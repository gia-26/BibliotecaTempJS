if (!localStorage.getItem('token')) {
  location.href = '../index.html';
}
else if (localStorage.getItem('rol') !== 'ROL003') {
  location.href = '../index.html';
}

const tblPersonal = document.getElementById('tblPersonal');
const slcTiposRol = document.getElementById('slcTiposRol');
const inpNoTrabajador = document.getElementById('noTrabajador');
const inpIdPersonal = document.getElementById('idPersonal');
const inpNombre = document.getElementById('nombre');
const inpApellidoP = document.getElementById('apellidoP');
const inpApellidoM = document.getElementById('apellidoM');
const inpPassword = document.getElementById('password');
const inpPasswordConfirm = document.getElementById('password-confirm');
const btnEditar = document.getElementById('btnEditar');
const btnGuardar = document.getElementById('btnGuardar');
const inpSearch = document.getElementById('inpSearch');
const togglePasswordBtn = document.getElementById("togglePassword");
const togglePasswordConfirmBtn = document.getElementById("togglePasswordConfirm");
const iconToggle = togglePasswordBtn.querySelector("i");
const iconToggleConfirm = togglePasswordConfirmBtn.querySelector("i");


const cargarPersonal = () => {
    fetch('https://backend-biblioteca-two.vercel.app/api/personal')
    .then(response => response.json())
    .then(personales => {
        tblPersonal.innerHTML = '';
        personales.forEach(personal => {
            tblPersonal.innerHTML += `
                <tr>
                    <td>${personal.Id_personal}</td>
                    <td>${personal.Nombre}</td>
                    <td>${personal.Apellido_P}</td>
                    <td>${personal.Apellido_M}</td>
                    <td>${personal.Tipo_rol}</td>
                    <td class="actions">
                        <a onclick="colocarDatos('${personal.Id_personal}', '${personal.Nombre}', '${personal.Apellido_P}', '${personal.Apellido_M}', '${personal.Id_rol}', '${personal.Id_trabajador}')" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                        <a onclick="eliminarPersonal('${personal.Id_personal}')" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
                    </td>
                </tr>
            `;
        });
    })
}

const recuperarTipoRol = () => {
    // Los roles ya se cargan desde cargarRoles()
    console.log("Roles cargados desde cargarRoles()");
}

const colocarDatos = (idPersonal, nombre, apellidoP, apellidoM, idRol, idTrabajador) => {
    inpNoTrabajador.value =  idTrabajador;
    inpIdPersonal.value = idPersonal;
    inpNombre.value = nombre;
    inpApellidoP.value = apellidoP;
    inpApellidoM.value = apellidoM;
    slcTiposRol.value = idRol;
    window.location.href = '#formPersonal';
    btnGuardar.style.display = 'none';
}

btnEditar.addEventListener('click', () => {
    editar();
})

const editar = () => {
    const idPersonal = inpIdPersonal.value;
    const password = inpPassword.value;
    const idRol = slcTiposRol.value;
    const passwordConfirm = inpPasswordConfirm.value;
    
    if (password !== passwordConfirm){
        mostrarAlerta({
            titulo: "Error",
            texto: "Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.",
            tipo: "error"
        });
        return;
    }

    fetch('https://backend-biblioteca-two.vercel.app/api/personal/editar/password',{
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            Id_personal: idPersonal,
            Id_rol: idRol,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            mostrarAlerta({
                titulo: "Éxito",
                texto: data.message,
                tipo: "success"
            });
            limpiar()
        } else {
            mostrarAlerta({
                titulo: "Error",
                texto: 'Error al actualizar el personal bibliotecario.',
                tipo: "error"
            });
        }
        cargarPersonal();
    })
    .catch(error => {
        console.error('Error al actualizar el personal bibliotecario:', error);
        mostrarAlerta({
            titulo: "Error",
            texto: 'Error al actualizar el personal bibliotecario.',
            tipo: "error"
        });
    });
}

const eliminarPersonal = (idPersonal) => {
    confirmarAccion("¿Estás seguro de eliminar este personal?", () => {
        fetch('https://backend-biblioteca-two.vercel.app/api/personal/eliminar', {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ Id_personal: idPersonal })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarAlerta({
                    titulo: "Éxito",
                    texto: data.message,
                    tipo: "success"
                });
                cargarPersonal();
                limpiar();
            } else {
                mostrarAlerta({
                    titulo: "Error",
                    texto: 'Error al eliminar el personal.',
                    tipo: "error"
                });
            }
        })
        .catch(error => {
            console.error('Error al eliminar personal:', error);
            mostrarAlerta({
                titulo: "Error",
                texto: 'Error al eliminar el personal.',
                tipo: "error"
            });
        });
    });
}

const buscarTrabajador = () => {
    const noTrabajador = inpNoTrabajador.value.trim();
    if (noTrabajador === '') {
        mostrarAlerta({
            titulo: "Error",
            texto: 'Por favor ingresa el número de trabajador para buscar.',
            tipo: "error"
        });
        return;
    }

    fetch(`https://backend-biblioteca-two.vercel.app/api/personal/trabajador/${noTrabajador}`)
    .then(response => response.json())
    .then(Trabajador => {
        if (!Trabajador.success) {
            mostrarAlerta({
                titulo: "Error",
                texto: Trabajador.message,
                tipo: "error"
            });
            return;
        }

        //console.log('Trabajador encontrado:', Trabajador.data);

        inpNombre.value = Trabajador.data.Nombre;
        inpApellidoP.value = Trabajador.data.Apellido_P;
        inpApellidoM.value = Trabajador.data.Apellido_M;
    })
    .catch(error => {
        console.error('Error al buscar el trabajador:', error);
        mostrarAlerta({
            titulo: "Error",
            texto: 'Error al buscar el trabajador.',
            tipo: "error"
        });
    });

}

inpNoTrabajador.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        buscarTrabajador();
    }
});

const guardar = () => {
    const noTrabajador = inpNoTrabajador.value.trim();
    const nombre = inpNombre.value.trim();
    const apellidoP = inpApellidoP.value.trim();
    const apellidoM = inpApellidoM.value.trim();
    const idRol = slcTiposRol.value;
    const idPersonal = inpIdPersonal.value;
    const password = inpPassword.value;
    const passwordConfirm = inpPasswordConfirm.value;
    
    if (!noTrabajador || !nombre || !apellidoP || !apellidoM || !idRol) {
        mostrarAlerta({
            titulo: "Error",
            texto: 'Por favor completa todos los campos.',
            tipo: "error"
        });
        return;
    }
    
    if (password !== passwordConfirm) {
        mostrarAlerta({
            titulo: "Error",
            texto: 'Las contraseñas no coinciden.',
            tipo: "error"
        });
        return;
    }
    
    fetch('https://backend-biblioteca-two.vercel.app/api/personal/guardar', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            Id_trabajador: noTrabajador,
            Id_rol: idRol,
            password: password,
            Id_personal: idPersonal
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarAlerta({
                titulo: "Éxito",
                texto: data.message + "\nEl ID del personal es: " + data.idPersonal,
                tipo: "success"
            });
            limpiar();
            cargarPersonal();
        } else {
            mostrarAlerta({
                titulo: "Error",
                texto: 'Error al guardar el personal.',
                tipo: "error"
            });
        }
    })
    .catch(error => {
        console.error('Error al guardar personal:', error);
        mostrarAlerta({
            titulo: "Error",
            texto: 'Error al guardar el personal.',
            tipo: "error"
        });
    });
}

const limpiar = () => {
    inpNoTrabajador.value =  '';
    generarIdPersonal();
    inpNombre.value = '';
    inpApellidoP.value = '';
    inpApellidoM.value = '';
    inpPassword.value = '';
    inpPasswordConfirm.value = '';
    if (slcTiposRol.options.length > 0) {
        slcTiposRol.selectedIndex = 0;
    }
}

const buscarPersonal = () => {
    const searchTerm = inpSearch.value.trim();
    if (searchTerm === '') {
        cargarPersonal();
        return;
    }

    fetch(`https://backend-biblioteca-two.vercel.app/api/personal/${searchTerm}`)
    .then(response => response.json())
    .then(personal => {
        tblPersonal.innerHTML = '';
        if (personal.length === 0) {
            tblPersonal.innerHTML = "<tr><td colspan='6'>No se encontró personal con ese ID</td></tr>";
            return;
        }
        personal.forEach(p => {
            tblPersonal.innerHTML += `
                <tr>
                    <td>${p.Id_personal}</td>
                    <td>${p.Nombre}</td>
                    <td>${p.Apellido_P}</td>
                    <td>${p.Apellido_M}</td>
                    <td>${p.Tipo_rol}</td>
                    <td class="actions">
                        <a onclick="colocarDatos('${p.Id_personal}', '${p.Nombre}', '${p.Apellido_P}', '${p.Apellido_M}', '${p.Id_rol}', '${p.Id_trabajador}')" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                        <a onclick="eliminarPersonal('${p.Id_personal}')" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error('Error al buscar el personal bibliotecario:', error);
        mostrarAlerta({
            titulo: "Error",
            texto: 'Error al buscar el personal bibliotecario.',
            tipo: "error"
        });
    });
}

inpSearch.addEventListener('input', () => {
    buscarPersonal();
});

// MOSTRAR / OCULTAR CONTRASEÑA
togglePasswordBtn.addEventListener("click", () => {

    const esPassword = inpPassword.type === "password";

    inpPassword.type = esPassword ? "text" : "password";

    if (esPassword) {
        iconToggle.classList.remove("fa-eye-slash");
        iconToggle.classList.add("fa-eye");
    } else {
        iconToggle.classList.remove("fa-eye");
        iconToggle.classList.add("fa-eye-slash");
    }

});

togglePasswordConfirmBtn.addEventListener("click", () => {

    const esPasswordConfirm = inpPasswordConfirm.type === "password";
    inpPasswordConfirm.type = esPasswordConfirm ? "text" : "password";

    if (esPasswordConfirm) {
        iconToggleConfirm.classList.remove("fa-eye-slash");
        iconToggleConfirm.classList.add("fa-eye");
    } else {
        iconToggleConfirm.classList.remove("fa-eye");
        iconToggleConfirm.classList.add("fa-eye-slash");
    }
});

btnGuardar.addEventListener('click', () => {
    guardar();
});

const generarIdPersonal = () => {
    fetch('https://backend-biblioteca-two.vercel.app/api/personal/generar/id')
    .then(response => response.json())
    .then(idPersonal => {
        console.log('ID personal generado:', idPersonal);
        inpIdPersonal.value = idPersonal;
    })
    .catch(error => {
        console.error('Error al generar ID personal:', error);
    });
}

// ========== FUNCIONES PARA TIPOS DE ROL ==========

// NOTIFICACIÓN VERDE para roles
function mostrarNotificacionRoles(mensaje) {
    const alerta = document.getElementById("mensajeExitoRoles");
    if (!alerta) return;
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    alerta.classList.add("alert-success");
    alerta.classList.remove("alert-error");
    setTimeout(() => { alerta.style.display = "none"; }, 3000);
}

// NOTIFICACIÓN ROJA para roles
function mostrarNotificacionErrorRoles(mensaje) {
    const alerta = document.getElementById("mensajeExitoRoles");
    if (!alerta) return;
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

async function cargarRolesSelect() {
    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipo_rol"
    );
    const data = await res.json();

    // Actualiza el SELECT
    const select = document.getElementById("slcTiposRol");
    if (select) {
        const valorActual = select.value;
        select.innerHTML = '';
        data.forEach(rol => {
            select.innerHTML += `
                <option value="${rol.Id_rol}">${rol.Tipo_rol}</option>
            `;
        });
        if (valorActual) select.value = valorActual;
    }

    // Actualiza la LISTA del modal
    const contenedor = document.getElementById("listaRoles");
    if (contenedor) {
        contenedor.innerHTML = "";
        data.forEach(rol => {
            contenedor.innerHTML += `
            <div class="fila-item">
                <span class="item-text">${rol.Tipo_rol}</span>
                <div class="acciones">
                    <button onclick="editarRol('${rol.Id_rol}','${rol.Tipo_rol}')" class="icon-btn">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="eliminarRol('${rol.Id_rol}')" class="icon-btn delete">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>`;
        });
    }
}

// GUARDAR / EDITAR ROL
const formRol = document.getElementById("formRol");
if (formRol) {
    formRol.addEventListener("submit", async function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombreRol").value.trim();
        const id = document.getElementById("idRol").value;
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

        if (nombre === "") { alert("Escribe el nombre del rol"); return; }
        if (!regex.test(nombre)) { alert("Solo se permiten letras"); return; }

        let url = "https://backend-biblioteca-two.vercel.app/api/roles/agregar";
        if (id !== "") {
            url = "https://backend-biblioteca-two.vercel.app/api/roles/editar";
        }

        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id_rol: id, Nombre: nombre })
        });

        if (id !== "") {
            mostrarNotificacionRoles("Tipo de rol actualizado correctamente.");
        } else {
            mostrarNotificacionRoles("Tipo de rol agregado correctamente.");
        }

        limpiarFormularioRoles();
        cargarRolesSelect();
    });
}

// EDITAR ROL
function editarRol(id, nombre) {
    document.getElementById("idRol").value = id;
    document.getElementById("nombreRol").value = nombre;
    document.getElementById("tituloFormRol").textContent = "Editar tipo de rol";
}

// ELIMINAR ROL
async function eliminarRol(id) {
    confirmarAccion("¿Eliminar este tipo de rol?", async () => {
        const res = await fetch("https://backend-biblioteca-two.vercel.app/api/roles/eliminar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Id_rol: id })
        });
    
        const data = await res.json();
    
        if (!res.ok) {
            mostrarNotificacionErrorRoles(data.error);
            return;
        }
    
        mostrarNotificacionRoles("Tipo de rol eliminado correctamente.");
        cargarRolesSelect();
    });
}

// LIMPIAR FORMULARIO DE ROLES
function limpiarFormularioRoles() {
    const idRol = document.getElementById("idRol");
    const nombreRol = document.getElementById("nombreRol");
    const tituloFormRol = document.getElementById("tituloFormRol");
    if (idRol) idRol.value = "";
    if (nombreRol) nombreRol.value = "";
    if (tituloFormRol) tituloFormRol.textContent = "Agregar tipo de rol";
}

// CANCELAR ROL
const cancelarBtnRol = document.getElementById("cancelarBtnRol");
if (cancelarBtnRol) {
    cancelarBtnRol.addEventListener("click", limpiarFormularioRoles);
}

// CARGAR ROLES EN EL SELECT
async function cargarRolesSelect() {
    const res = await fetch(
        "https://backend-biblioteca-two.vercel.app/api/tipo_rol"
    );
    const data = await res.json();
    const select = document.getElementById("slcTiposRol");
    select.innerHTML = '';

    data.forEach(rol => {
        select.innerHTML += `
            <option value="${rol.Id_rol}">${rol.Tipo_rol}</option>
        `;
    });
}

cargarPersonal();
generarIdPersonal();
cargarRolesSelect();
