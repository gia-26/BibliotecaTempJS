import { test, expect } from '@playwright/test';

test('PI-01 - Creación de tipo de préstamo vía API', async ({ page }) => {

  // Tiempo de espera máximo de 1 minuto para toda la prueba
  test.setTimeout(60000);

  // ─────────────────────────────────────────────
  // PASO 1 – Acceder al módulo de Préstamo
  // ─────────────────────────────────────────────
  await test.step('1. Acceder al módulo de Préstamo', async () => {
    // 1.1 Ir a la URL local
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    // 1.2 Credenciales de acceso
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // 1.3 Manejo de la Alerta SweetAlert
    const alerta = page.locator('.swal2-popup');
    const btnAceptar = page.locator('button.swal2-confirm');
    
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
    
    // Esperar a que la alerta desaparezca para no bloquear el siguiente clic
    await expect(alerta).toBeHidden();

    // 1.4 Navegar a la sección de Préstamos desde el Dashboard
    const btnVerPrestamos = page.getByRole('link', { name: /Ver préstamos/i });
    await btnVerPrestamos.click();

    // Validar que estamos en la URL correcta
    await expect(page).toHaveURL(/.*prestamos/);
  });

  // ─────────────────────────────────────────────
  // PASO 2 – Seleccionar icono de ajustes e ingresar datos
  // ─────────────────────────────────────────────
  await test.step('2. Seleccionar icono de ajustes e ingresar datos', async () => {
    // CORRECCIÓN: Usamos getByTitle para diferenciar el botón de préstamos del de usuarios
    await page.getByTitle('Configurar tipos de préstamo').click();

    // Esperar a que el modal específico se muestre
    const modal = page.locator('#modal-tipos-prestamo');
    await expect(modal).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 3 y 4 – Enviar formulario (POST) y Revisar respuesta
  // ─────────────────────────────────────────────
  await test.step('3 y 4. Enviar formulario y revisar respuesta API', async () => {
    // Localizamos el iframe que contiene el formulario
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // Escribir el nuevo tipo
    await frame.locator('#nombreTipoPrestamo').fill('Interno');

    // Preparamos la captura de la respuesta de la API (POST)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/tipos_prestamo/agregar') && 
      response.request().method() === 'POST'
    );

    // Clic en Guardar dentro del iframe
    await frame.locator('button.btn-primario').click();

    // Validar que la respuesta del servidor sea exitosa (Status 200)
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  // ─────────────────────────────────────────────
  // PASO 5 y 6 – Consultar base de datos y Verificar en interfaz
  // ─────────────────────────────────────────────
  await test.step('5 y 6. Verificar registro insertado y visible', async () => {
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // 1. Verificar la notificación de éxito interna del iframe
    const mensaje = frame.locator('#mensajeExito');
    await expect(mensaje).toBeVisible();
    await expect(mensaje).toContainText('Tipo de préstamo agregado correctamente.');

    // 2. Verificar que el texto "Interno" aparezca en la lista superior
    const lista = frame.locator('#listaTiposPrestamo');
    await expect(lista).toContainText('Interno');

    // 3. Cerrar el modal para finalizar la prueba limpiamente
    await frame.locator('.cerrar-modal').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();
  });
});