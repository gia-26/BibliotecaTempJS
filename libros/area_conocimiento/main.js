// FUNCIÓN PARA MOSTRAR NOTIFICACIÓN
function mostrarNotificacion(mensaje) {
    const alerta = document.getElementById("mensajeExito");
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

// CARGAR AREAS
async function cargarAreas() {
    const res = await fetch("https://backend-biblioteca-two.vercel.app/api/areas");
    const data = await res.json();
    const contenedor = document.getElementById("listaAreas");
    contenedor.innerHTML = "";

    data.forEach((area) => {
        contenedor.innerHTML += `
        <div class="fila-area">
            <span class="area-texto">${area.Area_conocimiento}</span>
            <span class="estante-texto">${area.N_estante}</span>
            <div class="acciones">
                <button onclick="editarArea('${area.Id_area_conocimiento}','${area.Area_conocimiento}','${area.N_estante}')" class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="eliminarArea('${area.Id_area_conocimiento}')" class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

cargarAreas();

// GUARDAR / EDITAR
document.getElementById("formArea").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre  = document.getElementById("nombreArea").value.trim();
    const estante = document.getElementById("numeroEstante").value.trim();
    const id      = document.getElementById("idArea").value;

    if (nombre === "" || estante === "") {
        alert("Completa todos los campos");
        return;
    }

    let url = "https://backend-biblioteca-two.vercel.app/api/areas/agregar";

    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/api/areas/editar";
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Id_area_conocimiento: id,
            Area_conocimiento: nombre,
            N_estante: estante,
        }),
    });

    // ✅ NOTIFICACIÓN según operación
    if (id !== "") {
        mostrarNotificacion("Área de conocimiento actualizada correctamente.");
    } else {
        mostrarNotificacion("Área de conocimiento agregada correctamente.");
    }

    limpiarFormulario();
    cargarAreas();
});

// EDITAR
function editarArea(id, area, estante) {
    document.getElementById("idArea").value          = id;
    document.getElementById("nombreArea").value      = area;
    document.getElementById("numeroEstante").value   = estante;
}

// ELIMINAR
async function eliminarArea(id) {
    if (!confirm("¿Eliminar esta área?")) return;

    await fetch("https://backend-biblioteca-two.vercel.app/api/areas/eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id_area_conocimiento: id }),
    });

    // ✅ NOTIFICACIÓN de eliminado
    mostrarNotificacion("Área de conocimiento eliminada correctamente.");

    cargarAreas();
}

// CANCELAR
document
    .getElementById("cancelarBtn")
    .addEventListener("click", limpiarFormulario);

// LIMPIAR FORM
function limpiarFormulario() {
    document.getElementById("idArea").value        = "";
    document.getElementById("nombreArea").value    = "";
    document.getElementById("numeroEstante").value = "";
}

// VALIDAR ESTANTE — solo números, máx 10 dígitos
const estanteInput = document.getElementById("numeroEstante");
estanteInput.addEventListener("input", () => {
    estanteInput.value = estanteInput.value
        .replace(/[^0-9]/g, "")
        .slice(0, 10);
});