import {test, expect} from '@playwright/test';

test('Eliminación de tipo de préstamo', async ({page}) => {
    await test.step('Iniciar sesión y acceder al módulo de préstamo', async () => {
        await page.goto('http://localhost/BibliotecaTempJS/login/');

        await page.getByPlaceholder('Ingresa tu usuario').fill('PER002');
        await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
        await page.getByRole('button', { name: 'Entrar' }).click();

        await page.getByRole('link', { name: 'Ver préstamos' }).click();

        await expect(page).toHaveURL('http://localhost/BibliotecaTempJS/devoluciones/');
    });
})