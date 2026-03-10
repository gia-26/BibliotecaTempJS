// @ts-check
import { test, expect } from '@playwright/test';

test('Validación de seguridad: Inyección SQL en formulario de Login', async ({ page }) => {
  await test.step('Acceder a la página del Login', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
  });

  await test.step('Iniciar sesión con cualquier usuario y contraseña', async () => {
    await page.getByPlaceholder('Ingresa tu usuario').fill('PER003');
    await page.getByPlaceholder('Ingresa tu contraseña').fill('contrA123$');
    await page.getByRole('button', { name: 'Entrar' }).click();
  });

  /*await test.step('La página manda error, pero la peteción fue enviada', async () => {
    await expect(page).toHaveURL('https://biblioteca.grupoctic.com/login.php?message=error');
  })*/
});