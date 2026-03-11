const tipoReporte = document.getElementById('tipo_reporte');
const fechaInicio = document.getElementById('fecha_inicio');
const fechaFin = document.getElementById('fecha_fin');
const btnGenerar = document.getElementById('btnGenerar');
const btnLimpiar = document.getElementById('btnLimpiar');

const totalMultas = document.getElementById('totalMultas');
const totalPrestamos = document.getElementById('totalPrestamos');
const librosPendientes = document.getElementById('librosPendientes');
const mensajeErrorReporte = document.getElementById('mensajeErrorReporte');

const BASE_URL = 'https://backend-biblioteca-two.vercel.app/api/reportes';

// CARGAR DASHBOARD
fetch(`${BASE_URL}/dashboard`)
  .then(res => res.json())
  .then(data => {
    totalMultas.textContent = `$${parseFloat(data.TotalMultas || 0).toFixed(2)}`;
    totalPrestamos.textContent = data.TotalPrestamos || 0;
    librosPendientes.textContent = data.LibrosDevolver || 0;
  })
  .catch(error => {
    console.error('Error al cargar dashboard:', error);
  });

function mostrarError(mensaje) {
  mensajeErrorReporte.textContent = mensaje;
  mensajeErrorReporte.style.display = 'block';
}

function ocultarError() {
  mensajeErrorReporte.textContent = '';
  mensajeErrorReporte.style.display = 'none';
}

// GENERAR PDF DESDE BACKEND
btnGenerar.addEventListener('click', (e) => {
  e.preventDefault();

  const t = tipoReporte.value;
  const fIni = fechaInicio.value;
  const fFin = fechaFin.value;

  ocultarError();

  if (!fIni || !fFin) {
    mostrarError("Seleccione ambas fechas.");
    return;
  }

  // Como input type="date" devuelve YYYY-MM-DD,
  // se puede comparar directamente
  if (fIni > fFin) {
    mostrarError("La fecha de inicio no puede ser mayor que la fecha fin.");
    return;
  }

  window.open(
    `${BASE_URL}/pdf?tipo=${t}&inicio=${fIni}&fin=${fFin}`,
    "_blank"
  );
});

// LIMPIAR
btnLimpiar.addEventListener('click', () => {
  fechaInicio.value = '';
  fechaFin.value = '';
  ocultarError();
});

// Ocultar error cuando cambien los campos
fechaInicio.addEventListener('input', ocultarError);
fechaFin.addEventListener('input', ocultarError);
tipoReporte.addEventListener('change', ocultarError);