import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación de préstamo y reportes', async ({ page, context }) => {
  // Tiempo extendido para manejar los 3 cambios de sesión
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO / COORDINADOR (PER004) ---
  await test.step('1-3. Iniciar sesión y renovar préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); // Coordinador según video
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Alerta de bienvenida
    await page.locator('button.swal2-confirm').click();

    // Navegación mediante ID para evitar "strict mode violation"
    await page.locator('a#devoluciones').click();
    
    // Localizar préstamo de ALU007 en la tabla
    const filaPrestamo = page.locator('#tablaDevoluciones tr', { hasText: 'ALU007' }).first();
    await filaPrestamo.waitFor({ state: 'visible' });

    // Guardar fecha actual para comparar después
    const fechaAntigua = await filaPrestamo.locator('td').nth(5).textContent();
    
    // Clic en botón "Renovar" (el naranja 'btn-edit' del video)
    await filaPrestamo.locator('button.btn-edit').click();
    
    // Confirmar en SweetAlert ("Sí, renovar")
    await page.locator('button.swal2-confirm').click();
    await page.waitForTimeout(1000);
    // Aceptar mensaje de éxito
    await page.locator('button.swal2-confirm').click();

    // Verificación de recálculo: la fecha en la columna 6 debe ser distinta
    const fechaNueva = await filaPrestamo.locator('td').nth(5).textContent();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    // Cerrar sesión actual
    await page.locator('#btnSalir').click();
    
    // Login Alumno
    await page.locator('#sesion').selectOption('TU001'); // Tipo de Usuario: Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Acceder a "Ver mis préstamos" (botón azul en el dashboard)
    await page.locator('a.btn', { hasText: 'Ver mis préstamos' }).click();
    
    // Validar presencia del libro y estado activo
    const tablaHistorial = page.locator('table');
    await expect(tablaHistorial).toContainText('Cien años de soledad');
    await expect(tablaHistorial).toContainText('Activo');
  });

  // --- PASO 7: INTENTO DE RENOVACIÓN DOBLE (BLOQUEO) ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir').click();
    
    // Regresar como Bibliotecario para intentar forzar otra renovación
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#devoluciones').click();
    const filaPrestamo = page.locator('#tablaDevoluciones tr', { hasText: 'ALU007' }).first();
    
    // Segundo intento de renovación
    await filaPrestamo.locator('button.btn-edit').click();
    await page.locator('button.swal2-confirm').click(); 
    
    // Validar que aparezca el icono de error o mensaje de restricción
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
  });

  // --- PASO 8 Y 9: JEFE DE DEPARTAMENTO (PER002) Y REPORTE ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir').click();
    
    // Login Jefe de Departamento
    await page.locator('#sesion').selectOption('ROL003'); 
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Ir a módulo de Reportes
    await page.locator('a#reportes').click();
    
    // Configurar reporte de préstamos
    await page.locator('#tipoReporte').selectOption('prestamos');
    await page.locator('#fechaInicio').fill('2026-01-01');
    await page.locator('#fechaFin').fill('2026-04-30');

    // Capturar la apertura del PDF en una nueva pestaña
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerarReporte').click()
    ]);

    // Validar que la nueva página cargó un recurso .php o PDF
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});