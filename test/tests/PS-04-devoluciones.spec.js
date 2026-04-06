import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page, context }) => {
  // Aumentamos el tiempo por la latencia entre XAMPP y el backend en Vercel
  test.setTimeout(180000); 

  const URL_LOGIN = 'http://localhost/BibliotecaTempJS/login/';

  // --- PASO 1, 2 Y 3: COORDINADOR BIBLIOTECARIO (ROL002) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Esperar al select principal (evita el error de "hidden" en las opciones)
    const selectSesion = page.locator('#sesion');
    await selectSesion.waitFor({ state: 'visible' });
    await selectSesion.selectOption('ROL002'); 
    
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Cerrar alerta SweetAlert de bienvenida
    const btnOk = page.locator('button.swal2-confirm');
    await btnOk.waitFor({ state: 'visible' });
    await btnOk.click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Navegar a sección Devoluciones
    await page.locator('a#devoluciones').click();
    await page.waitForSelector('#tblPrestamos tr', { state: 'attached' });

    // Filtrar por el ID del alumno ALU007
    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1500); // Tiempo para que el JS filtre la tabla

    // Localizar fila específica: ID ALU007 y Libro LIB001
    const fila = page.locator('tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    // Clic en botón Renovar (Naranja)
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    
    // Confirmaciones de SweetAlert
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Validar que la fecha de devolución cambió
    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    // Logout y retorno a Login
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForTimeout(1000);
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Seleccionar "Miembro" (Selector corregido según tu index.html)
    await page.locator('#sesion').selectOption('Miembro'); 
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Clic en el botón de Préstamos del alumno
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    
    // Esperar carga asíncrona de la tabla (Network Idle)
    await page.waitForLoadState('networkidle');
    const tabla = page.locator('table, .table').first();
    await tabla.waitFor({ state: 'visible', timeout: 10000 });
    
    // Verificar que el libro LIB001 aparece en la tabla
    await expect(tabla).toContainText('LIB001', { timeout: 10000 });
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
    
    // Intentar segunda renovación (debe estar bloqueada)
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Validar mensaje de error (Límite alcanzado)
    await expect(page.locator('.swal2-error, .swal2-html-container')).toBeVisible();
    await page.locator('button.swal2-confirm').click();
  });
});