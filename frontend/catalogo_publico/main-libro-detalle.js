const params = new URLSearchParams(window.location.search);
const idLibro = params.get('id');
const estadoLibro = params.get('estado');
const libroDetalleDiv = document.getElementById('libro-detalle');

const libroPopular = `
    <div style="margin-top: 1.5rem; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
            <i class="fas fa-mobile-alt" style="color: #4a69bd; font-size: 1.2rem;"></i>
            <span style="font-weight: 600; color: var(--texto-marron);">Escanea para Realidad Aumentada</span>
        </div>
        <div style="padding: 10px; background: white; border-radius: 10px; display: inline-block;">
            <img src="https://biblioteca.grupoctic.com/libros_img/qrHarryPotter.jpg" 
                alt="QR para AR" 
                style="width: 150px; height: 150px; border-radius: 5px;">
        </div>
        <p style="font-size: 0.85rem; color: var(--texto-marron); opacity: 0.7; margin-top: 0.5rem;">
            Usa la cámara de tu dispositivo móvil
        </p>
    </div>
`;

fetch(`http://localhost:3000/api/libros/${idLibro}`)
  .then(response => response.json())
  .then(libro => {
    console.log('Detalles del libro:', libro);
    libroDetalleDiv.innerHTML = '';
    libroDetalleDiv.innerHTML = `
        <div class="libro-portada">
            <img src="https://biblioteca.grupoctic.com/libros_img/${libro[0].Imagen}" alt="${libro[0].Titulo}" id="libro-imagen">
            <div class="estado-badge ${estadoLibro.toLowerCase()}" id="estado-libro">${estadoLibro}</div>
            ${(idLibro === 'LIB0037') ? libroPopular : ''}
        </div>

        <div class="libro-info">
            <h1 id="libro-titulo">${libro[0].Titulo}</h1>
            <div class="autor" id="libro-autor">${libro[0].Autor}</div>

            <div class="libro-meta">
            <div class="meta-item">
                <h3>Género</h3>
                <p id="libro-genero">${libro[0].Genero}</p>
            </div>
            <div class="meta-item">
                <h3>ISBN</h3>
                <p id="libro-isbn">${libro[0].ISBN}</p>
            </div>
            <div class="meta-item">
                <h3>Editorial</h3>
                <p id="libro-editorial">${libro[0].Editorial}</p>
            </div>
            <div class="meta-item">
                <h3>Año de publicación</h3>
                <p id="libro-anio">${libro[0].Anio}</p>
            </div>
            </div>

            <div class="sinopsis">
            <h2>Sinopsis</h2>
            <p id="libro-sinopsis">${libro[0].Sinopsis}</p>
            </div>

            <div class="acciones">
            <a href="./index.html" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Volver al Catálogo
            </a>
            </div>  
        </div>
    `;
  })
  .catch(error => {
    console.error('Error al obtener los detalles del libro:', error);
  });
