// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

// CARGAR TIPOS
async function cargarTipos() {
    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios"
    );
    const data = await res.json();
    const contenedor = document.getElementById("listaTipos");
    contenedor.innerHTML = "";
    data.forEach(tipo => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">${tipo.Tipo_usuario}</span>
            <div class="acciones">
                <button onclick="editarTipo('${tipo.Id_tipo_usuario}','${tipo.Tipo_usuario}')" class="icon-btn edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarTipo('${tipo.Id_tipo_usuario}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

// EDITAR
function editarTipo(id, nombre) {
    document.getElementById("idTipo").value     = id;
    document.getElementById("nombreTipo").value = nombre;
}

// ELIMINAR
async function eliminarTipo(id) {
    if (!confirm("¿Eliminar este tipo de usuario?")) return;
    await fetch("https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_tipo_usuario: id })
    });
    mostrarNotificacion("Tipo de usuario eliminado correctamente.");
    cargarTipos();
}

// LIMPIAR
function limpiarFormulario() {
    document.getElementById("idTipo").value     = "";
    document.getElementById("nombreTipo").value = "";
}

// ✅ GUARD: Solo ejecuta si estamos en la página correcta
if (document.getElementById("formTipo")) {

    cargarTipos();

    document.getElementById("formTipo").addEventListener("submit", async function(e) {
        e.preventDefault();
        const nombre = document.getElementById("nombreTipo").value.trim();
        const id     = document.getElementById("idTipo").value;

        if (nombre === "") {
            alert("Escribe el tipo de usuario");
            return;
        }

        let url = "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/agregar";
        if (id !== "") {
            url = "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/editar";
        }

        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id_tipo_usuario: id, Tipo_usuario: nombre })
        });

        if (id !== "") {
            mostrarNotificacion("Tipo de usuario actualizado correctamente.");
        } else {
            mostrarNotificacion("Tipo de usuario agregado correctamente.");
        }

        limpiarFormulario();
        cargarTipos();
    });

    document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

}