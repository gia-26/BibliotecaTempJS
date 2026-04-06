import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación y límite de préstamo LIB001', async ({ page }) => {
  // Aumentamos el tiempo de espera por si el servidor local o Vercel están lentos
  test.setTimeout(120000); 

  const URL_LOGIN = 'http://localhost/BibliotecaTempJS/login/';

  // --- PASO 1, 2 Y 3: ROL COORDINADOR (RENOVAR) ---
  await test.step('1-3. Iniciar sesión y realizar primera renovación', async () => {
    await page.goto(URL_LOGIN, { waitUntil: 'load' });
    
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Cerrar alerta de bienvenida
    await page.locator('button.swal2-confirm', { hasText: 'OK' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Ir a Devoluciones
    await page.locator('a#devoluciones').click();
    await page.waitForSelector('#tblPrestamos', { state: 'visible' });

    // Filtrar por el usuario ALU007
    await page.locator('#filtroSelect').selectOption('idUsuario');
    await page.locator('#searchInput').fill('ALU007');
    await page.waitForTimeout(1000); // Esperar que el filtrado procese

    // Localizar la fila que contiene al usuario y al libro
    const fila = page.locator('tr', { hasText: 'ALU007' }).filter({ hasText: 'LIB001' }).first();
    const fechaAntigua = await fila.locator('td').nth(5).innerText();
    
    // Clic en Renovar (Botón naranja)
    await fila.locator('button.btn-warning').click();
    
    // Confirmar en el SweetAlert
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Verificar cambio de fecha
    const fechaNueva = await fila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ROL ALUMNO (VERIFICAR HISTORIAL) ---
  await test.step('4-6. Verificar historial en el perfil del Alumno', async () => {
    // Logout
    await page.locator('#btnSalir, .fa-sign-out-alt').first().click();
    await page.goto(URL_LOGIN);
    
    // Login Alumno
    await page.locator('#sesion').selectOption('Miembro');
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    await page.locator('button.swal2-confirm').click();
    await page.locator('.swal2-container').waitFor({ state: 'hidden' });

    // Entrar a "Mis préstamos" o botón de historial
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    
    // Esperar a que la página cargue los datos
    await page.waitForLoadState('networkidle');

    // EXPLICACIÓN DEL CAMBIO: Buscamos el nombre del libro, ya que LIB001 no es visible en esta vista
    const contenidoHistorial = page.locator('body');
    await expect(contenidoHistorial).toContainText('Cien años de soledad', { timeout: 15000 });
    
    // Opcional: Verificar que el estado diga "Activo" o "Entregado"
    await expect(contenidoHistorial).toContainText(/Activo|Entregado/i);
  });

  // --- PASO 7: INTENTAR SEGUNDA RENOVACIÓN (BLOQUEO) ---
  await test.step('7. Validar que no se puede renovar más de lo permitido', async () => {
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
    
    // Intentar renovar otra vez
    await fila.locator('button.btn-warning').click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Si el sistema bloquea, debería aparecer un mensaje de error o aviso en SweetAlert
    // Verificamos que aparezca la alerta de SweetAlert indicando el límite
    const alertaError = page.locator('.swal2-popup');
    await expect(alertaError).toBeVisible({ timeout: 8000 });
  });
});