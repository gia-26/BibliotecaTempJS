//CAMBIO DE SECCIONES (MENÚ LATERAL)
document.querySelectorAll(".profile-menu a").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        // Quitar activo
        document.querySelectorAll(".profile-menu a")
            .forEach(l => l.classList.remove("active"));

        this.classList.add("active");

        // Cambiar sección
        document.querySelectorAll(".content-section")
            .forEach(sec => sec.classList.remove("active"));

        document.getElementById(this.dataset.target)
            .classList.add("active");

    });

});

//CARGAR AUTORES
async function cargarAutores() {

    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/autores"
    );

    const data = await res.json();

    const contenedor = document.getElementById("listaAutores");

    contenedor.innerHTML = "";

    data.forEach(autor => {

        contenedor.innerHTML += `
        <div class="fila-item">

            <span class="item-text">
                ${autor.Nombre}
            </span>

            <div class="acciones">

                <button 
                    onclick="editarAutor('${autor.Id_autor}','${autor.Nombre}')" 
                    class="icon-btn"
                >
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>

                <button 
                    onclick="eliminarAutor('${autor.Id_autor}')" 
                    class="icon-btn delete"
                >
                    <i class="fa-solid fa-trash-can"></i>
                </button>

            </div>

        </div>
        `;

    });

}

// Ejecutar al cargar
cargarAutores();

// GUARDAR / AGREGAR AUTOR
document
    .getElementById("formAutor")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const nombre = document
            .getElementById("nombreAutor")
            .value
            .trim();

        const id = document
            .getElementById("idAutor")
            .value;

        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

        if (nombre === "") {
            alert("Escribe el nombre del autor");
            return;
        }

        if (!regex.test(nombre)) {
            alert("Solo se permiten letras");
            return;
        }

        let url = "https://backend-biblioteca-two.vercel.app/autores/agregar";

        if (id !== "") {
            url = "https://backend-biblioteca-two.vercel.app/autores/editar";
        }

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id_autor: id,
                Nombre: nombre
            })
        });

        limpiarFormulario();
        cargarAutores();

    }
);

//EDITAR AUTOR
function editarAutor(id, nombre) {

    document.getElementById("idAutor").value = id;

    document.getElementById("nombreAutor").value = nombre;

    document.getElementById("tituloForm").textContent =
        "Editar autor";

    document
        .querySelector('[data-target="form"]')
        .click();

}

//ELIMINAR AUTOR
async function eliminarAutor(id) {

    if (!confirm("¿Eliminar este autor?")) return;

    await fetch(
        "https://backend-biblioteca-two.vercel.app/autores/eliminar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Id_autor: id
            })
        }
    );

    cargarAutores();

}

//LIMPIAR FORMULARIO
function limpiarFormulario() {

    document.getElementById("idAutor").value = "";

    document.getElementById("nombreAutor").value = "";

    document.getElementById("tituloForm").textContent =
        "Agregar autor";

}

//BOTÓN CANCELAR
document
    .getElementById("cancelarBtn")
    .addEventListener("click", limpiarFormulario);