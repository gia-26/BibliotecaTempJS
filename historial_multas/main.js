const nombreUsuario = document.getElementById("nombreUsuario");
const tipoUsuario = document.getElementById("tipoUsuario");
const montoTotal = document.getElementById("montoTotal");
const listaMultas = document.getElementById("listaMultas");

// CARGAR INFORMACIÓN DEL USUARIO
function cargarUsuario() {
  const nombre = localStorage.getItem("nombre");
  const id = localStorage.getItem("id");
  const rol = localStorage.getItem("rol");
  const tipo = (rol === "Alumno") ? "TU001" : "TU002";

  fetch(`https://backend-biblioteca-two.vercel.app/api/usuarios/buscar?id=${id}&tipo=${tipo}`)
    .then(res => res.json())
    .then(data => {
      nombreUsuario.textContent = nombre || "Nombre no encontrado";
      tipoUsuario.textContent = data.Carrera || rol; // ← muestra la carrera
    })
    .catch(error => console.error("Error al obtener usuario:", error));
}

// CARGAR RESUMEN DE MULTAS
function cargarResumen() {
  const token = localStorage.getItem("token");

  fetch("https://backend-biblioteca-two.vercel.app/api/usuarios/resumen", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    
      const total = data.MontoTotal !== undefined ? data.MontoTotal : (data[0] ? data[0].MontoTotal : 0);
      montoTotal.textContent = `$${parseFloat(total).toFixed(2)}`;
    })
    .catch(err => console.error("Error cargando resumen:", err));
}

// CARGAR LISTA DE MULTAS
function cargarMultas() {
  const token = localStorage.getItem("token");

  fetch("https://backend-biblioteca-two.vercel.app/api/multas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {

      listaMultas.innerHTML = "";

      if (data.length === 0) {
        listaMultas.innerHTML = "<p>No tienes multas registradas.</p>";
        return;
      }

      data.forEach(multa => {

  listaMultas.innerHTML += `
    <div class="multa-card">
      <div class="multa-header">
        <div class="multa-concepto">Devolución Tardía</div>
        <div class="multa-monto">$${parseFloat(multa.Monto).toFixed(2)}</div>
      </div>

      <div class="multa-body">
        <div class="multa-info">

          <div class="info-item">
            <span class="info-label">Libro:</span>
            <span class="info-value">${multa.Titulo}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha de Devolución:</span>
            <span class="info-value">
              ${multa.Fecha_devolucion_real 
                ? multa.Fecha_devolucion_real.split('T')[0] 
                : 'No se ha devuelto'}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Fecha Límite:</span>
            <span class="info-value">
              ${multa.Fecha_devolucion.split('T')[0]}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">Días de Retraso:</span>
            <span class="info-value">${multa.Dias_excedidos} días</span>
          </div>

        </div>
      </div>
    </div>
  `;
});

    });
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuario();
  cargarResumen();
  cargarMultas();
});