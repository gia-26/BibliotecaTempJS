const tipoReporte = document.getElementById('tipo_reporte');
const fechaInicio = document.getElementById('fecha_inicio');
const fechaFin = document.getElementById('fecha_fin');
const btnGenerar = document.getElementById('btnGenerar');
const btnLimpiar = document.getElementById('btnLimpiar');

const totalMultas = document.getElementById('totalMultas');
const totalPrestamos = document.getElementById('totalPrestamos');
const librosPendientes = document.getElementById('librosPendientes');

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

// GENERAR PDF DESDE BACKEND
btnGenerar.addEventListener('click', (e) => {
  e.preventDefault();

  // 1. Limpiar validaciones nativas previas
  fechaInicio.setCustomValidity("");
  fechaFin.setCustomValidity("");

  const t = tipoReporte.value;
  const fIni = fechaInicio.value;
  const fFin = fechaFin.value;

  // 2. VALIDACIÓN CAMPOS VACÍOS
  if (!fIni) {
    fechaInicio.setCustomValidity("Completa este campo");
    fechaInicio.reportValidity();
    return;
  }
  if (!fFin) {
    fechaFin.setCustomValidity("Completa este campo");
    fechaFin.reportValidity();
    return;
  }

  // 3. VALIDACIÓN 
  if (fIni > fFin) {
    alert("La fecha de inicio no puede ser mayor que la fecha fin.");
    return;
  }

  // Si todo está bien, abre el PDF
  window.open(
    `${BASE_URL}/pdf?tipo=${t}&inicio=${fIni}&fin=${fFin}`,
    "_blank"
  );
});