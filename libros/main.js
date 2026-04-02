const tablaLibros = document.getElementById("tablaLibros");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const URL_BASE = "https://backend-biblioteca-two.vercel.app/";

const cargarLibros = () => {
  fetch(`${URL_BASE}api/libros`)
    .then(res => res.json())
    .then(datos => {
      const libros = datos.data || [];
      tablaLibros.innerHTML = "";

      if (libros.length === 0) {
        tablaLibros.innerHTML =
          `<tr><td colspan="6">No se encontraron libros.</td></tr>`;
        return;
      }

      libros.forEach(libro => {
        tablaLibros.innerHTML += `
          <tr>
            <td>
              <img src="${libro.Imagen}" class="book-image" alt="Imagen del libro ${libro.Titulo}">
            </td>
            <td>${libro.Id_libro}</td>
            <td>${libro.Titulo}</td>
            <td>${libro.Autor}</td>
            <td>${libro.Genero}</td>
            <td class="actions">
              <button class="action-link action-edit"
                onclick="abrirModal('./guardarLibros/index.html?id=${libro.Id_libro}')">
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

searchInput.addEventListener('input', () => {
  buscarLibros();
});

const buscarLibros = () => {
  const valor = searchInput.value.toLowerCase();
  const tipo = filterSelect.value;

  if (!valor) {
    cargarLibros();
    return;
  }

  fetch(`${URL_BASE}api/libros/buscar?tipo=${tipo}&valor=${encodeURIComponent(valor)}`)
    .then(res => res.json())
    .then(datos => {
      const libros = datos.data || [];
      tablaLibros.innerHTML = "";
      console.log("Libros encontrados:", libros);
      if (libros.length === 0) {
        tablaLibros.innerHTML =
          `<tr><td colspan="6">No se encontraron libros para "${valor}".</td></tr>`;
        return;
      }
      libros.forEach(libro => {
        tablaLibros.innerHTML += `
          <tr>
            <td>
              <img src="${libro.Imagen}" class="book-image" alt="Imagen del libro ${libro.Titulo}">
            </td>
            <td>${libro.Id_libro}</td>
            <td>${libro.Titulo}</td>
            <td>${libro.Autor}</td>
            <td>${libro.Genero}</td>
            <td class="actions">
              <button class="action-link action-edit"
                onclick="abrirModal('./guardarLibros/index.html?id=${libro.Id_libro}')">
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
    })
    .catch(err => {
      console.error("Error al buscar libros:", err);
      tablaLibros.innerHTML =
        `<tr><td colspan="6">Ocurrió un error al buscar libros.</td></tr>`;
    });
}

// ELIMINAR
const eliminarLibro = (id) => {
  if (!confirm("¿Estás seguro de que deseas eliminar este libro?")) {
    return;
  }

  fetch(`${URL_BASE}api/libros/eliminar/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(data.message || "Libro eliminado exitosamente.");
      cargarLibros();
    } else {
      alert(data.error || "Error al eliminar el libro.");
    }
  })
  .catch(err => {
    console.error("Error al eliminar el libro:", err);
    alert("Ocurrió un error al eliminar el libro.");
  });
};

// MODAL
const abrirModal = (url) => {
  const modal = document.getElementById("modalLibros");
  const iframe = document.getElementById("modalIframe");

  iframe.src = url;
  modal.style.display = "flex";
};

window.onclick = function (event) {
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