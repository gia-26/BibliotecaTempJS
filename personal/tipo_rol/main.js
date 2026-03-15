//CARGAR ROLES
async function cargarRoles() {

    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/roles"
    );

    const data = await res.json();

    const contenedor =
        document.getElementById("listaRoles");

    contenedor.innerHTML = "";

    data.forEach(rol => {

        contenedor.innerHTML += `

        <div class="fila-genero">

            <span class="genero-texto">
                ${rol.Nombre}
            </span>

            <div class="acciones">

                <button
                onclick="editarRol('${rol.Id_rol}','${rol.Nombre}')"
                class="icon-btn">

                <i class="fa-solid fa-pen-to-square"></i>

                </button>

                <button
                onclick="eliminarRol('${rol.Id_rol}')"
                class="icon-btn delete">

                <i class="fa-solid fa-trash-can"></i>

                </button>

            </div>

        </div>

        `;

    });

}

cargarRoles();

//GUARDAR / AGREGAR ROL
document
.getElementById("formRol")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre =
        document.getElementById("nombreRol")
        .value
        .trim();

    const id =
        document.getElementById("idRol")
        .value;

    if (nombre === "") {
        alert("Ingresa el nombre del rol");
        return;
    }

    let url =
    "https://backend-biblioteca-two.vercel.app/roles/agregar";

    if (id !== "") {

        url =
        "https://backend-biblioteca-two.vercel.app/roles/editar";

    }

    await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            Id_rol: id,
            Nombre: nombre
        })

    });

    limpiarFormulario();

    cargarRoles();

});

//EDITAR ROL
function editarRol(id, nombre) {

    document.getElementById("idRol").value = id;

    document.getElementById("nombreRol").value = nombre;

}

// ELIMINAR ROL
async function eliminarRol(id) {

    if (!confirm("¿Eliminar este rol?")) return;

    await fetch(

        "https://backend-biblioteca-two.vercel.app/roles/eliminar",

        {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            Id_rol: id
        })

    });

    cargarRoles();

}

//LIMPIAR FORMULARIO
function limpiarFormulario() {

    document.getElementById("idRol").value = "";

    document.getElementById("nombreRol").value = "";

}

// BOTON CANCELAR
document
.getElementById("cancelarBtn")
.addEventListener("click", limpiarFormulario);