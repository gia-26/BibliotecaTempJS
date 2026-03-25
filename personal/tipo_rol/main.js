// NOTIFICACIÓN VERDE
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    alerta.classList.add("alert-success");
    alerta.classList.remove("alert-error");
    setTimeout(() => { alerta.style.display = "none"; }, 3000);
}

// NOTIFICACIÓN ROJA
function mostrarNotificacionError(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    alerta.classList.add("alert-error");
    alerta.classList.remove("alert-success");
    setTimeout(() => {
        alerta.style.display = "none";
        alerta.classList.remove("alert-error");
        alerta.classList.add("alert-success");
    }, 4000);
}

// CARGAR TIPOS DE ROL
async function cargarRoles() {
    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/roles");
    const data = await res.json();
    const contenedor = document.getElementById("listaRoles");
    contenedor.innerHTML = "";

    data.forEach(rol => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">${rol.Nombre}</span>
            <div class="acciones">
                <button onclick="editarRol('${rol.Id_rol}','${rol.Nombre}')" class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarRol('${rol.Id_rol}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

cargarRoles();

// GUARDAR / EDITAR
document.getElementById("formRol").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreRol").value.trim();
    const id     = document.getElementById("idRol").value;
    const regex  = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

    if (nombre === "") { alert("Escribe el nombre del rol"); return; }
    if (!regex.test(nombre)) { alert("Solo se permiten letras"); return; }

    let url = "https://backend-biblioteca-two.vercel.app/api/roles/agregar";
    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/roles/editar";
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_rol: id, Nombre: nombre })
    });

    if (id !== "") {
        mostrarNotificacion("Tipo de rol actualizado correctamente.");
    } else {
        mostrarNotificacion("Tipo de rol agregado correctamente.");
    }

    limpiarFormulario();
    cargarRoles();
});

// EDITAR
function editarRol(id, nombre) {
    document.getElementById("idRol").value     = id;
    document.getElementById("nombreRol").value = nombre;
    document.getElementById("tituloForm").textContent = "Editar tipo de rol";
}

// ELIMINAR
async function eliminarRol(id) {
    if (!confirm("¿Eliminar este tipo de rol?")) return;

    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/roles/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_rol: id })
    });

    const data = await res.json();

    if (!res.ok) {
        mostrarNotificacionError(data.error);
        return;
    }

    mostrarNotificacion("Tipo de rol eliminado correctamente.");
    cargarRoles();
}

// LIMPIAR
function limpiarFormulario() {
    document.getElementById("idRol").value     = "";
    document.getElementById("nombreRol").value = "";
    document.getElementById("tituloForm").textContent = "Agregar tipo de rol";
}

// CANCELAR
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

// CERRAR MODAL CON LA X
document.querySelector(".cerrar").addEventListener("click", function() {
    window.parent.closeModal('modal-roles');
});