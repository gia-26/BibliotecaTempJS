import { test, expect } from '@playwright/test';

test('PS-05 - Actualización de datos de libro existente', async ({ page }) => {

  // Tiempo extendido para servidores locales lentos
  test.setTimeout(120000);

  // ─────────────────────────────────────────────
  // PASO 1 – Ingresar al sistema
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // PASO 2 y 3 – Navegación y Búsqueda
  // ─────────────────────────────────────────────
  await test.step('2 y 3. Acceder a Libros y buscar LIB009', async () => {
    await page.getByRole('link', { name: /Libros/i }).first().click();
    await page.locator('#filterSelect').selectOption('id');
    await page.locator('#searchInput').fill('LIB009');
    
    const fila = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    await expect(fila).toBeVisible({ timeout: 15000 });
  });

  // ─────────────────────────────────────────────
  // PASO 4 – Abrir Modal
  // ─────────────────────────────────────────────
  await test.step('4. Seleccionar la opción Editar', async () => {
    const filaLibro = page.locator('#tablaLibros tr', { hasText: 'LIB009' });
    const btnEditar = filaLibro.locator('.fa-pen-to-square, .btn-editar').first();
    await btnEditar.click();
    await expect(page.locator('#modalLibros')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 5 – Modificar Datos (DENTRO DEL IFRAME)
  // ─────────────────────────────────────────────
  await test.step('5. Modificar campos dentro del Iframe', async () => {
    const frame = page.frameLocator('#modalIframe');
    const inputTitulo = frame.locator('#inpTitulo');
    
    // Esperar a que el iframe cargue su contenido
    await inputTitulo.waitFor({ state: 'visible', timeout: 20000 });

    await inputTitulo.clear();
    await inputTitulo.fill('Programación Avanzada');
    
    await frame.locator('#slcAnioEdicion').selectOption({ label: '2023' });
    
    await frame.locator('#inpNoEjemplares').clear();
    await frame.locator('#inpNoEjemplares').fill('1');
  });

  // ─────────────────────────────────────────────
  // PASO 6 – Guardar y Gestionar Alerta (CORRECCIÓN CRÍTICA)
  // ─────────────────────────────────────────────
  await test.step('6. Presionar Guardar y confirmar Alerta', async () => {
    const frame = page.frameLocator('#modalIframe');
    const btnGuardar = frame.locator('#btnGuardar');

    // Forzamos el scroll y el clic
    await btnGuardar.scrollIntoViewIfNeeded();
    await btnGuardar.click();

    // Lógica para detectar el botón "Aceptar" de SweetAlert 
    // Lo busca tanto dentro del iframe como fuera
    const btnConfirmar = frame.locator('button.swal2-confirm');
    const btnConfirmarPagina = page.locator('button.swal2-confirm');

    // Intentar hacer clic en el que aparezca primero
    try {
      await Promise.race([
        btnConfirmar.waitFor({ state: 'visible', timeout: 10000 }).then(() => btnConfirmar.click()),
        btnConfirmarPagina.waitFor({ state: 'visible', timeout: 10000 }).then(() => btnConfirmarPagina.click())
      ]);
    } catch (e) {
      console.log('La alerta tardó en aparecer o ya se cerró');
    }

    // Esperar a que el modal se cierre realmente
    await expect(page.locator('#modalLibros')).toBeHidden({ timeout: 15000 });
  });

  // ─────────────────────────────────────────────
  // PASO 7 al 9 – Verificación Final
  // ─────────────────────────────────────────────
  await test.step('7, 8 y 9. Verificar cambios y cerrar sesión', async () => {
    // Verificación en tabla
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    
    // Recarga para persistencia
    await page.reload();
    await page.locator('#searchInput').fill('LIB009');
    await expect(page.locator('#tablaLibros')).toContainText('Programación Avanzada');
    await expect(page.locator('#tablaLibros')).toContainText('2023');

    // Logout
    const btnSalir = page.locator('.fa-sign-out-alt, .fa-door-open, #btnSalir').first();
    await btnSalir.click();
    await expect(page).toHaveURL(/.*login/);
  });
});