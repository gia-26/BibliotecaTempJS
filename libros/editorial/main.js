// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

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

// CARGAR EDITORIALES
async function cargarEditoriales() {
    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/editoriales");
    const data = await res.json();

    const contenedor = document.getElementById("listaEditoriales");
    contenedor.innerHTML = "";

    data.forEach(editorial => {
        contenedor.innerHTML += `
        <div class="fila-item">
            <span class="item-text">
                ${editorial.Nombre} (${editorial.Pais})
            </span>
            <div class="acciones">
                <button 
                    class="icon-btn btn-editar"
                    data-id="${editorial.Id_editorial}"
                    data-nombre="${editorial.Nombre}"
                    data-pais="${editorial.Pais}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                    class="icon-btn delete btn-eliminar"
                    data-id="${editorial.Id_editorial}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });

    // EVENTOS CON data-*
    contenedor.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => {
            editarEditorial(btn.dataset.id, btn.dataset.nombre, btn.dataset.pais);
        });
    });

    contenedor.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            eliminarEditorial(btn.dataset.id);
        });
    });
}

// EDITAR
function editarEditorial(id, nombre, pais) {
    document.getElementById("idEditorial").value = id;
    document.getElementById("nombreEditorial").value = nombre;
    document.getElementById("paisEditorial").value = pais;
}

// ELIMINAR
async function eliminarEditorial(id) {
    if (!confirm("¿Eliminar esta editorial?")) return;

    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/editoriales/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_editorial: id })
    });

    const data = await res.json();

    if (!res.ok) {
        mostrarNotificacionError(data.error);
        return;
    }

    mostrarNotificacion("Editorial eliminada correctamente.");
    cargarEditoriales();
    
    // ACTUALIZAR EL SELECT EN LA PÁGINA PRINCIPAL
    if (window.parent && window.parent.recuperarEditoriales) {
        window.parent.recuperarEditoriales();
    }
}

// LIMPIAR
function limpiarFormulario() {
    document.getElementById("idEditorial").value = "";
    document.getElementById("nombreEditorial").value = "";
    document.getElementById("paisEditorial").value = "";
}

// CANCELAR
document.getElementById("cancelarBtn").addEventListener("click", limpiarFormulario);

// GUARDAR / EDITAR
document.getElementById("formEditorial").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombreEditorial").value.trim();
    const pais = document.getElementById("paisEditorial").value.trim();
    const id = document.getElementById("idEditorial").value;

    if (nombre === "" || pais === "") {
        alert("Escribe el nombre y país");
        return;
    }

    let url = "https://backend-biblioteca-two.vercel.app/api/editoriales/agregar";
    let body = { Nombre: nombre, Pais: pais };

    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/editoriales/editar";
        body = { Id_editorial: id, Nombre: nombre, Pais: pais };
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (id !== "") {
        mostrarNotificacion("Editorial actualizada correctamente.");
    } else {
        mostrarNotificacion("Editorial agregada correctamente.");
    }

    limpiarFormulario();
    cargarEditoriales();
    
    // ACTUALIZAR EL SELECT EN LA PÁGINA PRINCIPAL
    if (window.parent && window.parent.recuperarEditoriales) {
        window.parent.recuperarEditoriales();
    }
});

// CARGAR EDITORIALES AL INICIAR
cargarEditoriales();