//CARGAR GENEROS
async function cargarGeneros() {

    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/generos"
    );

    const data = await res.json();

    const contenedor =
        document.getElementById("listaGeneros");

    contenedor.innerHTML = "";

    data.forEach(genero => {

        contenedor.innerHTML += `

        <div class="fila-genero">

            <span class="genero-texto">
                ${genero.Nombre}
            </span>

            <div class="acciones">

                <button
                onclick="editarGenero('${genero.Id_genero}','${genero.Nombre}')"
                class="icon-btn">

                <i class="fa-solid fa-pen-to-square"></i>

                </button>

                <button
                onclick="eliminarGenero('${genero.Id_genero}')"
                class="icon-btn delete">

                <i class="fa-solid fa-trash-can"></i>

                </button>

            </div>

        </div>

        `;

    });

}

cargarGeneros();

//GUARDAR / AGREGAR GENERO
document
.getElementById("formGenero")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre =
        document.getElementById("nombreGenero")
        .value
        .trim();

    const id =
        document.getElementById("idGenero")
        .value;

    if (nombre === "") {
        mostrarMensaje("Ingresa el nombre del género", "error");
        return;
    }

    let url =
    "https://backend-biblioteca-two.vercel.app/generos/agregar";

    let esEdicion = false;

    if (id !== "") {
        url = "https://backend-biblioteca-two.vercel.app/generos/editar";
        esEdicion = true;
    }

    const response = await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            Id_genero: id,
            Nombre: nombre
        })

    });

    const result = await response.json();

    if (response.ok) {
        if (esEdicion) {
            mostrarMensaje("Género editado correctamente", "ok");
        } else {
            mostrarMensaje("Género registrado correctamente", "ok");
        }
        limpiarFormulario();
        cargarGeneros();
    } else {
        mostrarMensaje(result.message || "Error al guardar el género", "error");
    }

});

//EDITAR GENERO
function editarGenero(id, nombre) {

    document.getElementById("idGenero").value = id;

    document.getElementById("nombreGenero").value = nombre;

}

// ELIMINAR GENERO
async function eliminarGenero(id) {

    if (!confirm("¿Eliminar este género?")) return;

    const response = await fetch(

        "https://backend-biblioteca-two.vercel.app/generos/eliminar",

        {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            Id_genero: id
        })

    });

    const result = await response.json();

    if (response.ok) {
        mostrarMensaje("Género eliminado correctamente", "ok");
        cargarGeneros();
    } else {
        if (response.status === 400) {
            mostrarMensaje("No se puede eliminar el género porque tiene libros asociados", "error");
        } else {
            mostrarMensaje(result.message || "Error al eliminar el género", "error");
        }
    }

}

//LIMPIAR FORMULARIO
function limpiarFormulario() {

    document.getElementById("idGenero").value = "";

    document.getElementById("nombreGenero").value = "";

}

// BOTON CANCELAR
document
.getElementById("cancelarBtn")
.addEventListener("click", limpiarFormulario);

// MOSTRAR MENSAJE
function mostrarMensaje(texto, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector(".mensaje");
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // Crear nuevo mensaje
    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = `mensaje ${tipo}`;
    mensajeDiv.textContent = texto;

    // Insertar al inicio del modal-body
    const modalBody = document.querySelector(".modal-body");
    modalBody.insertBefore(mensajeDiv, modalBody.firstChild);

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}