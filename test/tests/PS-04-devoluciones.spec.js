import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page, context }) => {
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (PER004) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    // Esperar a que el selector de sesión tenga las opciones cargadas
    await page.waitForSelector('#sesion option[value="ROL002"]', { state: 'attached' });
    await page.locator('#sesion').selectOption('ROL002'); 
    
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Manejo de SweetAlert Bienvenida
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#devoluciones').click();
    
    // Esperar a que la tabla tenga datos
    await page.waitForSelector('#tblPrestamos tr', { state: 'visible' });

    // Filtrar por ID de Usuario para encontrar a ALU007 rápido
    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1000); // Pausa para el filtrado dinámico

    // Ubicar la fila exacta de LIB001 para ALU007
    const fila = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    // Clic en Renovar (Último botón de la fila)
    await fila.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Confirmar éxito y esperar a que el modal desaparezca
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    // Cerrar sesión y esperar a estar de vuelta en login
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForURL('**/login/**');
    
    // ESPERA CRÍTICA: Esperar a que la opción de Estudiante aparezca
    await page.waitForSelector('#sesion option[value="TU001"]', { state: 'attached' });
    await page.locator('#sesion').selectOption('TU001'); 
    
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Ir a historial de préstamos
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    await expect(page.locator('table')).toContainText('LIB001');
    await expect(page.locator('table')).toContainText('Activo');
  });

  // --- PASO 7: VALIDAR LÍMITE DE RENOVACIÓN (BLOQUEO) ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForURL('**/login/**');
    
    await page.waitForSelector('#sesion option[value="ROL002"]', { state: 'attached' });
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#devoluciones').click();
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1000);

    const fila = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    
    // Intentar segunda renovación (Límite alcanzado)
    await fila.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Validar que aparezca el error de SweetAlert
    await expect(page.locator('.swal2-error, .swal2-html-container')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });
  });

  // --- PASO 8 Y 9: REPORTE JEFE (PER002) ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForURL('**/login/**');
    
    await page.waitForSelector('#sesion option[value="ROL003"]', { state: 'attached' });
    await page.locator('#sesion').selectOption('ROL003'); 
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#reportes').click();
    await page.locator('#tipoReporte').selectOption('prestamos');
    
    // Capturar la nueva pestaña del PDF
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerarReporte').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});