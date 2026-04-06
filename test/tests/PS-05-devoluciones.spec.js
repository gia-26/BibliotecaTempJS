import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo extendido para servidores locales (XAMPP/WAMP)
  test.setTimeout(120000);

  // 1. LOGIN
  await test.step('1. Ingresar al sistema', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
  });

  // 2 y 3. NAVEGACIÓN Y BÚSQUEDA
  await test.step('2 y 3. Acceder a Libros y buscar LIB009', async () => {
    await page.getByRole('link', { name: /Libros/i }).first().click();
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    // Esperar a que la fila específica cargue
    const fila = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    await expect(fila).toBeVisible({ timeout: 15000 });
  });

  // 4. SELECCIONAR EDITAR
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    // Buscamos el botón de editar en la fila
    const btnEditar = filaLibro.locator('button, a, i.fa-pen-to-square').first();
    
    await btnEditar.waitFor({ state: 'visible' });
    await btnEditar.click({ force: true });
    
    // Validar que el modal abrió
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // 5. MODIFICAR DATOS (DENTRO DEL IFRAME)
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    const frame = page.frameLocator('#modalIframe');
    const inputTitulo = frame.locator('#inpTitulo');
    
    // Espera a que el formulario cargue dentro del frame
    await inputTitulo.waitFor({ state: 'visible', timeout: 20000 });

    await inputTitulo.clear();
    await inputTitulo.fill('Programación Avanzada');
    
    // Cambiamos año y ejemplares
    await frame.locator('#slcAnioEdicion').selectOption({ index: 1 }); 
    await frame.locator('#inpNoEjemplares').clear();
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // 6. GUARDAR Y PROCESAR
  await test.step('6. Presionar Guardar y confirmar Alerta', async () => {
    const frame = page.frameLocator('#modalIframe');
    await frame.locator('#btnGuardar').click();

    // Manejo de SweetAlert (Plan A: Frame, Plan B: Página)
    const btnConfirmarFrame = frame.locator('button.swal2-confirm');
    const btnConfirmarPagina = page.locator('button.swal2-confirm');

    try {
      await Promise.race([
        btnConfirmarFrame.waitFor({ state: 'visible', timeout: 10000 }).then(() => btnConfirmarFrame.click()),
        btnConfirmarPagina.waitFor({ state: 'visible', timeout: 10000 }).then(() => btnConfirmarPagina.click())
      ]);
    } catch (e) {
      console.log('Alerta manual o ausente');
    }

    // Forzar cierre de modal y esperar proceso de guardado
    await page.evaluate(() => { if(typeof closeAllModals === 'function') closeAllModals(); });
    await page.waitForTimeout(2000); 
  });

  // 7, 8 y 9. VERIFICACIÓN Y CIERRE (CORREGIDO PARA PERSISTENCIA)
  await test.step('7, 8 y 9. Verificar cambios y cerrar sesión', async () => {
    // RECARGA OBLIGATORIA para verificar si el cambio llegó a la base de datos
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    
    // Verificación del nuevo título
    const tabla = page.locator('#tablaLibros');
    await expect(tabla).toContainText('Programación Avanzada', { timeout: 10000 });

    // Logout final
    await page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first().click();
    await expect(page).toHaveURL(/.*login/);
  });
});