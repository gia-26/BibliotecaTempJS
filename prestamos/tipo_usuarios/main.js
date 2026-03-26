// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

// FUNCIÓN PARA ESCAPAR HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
            <span class="item-text">${escapeHtml(tipo.Tipo_usuario)}</span>
            <div class="acciones">
                <button onclick="editarTipo('${tipo.Id_tipo_usuario}','${escapeHtml(tipo.Tipo_usuario)}')" class="icon-btn edit">
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
    document.getElementById("idTipo").value = id;
    document.getElementById("nombreTipo").value = nombre;
}

// ELIMINAR
async function eliminarTipo(id) {
    if (!confirm("¿Eliminar este tipo de usuario?")) return;
    
    try {
        await fetch(
            "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/eliminar",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Id_tipo_usuario: id }),
            }
        );
        
        mostrarNotificacion("Tipo de usuario eliminado correctamente.");
        cargarTipos();

        // ACTUALIZAR SELECT EN PÁGINA PRINCIPAL
        if (window.parent && window.parent.mostrarTiposUsuarios) {
            window.parent.mostrarTiposUsuarios();
        }
        
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarNotificacion("Error al eliminar el tipo de usuario.");
    }
}

// LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById("idTipo").value = "";
    document.getElementById("nombreTipo").value = "";
}

// GUARDAR (AGREGAR/EDITAR)
async function guardarTipo(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombreTipo").value.trim();
    const id = document.getElementById("idTipo").value;

    if (nombre === "") {
        alert("Escribe el tipo de usuario");
        return;
    }

    try {
        let url = "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/agregar";
        let body = { Tipo_usuario: nombre };
        
        if (id !== "") {
            url = "https://backend-biblioteca-two.vercel.app/api/tipo_usuarios/editar";
            body = { Id_tipo_usuario: id, Tipo_usuario: nombre };
        }

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
        cargarTipos();

        // ACTUALIZAR SELECT EN PÁGINA PRINCIPAL
        if (window.parent && window.parent.mostrarTiposUsuarios) {
            window.parent.mostrarTiposUsuarios();
        }
        
    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarNotificacion("Error al guardar el tipo de usuario.");
    }
}

// INICIALIZAR
if (document.getElementById("formTipo")) {
    cargarTipos();
    document.getElementById("formTipo").addEventListener("submit", guardarTipo);
    document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);
}