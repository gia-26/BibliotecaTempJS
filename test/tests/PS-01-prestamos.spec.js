import { test, expect } from '@playwright/test';

test('Registro de préstamo (flujo completo E2E)', async ({ page }) => {
    await test.step('Acceder al sistema e inciar sesión', async () => {
        await page.goto('http://localhost/BibliotecaTempJS/login/');
        await test.step('Iniciar sesión con cualquier usuario y contraseña', async () => {
          await page.getByLabel('Sesión:').selectOption('ROL003');
          await page.getByPlaceholder('Ingresa tu usuario').fill('PER002');
          await page.getByPlaceholder('Ingresa tu contraseña').fill('pasS123$');
          await page.getByRole('button', { name: 'Entrar' }).click();
          await page.getByRole('button', { name: 'Aceptar' }).click();
        });
    });

  await test.step('Ingresar al módulo de Libros y seleccionar la opción para registrar un nuevo libro', async () => {
    await page.getByRole('link', { name: 'Gestionar Libros' }).click();
    await page.getByRole('button', { name: 'Agregar Nuevo Libro' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'El título debe tener entre 5' }).fill('El principito');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Formato ISBN válido: 978-3-16' }).fill('978-0156012195');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Ingresa edición' }).fill('1ra edición');
    await page.locator('#modalIframe').contentFrame().locator('#slcAnioEdicion').selectOption('AE009');
    await page.locator('#modalIframe').contentFrame().locator('#slcAreaConocimiento').selectOption('AC003');
    await page.locator('#modalIframe').contentFrame().locator('#slcGeneroPrincipal').selectOption('GEN007');
    await page.locator('#modalIframe').contentFrame().locator('#slcAutorPrincipal').selectOption('AUT003');
    await page.locator('#modalIframe').contentFrame().locator('#slcEditoriales').selectOption('EDI003');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Escribe la sinopsis aquí' }).fill('Relata el encuentro entre un aviador perdido en el desierto y un pequeño príncipe proveniente de otro planeta. A través de sus conversaciones, el libro reflexiona sobre la amistad, el amor, la soledad y la importancia de ver más allá de lo superficial, resaltando valores esenciales de la vida desde una perspectiva sencilla pero profunda.');
    await page.locator('#modalIframe').contentFrame().locator('#inpNoEjemplares').fill('3');
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Choose File' }).setInputFiles('elprincipito.jpg');
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Guardar' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Aceptar' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: '×' }).click();
  });

  await test.step('Ingresar al módulo Préstamos y seleccionar el ejemplar (libro) recién creado', async () => {
    await page.getByRole('link', { name: ' Préstamos' }).click();
    await page.getByRole('cell', { name: 'EJE087', exact: true }).click(); //Ejemplar recién creado
    await expect(page.locator('#idLibro')).toHaveValue('LIB043');
  });

  await test.step('Ingresar el ID del usuario ALU007 y validar su existencia', async () => {
    await page.getByRole('textbox', { name: 'ID del usuario:' }).fill('ALU007');
    await page.getByRole('textbox', { name: 'ID del usuario:' }).press('Enter');
    await expect(page.getByRole('textbox', { name: 'Nombre del usuario:' })).toHaveValue('Giovanni Ibarra Antonio');
  });

  await test.step('Confirmar el préstamo “Registrar préstamo”', async () => {
    await page.getByRole('button', { name: 'Registrar préstamo' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).waitFor();
    await page.getByRole('button', { name: 'Aceptar' }).click();
  });

  await test.step('El ejemplar se marca como prestado en el listado de ejemplares', async () => {
    await expect(page.locator('tr:nth-child(15) > td:nth-child(6) > .status-badge')).toHaveText('Prestado');
  });

  await test.step('Ingresar al módulo de Devoluciones', async () => {
    await page.getByRole('link', { name: 'Devoluciones' }).click();
  });

  await test.step('Registrar la devolución del préstamo realizado', async () => {
    await page.getByRole('button', { name: 'Devolver' }).first().click();
    await page.getByRole('button', { name: 'Sí' }).waitFor();
    await page.getByRole('button', { name: 'Sí' }).click();
    await page.getByRole('button', { name: 'Aceptar' }).waitFor();
    await page.getByRole('button', { name: 'Aceptar' }).click();
  });

  await test.step('Verificar que el ejemplar esté marcado como Disponible', async () => {
    await page.getByRole('link', { name: ' Préstamos' }).click();
    await expect(page.locator('tr:nth-child(15) > td:nth-child(6) > .status-badge')).toHaveText('Disponible');
  });
});