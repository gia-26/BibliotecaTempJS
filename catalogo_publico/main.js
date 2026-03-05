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

cargarLibros();