// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
  const alerta = document.getElementById("mensajeExito");
  alerta.textContent = mensaje;
  alerta.style.display = "block";
  setTimeout(() => {
    alerta.style.display = "none";
  }, 3000);
}

// CARGAR TIPOS DE USUARIO
async function cargarTiposUsuario() {
  const res = await fetch(
    "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios",
  );
  const data = await res.json();
  const contenedor = document.getElementById("listaTiposUsuario");
  contenedor.innerHTML = "";
  data.forEach((tipo) => {
    contenedor.innerHTML += `
        <div class="fila-genero">
            <span class="genero-texto">${tipo.Tipo_usuario}</span>
            <div class="acciones">
                <button onclick="editarTipoUsuario('${tipo.Id_tipo_usuario}','${tipo.Tipo_usuario}')" class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarTipoUsuario('${tipo.Id_tipo_usuario}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
  });
}

// EDITAR
function editarTipoUsuario(id, nombre) {
  document.getElementById("idTipoUsuario").value = id;
  document.getElementById("nombreTipoUsuario").value = nombre;
}

// ELIMINAR
async function eliminarTipoUsuario(id) {
  if (!confirm("¿Eliminar este tipo de usuario?")) return;
  await fetch(
    "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/eliminar",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Id_tipo_usuario: id }),
    },
  );
  mostrarNotificacion("Tipo de usuario eliminado correctamente.");
  cargarTiposUsuario();

  if (window.parent && window.parent.mostrarTiposUsuarios) {
    window.parent.mostrarTiposUsuarios();
  }
}

// LIMPIAR
function limpiarFormulario() {
  document.getElementById("idTipoUsuario").value = "";
  document.getElementById("nombreTipoUsuario").value = "";
}

// Solo ejecuta si estamos en la página correcta
if (document.getElementById("formTipoUsuario")) {
  cargarTiposUsuario();

  document
    .getElementById("formTipoUsuario")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const nombre = document.getElementById("nombreTipoUsuario").value.trim();
      const id = document.getElementById("idTipoUsuario").value;

      if (nombre === "") {
        alert("Ingresa el nombre del tipo de usuario");
        return;
      }

      let url =
        "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/agregar";
      if (id !== "") {
        url =
          "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/editar";
      }

      const body =
        id !== ""
          ? { Id_tipo_usuario: id, Tipo_usuario: nombre }
          : { Tipo_usuario: nombre };

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (id !== "") {
        mostrarNotificacion("Tipo de usuario actualizado correctamente.");
      } else {
        mostrarNotificacion("Tipo de usuario agregado correctamente.");
      }

      limpiarFormulario();
      cargarTiposUsuario();

      if (window.parent && window.parent.mostrarTiposUsuarios) {
        window.parent.mostrarTiposUsuarios();
      }
    });

  document
    .getElementById("cancelarBtn")
    .addEventListener("click", limpiarFormulario);
}
