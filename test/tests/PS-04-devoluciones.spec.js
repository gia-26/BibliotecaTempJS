import { test, expect } from '@playwright/test';

test('PS-04 - Validación de renovación de préstamo y reportes', async ({ page, context }) => {
  // Tiempo extendido para los 3 cambios de sesión y generación de reportes
  test.setTimeout(180000); 

  // --- PASO 1, 2 Y 3: BIBLIOTECARIO (PER004) ---
  await test.step('1-3. Iniciar sesión y renovar préstamo', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL002'); 
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    
    // Alerta de bienvenida
    await page.locator('button.swal2-confirm').click();

    // Navegación al módulo de Devoluciones (ID del enlace lateral)
    await page.locator('a#devoluciones').click();
    
    // ESPERA DINÁMICA: Esperar a que el script main.js llene la tabla #tblPrestamos
    await page.waitForFunction(() => {
      const filas = document.querySelectorAll('#tblPrestamos tr');
      return filas.length > 0;
    }, { timeout: 20000 });

    // Localizar la fila de ALU007 (Cien años de soledad)
    const filaPrestamo = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).first();
    
    // Guardar la fecha de devolución (Columna 6 en tu HTML index)
    const fechaAntigua = await filaPrestamo.locator('td').nth(5).innerText();
    
    // Clic en el botón RENOVAR (Es el último botón de la fila según tu index.html)
    await filaPrestamo.locator('button').last().click();
    
    // Confirmación de SweetAlert ("Sí, renovar")
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Pausa para que el servidor procese y aceptar mensaje de éxito
    await page.waitForTimeout(2000);
    await page.locator('button.swal2-confirm', { hasText: 'Aceptar' }).click();

    // Verificar que la fecha se actualizó en la tabla
    const fechaNueva = await filaPrestamo.locator('td').nth(5).innerText();
    expect(fechaAntigua).not.toBe(fechaNueva);
  });

  // --- PASO 4, 5 Y 6: ALUMNO (ALU007) ---
  await test.step('4-6. Verificar historial como Alumno', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('TU001'); // Tipo Usuario: Estudiante
    await page.locator('#usuario').fill('ALU007');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    // Acceder a "Ver mis préstamos" (según dashboard de alumno)
    await page.locator('a.btn', { hasText: /préstamos|prestamos/i }).first().click();
    
    // Validar libro y estado activo
    const tablaHistorial = page.locator('table');
    await expect(tablaHistorial).toContainText('Cien años de soledad');
    await expect(tablaHistorial).toContainText('Activo');
  });

  // --- PASO 7: INTENTO DE RENOVACIÓN DOBLE (BLOQUEO) ---
  await test.step('7. Intentar renovar nuevamente (Bloqueo)', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('ROL002');
    await page.locator('#usuario').fill('PER004');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#devoluciones').click();
    
    // Esperar carga de datos
    await page.waitForFunction(() => document.querySelectorAll('#tblPrestamos tr').length > 0);

    const filaPrestamo = page.locator('#tblPrestamos tr', { hasText: 'ALU007' }).first();
    await filaPrestamo.locator('button').last().click();
    await page.locator('button.swal2-confirm', { hasText: /Sí|Si/ }).click();
    
    // Validar alerta de error de SweetAlert (Bloqueo por límite de renovación)
    await expect(page.locator('.swal2-error')).toBeVisible();
    await page.locator('button.swal2-confirm').click(); 
  });

  // --- PASO 8 Y 9: JEFE DE DEPARTAMENTO (PER002) Y REPORTE ---
  await test.step('8-9. Generar reporte como Jefe', async () => {
    await page.locator('#btnSalir').click();
    
    await page.locator('#sesion').selectOption('ROL003'); // Jefe
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();
    await page.locator('button.swal2-confirm').click();

    await page.locator('a#reportes').click();
    
    // Configurar reporte
    await page.locator('#tipoReporte').selectOption('prestamos');
    await page.locator('input[type="date"]').first().fill('2026-01-01');
    await page.locator('input[type="date"]').last().fill('2026-04-30');

    // Manejar apertura de nueva pestaña para el PDF
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('button', { hasText: /Generar|Reporte/i }).first().click()
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.php'); 
  });
});