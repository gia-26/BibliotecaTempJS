const tablaLibros = document.getElementById("tablaLibros");
const btnBuscar = document.getElementById("btnBuscar");
const btnLimpiar = document.getElementById("btnLimpiar");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

// CARGAR LIBROS
function cargarLibros(filtro = "titulo", termino = "") {

  fetch(`https://backend-biblioteca-two.vercel.app/api/libros?filtro=${filtro}&termino=${termino}`)
    .then(res => res.json())
    .then(data => {

      tablaLibros.innerHTML = "";

      if (data.length === 0) {
        tablaLibros.innerHTML =
          `<tr><td colspan="6">No se encontraron libros.</td></tr>`;
        return;
      }

      data.forEach(libro => {

        tablaLibros.innerHTML += `
          <tr>
            <td>
              <img src="https://biblioteca.grupoctic.com/libros_img/${libro.Imagen}"
                   class="book-image">
            </td>
            <td>${libro.Id_libro}</td>
            <td>${libro.Titulo}</td>
            <td>${libro.Autor}</td>
            <td>${libro.Genero}</td>
            <td class="actions">
              <button class="action-link action-edit"
                onclick="openModal('modalLibros', '${libro.Id_libro}', true)">
                <i class="fas fa-edit"></i> Editar
              </button>

              <button class="action-link action-delete"
                onclick="eliminarLibro('${libro.Id_libro}')">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        `;
      });

    });
}

// BUSCAR
btnBuscar.addEventListener("click", () => {
  cargarLibros(filterSelect.value, searchInput.value);
});

// LIMPIAR
btnLimpiar.addEventListener("click", () => {
  searchInput.value = "";
  cargarLibros();
});

// ELIMINAR
function eliminarLibro(id) {

  if (!confirm("¿Estás seguro de que deseas eliminar este libro?"))
    return;

  fetch(`https://backend-biblioteca-two.vercel.app/api/libros/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(() => cargarLibros());
}

// MODAL
function openModal(modalId, idLibro, editar) {
  document.getElementById(modalId).style.display = "flex";

  if (editar)
    document.getElementById("modalIframe").src =
      `gestionLibros.html?id=${idLibro}`;
  else
    document.getElementById("modalIframe").src =
      `gestionLibros.html`;
}

window.onclick = function(event) {
  const modal = document.getElementById("modalLibros");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ZOOM
let currentZoom = 100;
const minZoom = 50;
const maxZoom = 200;
const zoomStep = 10;

function updateZoom() {
  document.body.style.zoom = `${currentZoom}%`;
  document.getElementById("zoomLevel").textContent = `${currentZoom}%`;
  localStorage.setItem("pageZoom", currentZoom);
}

document.getElementById("zoomIn").addEventListener("click", () => {
  if (currentZoom < maxZoom) {
    currentZoom += zoomStep;
    updateZoom();
  }
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (currentZoom > minZoom) {
    currentZoom -= zoomStep;
    updateZoom();
  }
});

document.getElementById("zoomReset").addEventListener("click", () => {
  currentZoom = 100;
  updateZoom();
});

document.addEventListener("DOMContentLoaded", () => {
  const savedZoom = localStorage.getItem("pageZoom");
  if (savedZoom) {
    currentZoom = parseInt(savedZoom);
    updateZoom();
  }
  cargarLibros();
});