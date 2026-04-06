import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo de espera extendido para procesos de carga y red
  test.setTimeout(90000);

  // ─────────────────────────────────────────────
  // PASO 1 – Ingresar al sistema
  // ─────────────────────────────────────────────
  await test.step('1. Ingresar al sistema con usuario válido', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    // Cerrar la alerta inicial de bienvenida
    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
    await expect(page.locator('.swal2-popup')).toBeHidden();
  });

  // ─────────────────────────────────────────────
  // PASO 2 – Acceder al módulo Libros
  // ─────────────────────────────────────────────
  await test.step('2. Acceder al módulo Libros', async () => {
    // Buscamos el enlace de Libros en el menú
    await page.getByRole('link', { name: /Libros/i }).first().click();
    await expect(page).toHaveURL(/.*libros/);
  });

  // ─────────────────────────────────────────────
  // PASO 3 – Buscar el libro LIB009
  // ─────────────────────────────────────────────
  await test.step('3. Buscar el libro con ID LIB009', async () => {
    // Usamos los IDs reales de tu HTML principal
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    // Verificamos que la tabla muestre el resultado
    await expect(page.locator('#tablaLibros')).toContainText('LIB009');
  });

  // ─────────────────────────────────────────────
  // PASO 4 – Seleccionar opción Editar
  // ─────────────────────────────────────────────
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    
    // Hacemos clic en el icono de edición (lápiz)
    await filaLibro.locator('.fa-pen-to-square').click();
    
    // Validamos que el modal se abre (ID del primer HTML)
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 5 – Modificar datos (Dentro del IFRAME)
  // ─────────────────────────────────────────────
  await test.step('5. Modificar campos: Título, Año y Ejemplares', async () => {
    // Accedemos al iframe usando su ID: modalIframe
    const frame = page.frameLocator('#modalIframe');

    // Usamos los IDs reales de tu HTML de edición
    await frame.locator('#inpTitulo').fill('Programación Avanzada');
    
    // Seleccionamos el año 2023 (Asegúrate de que el texto '2023' sea una opción válida)
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });

    // Cambiamos ejemplares a 1 (según lo solicitado)
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // ─────────────────────────────────────────────
  // PASO 6 – Presionar Guardar cambios
  // ─────────────────────────────────────────────
  await test.step('6. Presionar el botón Guardar cambios', async () => {
    const frame = page.frameLocator('#modalIframe');

    // Escuchamos la respuesta de la API para confirmar éxito
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('api') && response.request().method() === 'POST'
    );

    // Clic en Guardar (ID: btnGuardar)
    await frame.locator('#btnGuardar').click();

    // El SweetAlert suele dispararse en la página principal (fuera del iframe)
    const swalAceptar = page.locator('button.swal2-confirm');
    await swalAceptar.waitFor({ state: 'visible' });
    await swalAceptar.click();

    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // PASO 7 y 8 – Verificar actualización y persistencia
  // ─────────────────────────────────────────────
  await test.step('7 y 8. Verificar actualización en tabla y recarga', async () => {
    // Verificación inmediata en la tabla
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');

    // Recarga de página (F5) para validar persistencia en DB
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    await expect(page.locator('#tablaLibros')).toContainText('2023');
  });

  // ─────────────────────────────────────────────
  // PASO 9 – Cerrar sesión
  // ─────────────────────────────────────────────
  await test.step('9. Cerrar sesión', async () => {
    // Buscamos el botón de salir por icono o clase si no tiene ID directo
    const btnSalir = page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first();
    await btnSalir.click();
    
    // Validar redirección al login
    await expect(page).toHaveURL(/.*login/);
  });
});