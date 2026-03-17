const presentacionTexto = document.getElementById("presentacion-texto");
const historiaTexto = document.getElementById("historia-texto");
const misionTexto = document.getElementById("mision-texto");
const visionTexto = document.getElementById("vision-texto");
const objetivoTexto = document.getElementById("objetivo-texto");

// CARGAR INFORMACIÓN DE LA BIBLIOTECA
fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/informacion")
  .then(res => res.json())
  .then(data => {
    presentacionTexto.textContent = data.quienesSomos;
    historiaTexto.textContent = data.historia;
    
    // Llenar textareas para edición
    document.getElementById("presentacion-contenido").value = data.quienesSomos;
    document.getElementById("historia-contenido").value = data.historia;
  })
  .catch(error => console.error('Error cargando información:', error));

// CARGAR MISIÓN, VISIÓN Y OBJETIVO
fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/mvo")
  .then(res => res.json())
  .then(data => {
    misionTexto.textContent = data.mision;
    visionTexto.textContent = data.vision;
    objetivoTexto.textContent = data.objetivo;
    
    // Llenar textarea de MVO con la selección actual (Misión por defecto)
    document.getElementById("mvo-contenido").value = data.mision;
  })
  .catch(error => console.error('Error cargando MVO:', error));

// ACTUALIZAR PRESENTACIÓN (¿Quiénes Somos?)
document.getElementById("update-presentacion-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const nuevoContenido = document.getElementById("presentacion-contenido").value;

  if (!nuevoContenido.trim()) {
    alert("El campo no puede estar vacío");
    return;
  }

  if (!confirm("¿Guardar cambios en ¿Quiénes Somos? ?")) return;

  fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/informacion", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quienesSomos: nuevoContenido
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Presentación actualizada correctamente");
    
    // Recargar datos
    fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/informacion")
      .then(res => res.json())
      .then(data => {
        presentacionTexto.textContent = data.quienesSomos;
      });
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error al actualizar la presentación");
  });
});

// ACTUALIZAR HISTORIA
document.getElementById("update-historia-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const nuevoContenido = document.getElementById("historia-contenido").value;

  if (!nuevoContenido.trim()) {
    alert("El campo no puede estar vacío");
    return;
  }

  if (!confirm("¿Guardar cambios en Nuestra Historia?")) return;

  fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/informacion", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      historia: nuevoContenido
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Historia actualizada correctamente");
    
    // Recargar datos
    fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/informacion")
      .then(res => res.json())
      .then(data => {
        historiaTexto.textContent = data.historia;
      });
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Error al actualizar la historia");
  });
});

// ACTUALIZAR MISIÓN, VISIÓN U OBJETIVO
document.getElementById("update-mvo-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const seleccion = document.getElementById("seleccion-mvo").value;
  const nuevoContenido = document.getElementById("mvo-contenido").value;

  if (!nuevoContenido.trim()) {
    alert("El campo no puede estar vacío");
    return;
  }

  if (!confirm(`¿Guardar cambios en ${seleccion}?`)) return;

  fetch(`https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/${seleccion}`, {
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
    
    // Recargar datos de MVO
    fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/mvo")
      .then(res => res.json())
      .then(data => {
        misionTexto.textContent = data.mision;
        visionTexto.textContent = data.vision;
        objetivoTexto.textContent = data.objetivo;
      });
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Error al actualizar ${seleccion}`);
  });
});

// Cambiar contenido del textarea según selección de MVO
document.getElementById("seleccion-mvo").addEventListener("change", function() {
  const seleccion = this.value;
  
  // Obtener el valor actual según la selección
  fetch("https://backend-biblioteca-two.vercel.app/api/informacion_biblioteca/mvo")
    .then(res => res.json())
    .then(data => {
      document.getElementById("mvo-contenido").value = data[seleccion];
    })
    .catch(error => console.error('Error cargando valor:', error));
});