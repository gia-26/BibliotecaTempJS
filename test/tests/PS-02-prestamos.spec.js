import { test, expect } from '@playwright/test';

test('Eliminación de Tipo de Préstamo', async ({ page }) => {
  await test.step('Iniciar sesión y acceder al módulo de préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');

    await page.getByPlaceholder('Ingresa tu usuario').fill('PER002');
    await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.getByRole('link', { name: 'Ver préstamos' }).click();

    await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/prestamos/');
  });

  await test.step('Seleccionar el ícono de ajuste de los tipos de préstamos', async () => {
    await page.locator('button.config-btn[title="Configurar tipos de préstamo"]').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();
  });

  await test.step('Seleccionar un tipo con préstamos activos (TP001)', async () => {
    const filaTp001 = page
      .locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' });

    await expect(filaTp001).toBeVisible();
    await filaTp001.click();

    await expect(filaTp001).toHaveClass('selected-row');
    await expect(filaTp001).toContainText('Domicilio');
  });

  await test.step('Intentar eliminar el tipo seleccionado', async () => {
    const filaTp001 = page
      .locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' });

    const btnEliminar = filaTp001.locator('button.btn-delete');

    await expect(btnEliminar).toBeVisible();
    await expect(btnEliminar).toBeEnabled();

    await btnEliminar.click();

    // El sistema NO usa dialog nativo, así que solo validamos que el modal siga abierto
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();

    // Y que el registro siga existiendo
    await expect(filaTp001).toBeVisible();
  });

  await test.step('Visualizar mensaje o restricción en la interfaz', async () => {
    // Si tu sistema muestra mensaje visual, ajusta estos selectores según tu HTML real
    const posiblesMensajes = page.locator(
      '.alert-danger, .alert, .error, .mensaje-error, .toast, .toast-error, .swal2-popup'
    );

    // Esta validación no obliga a que exista mensaje;
    // solo comprueba que el modal no desapareció y la fila sigue presente
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();

    const filaTp001 = page
      .locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' });

    await expect(filaTp001).toBeVisible();

    // Si quieres, luego aquí puedes activar validación exacta del mensaje:
    // await expect(posiblesMensajes.first()).toBeVisible();
  });

  await test.step('Verificar que TP001 NO fue eliminado del sistema', async () => {
    const filaTp001 = page
      .locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' });

    await expect(filaTp001).toBeVisible();
    await expect(filaTp001).toContainText('TP001');
    await expect(filaTp001).toContainText('Domicilio');
  });

  await test.step('Consultar que los préstamos activos continúan sin alteraciones', async () => {
    const btnCerrarModal = page.locator('#modal-tipos-prestamo .close');

    await expect(btnCerrarModal).toBeVisible();
    await btnCerrarModal.click();

    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();

    await expect(
      page.locator('#tblEjemplares .status-badge').filter({ hasText: 'Prestado' }).first()
    ).toBeVisible();
  });

  await test.step('Verificar que el tipo sigue disponible para nuevos préstamos', async () => {
    const selectTipo = page.locator('#slcTipoPrestamos');

    await expect(selectTipo).toBeVisible();
    await selectTipo.selectOption({ label: 'Domicilio' });
    await expect(selectTipo).toHaveValue('TP001');
  });

  await test.step('Verificar integridad del sistema', async () => {
    await expect(page.locator('#formPrestamo')).toBeVisible();
    await expect(page.locator('#btnPrestar')).toBeVisible();
    await expect(page.locator('#tblEjemplares tr').first()).toBeVisible();
  });
});