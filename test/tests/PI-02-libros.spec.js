import { test, expect } from '@playwright/test';

test('Baja lógica de libro y verificación de estado', async ({ page }) => {
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

  await test.step('Ingresar al módulo de Gestión de Libros', async () => {
    await page.getByRole('link', { name: 'Gestionar Libros' }).click();
  });

  await test.step('Buscar el libro a eliminar', async () => {
    await page.locator('#filterSelect').selectOption('titulo');
    await page.getByRole('textbox', { name: 'Ingresa término de búsqueda...' }).fill('El mapa del tiempo');
  });

  await test.step('Eliminar el libro', async () => {
    await page.getByRole('button', { name: ' Eliminar' }).click();
    await page.getByRole('button', { name: 'Sí' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).click();
  });

  await test.step('Ingresar al catálogo público', async () => {
    await page.getByRole('link', { name: ' Ver catálogo' }).click();
  });

  await test.step('Buscar el libro eliminado y verificar que no aparezca', async () => {
    await page.getByRole('textbox', { name: 'Buscar por título, autor o gé' }).fill('El mapa del tiempo');
    await expect(page.getByRole('heading', { name: 'El mapa del tiempo' })).toBeHidden();
  });
});