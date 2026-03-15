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
        alert("Ingresa el nombre del género");
        return;
    }

    let url =
    "https://backend-biblioteca-two.vercel.app/generos/agregar";

    if (id !== "") {

        url =
        "https://backend-biblioteca-two.vercel.app/generos/editar";

    }

    await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            Id_genero: id,
            Nombre: nombre
        })

    });

    limpiarFormulario();

    cargarGeneros();

});

//EDITAR GENERO
function editarGenero(id, nombre) {

    document.getElementById("idGenero").value = id;

    document.getElementById("nombreGenero").value = nombre;

}

// ELIMINAR GENERO
async function eliminarGenero(id) {

    if (!confirm("¿Eliminar este género?")) return;

    await fetch(

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

    cargarGeneros();

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