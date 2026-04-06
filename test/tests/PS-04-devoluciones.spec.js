import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page, context }) => {
  test.setTimeout(180000); 

  const URL_LOGIN = 'http://localhost/BibliotecaTempJS/login/';

  // --- PASO 1, 2 Y 3: COORDINADOR BIBLIOTECARIO (ROL002) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto(URL_LOGIN, { waitUntil: 'networkidle' });
    
    // Según tu HTML: ROL002 es Coordinador
    await page.waitForSelector('#sesion option[value="ROL002"]');
    await page.locator('#sesion').selectOption('ROL002'); 
    
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#devoluciones').click();
    await page.waitForSelector('#tblPrestamos tr', { state: 'visible' });

    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1000);

    const fila = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    await fila.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForTimeout(2000);
    await page.goto(URL_LOGIN);
    
    // CORRECCIÓN: Según tu HTML el valor es "Miembro" no "TU001"
    await page.waitForSelector('#sesion option[value="Miembro"]');
    await page.locator('#sesion').selectOption('Miembro'); 
    
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    await expect(page.locator('table')).toContainText('LIB001');
    await expect(page.locator('table')).toContainText('Activo');
  });

  // --- PASO 7: VALIDAR LÍMITE DE RENOVACIÓN ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForTimeout(2000);
    await page.goto(URL_LOGIN);
    
    await page.waitForSelector('#sesion option[value="ROL002"]');
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
    
    await fila.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Verificación de Bloqueo
    await expect(page.locator('.swal2-error, .swal2-html-container')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });
  });

  // --- PASO 8 Y 9: REPORTE JEFE (PER002) ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForTimeout(2000);
    await page.goto(URL_LOGIN);
    
    await page.waitForSelector('#sesion option[value="ROL003"]');
    await page.locator('#sesion').selectOption('ROL003'); 
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    await page.locator('a#reportes').click();
    
    // Selectores del index de reportes que pasaste antes
    await page.locator('#tipo_reporte').selectOption('prestamos');
    await page.locator('#fecha_inicio').fill('2026-01-01');
    await page.locator('#fecha_fin').fill('2026-04-30');

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerar').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});