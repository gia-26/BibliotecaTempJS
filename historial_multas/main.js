const nombreUsuario = document.getElementById("nombreUsuario");
const tipoUsuario = document.getElementById("tipoUsuario");
const montoTotal = document.getElementById("montoTotal");
const listaMultas = document.getElementById("listaMultas");

// CARGAR INFORMACIÓN DEL USUARIO
function cargarUsuario() {
  fetch("http://localhost:3000/api/usuarios/buscar?id=ALU001&tipo=TU001")
    .then(res => res.json())
    .then(data => {
      console.log(data); // Esto te permitirá ver en la consola si viene como 'Nombre'
            nombreUsuario.textContent = data.Nombre || "Nombre no encontrado";
            tipoUsuario.textContent = "Ingeniería en TI"; 
    })
    .catch(error => console.error("Error al obtener usuario:", error));
}

// CARGAR RESUMEN DE MULTAS
function cargarResumen() {
  fetch("http://localhost:3000/api/usuarios/resumen")
    .then(res => res.json())
    .then(data => {
      // Si el backend devuelve un objeto directo: { MontoTotal: 123 }
      // Si devuelve un array: data[0].MontoTotal
      const total = data.MontoTotal !== undefined ? data.MontoTotal : (data[0] ? data[0].MontoTotal : 0);
      montoTotal.textContent = `$${parseFloat(total).toFixed(2)}`;
    })
    .catch(err => console.error("Error cargando resumen:", err));
}

// CARGAR LISTA DE MULTAS
function cargarMultas() {
  fetch("http://localhost:3000/api/multas")
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
                    ${multa.Fecha_devolucion_real ?? 'No se ha devuelto'}
                  </span>
                </div>

                <div class="info-item">
                  <span class="info-label">Fecha Límite:</span>
                  <span class="info-value">${multa.Fecha_devolucion}</span>
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