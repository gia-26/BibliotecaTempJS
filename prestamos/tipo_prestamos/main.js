//CARGAR TIPOS DE PRÉSTAMO
async function cargarTiposPrestamo() {

    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipos_prestamo"
    );

    const data = await res.json();

    const contenedor =
        document.getElementById("listaTiposPrestamo");

    contenedor.innerHTML = "";

    data.forEach(tipo => {

        contenedor.innerHTML += `
        <div class="fila-genero">
            <span class="genero-texto">
                ${tipo.Tipo_prestamo}
            </span>
            <div class="acciones">
                <button
                onclick="editarTipoPrestamo('${tipo.Id_tipo_prestamo}','${tipo.Tipo_prestamo}')"
                class="icon-btn">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                onclick="eliminarTipoPrestamo('${tipo.Id_tipo_prestamo}')"
                class="icon-btn delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>`;
    });
}

cargarTiposPrestamo();

//GUARDAR / AGREGAR TIPO DE PRÉSTAMO
document
.getElementById("formTipoPrestamo")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre =
        document.getElementById("nombreTipoPrestamo")
        .value.trim();

    const id =
        document.getElementById("idTipoPrestamo")
        .value;

    if (nombre === "") {
        alert("Ingresa el nombre del tipo de préstamo");
        return;
    }

    let url =
    "https://backend-biblioteca-two.vercel.app/api/tipos_prestamo/agregar";

    if (id !== "") {
        url =
        "https://backend-biblioteca-two.vercel.app/api/tipos_prestamo/editar";
    }

    const body = id !== ""
        ? { Id_tipo_prestamo: id, Tipo_prestamo: nombre }
        : { Tipo_prestamo: nombre };

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    limpiarFormulario();
    cargarTiposPrestamo();
});

//EDITAR TIPO DE PRÉSTAMO
function editarTipoPrestamo(id, nombre) {
    document.getElementById("idTipoPrestamo").value = id;
    document.getElementById("nombreTipoPrestamo").value = nombre;
}

// ELIMINAR TIPO DE PRÉSTAMO
async function eliminarTipoPrestamo(id) {

    if (!confirm("¿Eliminar este tipo de préstamo?")) return;

    await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipos_prestamo/eliminar",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id_tipo_prestamo: id })
        }
    );

    cargarTiposPrestamo();
}

//LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById("idTipoPrestamo").value = "";
    document.getElementById("nombreTipoPrestamo").value = "";
}

// BOTON CANCELAR
document
.getElementById("cancelarBtn")
.addEventListener("click", limpiarFormulario);