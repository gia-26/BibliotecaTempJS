const defaultData = {
  quienesSomos: 'La Biblioteca "Mtro. Sergio Saúl Figueroa Balderas"...',
  historia: 'La historia de la Biblioteca inicia en 1997...',
  mision: '',
  vision: '',
  objetivo: ''
};

let data = JSON.parse(localStorage.getItem("bibliotecaInfo")) || defaultData;

// Mostrar datos en pantalla
function renderData() {
  document.getElementById("presentacion-texto").innerHTML = data.quienesSomos.replace(/\n/g, "<br>");
  document.getElementById("historia-texto").innerHTML = data.historia.replace(/\n/g, "<br>");
  document.getElementById("mision-texto").innerHTML = data.mision.replace(/\n/g, "<br>");
  document.getElementById("vision-texto").innerHTML = data.vision.replace(/\n/g, "<br>");
  document.getElementById("objetivo-texto").innerHTML = data.objetivo.replace(/\n/g, "<br>");

  document.getElementById("presentacion-contenido").value = data.quienesSomos;
  document.getElementById("historia-contenido").value = data.historia;
  document.getElementById("mvo-contenido").value = data.mision;
}

function guardarDatos() {
  localStorage.setItem("bibliotecaInfo", JSON.stringify(data));
}

// Validación genérica
function validarCampo(valor, nombre) {
  if (valor.trim() === "") {
    alert(`⚠ El campo "${nombre}" no puede estar vacío.`);
    return false;
  }
  return true;
}

// Presentación
document.getElementById("update-presentacion-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const valor = document.getElementById("presentacion-contenido").value;
  if (!validarCampo(valor, "¿Quiénes Somos?")) return;
  if (!confirm("¿Guardar cambios?")) return;

  data.quienesSomos = valor.trim();
  guardarDatos();
  renderData();
  alert("Presentación actualizada correctamente.");
});

// Historia
document.getElementById("update-historia-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const valor = document.getElementById("historia-contenido").value;
  if (!validarCampo(valor, "Nuestra Historia")) return;
  if (!confirm("¿Guardar cambios?")) return;

  data.historia = valor.trim();
  guardarDatos();
  renderData();
  alert("Historia actualizada correctamente.");
});

// Misión / Visión / Objetivo
document.getElementById("update-mvo-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const seleccion = document.getElementById("seleccion-mvo").value;
  const valor = document.getElementById("mvo-contenido").value;

  if (!validarCampo(valor, seleccion)) return;
  if (!confirm("¿Guardar cambios?")) return;

  data[seleccion] = valor.trim();
  guardarDatos();
  renderData();
  alert("Actualizado correctamente.");
});

// Cambiar contenido del textarea según selección
document.getElementById("seleccion-mvo").addEventListener("change", function() {
  document.getElementById("mvo-contenido").value = data[this.value];
});

document.addEventListener("DOMContentLoaded", renderData);