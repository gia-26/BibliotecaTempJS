import { test, expect } from '@playwright/test';

test('Registro de préstamo (flujo completo E2E)', async ({ page }) => {
    await test.step('Acceder al sistema e inciar sesión', async () => {
        await page.goto('http://localhost/BibliotecaTempJS/login/');
        await test.step('Iniciar sesión con cualquier usuario y contraseña', async () => {
          await page.getByPlaceholder('Ingresa tu usuario').fill('PER004');
          await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
          await page.getByRole('button', { name: 'Entrar' }).click();
        });
    });

  await test.step('Ingresar al módulo de Libros y seleccionar la opción para registrar un nuevo libro', async () => {
    await page.getByRole('link', { name: 'Gestionar Libros' }).click();
    await page.getByRole('button', { name: 'Agregar Nuevo Libro' }).click();
  });

  await test.step('Ingresar al módulo Préstamos y seleccionar el ejemplar (libro) recién creado', async () => {
    await page.locator('a[href="/BibliotecaTempJS/prestamos/"]').click();
    await page.getByRole('cell', { name: 'EJE003', exact: true }).click(); //Ejemplar recién creado
    await expect(page.locator('#idLibro')).toHaveValue('LIB002');
  });

  await test.step('Ingresar el ID del usuario ALU001 y validar su existencia', async () => {
    await page.getByRole('textbox', { name: 'Ingresa ID del usuario' }).fill('ALU006');
    await page.getByRole('textbox', { name: 'Ingresa ID del usuario' }).press('Enter');
    await expect(page.getByRole('textbox', { name: 'Nombre completo' })).toHaveValue('Carmen');
  });

  await test.step('Confirmar el préstamo “Registrar préstamo”', async () => {
    await page.getByRole('button', { name: 'Registrar préstamo' }).click();
  });

  await test.step('El ejemplar se marca como prestado en el listado de ejemplares', async () => {
    await expect(page.locator('tr:nth-child(25) > td:nth-child(6) > .status-badge')).toHaveText('Prestado');
  });

  await test.step('Ingresar al módulo de Devoluciones', async () => {
    await page.getByRole('link', { name: 'Devoluciones' }).click();
  });

  await test.step('Registrar la devolución del préstamo realizado', async () => {
    await page.once('dialog', async dialog => {
        await dialog.accept(); // acepta el confirm
    });
    await page.getByRole('button', { name: 'Devolver'}).first().click();
  });

  await test.step('Verificar que el ejemplar esté marcado como Disponible', async () => {
    await page.locator('a[href="/BibliotecaTempJS/prestamos/"]').click();
    await expect(page.locator('tr:nth-child(25) > td:nth-child(6) > .status-badge')).toHaveText('Disponible');
  });
});