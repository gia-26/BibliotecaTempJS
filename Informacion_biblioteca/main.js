const quienesSomosTexto = document.getElementById("quienesSomos-texto");
const historiaTexto = document.getElementById("historia-texto");
const misionTexto = document.getElementById("mision-texto");
const visionTexto = document.getElementById("vision-texto");
const objetivoTexto = document.getElementById("objetivo-texto");

const totalLibros = document.getElementById("totalLibros");
const totalUsuarios = document.getElementById("totalUsuarios");
const anoFundacion = document.getElementById("anoFundacion");

// CARGAR INFORMACIÓN DE LA BIBLIOTECA
fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/informacion")
  .then(res => res.json())
  .then(data => {
    quienesSomosTexto.textContent = data.quienesSomos;
    historiaTexto.textContent = data.historia;
  })
  .catch(error => console.error('Error cargando información:', error));

// CARGAR MISIÓN, VISIÓN Y OBJETIVO
fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/mvo")
  .then(res => res.json())
  .then(data => {
    misionTexto.textContent = data.mision;
    visionTexto.textContent = data.vision;
    objetivoTexto.textContent = data.objetivo;
  })
  .catch(error => console.error('Error cargando MVO:', error));

// CARGAR ESTADÍSTICAS
fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/estadisticas")
  .then(res => res.json())
  .then(data => {
    totalLibros.textContent = data.totalLibros;
    totalUsuarios.textContent = data.totalUsuarios;
    anoFundacion.textContent = data.anoFundacion;
  })
  .catch(error => console.error('Error cargando estadísticas:', error));

// ACTUALIZAR INFORMACIÓN GENERAL
document.getElementById("update-info-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const nuevasQuienesSomos = document.getElementById("quienesSomos-input").value;
  const nuevaHistoria = document.getElementById("historia-input").value;

  if (!confirm("¿Guardar cambios en la información general?")) return;

  fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/informacion", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quienesSomos: nuevasQuienesSomos,
      historia: nuevaHistoria
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Información general actualizada correctamente");
    
    // Recargar datos
    fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/informacion")
      .then(res => res.json())
      .then(data => {
        quienesSomosTexto.textContent = data.quienesSomos;
        historiaTexto.textContent = data.historia;
      });
    
    // Limpiar textareas
    document.getElementById("quienesSomos-input").value = "";
    document.getElementById("historia-input").value = "";
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error al actualizar la información");
  });
});

// ACTUALIZAR MISIÓN, VISIÓN U OBJETIVO
document.getElementById("update-mvo-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const seleccion = document.getElementById("seleccion-mvo").value;
  const nuevoContenido = document.getElementById("mvo-input").value;

  if (!nuevoContenido.trim()) {
    alert("El campo no puede estar vacío");
    return;
  }

  if (!confirm(`¿Guardar cambios en ${seleccion}?`)) return;

  fetch(`https://backend-biblioteca-two.vercel.app/api/biblioteca/${seleccion}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      [seleccion]: nuevoContenido
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(`${seleccion.charAt(0).toUpperCase() + seleccion.slice(1)} actualizado correctamente`);
    
    // Recargar datos
    fetch("https://backend-biblioteca-two.vercel.app/api/biblioteca/mvo")
      .then(res => res.json())
      .then(data => {
        misionTexto.textContent = data.mision;
        visionTexto.textContent = data.vision;
        objetivoTexto.textContent = data.objetivo;
      });
    
    // Limpiar textarea
    document.getElementById("mvo-input").value = "";
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Error al actualizar ${seleccion}`);
  });
});

// Cambiar placeholder según selección
document.getElementById("seleccion-mvo").addEventListener("change", function() {
  const seleccion = this.value;
  const inputField = document.getElementById("mvo-input");
  
  inputField.placeholder = `Escribe el nuevo contenido para ${seleccion}...`;
});