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

// CARGAR AUTORES
async function cargarAutores() {
    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/autores");
    const data = await res.json();
    const contenedor = document.getElementById("listaAutores");
    contenedor.innerHTML = "";

    data.forEach(autor => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">${autor.Nombre}</span>
            <div class="acciones">
                <button onclick="editarAutor('${autor.Id_autor}','${autor.Nombre}')" class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarAutor('${autor.Id_autor}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

cargarAutores();

// GUARDAR / EDITAR
document.getElementById("formAutor").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreAutor").value.trim();
    const id     = document.getElementById("idAutor").value;
    const regex  = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

    if (nombre === "") { alert("Escribe el nombre del autor"); return; }
    if (!regex.test(nombre)) { alert("Solo se permiten letras"); return; }

    let url = "https://backend-biblioteca-two.vercel.app/api/autores/agregar";
    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/autores/editar";
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_autor: id, Nombre: nombre })
    });

    if (id !== "") {
        mostrarNotificacion("Autor actualizado correctamente.");
    } else {
        mostrarNotificacion("Autor agregado correctamente.");
    }

    limpiarFormulario();
    cargarAutores();
});

// EDITAR
function editarAutor(id, nombre) {
    document.getElementById("idAutor").value      = id;
    document.getElementById("nombreAutor").value  = nombre;
    document.getElementById("tituloForm").textContent = "Editar autor";
}

// ELIMINAR
async function eliminarAutor(id) {
    if (!confirm("¿Eliminar este autor?")) return;

    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/autores/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_autor: id })
    });

    const data = await res.json();

    // ✅ Si el backend rechaza, mostrar notificación roja
    if (!res.ok) {
        mostrarNotificacionError(data.error);
        return;
    }

    mostrarNotificacion("Autor eliminado correctamente.");
    cargarAutores();
}

// LIMPIAR
function limpiarFormulario() {
    document.getElementById("idAutor").value          = "";
    document.getElementById("nombreAutor").value      = "";
    document.getElementById("tituloForm").textContent = "Agregar autor";
}

// CANCELAR
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);