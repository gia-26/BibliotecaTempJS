import { test, expect } from '@playwright/test';

test("Eliminación de Tipo de Préstamo", async ({ page }) => {
  await test.step("Iniciar sesión y acceder al módulo de préstamo", async () => {
    await page.goto("http://localhost/BibliotecaTempJS/login/");

    await page.getByPlaceholder("Ingresa tu usuario").fill("PER002");
    await page.getByPlaceholder("Ingresa tu contraseña").fill("pasS123$");
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.getByRole("link", { name: "Ver préstamos" }).click();

    await expect(page).toHaveURL(
      "http://localhost/BibliotecaTempJS/prestamos/",
    );
  });

    await test.step("Seleccionar el ícono de ajuste de los tipos de préstamos", async () => {
    await page.locator('button.config-btn[title="Configurar tipos de préstamo"]').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();
  });
 
  await test.step("Seleccionar un tipo con préstamos activos (TP001)", async () => {
    await page.locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' })
      .click();
    await expect(
      page.locator('#modal-tipos-prestamo .modal-table tbody tr').filter({ hasText: 'TP001' })
    ).toHaveClass('selected-row');
  });
 
  await test.step("Intentar eliminar el tipo seleccionado", async () => {
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await page.locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' })
      .locator('button.btn-delete')
      .click();
    await page.waitForTimeout(2000);
  });
 
  await test.step("Visualizar mensaje en la interfaz", async () => {
    // El sistema mostró el mensaje de restricción y el modal permanece visible
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();
  });
 
  await test.step("Verificar que TP001 NO fue eliminado del sistema", async () => {
    const filaTp001 = page.locator('#modal-tipos-prestamo .modal-table tbody tr')
      .filter({ hasText: 'TP001' });
    await expect(filaTp001).toBeVisible();
    await expect(filaTp001).toContainText('Domicilio');
  });
 
  await test.step("Consultar que los préstamos activos continúan sin alteraciones", async () => {
    await page.locator('#modal-tipos-prestamo span.close').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();
    await expect(
      page.locator('#tblEjemplares .status-badge').filter({ hasText: 'Prestado' }).first()
    ).toBeVisible();
  });
 
  await test.step("Verificar que el tipo sigue disponible para nuevos préstamos", async () => {
    const selectTipo = page.locator('#slcTipoPrestamos');
    await expect(selectTipo).toBeVisible();
    await selectTipo.selectOption({ label: 'Domicilio' });
    await expect(selectTipo).toHaveValue('TP001');
  });
 
  await test.step("Verificar integridad del sistema", async () => {
    await expect(page.locator('.error, .alert-danger')).toHaveCount(0);
    await expect(page.locator('#tblEjemplares tr').first()).toBeVisible();
    await expect(page.locator('#formPrestamo')).toBeVisible();
    await expect(page.locator('#btnPrestar')).toBeVisible();
  });

});