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

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// CARGAR GÉNEROS
async function cargarGeneros() {
    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/generos");
    const data = await res.json();
    const contenedor = document.getElementById("listaGeneros");
    contenedor.innerHTML = "";

    data.forEach(genero => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">${escapeHtml(genero.Nombre)}</span>
            <div class="acciones">
                <button onclick="editarGenero('${genero.Id_genero}','${escapeHtml(genero.Nombre)}')" class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarGenero('${genero.Id_genero}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

// EDITAR
function editarGenero(id, nombre) {
    document.getElementById("idGenero").value = id;
    document.getElementById("nombreGenero").value = nombre;
    document.getElementById("tituloForm").textContent = "Editar género";
}

// ELIMINAR
async function eliminarGenero(id) {
    if (!confirm("¿Eliminar este género?")) return;

    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/generos/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_genero: id })
    });

    const data = await res.json();

    if (!res.ok) {
        mostrarNotificacionError(data.error);
        return;
    }

    mostrarNotificacion("Género eliminado correctamente.");
    cargarGeneros();
    
    // ACTUALIZAR LOS SELECTS EN LA PÁGINA PRINCIPAL
    if (window.parent && window.parent.recuperarGeneros) {
        window.parent.recuperarGeneros();
    }
}

// LIMPIAR
function limpiarFormulario() {
    document.getElementById("idGenero").value = "";
    document.getElementById("nombreGenero").value = "";
    document.getElementById("tituloForm").textContent = "Agregar género";
}

// CANCELAR
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

// GUARDAR / EDITAR
document.getElementById("formGenero").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreGenero").value.trim();
    const id = document.getElementById("idGenero").value;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

    if (nombre === "") {
        alert("Escribe el nombre del género");
        return;
    }
    if (!regex.test(nombre)) {
        alert("Solo se permiten letras");
        return;
    }

    let url = "https://backend-biblioteca-two.vercel.app/api/generos/agregar";
    let body = { Nombre: nombre };

    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/generos/editar";
        body = { Id_genero: id, Nombre: nombre };
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (id !== "") {
        mostrarNotificacion("Género actualizado correctamente.");
    } else {
        mostrarNotificacion("Género agregado correctamente.");
    }

    limpiarFormulario();
    cargarGeneros();
    
    // ACTUALIZAR LOS SELECTS EN LA PÁGINA PRINCIPAL
    if (window.parent && window.parent.recuperarGeneros) {
        window.parent.recuperarGeneros();
    }
});

// CERRAR MODAL CON LA X
document.querySelector(".cerrar").addEventListener("click", function() {
    window.parent.closeModal('modal-generos');
});

// CARGAR GÉNEROS AL INICIAR
cargarGeneros();