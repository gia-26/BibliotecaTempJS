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

async function obtenerDatoCurioso(anio) {
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/es/onthisday/events/01/01`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.events && data.events.length > 0) {

      // Recupera los índices ya usados para este libro
      const keyUsados = `usados_${idLibro}`;
      let usados = JSON.parse(sessionStorage.getItem(keyUsados) || '[]');

      // Filtra los que no se han mostrado
      const disponibles = data.events
        .map((e, i) => i)
        .filter(i => !usados.includes(i));

      // Si ya se usaron todos, reinicia
      if (disponibles.length === 0) {
        usados = [];
        sessionStorage.setItem(keyUsados, JSON.stringify(usados));
        disponibles.push(...data.events.map((e, i) => i));
      }

      // Toma uno aleatorio de los disponibles
      const indice = disponibles[Math.floor(Math.random() * disponibles.length)];

      // Guarda ese índice como usado
      usados.push(indice);
      sessionStorage.setItem(keyUsados, JSON.stringify(usados));

      return `En ${anio}: ${data.events[indice].text}`;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener dato curioso:', error);
    return null;
  }
}

fetch(`https://backend-biblioteca-two.vercel.app/api/libros/${idLibro}`)
  .then(response => response.json())
  .then(libro => {
    console.log('Detalles del libro:', libro);

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

            <div id="dato-curioso-container">
              <div class="dato-curioso">
                <h2><i class="fas fa-lightbulb"></i> Dato curioso del año ${libro[0].Anio}</h2>
                <p><i class="fas fa-spinner fa-spin"></i> Cargando dato curioso...</p>
              </div>
            </div>

            <div class="acciones">
            <a href="./index.html" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Volver al Catálogo
            </a>
            </div>  
        </div>
    `;

    //AQUÍ se llama la función y actualiza el contenedor
    obtenerDatoCurioso(libro[0].Anio).then(datoCurioso => {
      const contenedor = document.getElementById('dato-curioso-container');
      if (contenedor) {
        contenedor.innerHTML = datoCurioso ? `
          <div class="dato-curioso">
            <h2><i class="fas fa-lightbulb"></i> Dato curioso del año ${libro[0].Anio}</h2>
            <p>${datoCurioso}</p>
          </div>
        ` : '';
      }
    });

  })
  .catch(error => {
    console.error('Error al obtener los detalles del libro:', error);
  });