import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación rápida de préstamo y reportes', async ({ page, context }) => {
  // Tiempo extendido para manejar los cambios de sesión
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (PER004) ---
  await test.step('1-3. Iniciar sesión y renovar primer préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); // Coordinador
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Alerta de bienvenida
    await page.locator('button.swal2-confirm').click();

    // Navegar a Devoluciones
    await page.locator('a#devoluciones').click();
    
    // Esperar a que la tabla cargue (usamos un selector genérico de tabla)
    await page.waitForSelector('table tbody tr', { state: 'visible', timeout: 20000 });

    // --- SELECCIÓN RÁPIDA (SEGÚN VIDEO) ---
    // Tomamos la PRIMERA fila de la tabla (donde está ALU007 en tu video)
    const primeraFila = page.locator('table tbody tr').first();
    
    // Guardar fecha de entrega actual (Columna 6) para verificar después
    const fechaAntigua = await primeraFila.locator('td').nth(5).innerText();
    
    // Clic directo al botón naranja 'btn-edit' de la primera fila
    await primeraFila.locator('button.btn-edit').click();
    
    // Confirmar en SweetAlert ("Sí, renovar")
    await page.locator('button.swal2-confirm').click();
    await page.waitForTimeout(1500); // Pausa de seguridad para el backend
    // Aceptar mensaje de éxito
    await page.locator('button.swal2-confirm').click();

    // Verificar recálculo de fecha
    const fechaNueva = await primeraFila.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.locator('#btnSalir').click(); // Logout
    
    // Login Alumno
    await page.locator('#sesion').selectOption('TU001'); // Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Ver historial (botón azul en dashboard)
    await page.locator('a.btn', { hasText: 'Ver mis préstamos' }).click();
    
    // Validar libro y estado activo en la tabla de historial
    await expect(page.locator('table')).toContainText('Cien años de soledad');
    await expect(page.locator('table')).toContainText('Activo');
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
    await page.waitForSelector('table tbody tr', { state: 'visible' });

    // Intentar renovar la primera fila otra vez
    const primeraFila = page.locator('table tbody tr').first();
    await primeraFila.locator('button.btn-edit').click();
    await page.locator('button.swal2-confirm').click(); // "Sí, renovar"
    
    // Validar alerta de error (SweetAlert con cruz roja)
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
  });

  // --- PASO 8 Y 9: JEFE DE DEPARTAMENTO (PER002) Y REPORTE ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir').click();
    
    // Login Jefe
    await page.locator('#sesion').selectOption('ROL003'); 
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#reportes').click();
    
    // Configurar reporte
    await page.locator('#tipoReporte').selectOption('prestamos');
    await page.locator('#fechaInicio').fill('2026-01-01');
    await page.locator('#fechaFin').fill('2026-04-30');

    // Capturar apertura de PDF en nueva pestaña
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#btnGenerarReporte').click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); // Verifica que se abrió el generador
  });
});