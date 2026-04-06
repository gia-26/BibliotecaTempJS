import { test, expect } from '@playwright/test';

test('Registro de devolución de ejemplar', async ({ page }) => {
  await test.step('Acceder al sistema e inciar sesión', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await test.step('Iniciar sesión con cualquier usuario y contraseña', async () => {
        await page.getByLabel('Sesión:').selectOption('ROL002');
        await page.getByPlaceholder('Ingresa tu usuario').fill('PER006');
        await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
        await page.getByRole('button', { name: 'Entrar' }).click();
        await page.getByRole('button', { name: 'Aceptar' }).click();
      });
  });

  await test.step('Ingresar al módulo de Devoluciones', async () => {
    await page.getByRole('link', { name: 'Gestionar devoluciones' }).click();
  });

  await test.step('Devolver el libro', async () => {
    await page.getByRole('button', { name: 'Devolver' }).first().click();
    await page.getByRole('button', { name: 'Sí' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).click();
  });

  await test.step('Validar estado disponible', async () => {
    await page.getByRole('link', { name: ' Préstamos' }).click();
    await expect(page.locator('tr:nth-child(12) > td:nth-child(6) > .status-badge')).toHaveText('Disponible');
  });

  await test.step('Cerrar la sesión', async () => {
    await page.getByText('Cerrar Sesión').click();
  });

  await test.step('Iniciar sesión como alumno', async () => {
    await page.getByRole('textbox', { name: 'Usuario:' }).fill('ALU007');
    await page.getByRole('textbox', { name: 'Contraseña:' }).fill('pasS123$');
    await page.getByRole('button', { name: ' Entrar' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).click();
  });

  await test.step('Buscar el libro eliminado y verificar que no aparezca', async () => {
    await page.getByRole('link', { name: ' Mis préstamos' }).click();
    await expect(page.getByText('El hombre que hablaba serpiente').first()).toBeVisible();
    await expect(page.getByText('Entregado').first()).toBeVisible();
  });
});