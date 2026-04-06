import { test, expect } from '@playwright/test';

test('PI-01 - Creación de tipo de préstamo vía API', async ({ page }) => {

  // Tiempo de espera de 60 segundos para prevenir Timeouts en servidores locales
  test.setTimeout(60000);

  // ─────────────────────────────────────────────
  // PASO 1 – Acceder al módulo de Préstamo
  // ─────────────────────────────────────────────
  await test.step('1. Acceder al módulo de Préstamo', async () => {
    // 1.1 Navegar al login local
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    
    // 1.2 Proceso de Login
    await page.locator('#sesion').selectOption('ROL003'); // Jefe de Departamento
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // 1.3 Cerrar alerta de éxito
    const alerta = page.locator('.swal2-popup');
    const btnAceptar = page.locator('button.swal2-confirm');
    
    await btnAceptar.waitFor({ state: 'visible' });
    await btnAceptar.click();
    
    // Esperar a que la capa de la alerta desaparezca (evita errores de clic bloqueado)
    await expect(alerta).toBeHidden();

    // 1.4 Entrar a la sección de Préstamos
    const btnVerPrestamos = page.getByRole('link', { name: /Ver préstamos/i });
    await btnVerPrestamos.click();

    // Validar que la navegación fue exitosa
    await expect(page).toHaveURL(/.*prestamos/);
  });

  // ─────────────────────────────────────────────
  // PASO 2 – Abrir el modal de configuración
  // ─────────────────────────────────────────────
  await test.step('2. Seleccionar icono de ajustes e ingresar datos', async () => {
    // Usamos el Título exacto para no confundirlo con el engranaje de Usuarios
    await page.getByTitle('Configurar tipos de préstamo').click();

    // Verificamos que el modal se abrió
    const modal = page.locator('#modal-tipos-prestamo');
    await expect(modal).toBeVisible();
  });

  // ─────────────────────────────────────────────
  // PASO 3 y 4 – Enviar formulario y revisar respuesta API
  // ─────────────────────────────────────────────
  await test.step('3 y 4. Enviar formulario y revisar respuesta API', async () => {
    // Localizamos el iframe que contiene el mini-sistema de tipos de préstamo
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // Escribimos el valor en el input
    await frame.locator('#nombreTipoPrestamo').fill('Interno');

    // Preparamos la captura de la respuesta de red (POST)
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/tipos_prestamo/agregar') && 
      response.request().method() === 'POST'
    );

    // Clic en Guardar
    await frame.locator('button.btn-primario').click();

    // Validamos la respuesta. .ok() permite códigos 200 al 299 (incluyendo tu 201)
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy(); 
  });

  // ─────────────────────────────────────────────
  // PASO 5 y 6 – Verificar persistencia y visualización
  // ─────────────────────────────────────────────
  await test.step('5 y 6. Verificar registro insertado y visible', async () => {
    const frame = page.frameLocator('iframe[src*="tipo_prestamo"]');

    // 1. Verificar el mensaje de éxito en el DOM del iframe
    const mensaje = frame.locator('#mensajeExito');
    await expect(mensaje).toBeVisible();
    await expect(mensaje).toContainText('Tipo de préstamo agregado correctamente.');

    // 2. Verificar que el nuevo elemento "Interno" ya se listó en la tabla
    const lista = frame.locator('#listaTiposPrestamo');
    await expect(lista).toContainText('Interno');

    // 3. Cerrar el modal para dejar el sistema listo para otra prueba
    await frame.locator('.cerrar-modal').click();
    await expect(page.locator('#modal-tipos-prestamo')).toBeHidden();
  });
});