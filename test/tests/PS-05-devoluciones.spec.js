import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo extendido para evitar fallos por lentitud de respuesta del servidor local
  test.setTimeout(120000);

  // 1. LOGIN
  await test.step('1. Ingresar al sistema', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    // Confirmar alerta de bienvenida
    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.waitFor({ state: 'visible', timeout: 10000 });
    await btnAceptar.click();
  });

  // 2 y 3. NAVEGACIÓN Y BÚSQUEDA
  await test.step('2 y 3. Acceder a Libros y buscar LIB009', async () => {
    await page.getByRole('link', { name: /Libros/i }).first().click();
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    // Esperamos a que la fila con el ID aparezca
    const fila = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    await expect(fila).toBeVisible({ timeout: 15000 });
  });

  // 4. SELECCIONAR EDITAR (SELECTOR REFORZADO)
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    
    // Buscamos el botón de editar. Probamos con el icono o cualquier botón en la última celda.
    const btnEditar = filaLibro.locator('td').last().locator('button, a, i.fa-pen-to-square').first();
    
    await btnEditar.waitFor({ state: 'visible', timeout: 10000 });
    await btnEditar.scrollIntoViewIfNeeded();
    
    // Hacemos clic forzado para ignorar capas invisibles que puedan estar bloqueando
    await btnEditar.click({ force: true });
    
    // Validamos que el modal se abrió (ID del HTML principal)
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // 5. MODIFICAR DATOS (DENTRO DEL IFRAME)
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    const frame = page.frameLocator('#modalIframe');
    const inputTitulo = frame.locator('#inpTitulo');
    
    // Esperar a que el contenido del iframe esté listo
    await inputTitulo.waitFor({ state: 'visible', timeout: 20000 });

    await inputTitulo.clear();
    await inputTitulo.fill('Programación Avanzada');
    
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });
    
    await frame.locator('#inpNoEjemplares').clear();
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // 6. GUARDAR CAMBIOS Y ALERTA (IFRAME/PAGINA)
  await test.step('6. Presionar Guardar y confirmar Alerta', async () => {
    const frame = page.frameLocator('#modalIframe');
    const btnGuardar = frame.locator('#btnGuardar');

    await btnGuardar.click();

    // SweetAlert: lo buscamos en el frame y en la página por si acaso
    const btnConfirmarFrame = frame.locator('button.swal2-confirm');
    const btnConfirmarPagina = page.locator('button.swal2-confirm');

    try {
      // El que aparezca primero será clickeado
      await Promise.race([
        btnConfirmarFrame.waitFor({ state: 'visible', timeout: 8000 }).then(() => btnConfirmarFrame.click()),
        btnConfirmarPagina.waitFor({ state: 'visible', timeout: 8000 }).then(() => btnConfirmarPagina.click())
      ]);
    } catch (e) {
      console.log('Alerta procesada o no detectada');
    }

    // Esperar a que el modal desaparezca
    await expect(page.locator('#modalLibros')).toBeHidden({ timeout: 15000 });
  });

  // 7 al 9. VERIFICACIÓN Y LOGOUT
  await test.step('7, 8 y 9. Verificar y cerrar sesión', async () => {
    // Verificación inmediata
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    
    // Recarga (Paso 8)
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    await expect(page.locator('#tablaLibros')).toContainText('2023');

    // Cerrar sesión
    const btnSalir = page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first();
    await btnSalir.click();
    await expect(page).toHaveURL(/.*login/);
  });
});