// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

// CARGAR AÑOS
async function cargarAnios() {
    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/anios"
    );
    const data = await res.json();
    const contenedor = document.getElementById("listaAnios");
    contenedor.innerHTML = "";

    data.forEach(anio => {
        contenedor.innerHTML += `
        <div class="fila-anio">
            <span class="anio-texto">${anio.Anio_edicion}</span>
            <div class="acciones">
                <button onclick="editarAnio('${anio.Id_anio_edicion}','${anio.Anio_edicion}')" class="icon-btn edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarAnio('${anio.Id_anio_edicion}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

cargarAnios();

// GUARDAR / EDITAR
document
    .getElementById("formAnio")
    .addEventListener("submit", async function(e) {

    e.preventDefault();

    const anio = document.getElementById("anio").value.trim();
    const id   = document.getElementById("idAnio").value;

    if (!/^\d{4}$/.test(anio)) {
        alert("El año debe ser numérico de 4 dígitos");
        return;
    }

    let url = "https://backend-biblioteca-two.vercel.app/api/anios/agregar";

    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/anios/editar";
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Id_anio_edicion: id,
            Anio_edicion: anio
        })
    });

    //NOTIFICACIÓN según la operación
    if (id !== "") {
        mostrarNotificacion("Año de edición actualizado correctamente.");
    } else {
        mostrarNotificacion("Año de edición agregado correctamente.");
    }

    limpiarFormulario();
    cargarAnios();
});

// EDITAR
function editarAnio(id, anio) {
    document.getElementById("idAnio").value = id;
    document.getElementById("anio").value   = anio;
}

// ELIMINAR
async function eliminarAnio(id) {
    if (!confirm("¿Eliminar este año?")) return;

    await fetch("https://backend-biblioteca-two.vercel.app/api/anios/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_anio_edicion: id })
    });

    //NOTIFICACIÓN de eliminado
    mostrarNotificacion("Año de edición eliminado correctamente.");

    cargarAnios();
}

// LIMPIAR FORM
function limpiarFormulario() {
    document.getElementById("idAnio").value = "";
    document.getElementById("anio").value   = "";
}

// CANCELAR
document
    .getElementById("cancelarBtn")
    .addEventListener("click", limpiarFormulario);

// VALIDACIÓN INPUT — solo números, máx 4 dígitos
document
    .getElementById("anio")
    .addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 4);
    });