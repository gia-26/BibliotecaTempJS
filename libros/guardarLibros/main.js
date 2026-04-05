const inpTitulo = document.getElementById('inpTitulo');
const inpISBN = document.getElementById('inpISBN');
const inpEdicion = document.getElementById('inpEdicion');
const slcAnioEdicion = document.getElementById('slcAnioEdicion');
const slcAreaConocimiento = document.getElementById('slcAreaConocimiento');
const slcGeneroPrincipal = document.getElementById('slcGeneroPrincipal');
const slcSubgeneros = document.getElementById('selectSubgeneros');
const divSubgenerosContainer = document.getElementById('subgenerosContainer');
const slcAutorPrincipal = document.getElementById('slcAutorPrincipal');
const slcCoautores = document.getElementById('selectCoautores');
const divCoautoresContainer = document.getElementById('coautoresContainer');
const slcEditoriales = document.getElementById('slcEditoriales');
const slcEditorialesSecundarias = document.getElementById('selectEditoriales');
const divEditorialesContainer = document.getElementById('editorialesContainer');
const txtaSinopsis = document.getElementById('txtaSinopsis');
const inpNoEjemplares = document.getElementById('inpNoEjemplares');
const inpImagen = document.getElementById('inpImagen');
const btnGuardar = document.getElementById('btnGuardar');
const btnSubgeneros = document.getElementById('btnSubGeneros');
const btnCoautores = document.getElementById('btnCoautores');
const btnEditorialesSecundarias = document.getElementById('btnEditorialesSecundarias');
const loader = document.getElementById('loader-container');
const sectionTitle = document.getElementById('title');
const URL_BASE = 'https://backend-biblioteca-two.vercel.app/';
const CLOUD_NAME = "dpxukm9oe";
const PRESET = "biblioteca";

let urlImagenAnterior = null;
let ejemplaresAnteriores = 0;

const params = new URLSearchParams(window.location.search);
const idLibro = params.get('id');

let subgeneros = new Set();
let coautores = new Set();
let editorialesSecundarias = new Set();

btnGuardar.addEventListener('click', () => {
    if (idLibro) {
        actualizarLibro();
    }
    else {
        guaradarLibro();
    }
});

const guaradarLibro = async () => {
    const imagen = inpImagen.files[0];
    if (!validarDatos()) return;

    // Validar imagen
    if (imagen) {
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024;
        
        if (!tiposPermitidos.includes(imagen.type)) {
        mostrarAlerta({
          titulo: "Error",
          texto: "Formato de imagen no válido. Solo se permiten: JPG, JPEG, PNG",
          tipo: "error"
        });
        inpImagen.focus();
        return false;
        }
        
        if (imagen.size > maxSize) {
        mostrarAlerta({
          titulo: "Error",
          texto: "La imagen no puede exceder los 2MB",
          tipo: "error"
        });
        inpImagen.focus();
        return false;
        }
    }
    else {
        mostrarAlerta({
          titulo: "Error",
          texto: "La imagen es obligatoria",
          tipo: "error"
        });
        inpImagen.focus();
        return false;
    }

    loader.style.display = 'flex';
    const titulo = inpTitulo.value.trim();
    const isbn = inpISBN.value.trim();
    const edicion = inpEdicion.value.trim();
    const anioEdicion = slcAnioEdicion.value;
    const areaConocimiento = slcAreaConocimiento.value;
    const generoPrincipal = slcGeneroPrincipal.value;
    const autorPrincipal = slcAutorPrincipal.value;
    const editorialPrincipal = slcEditoriales.value;
    const sinopsis = txtaSinopsis.value.trim();
    const noEjemplares = inpNoEjemplares.value;
    const urlImagen = await subirimg(); // Subir imagen y obtener URL

    if (!urlImagen) {
        mostrarAlerta({
          titulo: "Error",
          texto: "No se pudo subir la imagen. El libro no se guardará.",
          tipo: "error"
        });
        loader.style.display = 'none';
        return;
    }

    const libro = {
        titulo,
        isbn,
        edicion,
        anioEdicion,
        areaConocimiento,
        generoPrincipal,
        subgeneros: Array.from(subgeneros) || [],
        autorPrincipal,
        coautores: Array.from(coautores) || [],
        editorialPrincipal,
        editorialesSecundarias: Array.from(editorialesSecundarias) || [],
        sinopsis,
        noEjemplares,
        urlImagen
    };

    fetch(URL_BASE + 'api/libros/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarAlerta({
                titulo: "Éxito",
                texto: data.message,
                tipo: "success"
            });
            limpiarFormulario();
            loader.style.display = 'none';
        }
        else {
            mostrarAlerta({
                titulo: "Error",
                texto: 'Error al guardar el libro: ' + data.error,
                tipo: "error"
            });
            loader.style.display = 'none';
        }
    })
    .catch(error => {
        console.error("Error al guardar el libro:", error);
        mostrarAlerta({
            titulo: "Error",
            texto: "Ha ocurrido un error al guardar el libro. Por favor, inténtalo de nuevo.",
            tipo: "error"
        });
        loader.style.display = 'none';
    });
}

const validarDatos = () => {
  // Obtener valores
  const titulo = inpTitulo.value.trim();
  const isbn = inpISBN.value.trim();
  const edicion = inpEdicion.value.trim();
  const anioEdicion = slcAnioEdicion.value;
  const areaConocimiento = slcAreaConocimiento.value;
  const generoPrincipal = slcGeneroPrincipal.value;
  const autorPrincipal = slcAutorPrincipal.value;
  const editorialPrincipal = slcEditoriales.value;
  const sinopsis = txtaSinopsis.value.trim();
  const noEjemplares = inpNoEjemplares.value;
  
  // Validar título
  if (titulo === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "El título es obligatorio",
      tipo: "error"
    });
    inpTitulo.focus();
    return false;
  }
  if (titulo.length < 5) {
    mostrarAlerta({
      titulo: "Error",
      texto: "El título debe tener al menos 5 caracteres",
      tipo: "error"
    });
    inpTitulo.focus();
    return false;
  }
  if (titulo.length > 100) {
    mostrarAlerta({
      titulo: "Error",
      texto: "El título no puede tener más de 100 caracteres",
      tipo: "error"
    });
    inpTitulo.focus();
    return false;
  }
  
  // Validar ISBN
  if (isbn === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "El ISBN es obligatorio",
      tipo: "error"
    });
    inpISBN.focus();
    return false;
  }
  
  // Validar edición
  if (edicion === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "La edición es obligatoria",
      tipo: "error"
    });
    inpEdicion.focus();
    return false;
  }
  
  // Validar año de edición
  if (anioEdicion === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Debe seleccionar un año de edición",
      tipo: "error"
    });
    slcAnioEdicion.focus();
    return false;
  }
  
  // Validar área de conocimiento
  if (areaConocimiento === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Debe seleccionar un área de conocimiento",
      tipo: "error"
    });
    slcAreaConocimiento.focus();
    return false;
  }
  
  // Validar género principal
  if (generoPrincipal === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Debe seleccionar un género principal",
      tipo: "error"
    });
    slcGeneroPrincipal.focus();
    return false;
  }
  
  // Validar autor principal
  if (autorPrincipal === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Debe seleccionar un autor principal",
      tipo: "error"
    });
    slcAutorPrincipal.focus();
    return false;
  }
  
  // Validar editorial principal
  if (editorialPrincipal === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Debe seleccionar una editorial principal",
      tipo: "error"
    });
    slcEditoriales.focus();
    return false;
  }
  
  // Validar sinopsis
  if (sinopsis === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "La sinopsis es obligatoria",
      tipo: "error"
    });
    txtaSinopsis.focus();
    return false;
  }
  if (sinopsis.length < 10) {
    mostrarAlerta({
      titulo: "Error",
      texto: "La sinopsis debe tener al menos 10 caracteres",
      tipo: "error"
    });
    txtaSinopsis.focus();
    return false;
  }
  if (sinopsis.length > 2000) {
    mostrarAlerta({
      titulo: "Error",
      texto: "La sinopsis no puede tener más de 2000 caracteres",
      tipo: "error"
    });
    txtaSinopsis.focus();
    return false;
  }
  
  // Validar número de ejemplares
  if (noEjemplares === '') {
    mostrarAlerta({
      titulo: "Error",
      texto: "El número de ejemplares es obligatorio",
      tipo: "error"
    });
    inpNoEjemplares.focus();
    return false;
  }
  const numEjemplares = parseInt(noEjemplares);
  if (numEjemplares < 1 || numEjemplares > 100) {
    mostrarAlerta({
      titulo: "Error",
      texto: "El número de ejemplares debe estar entre 1 y 100",
      tipo: "error"
    });
    inpNoEjemplares.focus();
    return false;
  }
  
  // Si todas las validaciones pasan
  return true;
}

function recuperarGeneros() {
    fetch(URL_BASE + 'api/generos')
     .then(response => response.json())
     .then(generos => {
        slcGeneroPrincipal.innerHTML = '';
        slcSubgeneros.innerHTML = '';
        generos.forEach(genero => {
            slcGeneroPrincipal.innerHTML += `<option value="${genero.Id_genero}">${genero.Nombre}</option>`;
            slcSubgeneros.innerHTML += `<option value="${genero.Id_genero}">${genero.Nombre}</option>`;
        });
     })
     .catch(error => {
         console.error('Error al recuperar los géneros:', error);
     })
}

function recuperarAniosEdicion() {
    fetch(URL_BASE + 'api/anios')
     .then(response => response.json())
     .then(anios => {
        slcAnioEdicion.innerHTML = '';
        anios.forEach(anio => {
            slcAnioEdicion.innerHTML += `<option value="${anio.Id_anio_edicion}">${anio.Anio_edicion}</option>`;
        });
     })
     .catch(error => {
         console.error('Error al recuperar los años de edición:', error);
     })
}

function recuperarAreasConocimiento() {
    fetch(URL_BASE + 'api/areas')
     .then(response => response.json())
     .then(areas => {
        slcAreaConocimiento.innerHTML = '';
        areas.forEach(area => {
            slcAreaConocimiento.innerHTML += `<option value="${area.Id_area_conocimiento}">${area.Area_conocimiento}</option>`;
        });
     })
     .catch(error => {
         console.error('Error al recuperar las áreas de conocimiento:', error);
     })
}

function recuperarAutores() {
    fetch(URL_BASE + 'api/autores')
     .then(response => response.json())
     .then(autores => {
        slcAutorPrincipal.innerHTML = '';
        slcCoautores.innerHTML = '';
        autores.forEach(autor => {
            slcAutorPrincipal.innerHTML += `<option value="${autor.Id_autor}">${autor.Nombre}</option>`;
            slcCoautores.innerHTML += `<option value="${autor.Id_autor}">${autor.Nombre}</option>`;
        });
     })
     .catch(error => {
         console.error('Error al recuperar los autores:', error);
     })
}

function recuperarEditoriales() {
    fetch(URL_BASE + 'api/editoriales')
     .then(response => response.json())
     .then(editoriales => {
        slcEditoriales.innerHTML = '';
        slcEditorialesSecundarias.innerHTML = '';
        editoriales.forEach(editorial => {
            slcEditoriales.innerHTML += `<option value="${editorial.Id_editorial}">${editorial.Nombre}</option>`;
            slcEditorialesSecundarias.innerHTML += `<option value="${editorial.Id_editorial}">${editorial.Nombre}</option>`;
        });
     })
     .catch(error => {
         console.error('Error al recuperar las editoriales:', error);
     })
}

btnSubgeneros.addEventListener('click', () => {
    const id = slcSubgeneros.value;
    const genero = slcSubgeneros.options[slcSubgeneros.selectedIndex].text;

    // Verificar si el género ya fue agregado
    if (document.querySelector(`.tag[data-id="${id}"]`)) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Este subgénero ya ha sido agregado.",
            tipo: "error"
        });
        return;
    }

    if (!id) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Por favor, selecciona un subgénero.",
            tipo: "error"
        });
        return;
    }
    if (subgeneros.size < 1)  divSubgenerosContainer.innerHTML = '';

    divSubgenerosContainer.innerHTML += `
        <div class='tag' data-id='${id}'>
            ${genero}
            <button type='button' class='tag-remove' onclick="remover(this, 'subgeneros')">×</button>
        </div>
    `;

    subgeneros.add(id);
});

btnCoautores.addEventListener('click', () => {
    const id = slcCoautores.value;
    const autor = slcCoautores.options[slcCoautores.selectedIndex].text;

    // Verificar si el autor ya fue agregado
    if (document.querySelector(`.tag[data-id="${id}"]`)) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Este coautor ya ha sido agregado.",
            tipo: "error"
        });
        return;
    }

    if (!id) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Por favor, selecciona un coautor.",
            tipo: "error"
        });
        return;
    }
    if (coautores.size < 1)  divCoautoresContainer.innerHTML = '';

    divCoautoresContainer.innerHTML += `
        <div class='tag' data-id='${id}'>
            ${autor}
            <button type='button' class='tag-remove' onclick="remover(this, 'coautores')">×</button>
        </div>
    `;

    coautores.add(id);
});

btnEditorialesSecundarias.addEventListener('click', () => {
    const id = slcEditorialesSecundarias.value;
    const editorial = slcEditorialesSecundarias.options[slcEditorialesSecundarias.selectedIndex].text;

    // Verificar si la editorial ya fue agregada
    if (document.querySelector(`.tag[data-id="${id}"]`)) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Esta editorial secundaria ya ha sido agregada.",
            tipo: "error"
        });
        return;
    }
    if (!id) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Por favor, selecciona una editorial secundaria.",
            tipo: "error"
        });
        return;
    }
    if (editorialesSecundarias.size < 1)  divEditorialesContainer.innerHTML = '';

    divEditorialesContainer.innerHTML += `
        <div class='tag' data-id='${id}'>
            ${editorial}
            <button type='button' class='tag-remove' onclick="remover(this, 'editoriales')">×</button>
        </div>
    `;

    editorialesSecundarias.add(id);
});

const remover = (btn, tipo) => {
    const tag = btn.parentElement;
    tag.remove();
    
    //Conseguir el id
    const id = tag.getAttribute('data-id');

    switch(tipo) {
        case 'subgeneros':
            subgeneros.delete(id);
            if (subgeneros.size < 1)  divSubgenerosContainer.innerHTML = '<div class="empty-state">No hay subgéneros agregados.</div>';
            break;
        case 'coautores':
            coautores.delete(id);
            if (coautores.size < 1)  divCoautoresContainer.innerHTML = '<div class="empty-state">No hay coautores agregados.</div>';
            break;
        case 'editoriales':
            editorialesSecundarias.delete(id);
            if (editorialesSecundarias.size < 1)  divEditorialesContainer.innerHTML = '<div class="empty-state">No hay editoriales secundarias agregadas.</div>';
            break;
    }
}

inpImagen.addEventListener('change', () => {
    const file = inpImagen.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgPreview = document.getElementById('imagePreview');
            const texto = imgPreview.querySelector('.no-image');

            imgPreview.style.backgroundImage = `url(${e.target.result})`;

            if (texto) texto.style.display = 'none';
        }

        reader.readAsDataURL(file);
    }
});

const subirimg = async () => {
    const foto = inpImagen.files[0];
    let urlOptimizada = '';

    loader.style.display = 'flex';
    
    const formData = new FormData();
    formData.append('file', foto);
    formData.append('upload_preset', PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Fallo al subir la imagen",
            tipo: "error"
        });
        return null;
    }

    const data = await response.json();
    loader.style.display = 'none';
    urlOptimizada = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${data.public_id}`;

    return urlOptimizada || null;
}

const limpiarFormulario = () => {
    inpTitulo.value = '';
    inpISBN.value = '';
    inpEdicion.value = '';
    txtaSinopsis.value = '';
    inpNoEjemplares.value = '1';
    inpImagen.value = '';
    document.getElementById('imagePreview').style.backgroundImage = 'none';
    divSubgenerosContainer.innerHTML = '<div class="empty-state">No hay subgéneros agregados.</div>';
    divCoautoresContainer.innerHTML = '<div class="empty-state">No hay coautores agregados.</div>';
    divEditorialesContainer.innerHTML = '<div class="empty-state">No hay editoriales secundarias agregadas.</div>';
}

const cargarDatosLibro = (id) => {
    loader.style.display = 'flex';
    fetch(URL_BASE + `api/libros/${id}`)
     .then(response => response.json())
     .then(libro => {
        if (!libro.success) {
            mostrarAlerta({
                titulo: "Error",
                texto: "Error al recuperar los datos del libro: " + libro.message,
                tipo: "error"
            });
            loader.style.display = 'none';
            return;
        }

        inpTitulo.value = libro.data.Titulo;
        inpISBN.value = libro.data.ISBN;
        inpEdicion.value = libro.data.Edicion;
        slcAnioEdicion.value = libro.data.Id_anio_edicion;
        slcAreaConocimiento.value = libro.data.Id_area_conocimiento;
        slcGeneroPrincipal.value = libro.data.Id_genero;
        slcAutorPrincipal.value = libro.data.Id_autor;
        slcEditoriales.value = libro.data.Id_editorial;
        txtaSinopsis.value = libro.data.Sinopsis;
        inpNoEjemplares.value = libro.data.ejemplares.length;
        ejemplaresAnteriores = libro.data.ejemplares.length;

        //Cargar imagen
        const imgPreview = document.getElementById('imagePreview');
        const texto = imgPreview.querySelector('.no-image');
        urlImagenAnterior = libro.data.Imagen;
        imgPreview.style.backgroundImage = `url(${urlImagenAnterior})`;
        if (texto) texto.style.display = 'none';

        divSubgenerosContainer.innerHTML = '';
        divCoautoresContainer.innerHTML = '';
        divEditorialesContainer.innerHTML = '';

        // Cargar subgéneros
        libro.data.subgeneros.forEach(sub => {
            divSubgenerosContainer.innerHTML += `
                <div class='tag' data-id='${sub.Id_genero}'>
                    ${sub.Nombre}
                    <button type='button' class='tag-remove' onclick="remover(this, 'subgeneros')">×</button>
                </div>
            `;
            subgeneros.add(sub.Id_genero);
        });

        //Cargar coautores
        libro.data.coautores.forEach(coautor => {
            divCoautoresContainer.innerHTML += `
                <div class='tag' data-id='${coautor.Id_autor}'>
                    ${coautor.Nombre}
                    <button type='button' class='tag-remove' onclick="remover(this, 'coautores')">×</button>
                </div>
            `;
            coautores.add(coautor.Id_autor);
        });

        //Cargar editoriales secundarias
        libro.data.editorialesSecundarias.forEach(editorial => {
            divEditorialesContainer.innerHTML += `
                <div class='tag' data-id='${editorial.Id_editorial}'>
                    ${editorial.Nombre}
                    <button type='button' class='tag-remove' onclick="remover(this, 'editoriales')">×</button>
                </div>
            `;
            editorialesSecundarias.add(editorial.Id_editorial);
        });

        loader.style.display = 'none';
    })
    .catch(error => {
        console.error('Error al recuperar los datos del libro:', error);
        loader.style.display = 'none';
        mostrarAlerta({
            titulo: "Error",
            texto: "Ha ocurrido un error al cargar los datos del libro. Por favor, inténtalo de nuevo.",
            tipo: "error"
        });
    });
}

const actualizarLibro = async () => {
    const titulo = inpTitulo.value.trim();
    const isbn = inpISBN.value.trim();
    const edicion = inpEdicion.value.trim();
    const anioEdicion = slcAnioEdicion.value;
    const areaConocimiento = slcAreaConocimiento.value;
    const generoPrincipal = slcGeneroPrincipal.value;
    const autorPrincipal = slcAutorPrincipal.value;
    const editorialPrincipal = slcEditoriales.value;
    const sinopsis = txtaSinopsis.value.trim();
    let noEjemplares = (inpNoEjemplares.value - ejemplaresAnteriores);
    const file = inpImagen.files[0];
    let url = urlImagenAnterior; // Por defecto, mantenemos la URL anterior
    if (!validarDatos()) return;
    
    noEjemplares = (noEjemplares > 0) ? noEjemplares : 0;
    
    loader.style.display = 'flex';

    if (file) {
        url = await subirimg(); // Subir nueva imagen y obtener URL
        if (!url) {
            mostrarAlerta({
                titulo: "Error",
                texto: "No se pudo subir la imagen. El libro no se actualizará.",
                tipo: "error"
            });
            loader.style.display = 'none';
            return;
        }
        else {
            const regex = /\/upload\/.*?\/(.*?)$/;
            const match = urlImagenAnterior.match(regex);
            if (match && match[1]) {
                const publicIdAnterior = match[1];
                fetch(URL_BASE + 'api/libros/eliminar/imagen', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ public_id: publicIdAnterior })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        mostrarAlerta({
                            titulo: "Éxito",
                            texto: "Imagen anterior eliminada exitosamente",
                            tipo: "success"
                        });
                    }
                    else {
                        mostrarAlerta({
                            titulo: "Error",
                            texto: "Error al eliminar la imagen anterior: " + data.error,
                            tipo: "error"
                        });
                        return;
                    }
                })
            }
        }
    }

    const libro = {
        idLibro,
        titulo,
        isbn,
        edicion,
        anioEdicion,
        areaConocimiento,
        generoPrincipal,
        subgeneros: Array.from(subgeneros) || [],
        autorPrincipal,
        coautores: Array.from(coautores) || [],
        editorialPrincipal,
        editorialesSecundarias: Array.from(editorialesSecundarias) || [],
        sinopsis,
        noEjemplares,
        url
    };

    fetch(URL_BASE + 'api/libros/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libro)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarAlerta({
                titulo: "Éxito",
                texto: data.message,
                tipo: "success"
            });
            limpiarFormulario();
            loader.style.display = 'none';
        }
        else {
            mostrarAlerta({
                titulo: "Error",
                texto: 'Error al editar el libro: ' + data.error,
                tipo: "error"
            });
            loader.style.display = 'none';
        }
    })
    .catch(error => {
        console.error("Error al editar el libro:", error);
        mostrarAlerta({
            titulo: "Error",
            texto: "Ha ocurrido un error al editar el libro. Por favor, inténtalo de nuevo.",
            tipo: "error"
        });
        loader.style.display = 'none';
    });
}

// Al cargar la página, recuperamos los datos para los select
if (idLibro) {
    sectionTitle.innerText  = "Editar Libro";
    cargarDatosLibro(idLibro);
}

loader.style.display = 'flex';
recuperarAniosEdicion();
recuperarAreasConocimiento();
recuperarGeneros();
recuperarAutores();
recuperarEditoriales();
divSubgenerosContainer.innerHTML = '<div class="empty-state">No hay subgéneros agregados.</div>';
divCoautoresContainer.innerHTML = '<div class="empty-state">No hay coautores agregados.</div>';
divEditorialesContainer.innerHTML = '<div class="empty-state">No hay editoriales secundarias agregadas.</div>';
loader.style.display = 'none';