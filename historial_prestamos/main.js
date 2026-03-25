// Elementos del DOM
const nombreUsuario = document.getElementById("nombreUsuario");
const tipoUsuario = document.getElementById("tipoUsuario");

const prestamosTotales = document.getElementById("prestamosTotales");
const librosActivos = document.getElementById("librosActivos");
const librosDevueltos = document.getElementById("librosDevueltos");

const prestamosContainer = document.getElementById("prestamosContainer");

// CARGAR INFORMACIÓN DEL USUARIO
function cargarUsuario() {
  const nombre = localStorage.getItem("nombre");
  const rol = localStorage.getItem("rol");

  nombreUsuario.textContent = nombre || "Nombre no encontrado";
  tipoUsuario.textContent = rol || "";
}

// CARGAR ESTADÍSTICAS DEL USUARIO
function cargarEstadisticas() {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  // Agrega la barra antes del ID
  fetch(`https://backend-biblioteca-two.vercel.app/api/usuarios/usuario/estadisticas/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    prestamosTotales.textContent = data.prestamosTotales;
    librosActivos.textContent = data.librosActivos;
    librosDevueltos.textContent = data.librosDevueltos;
  })
  
}

// CARGAR HISTORIAL DE PRÉSTAMOS
function cargarHistorial() {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  // Agrega la barra antes del ID
  fetch(`https://backend-biblioteca-two.vercel.app/api/usuarios/usuario/mis-prestamos/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    prestamosContainer.innerHTML = "";

    if (!data || data.length === 0) {
      prestamosContainer.innerHTML = "<p>No tienes préstamos registrados.</p>";
      return;
    }

    data.forEach(prestamo => {
      const card = document.createElement("div");
      card.classList.add("prestamo-card");

      let estadoClase = "prestado";
      if (prestamo.estado === "Entregado") estadoClase = "entregado";
      else if (prestamo.estado === "Expirado") estadoClase = "expirado";
      else if (prestamo.estado === "Activo") estadoClase = "prestado";

      card.innerHTML = `
        <div class="prestamo-header">
          <div class="prestamo-title">${prestamo.titulo}</div>
          <div class="prestamo-author">Por: ${prestamo.autor}</div>
        </div>

        <div class="prestamo-body">
          <div class="prestamo-info">
            <div class="info-item">
              <label>Fecha de Préstamo</label>
              <span>${prestamo.fechaPrestamo}</span>
            </div>
            <div class="info-item">
              <label>Fecha Devolución Esperada</label>
              <span>${prestamo.fechaDevolucion}</span>
            </div>
            <div class="info-item">
              <label>Fecha Devolución Real</label>
              <span>${prestamo.fechaDevolucionReal || "No devuelto"}</span>
            </div>
            <div class="info-item">
              <label>Días</label>
              <span>${prestamo.dias}</span>
            </div>
            <div class="info-item">
              <label>Renovaciones</label>
              <span>${prestamo.renovaciones}</span>
            </div>
          </div>

          <div class="estado ${estadoClase}">
            ${prestamo.estado}
          </div>
        </div>
      `;

      prestamosContainer.appendChild(card);
    });
  })
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
  cargarEstadisticas();
  cargarHistorial();
});