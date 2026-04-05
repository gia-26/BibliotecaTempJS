import { test, expect } from '@playwright/test';

test('Registro de libro y visualización en catálogo público', async ({ page }) => {
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

  await test.step('Ingresar al módulo de Libros y seleccionar la opción para registrar un nuevo libro', async () => {
    await page.getByRole('link', { name: 'Gestionar Libros' }).click();
    await page.getByRole('button', { name: 'Agregar Nuevo Libro' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'El título debe tener entre 5' }).fill('Introducción a Bases de Datos');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Formato ISBN válido: 978-3-16' }).fill('978-6071500333');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Ingresa edición' }).fill('1ra edición');
    await page.locator('#modalIframe').contentFrame().locator('#slcAnioEdicion').selectOption('AE002');
    await page.locator('#modalIframe').contentFrame().locator('#slcAreaConocimiento').selectOption('AC005');
    await page.locator('#modalIframe').contentFrame().locator('#slcGeneroPrincipal').selectOption('GEN005');
    await page.locator('#modalIframe').contentFrame().locator('#slcAutorPrincipal').selectOption('AUT007');
    await page.locator('#modalIframe').contentFrame().locator('#slcEditoriales').selectOption('EDI001');
    await page.locator('#modalIframe').contentFrame().getByRole('textbox', { name: 'Escribe la sinopsis aquí' }).fill('“Introducción a las bases de datos” es una obra que guía al lector a través de los fundamentos del almacenamiento y manejo de información en sistemas digitales. A lo largo del libro, se exploran conceptos clave como el diseño de bases de datos, el modelo entidad-relación, la organización en tablas y el uso del lenguaje SQL, todo explicado de manera clara y progresiva. Con un enfoque práctico, la obra muestra cómo estructurar datos de forma eficiente, garantizando su integridad y seguridad, convirtiéndose en una herramienta esencial para quienes inician en el mundo de la informática y los sistemas de información.');
    await page.locator('#modalIframe').contentFrame().locator('#inpNoEjemplares').fill('3');
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Choose File' }).setInputFiles('basededatos.jpg');
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Guardar' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: 'Aceptar' }).click();
    await page.locator('#modalIframe').contentFrame().getByRole('button', { name: '×' }).click();
  });

  await test.step('Ingresar al catálogo público', async () => {
    await page.getByRole('link', { name: ' Ver catálogo' }).click();
  });

  await test.step('Buscar el libro registrado y validar su existencia', async () => {
    await page.getByRole('textbox', { name: 'Buscar por título, autor o gé' }).fill('Introducción a Bases de Datos');
    await expect(page.getByRole('heading', { name: 'Introducción a Bases de Datos' })).toBeVisible();
  });
});