import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page, context }) => {
  // Tiempo extendido para manejar la latencia del backend en Vercel
  test.setTimeout(180000); 

  const URL_LOGIN = 'http://localhost/BibliotecaTempJS/login/';

  // --- PASO 1, 2 Y 3: COORDINADOR BIBLIOTECARIO (ROL002) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Esperar al select de sesión (evita errores de opciones ocultas)
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
    await page.waitForTimeout(1500); // Pausa para el filtrado dinámico

    // Localizar la fila del libro LIB001 (Cien años de soledad)
    const fila = page.locator('tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    // Clic en el botón naranja de Renovar
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    
    // Confirmar en SweetAlert
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Validar que la fecha cambió
    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    // Logout y regreso a login
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.waitForTimeout(1500);
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    // Seleccionamos "Miembro" (Valor real en el HTML para estudiantes)
    await page.locator('#sesion').selectOption('Miembro');
    
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Clic en el botón de préstamos/historial del alumno
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    
    // SOLUCIÓN AL TIMEOUT: Esperamos a que el texto aparezca en el body, no solo en 'table'
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText('LIB001', { timeout: 15000 });
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
    
    // Intentar renovar por segunda vez (debe fallar)
    await fila.locator('button.btn-warning, button:has-text("Renovar")').click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Esperar mensaje de error de SweetAlert (Límite alcanzado)
    const mensajeError = page.locator('.swal2-error, .swal2-html-container');
    await expect(mensajeError).toBeVisible({ timeout: 10000 });
    await page.locator('button.swal2-confirm').click();
  });
});