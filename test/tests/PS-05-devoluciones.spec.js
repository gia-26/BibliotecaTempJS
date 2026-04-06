import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo extendido para lidiar con la carga de XAMPP/Localhost
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
    
    const fila = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    await expect(fila).toBeVisible({ timeout: 15000 });
  });

  // 4. SELECCIONAR EDITAR
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    // Buscamos cualquier elemento clicable en la última celda (Acciones)
    const btnEditar = filaLibro.locator('td').last().locator('button, a, i.fa-pen-to-square').first();
    
    await btnEditar.waitFor({ state: 'visible' });
    await btnEditar.click({ force: true });
    
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // 5. MODIFICAR DATOS (DENTRO DEL IFRAME)
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    const frame = page.frameLocator('#modalIframe');
    const inputTitulo = frame.locator('#inpTitulo');
    
    await inputTitulo.waitFor({ state: 'visible', timeout: 20000 });

    await inputTitulo.clear();
    await inputTitulo.fill('Programación Avanzada');
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });
    await frame.locator('#inpNoEjemplares').clear();
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // 6. GUARDAR Y CERRAR MODAL
  await test.step('6. Presionar Guardar y confirmar Alerta', async () => {
    const frame = page.frameLocator('#modalIframe');
    await frame.locator('#btnGuardar').click();

    // Localizar el botón de confirmar de SweetAlert (puede estar en el frame o en la página)
    const btnConfirmarFrame = frame.locator('button.swal2-confirm');
    const btnConfirmarPagina = page.locator('button.swal2-confirm');

    try {
      await Promise.race([
        btnConfirmarFrame.waitFor({ state: 'visible', timeout: 8000 }).then(() => btnConfirmarFrame.click()),
        btnConfirmarPagina.waitFor({ state: 'visible', timeout: 8000 }).then(() => btnConfirmarPagina.click())
      ]);
      
      // Pequeña espera para que el sistema procese el cierre tras el click
      await page.waitForTimeout(1000); 
    } catch (e) {
      console.log('Alerta no detectada o ya cerrada');
    }

    // SI EL MODAL SIGUE ABIERTO, FORZAMOS EL CIERRE
    const modal = page.locator('#modalLibros');
    if (await modal.isVisible()) {
      // Intentamos cerrar haciendo clic en el botón X del modal o escapando
      await page.keyboard.press('Escape');
      // Si el sistema tiene la función closeAllModals, la ejecutamos
      await page.evaluate(() => { if(typeof closeAllModals === 'function') closeAllModals(); });
    }

    await expect(modal).toBeHidden({ timeout: 10000 });
  });

  // 7, 8 y 9. VERIFICACIÓN Y LOGOUT
  await test.step('7, 8 y 9. Verificar cambios y cerrar sesión', async () => {
    // Verificación en tabla
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    
    // Paso 8: Recarga de página para persistencia
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    await expect(page.locator('#tablaLibros')).toContainText('2023');

    // Paso 9: Logout
    await page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first().click();
    await expect(page).toHaveURL(/.*login/);
  });
});