import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page, context }) => {
  // Tiempo de espera extendido para ejecuciones en XAMPP/Local
  test.setTimeout(180000); 

  const URL_LOGIN = 'http://localhost/BibliotecaTempJS/login/';

  // --- PASO 1, 2 Y 3: COORDINADOR BIBLIOTECARIO (ROL002) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Esperar al contenedor del select, no a la opción interna
    const selectSesion = page.locator('#sesion');
    await selectSesion.waitFor({ state: 'visible' });
    await selectSesion.selectOption('ROL002'); 
    
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Cerrar alerta de bienvenida
    const btnOk = page.locator('button.swal2-confirm');
    await btnOk.waitFor({ state: 'visible' });
    await btnOk.click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Navegar a Devoluciones
    await page.locator('a#devoluciones').click();
    await page.waitForSelector('#tblPrestamos tr', { state: 'attached' });

    // Filtrar por ID de Usuario ALU007
    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1200); // Pausa para que el JS filtre la tabla

    // Localizar la fila del libro LIB001
    const fila = page.locator('tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    // Clic en el botón naranja de Renovar
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    
    // Confirmar en el modal de SweetAlert
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Validar que la fecha cambió
    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    // Cerrar sesión
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Seleccionar "Miembro" (Valor correcto según tu index.html)
    const selectSesion = page.locator('#sesion');
    await selectSesion.waitFor({ state: 'visible' });
    await selectSesion.selectOption('Miembro'); 
    
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Ir a la sección de préstamos del alumno
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    await expect(page.locator('table')).toContainText('LIB001');
  });

  // --- PASO 7: VALIDAR LÍMITE DE RENOVACIÓN (BLOQUEO) ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.goto(URL_LOGIN);
    
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#devoluciones').click();
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1000);

    const fila = page.locator('tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    
    // Intentar renovar por segunda vez
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // VERIFICACIÓN: El sistema debe mostrar un error (clase .swal2-error)
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });
  });

  // --- PASO 8 Y 9: REPORTE JEFE (PER002) ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.goto(URL_LOGIN);
    
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#reportes').click();
    
    // Configurar filtros de reporte
    await page.locator('#tipo_reporte').selectOption('prestamos');
    await page.locator('#fecha_inicio').fill('2026-01-01');
    await page.locator('#fecha_fin').fill('2026-04-30');

    // Capturar apertura de PDF en nueva pestaña
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerar').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});