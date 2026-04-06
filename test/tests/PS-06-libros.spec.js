import { test, expect } from '@playwright/test';

test('Gestión de Autores y Relación con Libros', async ({ page }) => {
  test.setTimeout(120000);

  const nombreAutorNuevo   = 'Javi Márquez Rodríguez';
  const nombreAutorEditado = 'Javier Márquez Rodríguez';

  const cerrarModalAutoresYLibros = async () => {
    const iframeLibros  = page.frameLocator('#modalIframe');
    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');

    await iframeAutores.locator('.cerrar').click();
    await page.waitForTimeout(1000);
    await expect(iframeLibros.locator('#modal-autores')).toBeHidden();

    await page.evaluate(() => {
      const modal  = document.getElementById('modalLibros');
      const iframe = document.getElementById('modalIframe');
      if (modal)  modal.style.display = 'none';
      if (iframe) iframe.src          = '';
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('#modalLibros')).toBeHidden();
  };

  const scrollHastaAutor = async (nombreAutor) => {
    const frameAutores = page.frames().find(f => f.url().includes('autores/index.html'));
    if (frameAutores) {
      await frameAutores.evaluate((nombre) => {
        const items = document.querySelectorAll('#listaAutores .fila-item');
        for (const item of items) {
          if (item.textContent.includes(nombre)) {
            item.scrollIntoView({ behavior: 'instant', block: 'center' });
            break;
          }
        }
      }, nombreAutor);
      await page.waitForTimeout(500);
    }
  };

  await test.step('Iniciar sesión con usuario autorizado', async () => {
    await page.goto('http://localhost/BibliotecaTempJS/login/');
    await page.locator('#sesion').selectOption('ROL003');
    await page.locator('#usuario').fill('PER002');
    await page.locator('#password').fill('pasS123$');
    await page.locator('#btnEntrar').click();

    await page.locator('.swal2-popup').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.swal2-confirm').click();

    await page.waitForFunction(
      () => window.location.href.includes('/dashboard/'),
      { timeout: 15000 }
    );
    await page.waitForTimeout(2000);
  });

  await test.step('Acceder al módulo Autores', async () => {
    await page.locator('a[href="/BibliotecaTempJS/libros/"]').click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/libros\//);
    await expect(page.locator('#tablaLibros')).toBeVisible();
    await page.locator('#tablaLibros tr').first().waitFor({ state: 'visible', timeout: 10000 });

    await page.locator('#btnAgregar').click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#modalLibros')).toBeVisible();

    const iframeLibros = page.frameLocator('#modalIframe');
    await iframeLibros.locator('.form-section').waitFor({ state: 'visible', timeout: 10000 });

    await iframeLibros.locator('button.config-btn[title="Configurar autores principales"]').click();
    await page.waitForTimeout(2000);

    // Verificar que el módulo de autores se desplegó
    await expect(iframeLibros.locator('#modal-autores')).toBeVisible();
    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');
    await iframeAutores.locator('.modal-container').waitFor({ state: 'visible', timeout: 8000 });
  });

  await test.step('Crear un nuevo autor con el nombre indicado', async () => {
    const iframeLibros  = page.frameLocator('#modalIframe');
    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');

    // Llenar y guardar el nuevo autor
    await iframeAutores.locator('#nombreAutor').fill(nombreAutorNuevo);
    await iframeAutores.locator('#formAutor button[type="submit"]').click();
    await page.waitForTimeout(2000);

    // Verificar mensaje de éxito
    const mensaje = iframeAutores.locator('#mensajeExito');
    await expect(mensaje).toBeVisible({ timeout: 8000 });
    const textoMensaje = await mensaje.textContent();
    console.log(`   Mensaje: "${textoMensaje}"`);
    await page.waitForTimeout(1500);

    // Scroll y verificar con count() que el autor existe
    await scrollHastaAutor(nombreAutorNuevo);
    const cantidad = await iframeAutores.locator('#listaAutores .fila-item')
      .filter({ hasText: nombreAutorNuevo })
      .count();
    expect(cantidad).toBeGreaterThan(0);
    console.log(`   Autor "${nombreAutorNuevo}" registrado exitosamente ✓`);

    await cerrarModalAutoresYLibros();
  });

  await test.step('Acceder al módulo Libros', async () => {
    await expect(page.locator('#modalLibros')).toBeHidden();
    await expect(page).toHaveURL(/\/libros\//);
    await expect(page.locator('#tablaLibros')).toBeVisible();
    await page.locator('#filterSelect').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('#filterSelect')).toBeEnabled();
  });

  await test.step('Editar un libro existente y asignar el autor creado', async () => {
    await page.waitForTimeout(1000);

    await page.locator('#filterSelect').selectOption('titulo');
    await page.locator('#searchInput').fill('Cien años de soledad');
    await page.waitForTimeout(2000);

    const filaLibro = page.locator('#tablaLibros tr')
      .filter({ hasText: 'Cien años de soledad' });
    await expect(filaLibro).toBeVisible({ timeout: 8000 });

    await filaLibro.locator('.action-link.action-edit').click();
    await page.waitForTimeout(2000);

    // Verificar que el modal de edición se abrió
    await expect(page.locator('#modalLibros')).toBeVisible();
    const iframeLibros = page.frameLocator('#modalIframe');
    await iframeLibros.locator('.form-section').waitFor({ state: 'visible', timeout: 10000 });

    // Seleccionar el nuevo autor en el select de autor principal
    const selectAutor = iframeLibros.locator('#slcAutorPrincipal');
    await expect(selectAutor).toBeVisible();
    await selectAutor.selectOption({ label: nombreAutorNuevo });

    const valorSeleccionado = await selectAutor.inputValue();
    console.log(`   Autor seleccionado ID: "${valorSeleccionado}"`);
    expect(valorSeleccionado).not.toBe('');

    // Guardar cambios
    await iframeLibros.locator('#btnGuardar').click();
    await page.waitForTimeout(3000);

    // SweetAlert de éxito dentro del iframe de guardarLibros
    const swalEnIframe = iframeLibros.locator('.swal2-popup');
    await swalEnIframe.waitFor({ state: 'visible', timeout: 8000 });
    await iframeLibros.locator('.swal2-confirm').click();
    await page.waitForTimeout(1500);

    // Cerrar modal y limpiar iframe
    await page.evaluate(() => {
      const modal  = document.getElementById('modalLibros');
      const iframe = document.getElementById('modalIframe');
      if (modal)  modal.style.display = 'none';
      if (iframe) iframe.src          = '';
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('#modalLibros')).toBeHidden();
  });

  await test.step('Consultar el libro desde el listado general', async () => {
    await page.waitForTimeout(1000);
    await page.locator('#tablaLibros tr').first().waitFor({ state: 'visible', timeout: 10000 });

    await page.locator('#filterSelect').selectOption('titulo');
    await page.locator('#searchInput').fill('Cien años de soledad');
    await page.waitForTimeout(2000);

    const filaLibro = page.locator('#tablaLibros tr')
      .filter({ hasText: 'Cien años de soledad' });
    await expect(filaLibro).toBeVisible({ timeout: 8000 });

    const celdaAutor = filaLibro.locator('td').nth(3);
    const textoAutor = await celdaAutor.textContent();
    console.log(`   Autor en tabla: "${textoAutor}"`);
    expect(textoAutor?.trim()).toBe(nombreAutorNuevo);
  });

  await test.step('Modificar el nombre del autor', async () => {
    await page.locator('#searchInput').fill('');
    await page.waitForTimeout(500);

    // Abrir formulario de agregar para acceder a config de autores
    await page.locator('#btnAgregar').click();
    await page.waitForTimeout(2000);

    const iframeLibros = page.frameLocator('#modalIframe');
    await iframeLibros.locator('.form-section').waitFor({ state: 'visible', timeout: 10000 });

    await iframeLibros.locator('button.config-btn[title="Configurar autores principales"]').click();
    await page.waitForTimeout(2000);

    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');
    await iframeAutores.locator('.modal-container').waitFor({ state: 'visible', timeout: 8000 });

    // Scroll hasta el autor y clic en editar
    await scrollHastaAutor(nombreAutorNuevo);

    const btnEditar = iframeAutores.locator('#listaAutores .fila-item')
      .filter({ hasText: nombreAutorNuevo })
      .locator('.icon-btn:not(.delete)');
    await expect(btnEditar).toBeVisible({ timeout: 8000 });
    await btnEditar.click();
    await page.waitForTimeout(500);

    await expect(iframeAutores.locator('#nombreAutor')).toHaveValue(nombreAutorNuevo);

    // Modificar el nombre
    await iframeAutores.locator('#nombreAutor').fill(nombreAutorEditado);
    await iframeAutores.locator('#formAutor button[type="submit"]').click();
    await page.waitForTimeout(2000);

    // Verificar mensaje de actualización exitosa
    const mensaje = iframeAutores.locator('#mensajeExito');
    await expect(mensaje).toBeVisible({ timeout: 8000 });
    const textoMensaje = await mensaje.textContent();
    console.log(`   Mensaje: "${textoMensaje}"`);
  });

  await test.step('Consultar nuevamente el libro asociado', async () => {
    const iframeLibros  = page.frameLocator('#modalIframe');
    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');

    // Scroll y verificar nombre editado en lista de autores
    await scrollHastaAutor(nombreAutorEditado);
    const cantidad = await iframeAutores.locator('#listaAutores .fila-item')
      .filter({ hasText: nombreAutorEditado })
      .count();
    expect(cantidad).toBeGreaterThan(0);
    console.log(`   Nuevo nombre visible en lista: "${nombreAutorEditado}" ✓`);

    // Cerrar modales y limpiar iframe
    await cerrarModalAutoresYLibros();

    await page.waitForTimeout(1000);
    await page.locator('#filterSelect').selectOption('titulo');
    await page.locator('#searchInput').fill('Cien años de soledad');
    await page.waitForTimeout(2000);

    const filaLibro = page.locator('#tablaLibros tr')
      .filter({ hasText: 'Cien años de soledad' });
    await expect(filaLibro).toBeVisible({ timeout: 8000 });

    const celdaAutor = filaLibro.locator('td').nth(3);
    const textoAutor = await celdaAutor.textContent();
    console.log(`   Nuevo nombre del autor en el libro: "${textoAutor}"`);
    expect(textoAutor?.trim()).toBe(nombreAutorEditado);
  });

  await test.step('Intentar eliminar el autor vinculado', async () => {
    await page.locator('#searchInput').fill('');
    await page.waitForTimeout(500);

    await page.locator('#btnAgregar').click();
    await page.waitForTimeout(2000);

    const iframeLibros = page.frameLocator('#modalIframe');
    await iframeLibros.locator('.form-section').waitFor({ state: 'visible', timeout: 10000 });

    await iframeLibros.locator('button.config-btn[title="Configurar autores principales"]').click();
    await page.waitForTimeout(2000);

    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');
    await iframeAutores.locator('.modal-container').waitFor({ state: 'visible', timeout: 8000 });

    // Scroll hasta el autor y clic en eliminar
    await scrollHastaAutor(nombreAutorEditado);

    const btnEliminar = iframeAutores.locator('#listaAutores .fila-item')
      .filter({ hasText: nombreAutorEditado })
      .locator('.icon-btn.delete');
    await expect(btnEliminar).toBeVisible({ timeout: 8000 });

    // Aceptar el confirm nativo del navegador
    page.once('dialog', async dialog => {
      console.log(`   Confirm: "${dialog.message()}"`);
      await dialog.accept();
    });

    await btnEliminar.click();
    await page.waitForTimeout(2000);

    // Verificar mensaje de error — el sistema bloquea la eliminación
    const mensajeError = iframeAutores.locator('#mensajeExito');
    await expect(mensajeError).toBeVisible({ timeout: 8000 });
    const textoError = await mensajeError.textContent();
    console.log(`   Mensaje del sistema: "${textoError}"`);
    expect(textoError).toContain('no se puede eliminar');
  });

  await test.step('Verificar que el libro sigue asociado al autor', async () => {
    const iframeLibros  = page.frameLocator('#modalIframe');
    const iframeAutores = iframeLibros.frameLocator('#modal-autores iframe');

    // Verificar que el autor NO fue eliminado
    await scrollHastaAutor(nombreAutorEditado);
    const autorSigueExistiendo = await iframeAutores.locator('#listaAutores .fila-item')
      .filter({ hasText: nombreAutorEditado })
      .count();
    expect(autorSigueExistiendo).toBeGreaterThan(0);
    console.log(`   El autor sigue en la lista ✓`);

    // Cerrar modales y limpiar iframe
    await cerrarModalAutoresYLibros();

    await page.waitForTimeout(1000);
    await page.locator('#filterSelect').selectOption('titulo');
    await page.locator('#searchInput').fill('Cien años de soledad');
    await page.waitForTimeout(2000);

    const filaLibro = page.locator('#tablaLibros tr')
      .filter({ hasText: 'Cien años de soledad' });
    await expect(filaLibro).toBeVisible({ timeout: 8000 });

    const celdaAutor = filaLibro.locator('td').nth(3);
    const textoAutor = await celdaAutor.textContent();
    console.log(`   Relación libro-autor intacta: "${textoAutor}" ✓`);
    expect(textoAutor?.trim()).toBe(nombreAutorEditado);
  });

  await test.step('Cerrar sesión', async () => {
    await page.locator('#searchInput').fill('');
    await page.waitForTimeout(500);
    await page.locator('a[data-text="Cerrar Sesión"]').click();
    await page.waitForTimeout(2000);

    await page.waitForFunction(
      () => window.location.href.includes('/login/'),
      { timeout: 10000 }
    );
    console.log('   Sesión finalizada correctamente ✓');
  });

});