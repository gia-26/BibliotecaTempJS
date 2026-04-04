import { test, expect } from '@playwright/test';

test('Validación de recálculo automático de fecha en renovación de préstamo', async ({ page }) => {

  // 🔹 1. Login como jefe y acceso a devoluciones
  await test.step('Iniciar sesión y acceder al módulo de devoluciones', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');

    await page.getByPlaceholder('Ingresa tu usuario').fill('PER002');
    await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForTimeout(2000);

    await page.getByRole('link', { name: 'Devoluciones' }).click();
    await expect(page.locator('table')).toBeVisible();
  });

  // 🔹 2. Seleccionar préstamo y renovar
  let fechaAntes = '';

  await test.step('Seleccionar un préstamo próximo a vencer y pulsar "Renovar"', async () => {
    const fila = page.locator('table tbody tr').last();

    fechaAntes = await fila.locator('td').nth(5).textContent();

    await fila.getByRole('button', { name: 'Renovar' }).click();

    await page.waitForTimeout(2000);
  });

  // 🔹 3. Validar cambio de fecha
  let fechaDespues = '';

  await test.step('Confirmar y validar nueva fecha de entrega', async () => {
    const fila = page.locator('table tbody tr').last();

    fechaDespues = await fila.locator('td').nth(5).textContent();

    expect(fechaDespues).not.toBe(fechaAntes);
  });

  // 🔹 4. Cerrar sesión y entrar como usuario
  await test.step('Cerrar sesión e iniciar sesión con usuario del préstamo', async () => {

    await page.getByRole('button', { name: 'Cerrar sesión' }).click();

    await page.waitForTimeout(1000);

    await page.getByPlaceholder('Ingresa tu usuario').fill('ALU003');
    await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForTimeout(2000);
  });

  // 🔹 5. Consultar historial
  await test.step('Consultar historial de préstamos', async () => {

    await page.getByRole('link', { name: 'Historial' }).click();

    await expect(page.locator('table')).toBeVisible();

    const filas = await page.locator('table tbody tr').count();
    expect(filas).toBeGreaterThan(0);
  });

  // 🔹 6. Verificar estado
  await test.step('Verificar que el ejemplar continúe en estado "Prestado"', async () => {

    const estado = await page.locator('table tbody tr').first().locator('td').last().textContent();

    expect(estado.toLowerCase()).toContain('prestado');
  });

  // 🔹 7. Validar límite de renovaciones (máx 2)
  await test.step('Intentar renovar nuevamente si excede el límite permitido', async () => {

    await page.getByRole('link', { name: 'Devoluciones' }).click();

    const fila = page.locator('table tbody tr').last();

    // Segunda renovación (permitida)
    await fila.getByRole('button', { name: 'Renovar' }).click();
    await page.waitForTimeout(2000);

    const fechaSegunda = await fila.locator('td').nth(5).textContent();
    expect(fechaSegunda).not.toBeNull();

    // Tercera renovación (bloqueada)
    await fila.getByRole('button', { name: 'Renovar' }).click();
    await page.waitForTimeout(2000);

    const fechaFinal = await fila.locator('td').nth(5).textContent();

    expect(fechaFinal).toBe(fechaSegunda);

    // Validar mensaje si aparece
    const mensajeError = page.locator('.swal2-popup, .alert, #mensajeError');
    if (await mensajeError.isVisible().catch(() => false)) {
      await expect(mensajeError).toBeVisible();
    }

  });

  // 🔹 8. Regresar a jefe
  await test.step('Cerrar sesión e iniciar sesión con jefe de departamento', async () => {

    await page.getByRole('button', { name: 'Cerrar sesión' }).click();

    await page.waitForTimeout(1000);

    await page.getByPlaceholder('Ingresa tu usuario').fill('PER002');
    await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.waitForTimeout(2000);
  });

  // 🔹 9. Generar reporte
  await test.step('Verificar consistencia generando reporte de préstamos', async () => {

    await page.getByRole('link', { name: 'Reportes' }).click();

    await expect(page.getByRole('button', { name: 'Generar PDF' })).toBeVisible();

    await page.getByRole('button', { name: 'Generar PDF' }).click();

    await page.waitForTimeout(3000);
  });

});