import { test, expect } from '@playwright/test';

test('PI-01 - Creación de tipo de préstamo vía API', async ({ page }) => {

  // Tiempo de espera para procesos de red o carga de modales
  test.setTimeout(60000);

  // ─────────────────────────────────────────────
  // PASO 1 – Acceder al módulo de Préstamo (Localhost)
  // ─────────────────────────────────────────────
  await test.step('1. Acceder al módulo de Préstamo', async () => {
    // URL de tu servidor local
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    // Login - Basado en tu video
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Esperar y cerrar el SweetAlert de "Inicio de sesión exitoso"
    const btnAceptarLogin = page.locator('button.swal2-confirm');
    await btnAceptarLogin.waitFor({ state: 'visible' });
    await btnAceptarLogin.click();

    // Clic en el botón "Ver préstamos" del Dashboard (ajustado a la ruta del video)
    await page.locator('a[href="../prestamos/"]').click();
    await expect(page).toHaveURL(/.*prestamos/);
  });

  // ─────────────────────────────────────────────
  // PASO 2 – Abrir ajustes e ingresar datos
  // ─────────────────────────────────────────────
  await test.step('2. Seleccionar icono de ajustes e ingresar datos', async () => {
    // Esperar a que la página de préstamos cargue y dar clic al engranaje
    await page.locator('.config-btn').click();

    // Esperar a que el modal con ID modal-tipos-prestamo sea visible
    await expect(page.locator('#modal-tipos-prestamo')).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 3 y 4 – Enviar formulario (POST) y Revisar respuesta
  // ─────────────────────────────────────────────
  await test.step('3 y 4. Enviar formulario y revisar respuesta API', async () => {
    // Localizamos el iframe que se vio en tu inspección de código
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // Escribir "Interno" en el campo de texto
    await frame.locator('#nombreTipoPrestamo').fill('Interno');

    // Escuchamos la respuesta de la API de Vercel (que es la que usa tu frontend)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/tipos_prestamo/agregar') && 
      response.request().method() === 'POST'
    );

    // Clic en el botón "Guardar" dentro del iframe
    await frame.locator('button.btn-primario').click();

    // Validar que la respuesta de la API fue 200 OK (como se vio en el video)
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  // ─────────────────────────────────────────────
  // PASO 5 y 6 – Consultar base de datos y Verificar en interfaz
  // ─────────────────────────────────────────────
  await test.step('5 y 6. Verificar registro insertado y visible', async () => {
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // 1. Verificar la notificación de éxito (id="mensajeExito")
    const mensaje = frame.locator('#mensajeExito');
    await expect(mensaje).toBeVisible();
    await expect(mensaje).toContainText('Tipo de préstamo agregado correctamente.');

    // 2. Verificar que el nuevo registro "Interno" aparezca en la lista
    const lista = frame.locator('#listaTiposPrestamo');
    await expect(lista).toContainText('Interno');

    // 3. Cerrar el modal para finalizar la prueba limpiamente
    await frame.locator('.cerrar-modal').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();
  });
});