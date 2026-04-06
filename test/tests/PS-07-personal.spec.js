import { test, expect } from '@playwright/test';

test('PS-07 - Modificación de rol y baja de usuario', async ({ page }) => {
  test.setTimeout(120000);
  await test.step('Iniciar sesión como jefe de departamento', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    await page.locator('.swal2-confirm').click();
    await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/dashboard/');
  });

  await test.step('Acceder al módulo Personal', async () => {
    await page.locator('a.btn', { hasText: 'Administrar Personal' }).click();
    await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/personal/');
  });

  await test.step('Buscar usuario con rol "Bibliotecario"', async () => {
    await page.locator('#inpSearch').fill('PER003');
    const fila = page.locator('#tblPersonal tr').filter({ hasText: 'PER003' });
    await expect(fila).toBeVisible();

    await fila.locator('.action-edit').click();
    
    //Esperar a que el formulario se llene con colocarDatos()
    await expect(page.locator('#idPersonal')).toHaveValue('PER003', { timeout: 5000 });
  });

  await test.step('Modificar rol a "Coordinador Bibliotecario"', async () => {
    await page.locator('#slcTiposRol').selectOption({ label: 'Coordinador Bibliotecario' });
    await page.locator('#password').fill('pasS123$');
    await page.locator('#password-confirm').fill('pasS123$');

    await page.locator('#btnEditar').click();

    const alerta = page.locator('.swal2-popup');
    await expect(alerta.locator('.swal2-title')).toHaveText('Éxito');
    await page.locator('.swal2-confirm').click();
  });

  await test.step('Cerrar sesión como administrador', async () => {
    await page.locator('a[data-text="Cerrar Sesión"]').click();
    await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/login/');
  });

  await test.step('Iniciar sesión con el usuario modificado', async () => {
    await page.locator('#sesion').selectOption('ROL002'); 
    await page.locator('#usuario').fill('PER003');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('.swal2-confirm').click();
  });

  await test.step('Cerrar sesión del usuario modificado', async () => {
    await page.locator('a[data-text="Cerrar Sesión"]').click();
    await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/login/');
  });

  await test.step('Iniciar sesión como administrador nuevamente', async () => {
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('.swal2-confirm').click();
  });

  await test.step('Dar de baja al usuario modificado', async () => {
    await page.locator('a.btn', { hasText: 'Administrar Personal' }).click();
    await page.locator('#tblPersonal tr').first().waitFor({ state: 'visible' });
    await page.locator('#inpSearch').fill('PER003');
    
    const fila = page.locator('#tblPersonal tr').filter({ hasText: 'PER003' });
    await expect(fila).toBeVisible();

    await fila.locator('.action-delete').click(); 
    
    await page.locator('.swal2-confirm').click(); 
    await expect(page.locator('.swal2-title')).toHaveText('Éxito');
    await page.locator('.swal2-confirm').click();
  });

  await test.step('Intentar iniciar sesión con usuario dado de baja', async () => {
    await page.locator('a[data-text="Cerrar Sesión"]').click();
    await page.waitForURL('**/login/');

    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER003');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    const popup = page.locator('.swal2-popup');
    await expect(popup).toBeVisible({ timeout: 10000 });
    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.click({ force: true });
    await expect(popup).toBeHidden();
  });

});