import { test, expect } from '@playwright/test';

test('Restricción de Eliminación de Tipo de Préstamo', async ({ page }) => {
  await test.step('Iniciar sesión y acceder al módulo de préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    // Esperar el SweetAlert y hacer clic en Aceptar
    await page.locator('.swal2-popup').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.swal2-confirm').click();

    // Esperar la redirección al dashboard
    await page.waitForFunction(
      () => window.location.href.includes('/dashboard/'),
      { timeout: 15000 }
    );
    await page.waitForTimeout(2000);

    // Navegar al módulo de préstamos
    await page.locator('a[href="/BibliotecaTempJS/prestamos/"]').click();
    await page.waitForTimeout(2000);
  });

  await test.step('Seleccionar el ícono de ajuste de los tipos de préstamos', async () => {
    await page.locator('button.config-btn[title="Configurar tipos de préstamo"]').click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();
  });

  // Referencia al iframe del modal
  const iframe = page.frameLocator('#modal-tipos-prestamo iframe');
  await iframe.locator('.modal-container').waitFor({ state: 'visible', timeout: 8000 });

  await test.step('Seleccionar un tipo con préstamos activos', async () => {
    const tipoDomicilio = iframe.locator('#listaTiposPrestamo .fila-genero').filter({ hasText: 'Domicilio' });
    await expect(tipoDomicilio).toBeVisible({ timeout: 8000 });
  });

  await test.step('Intentar eliminar el tipo seleccionado', async () => {
    const btnEliminar = iframe.locator('#listaTiposPrestamo .fila-genero')
      .filter({ hasText: 'Domicilio' })
      .locator('.icon-btn.delete');
    await expect(btnEliminar).toBeVisible();
    page.once('dialog', async dialog => {
      console.log(`   Confirm: "${dialog.message()}"`);
      await dialog.accept();
    });
    await btnEliminar.click();
    await page.waitForTimeout(2000);
  });

  await test.step('Visualizar mensaje en la interfaz', async () => {
    const mensaje = iframe.locator('#mensajeExito');
    await expect(mensaje).toBeVisible({ timeout: 8000 });
    const textoMensaje = await mensaje.textContent();
  });

  await test.step('Verificar registro en el sistema', async () => {
    await iframe.locator('#listaTiposPrestamo').waitFor({ state: 'visible' });
    const domicilioExiste = await iframe.locator('#listaTiposPrestamo .fila-genero')
      .filter({ hasText: 'Domicilio' })
      .count();
    expect(domicilioExiste).toBeGreaterThan(0);
  });

  // Cerrar modal
  await test.step('Cerrar modal de tipos de préstamo', async () => {
    await iframe.locator('.cerrar-modal').click();
    await page.waitForTimeout(1000);
  });

  await test.step('Consultar préstamos activos asociados', async () => {
    const prestamosActivos = page.locator('#tblEjemplares .status-badge').filter({ hasText: 'Prestado' });
    const cantidad = await prestamosActivos.count();
    expect(cantidad).toBeGreaterThan(0);
  });

  await test.step('Intentar registrar un nuevo préstamo usando ese tipo existente', async () => {
    const selectTipo = page.locator('#slcTipoPrestamos');
    await expect(selectTipo).toBeVisible();
    const opcionDomicilio = selectTipo.locator('option').filter({ hasText: 'Domicilio' });
    await expect(opcionDomicilio).toHaveCount(1);
    await selectTipo.selectOption({ label: 'Domicilio' });
    const valorSeleccionado = await selectTipo.inputValue();
  });

  await test.step('Verificar integridad del sistema', async () => {
    await expect(page.locator('#formPrestamo')).toBeVisible();
    await expect(page.locator('#tblEjemplares')).toBeVisible();
    await expect(page.locator('#btnPrestar')).toBeVisible();
    await expect(page.locator('#inpIdUsuario')).toBeVisible();
    await expect(page.locator('#slcTipoPrestamos')).toBeVisible();
  });

});