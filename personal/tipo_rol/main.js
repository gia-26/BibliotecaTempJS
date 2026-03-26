// Notificación verde
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    alerta.classList.add("alert-success");
    alerta.classList.remove("alert-error");
    setTimeout(() => { alerta.style.display = "none"; }, 3000);
}

// Notificación roja
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

// Cargar roles
async function cargarRoles() {
    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipo_rol"
    );
    const data = await res.json();
    const contenedor = document.getElementById("listaRoles");
    contenedor.innerHTML = "";

    data.forEach(rol => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">${rol.Tipo_rol}</span>
            <div class="acciones">
                <button onclick="editarRol('${rol.Id_rol}','${rol.Tipo_rol}')" class="icon-btn">
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

// Guardar / Editar
document.getElementById("formRol").addEventListener("submit", async function(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreRol").value.trim();
    const id = document.getElementById("idRol").value;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

    if (nombre === "") { alert("Escribe el nombre del rol"); return; }
    if (!regex.test(nombre)) { alert("Solo se permiten letras"); return; }

    let url = "https://backend-biblioteca-two.vercel.app/api/tipo_rol/agregar";
    if (id !== "") url = "https://backend-biblioteca-two.vercel.app/api/tipo_rol/editar";

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_rol: id, Tipo_rol: nombre })
    });

    const data = await response.json();
    if (!response.ok) {
        mostrarNotificacionError(data.error || "Error al guardar el rol");
        return;
    }

    mostrarNotificacion(id ? "Tipo de rol actualizado." : "Tipo de rol agregado.");
    limpiarFormulario();
    cargarRoles();
});

// Editar
function editarRol(id, nombre) {
    document.getElementById("idRol").value = id;
    document.getElementById("nombreRol").value = nombre;
    document.getElementById("tituloForm").textContent = "Editar tipo de rol";
}

// Eliminar
async function eliminarRol(id) {
    if (!confirm("¿Eliminar este tipo de rol?")) return;

    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipo_rol/eliminar",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id_rol: id })
        }
    );

    const data = await res.json();
    if (!res.ok) {
        mostrarNotificacionError(data.error);
        return;
    }

    mostrarNotificacion("Tipo de rol eliminado correctamente.");
    cargarRoles();
}

// Limpiar
function limpiarFormulario() {
    document.getElementById("idRol").value = "";
    document.getElementById("nombreRol").value = "";
    document.getElementById("tituloForm").textContent = "Agregar tipo de rol";
}

// Cancelar
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

