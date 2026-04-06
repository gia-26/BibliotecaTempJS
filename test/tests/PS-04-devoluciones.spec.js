import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación de préstamo LIB001 para ALU007', async ({ page, context }) => {
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (PER004) ---
  await test.step('1-3. Iniciar sesión, buscar y renovar préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); 
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Alerta de bienvenida
    await page.locator('button.swal2-confirm').click();

    // Navegar a Devoluciones
    await page.locator('a#devoluciones').click();
    
    // Esperar a que el cuerpo de la tabla esté listo
    await page.waitForSelector('#tblPrestamos', { state: 'visible' });
    
    // FILTRADO ESPECÍFICO: Buscar al usuario ALU007
    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    
    // Esperar a que la tabla se actualice con el filtro (pequeña pausa para el JS)
    await page.waitForTimeout(1000); 

    // Localizar la fila exacta que tenga el Usuario ALU007 y el Libro LIB001
    const filaPrestamo = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    await expect(filaPrestamo).toBeVisible();

    // Guardar la fecha de devolución (Columna 6) para comparar
    const fechaAntigua = await filaPrestamo.locator('td').nth(5).innerText();
    
    // Clic en el botón RENOVAR (Último botón de la fila según tu HTML)
    await filaPrestamo.locator('button').last().click();
    
    // Confirmar en SweetAlert ("Sí, renovar")
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Aceptar mensaje de éxito tras pausa de procesamiento
    await page.waitForTimeout(2000);
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();

    // Verificar que la fecha cambió en la tabla
    const fechaNueva = await filaPrestamo.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('TU001'); // Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Acceder a historial (Botón azul del dashboard)
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    
    // Validar que el libro LIB001 aparece como Activo
    await expect(page.locator('table')).toContainText('LIB001');
    await expect(page.locator('table')).toContainText('Activo');
  });

  // --- PASO 7: BLOQUEO DE SEGUNDA RENOVACIÓN ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#devoluciones').click();
    await page.locator('#searchInput').fill('ALU007');
    
    // Intentar renovar el mismo libro LIB001 otra vez
    const filaPrestamo = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    await filaPrestamo.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Validar alerta de error (Bloqueo por reglas de negocio)
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
  });

  // --- PASO 8 Y 9: REPORTE JEFE (PER002) ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('ROL003'); // Jefe
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#reportes').click();
    
    // Configurar reporte de préstamos
    await page.locator('#tipoReporte').selectOption('prestamos');
    await page.locator('input[type="date"]').first().fill('2026-01-01');
    await page.locator('input[type="date"]').last().fill('2026-04-30');

    // Capturar la pestaña del PDF
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerarReporte').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});