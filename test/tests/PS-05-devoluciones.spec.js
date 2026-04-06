import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo de espera de 2 minutos para lidiar con la carga de XAMPP/Localhost
  test.setTimeout(120000);

  // 1. LOGIN
  await test.step('1. Ingresar al sistema', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    // Esperar y cerrar la alerta de bienvenida
    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.waitFor({ state: 'visible', timeout: 10000 });
    await btnAceptar.click();
    await expect(page.locator('.swal2-popup')).toBeHidden();
  });

  // 2 y 3. NAVEGACIÓN Y BÚSQUEDA
  await test.step('2 y 3. Acceder a Libros y buscar LIB009', async () => {
    await page.getByRole('link', { name: /Libros/i }).first().click();
    
    // Aseguramos que el filtro esté en ID antes de escribir
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    // Esperamos a que la fila con el ID aparezca en la tabla
    const fila = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    await expect(fila).toBeVisible({ timeout: 15000 });
  });

  // 4. SELECCIONAR EDITAR (CORRECCIÓN CRÍTICA)
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    
    // Intentamos hacer clic en el botón de editar usando varios selectores posibles
    // Esto evita el fallo si la clase del icono cambia ligeramente
    const btnEditar = filaLibro.locator('.fa-pen-to-square, .fa-edit, .btn-editar, button i').first();
    
    await btnEditar.waitFor({ state: 'visible' });
    await btnEditar.click();
    
    // Validamos que el modal se abrió
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // 5. MODIFICAR DATOS (DENTRO DEL IFRAME)
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    const frame = page.frameLocator('#modalIframe');

    // Esperamos a que el contenido del iframe cargue realmente
    const inputTitulo = frame.locator('#inpTitulo');
    await inputTitulo.waitFor({ state: 'visible', timeout: 20000 });

    // Limpiamos y llenamos los campos con los IDs de tu HTML
    await inputTitulo.clear();
    await inputTitulo.fill('Programación Avanzada');
    
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });

    await frame.locator('#inpNoEjemplares').clear();
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // 6. GUARDAR CAMBIOS
  await test.step('6. Presionar el botón Guardar cambios', async () => {
    const frame = page.frameLocator('#modalIframe');
    
    // Clic en el botón Guardar del formulario
    await frame.locator('#btnGuardar').click();

    // Confirmar el mensaje de éxito (SweetAlert suele estar en la página padre)
    const swalAceptar = page.locator('button.swal2-confirm');
    await swalAceptar.waitFor({ state: 'visible' });
    await swalAceptar.click();
    
    // Esperar a que el modal desaparezca para continuar
    await expect(page.locator('#modalLibros')).toBeHidden();
  });

  // 7, 8 y 9. VERIFICACIÓN Y CIERRE
  await test.step('7, 8 y 9. Verificar cambios y cerrar sesión', async () => {
    // Verificación en caliente
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');

    // Recarga (Paso 8 del plan)
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