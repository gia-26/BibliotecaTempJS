import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Aumentamos el tiempo a 2 minutos para evitar fallos por lentitud del servidor local (XAMPP)
  test.setTimeout(120000);

  // ─────────────────────────────────────────────
  // PASO 1 – Ingresar al sistema
  // ─────────────────────────────────────────────
  await test.step('1. Ingresar al sistema con usuario válido', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    // Esperar y cerrar la alerta de bienvenida
    const btnAceptar = page.locator('button.swal2-confirm');
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
    await expect(page.locator('.swal2-popup')).toBeHidden();
  });

  // ─────────────────────────────────────────────
  // PASO 2 y 3 – Acceder y Buscar
  // ─────────────────────────────────────────────
  await test.step('2 y 3. Acceder al módulo Libros y buscar LIB009', async () => {
    // Ir a Libros
    await page.getByRole('link', { name: /Libros/i }).first().click();
    
    // Configurar búsqueda
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    // Verificar que aparezca en la tabla
    await expect(page.locator('#tablaLibros')).toContainText('LIB009');
  });

  // ─────────────────────────────────────────────
  // PASO 4 – Abrir Modal de Edición
  // ─────────────────────────────────────────────
  await test.step('4. Seleccionar la opción Editar del libro LIB009', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    
    // Clic en el icono del lápiz (usamos .first() por si hay duplicados ocultos)
    await filaLibro.locator('.fa-pen-to-square, .btn-editar').first().click();
    
    // Validar que el modal principal se visualiza
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 5 – Modificar datos (Dentro del IFRAME con esperas)
  // ─────────────────────────────────────────────
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    // Definir el frame
    const frame = page.frameLocator('#modalIframe');

    // ESPERA ACTIVA: Antes de escribir, esperamos a que el input sea visible
    // Esto evita el Timeout si el Iframe tarda en cargar el HTML interno
    const inputTitulo = frame.locator('#inpTitulo');
    await inputTitulo.waitFor({ state: 'visible', timeout: 15000 });

    // Llenar datos con los IDs reales de tu HTML
    await inputTitulo.fill('Programación Avanzada');
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // ─────────────────────────────────────────────
  // PASO 6 – Guardar cambios
  // ─────────────────────────────────────────────
  await test.step('6. Presionar el botón Guardar cambios', async () => {
    const frame = page.frameLocator('#modalIframe');

    // Clic en Guardar
    await frame.locator('#btnGuardar').click();

    // El SweetAlert suele aparecer en la página principal, no dentro del frame
    const swalAceptar = page.locator('button.swal2-confirm');
    await swalAceptar.waitFor({ state: 'visible' });
    await swalAceptar.click();
    
    // Esperar a que el modal se cierre
    await expect(page.locator('#modalLibros')).toBeHidden();
  });

  // ─────────────────────────────────────────────
  // PASO 7 y 8 – Verificación y Persistencia
  // ─────────────────────────────────────────────
  await test.step('7 y 8. Verificar actualización y recarga', async () => {
    // Verificar en la tabla directamente
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');

    // Recargar página para asegurar que se guardó en la Base de Datos
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    await expect(page.locator('#tablaLibros')).toContainText('2023');
  });

  // ─────────────────────────────────────────────
  // PASO 9 – Cerrar sesión
  // ─────────────────────────────────────────────
  await test.step('9. Cerrar sesión', async () => {
    // Selector flexible para el botón de salir (clase de font-awesome o ID)
    const btnSalir = page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first();
    await btnSalir.click();
    
    await expect(page).toHaveURL(/.*login/);
  });
});