const tipoReporte = document.getElementById('tipo_reporte');
const fechaInicio = document.getElementById('fecha_inicio');
const fechaFin = document.getElementById('fecha_fin');
const btnGenerar = document.getElementById('btnGenerar');
const btnLimpiar = document.getElementById('btnLimpiar');

const theadReporte = document.getElementById('theadReporte');
const tbodyReporte = document.getElementById('tbodyReporte');
const tituloReporte = document.getElementById('tituloReporte');

const totalMultas = document.getElementById('totalMultas');
const totalPrestamos = document.getElementById('totalPrestamos');
const librosPendientes = document.getElementById('librosPendientes');

// DASHBOARD
fetch('https://backend-biblioteca-two.vercel.app/api/reportes/dashboard')
  .then(res => res.json())
  .then(data => {
    totalMultas.textContent = `$${parseFloat(data.TotalMultas).toFixed(2)}`;
    totalPrestamos.textContent = data.TotalPrestamos;
    librosPendientes.textContent = data.LibrosDevolver;
  });

// GENERAR REPORTE
btnGenerar.addEventListener('click', () => {

  if (!fechaInicio.value || !fechaFin.value) {
    alert("Complete las fechas");
    return;
  }

  if (fechaInicio.value > fechaFin.value) {
    alert("La fecha inicio no puede ser mayor a la fecha fin");
    return;
  }

  fetch(`https://backend-biblioteca-two.vercel.app/api/reportes?tipo=${tipoReporte.value}&inicio=${fechaInicio.value}&fin=${fechaFin.value}`)
    .then(res => res.json())
    .then(data => {

      tbodyReporte.innerHTML = "";
      theadReporte.innerHTML = "";

      if (tipoReporte.value === "multas") {

        tituloReporte.textContent = "Reporte de Multas";

        theadReporte.innerHTML = `
          <tr>
            <th>Usuario</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Título</th>
            <th>Fecha devolución</th>
            <th>Fecha entrega</th>
            <th>Días excedidos</th>
            <th>Monto</th>
          </tr>
        `;

        data.forEach(row => {
          tbodyReporte.innerHTML += `
            <tr>
              <td>${row.Nombre}</td>
              <td>${row.Apellido_P}</td>
              <td>${row.Apellido_M}</td>
              <td>${row.Titulo}</td>
              <td>${row.Fecha_devolucion}</td>
              <td>${row.Fecha_devolucion_real}</td>
              <td>${row.Dias_excedidos}</td>
              <td>$${parseFloat(row.Monto).toFixed(2)}</td>
            </tr>
          `;
        });

      } else {

        tituloReporte.textContent = "Reporte de Préstamos";

        theadReporte.innerHTML = `
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Apellido P</th>
            <th>Apellido M</th>
            <th>ID Libro</th>
            <th>Título</th>
            <th>Fecha préstamo</th>
            <th>Fecha devolución</th>
            <th>Fecha entrega</th>
          </tr>
        `;

        data.forEach(row => {
          tbodyReporte.innerHTML += `
            <tr>
              <td>${row.Id}</td>
              <td>${row.Nombre}</td>
              <td>${row.Apellido_P}</td>
              <td>${row.Apellido_M}</td>
              <td>${row.Id_libro}</td>
              <td>${row.Titulo}</td>
              <td>${row.Fecha_prestamo}</td>
              <td>${row.Fecha_devolucion}</td>
              <td>${row.Fecha_devolucion_real || 'No entregado'}</td>
            </tr>
          `;
        });

      }

    });

});

// LIMPIAR
btnLimpiar.addEventListener('click', () => {
  fechaInicio.value = "";
  fechaFin.value = "";
  tbodyReporte.innerHTML = "";
  theadReporte.innerHTML = "";
  tituloReporte.textContent = "";
});