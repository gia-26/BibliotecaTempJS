import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación de préstamo y reportes', async ({ page, context }) => {
  test.setTimeout(180000); // Tiempo extendido por los múltiples inicios de sesión

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (O JEFE EN EL VIDEO) ---
  await test.step('1-3. Iniciar sesión y renovar préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); // Coordinador/Bibliotecario
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('button:has-text("Entrar")').click();
    await page.locator('button:has-text("Aceptar")').click();

    // Ir a Devoluciones
    await page.getByRole('link', { name: 'Devoluciones' }).click();
    
    // Buscar el préstamo de ALU007 (Libro: Cien años de soledad)
    const filaPrestamo = page.locator('tr', { hasText: 'ALU007' }).first();
    const fechaAntigua = await filaPrestamo.locator('td:nth-child(6)').textContent();
    
    // Renovar
    await filaPrestamo.locator('button:has-text("Renovar")').click();
    await page.locator('button:has-text("Si")').click();
    await page.locator('button:has-text("Aceptar")').click();

    // Verificar recálculo (Debería ser diferente a la fecha antigua)
    const fechaNueva = await filaPrestamo.locator('td:nth-child(6)').textContent();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.getByRole('link', { name: 'Cerrar Sesión' }).click();
    
    // Login Alumno
    await page.locator('#sesion').selectOption('TU001'); // Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('button:has-text("Entrar")').click();
    await page.locator('button:has-text("Aceptar")').click();

    // Ver historial
    await page.locator('button:has-text("Ver préstamos")').first().click();
    // Verificar que el libro aparece como Activo y renovado
    await expect(page.locator('h3:has-text("Cien años de soledad")')).toBeVisible();
    await expect(page.locator('text=Activo')).toBeVisible();
  });

  // --- PASO 7: INTENTO DE RENOVACIÓN DOBLE ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    // Regresamos a sesión de bibliotecario para intentar renovar de nuevo
    await page.getByRole('link', { name: 'Cerrar Sesión' }).click();
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('button:has-text("Entrar")').click();
    await page.locator('button:has-text("Aceptar")').click();

    await page.getByRole('link', { name: 'Devoluciones' }).click();
    const filaPrestamo = page.locator('tr', { hasText: 'ALU007' }).first();
    
    await filaPrestamo.locator('button:has-text("Renovar")').click();
    await page.locator('button:has-text("Si")').click();
    
    // Verificar mensaje de error/bloqueo
    await expect(page.locator('text=Error')).toBeVisible();
    await page.locator('button:has-text("Aceptar")').click();
  });

  // --- PASO 8 Y 9: JEFE DE DEPARTAMENTO Y REPORTE ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.getByRole('link', { name: 'Cerrar Sesión' }).click();
    
    // Login Jefe
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('button:has-text("Entrar")').click();
    await page.locator('button:has-text("Aceptar")').click();

    // Ir a Reportes
    await page.getByRole('link', { name: 'Reportes' }).click();
    await page.locator('select[name="tipoReporte"]').selectOption('Préstamos');
    
    // Seleccionar fechas (Ajustar según el calendario de tu video)
    await page.locator('input[type="date"]').first().fill('2026-01-01');
    await page.locator('input[type="date"]').last().fill('2026-04-06');

    // Manejar la apertura del PDF en pestaña nueva
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('button:has-text("Generar PDF")').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('api/reportes/pdf');
  });
});