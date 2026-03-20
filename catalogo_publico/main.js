const contenedorLibros = document.getElementById('contenedor-libros');
const textoPaginacion = document.getElementById('textoPaginacion-container');
const slcCriterioBusqueda = document.getElementById('criterio-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

let skip = 0;
let paginaActual = 1;
let totalPaginas = 0;
let totalLibros = 0;
const limit = 5;

const actualizarTextoPaginacion = () => {
    textoPaginacion.innerHTML = `Página <span class="numero">${paginaActual}</span> de <span class="numero">${totalPaginas}</span>`;
}

inputBusqueda.addEventListener('input', () => {
    cargarLibros();
})

const actualizarLibros = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(resultado => {
        contenedorLibros.innerHTML = '';
        totalLibros = resultado.total;
        totalPaginas = Math.ceil(totalLibros / limit);
        actualizarTextoPaginacion();
        resultado.libros.forEach(libro => {
            let estado = (libro.Ejemplares_Disponibles > 1) ? 'Disponible' : 'Prestado';
            contenedorLibros.innerHTML += `
                <div class="libro" style="position: relative;">
                    ${libro.Id_libro === 'LIB0037' ? '<div class="libro-popular-indicador">Más popular</div>' : ''}
                    <img src="https://biblioteca.grupoctic.com/libros_img/${libro.Imagen}" class="libro-img">
                    <div class="libro-content">
                    <h3>${libro.Titulo}</h3>
                    <div class="autor">${libro.Nombre}</div>
                    <span class="estado ${estado.toLowerCase()}">${estado}</span>
                    <p>${libro.Sinopsis}</p>
                    <a href="libro-detalle.html?id=${libro.Id_libro}&estado=${estado}" class="btn">Ver más</a>
                    </div>
                </div>
            `;
        })
      })
      .catch(error => {
        console.error('Error al obtener el catálogo:', error);
      });
}

const cargarLibros = () => {
    const tipo = slcCriterioBusqueda.value;
    const busqueda = inputBusqueda.value.trim();
    let url = `https://backend-biblioteca-two.vercel.app/api/catalogo?limit=${limit}&skip=${skip}`;

    if(busqueda && tipo) {
        url = `https://backend-biblioteca-two.vercel.app/api/catalogo/buscar?q=${busqueda}&tipo=${tipo}&limit=${limit}&skip=${skip}`;
    }

    actualizarLibros(url);
}


btnAnterior.addEventListener('click', () => {
    if(skip > 0) {
        skip -= limit;
        paginaActual--;
        cargarLibros();
    }
});

btnSiguiente.addEventListener('click', () => {
    if(skip < totalLibros - limit) {
        skip += limit;
        paginaActual++;
        cargarLibros();
    }
});

/*
    BUSQUEDA POR VOZ
*/

const TOKEN_IA = 'UJK4FAQ4M4CI6BNKRRYDMRYXCLFLD5FY';
const micButton = document.getElementById('btnMic');
const searchInput = document.getElementById('input-busqueda');

//Verificar si el navegador soporta reconocimiento de voz
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  micButton.style.display = 'none';
  console.log('Tu navegador no soporta reconocimiento de voz');
}

// Configurar el reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Configuración simple
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Variable para saber si está escuchando
let estaEscuchando = false;

//Función para enviar texto a Wit.ai
const analizarConWitAI = async (texto) => {
  try {
    console.log('Analizando con Wit.ai:', texto);
    searchInput.value = texto;

    const respuesta = await fetch(`https://api.wit.ai/message?v=20240306&q=${encodeURIComponent(texto)}`, {
      headers: { 'Authorization': `Bearer ${TOKEN_IA}` }
    });

    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();
    console.log('Respuesta de Wit.ai:', datos);
    
    // PROCESAR LAS ENTIDADES
    const entities = datos.entities;
    let mensaje, genero, titulo, autor, anio;
    mensaje = genero = titulo = autor = anio = '';
    
    // Verificar género
    if (entities['genero_libro:genero_libro']) {
      genero = entities['genero_libro:genero_libro'][0].value;
      mensaje += `Género: ${genero}. `;
    }
    
    // Verificar título
    if (entities['titulo_libro:titulo_libro']) {
      titulo = entities['titulo_libro:titulo_libro'][0].value;
      mensaje += `Título: ${titulo}. `;
    }
    
    // Verificar autor
    if (entities['autor_libro:autor_libro']) {
      autor = entities['autor_libro:autor_libro'][0].value;
      mensaje += `Autor: ${autor}. `;
    }

    // Verificar año de edición
    if (entities['anio_libro:anio_libro']) {
      anio = entities['anio_libro:anio_libro'][0].value;
      mensaje += `Año de edición: ${anio}. `;
    }

    let url = 'https://backend-biblioteca-two.vercel.app/api/catalogo/ia?';

    if (genero) url += `genero=${encodeURIComponent(genero)}&`;
    if (autor) url += `autor=${encodeURIComponent(autor)}&`;
    if (titulo) url += `titulo=${encodeURIComponent(titulo)}&`;
    if (anio) url += `anio=${encodeURIComponent(anio)}&`;
    if (limit) url += `limit=${limit}&`;
    if (skip) url += `skip=${skip}`;

    console.log('URL para búsqueda IA:', url);

    actualizarLibros(url);

    // Mostrar resultado
    if (mensaje) {
      alert(mensaje);
    } else {
      alert(texto);
    }
    
    // Aquí puedes llamar a tu función de búsqueda
  } catch (error) {
    console.error('Error:', error);
    alert(texto);
    searchInput.value = texto;
  }
};

//Evento cuando se reconoce voz
recognition.onresult = function(event) {
  const textoDicho = event.results[0][0].transcript;
  console.log('Texto reconocido:', textoDicho);

  searchInput.value = textoDicho;
  
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  analizarConWitAI(textoDicho);
};

//Evento cuando termina de escuchar
recognition.onend = function() {
  console.log('Dejó de escuchar');
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
};

//Evento si hay error
recognition.onerror = function(event) {
  console.error('Error de voz:', event.error);
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  if (event.error === 'not-allowed') {
    alert('Por favor, permite el acceso al micrófono para usar búsqueda por voz');
  }
};

//Función para empezar a escuchar
function empezarAEscuchar() {
  if (estaEscuchando) {
    recognition.stop(); // Dejar de escuchar
    return;
  }
  
  try {
    recognition.start();
    micButton.classList.add('escuchando');
    estaEscuchando = true;
    console.log('Escuchando... di algo');
  } catch (error) {
    console.error('Error al iniciar:', error);
  }
}

micButton.addEventListener('click', empezarAEscuchar);

cargarLibros();