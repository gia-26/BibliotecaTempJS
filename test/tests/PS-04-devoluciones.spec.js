import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación de préstamo y reportes', async ({ page, context }) => {
  // Tiempo extendido para el flujo completo E2E
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (PER004) ---
  await test.step('1-3. Iniciar sesión y renovar préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); // Coordinador/Bibliotecario
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Alerta de bienvenida
    await page.locator('button.swal2-confirm').click();

    // Navegar a Devoluciones (usando el ID del enlace lateral)
    await page.locator('a#devoluciones').click();
    
    // Localizar la fila del libro "Cien años de soledad" para el usuario ALU007
    const filaPrestamo = page.locator('tr', { hasText: 'Cien años de soledad' }).filter({ hasText: 'ALU007' }).first();
    await filaPrestamo.waitFor({ state: 'visible' });

    // Guardar la fecha de entrega actual para comparar el recálculo
    const fechaAntigua = await filaPrestamo.locator('td').nth(5).innerText();
    
    // Clic en el botón de renovar (botón naranja con icono de edición)
    await filaPrestamo.locator('button.btn-edit').click();
    
    // Confirmar en SweetAlert ("Sí, renovar")
    await page.locator('button.swal2-confirm').click();
    await page.waitForTimeout(1500); // Pausa para procesamiento
    // Aceptar mensaje de éxito
    await page.locator('button.swal2-confirm').click();

    // Verificar que la fecha de entrega se haya actualizado (recalulado)
    const fechaNueva = await filaPrestamo.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.locator('#btnSalir').click(); // Cerrar sesión
    
    await page.locator('#sesion').selectOption('TU001'); // Tipo de Usuario: Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Ver historial de préstamos (botón azul en dashboard)
    await page.locator('a.btn', { hasText: 'Ver mis préstamos' }).click();
    
    // Validar que el libro aparece como renovado y activo
    const tablaHistorial = page.locator('table');
    await expect(tablaHistorial).toContainText('Cien años de soledad');
    await expect(tablaHistorial).toContainText('Activo');
  });

  // --- PASO 7: BLOQUEO DE SEGUNDA RENOVACIÓN ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir').click();
    
    // Regresar como Bibliotecario
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#devoluciones').click();
    const filaPrestamo = page.locator('tr', { hasText: 'Cien años de soledad' }).filter({ hasText: 'ALU007' }).first();
    
    // Intentar renovar de nuevo
    await filaPrestamo.locator('button.btn-edit').click();
    await page.locator('button.swal2-confirm').click(); 
    
    // Validar alerta de error o bloqueo (Icono X de SweetAlert)
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
  });

  // --- PASO 8 Y 9: JEFE DE DEPARTAMENTO (PER002) ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('ROL003'); // Jefe
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#reportes').click();
    
    // Configurar y generar PDF
    await page.locator('#tipoReporte').selectOption('prestamos');
    await page.locator('#fechaInicio').fill('2026-01-01');
    await page.locator('#fechaFin').fill('2026-04-30');

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerarReporte').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});