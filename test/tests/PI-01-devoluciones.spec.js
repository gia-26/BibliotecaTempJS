import { test, expect } from '@playwright/test';

test('PI-01 - Creación de tipo de préstamo vía API', async ({ page }) => {

  // Aumentamos el timeout por si el servidor local o la API de Vercel tardan en responder
  test.setTimeout(60000);

  // ─────────────────────────────────────────────
  // PASO 1 – Acceder al módulo de Préstamo
  // ─────────────────────────────────────────────
  await test.step('1. Acceder al módulo de Préstamo', async () => {
    // 1.1 Ir a la URL local
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    // 1.2 Formulario de Login
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // 1.3 Manejo de la Alerta SweetAlert (Punto donde fallaba antes)
    const alerta = page.locator('.swal2-popup');
    const btnAceptar = page.locator('button.swal2-confirm');
    
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
    
    // IMPORTANTE: Esperar a que la alerta desaparezca para que no bloquee el clic del Dashboard
    await expect(alerta).toBeHidden();

    // 1.4 Clic en el botón del Dashboard usando el texto visible
    const btnVerPrestamos = page.getByRole('link', { name: /Ver préstamos/i });
    await btnVerPrestamos.click();

    // Verificamos que la URL cambió a préstamos
    await expect(page).toHaveURL(/.*prestamos/);
  });

  // ─────────────────────────────────────────────
  // PASO 2 – Abrir ajustes e ingresar datos
  // ─────────────────────────────────────────────
  await test.step('2. Seleccionar icono de ajustes e ingresar datos', async () => {
    // Clic en el engranaje de "Tipo de préstamo"
    await page.locator('.config-btn').click();

    // Esperar a que el modal sea visible en pantalla
    const modal = page.locator('#modal-tipos-prestamo');
    await expect(modal).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 3 y 4 – Enviar formulario (POST) y Revisar respuesta
  // ─────────────────────────────────────────────
  await test.step('3 y 4. Enviar formulario y revisar respuesta API', async () => {
    // Localizamos el iframe que contiene el formulario de tipos
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // Llenar el campo de texto con "Interno"
    await frame.locator('#nombreTipoPrestamo').fill('Interno');

    // Preparamos la escucha de la respuesta de la API (POST a Vercel)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/tipos_prestamo/agregar') && 
      response.request().method() === 'POST'
    );

    // Clic en el botón Guardar dentro del iframe
    await frame.locator('button.btn-primario').click();

    // Validar que la API respondió con éxito (Status 200 como en el video)
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  // ─────────────────────────────────────────────
  // PASO 5 y 6 – Consultar base de datos y Verificar en interfaz
  // ─────────────────────────────────────────────
  await test.step('5 y 6. Verificar registro insertado y visible', async () => {
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // 1. Verificar la notificación personalizada (mensajeExito)
    const mensaje = frame.locator('#mensajeExito');
    await expect(mensaje).toBeVisible();
    await expect(mensaje).toContainText('Tipo de préstamo agregado correctamente.');

    // 2. Verificar que el nuevo registro aparezca en la lista superior
    const lista = frame.locator('#listaTiposPrestamo');
    await expect(lista).toContainText('Interno');

    // 3. Cerrar el modal para finalizar la prueba
    await frame.locator('.cerrar-modal').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();
  });
});