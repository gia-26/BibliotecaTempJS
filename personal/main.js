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
                        <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
                    </td>
                </tr>
            `;
        });
    })
}

const recuperarTipoRol = () => {
    fetch('https://backend-biblioteca-two.vercel.app/api/personal/tipos-roles')
    .then(response => response.json())
    .then(roles => {
        slcTiposRol.innerHTML = '';
        roles.forEach(rol => {
            slcTiposRol.innerHTML += `
                <option value="${rol.Id_rol}">${rol.Tipo_rol}</option>
            `;
        });
    })
}

const colocarDatos = (idPersonal, nombre, apellidoP, apellidoM, idRol, idTrabajador) => {
    inpNoTrabajador.value =  idTrabajador;
    inpIdPersonal.value = idPersonal;
    inpNombre.value = nombre;
    inpApellidoP.value = apellidoP;
    inpApellidoM.value = apellidoM;
    slcTiposRol.value = idRol;
    window.location.href = '#formPersonal';
}

btnEditar.addEventListener('click', () => {
    editar();
})

const editar = () => {
    const idPersonal = inpIdPersonal.value;
    const password = inpPassword.value;
    const passwordConfirm = inpPasswordConfirm.value;
    
    if (password !== passwordConfirm){
        alert('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
        return;
    }

    fetch('https://backend-biblioteca-two.vercel.app/api/personal/editar/password',{
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            Id_personal: idPersonal,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            alert(data.message);
            limpiar()
        } else {
            alert('Error al actualizar el personal bibliotecario.');
        }
        cargarPersonal();
    })
    .catch(error => {
        console.error('Error al actualizar el personal bibliotecario:', error);
        alert('Error al actualizar el personal bibliotecario.');
    });
}

const limpiar = () => {
    inpNoTrabajador.value =  '';
    inpIdPersonal.value = '';
    inpNombre.value = '';
    inpApellidoP.value = '';
    inpApellidoM.value = '';
    inpPassword.value = '';
    inpPasswordConfirm.value = '';
    slcTiposRol.selectedIndex = 0;
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
                        <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error('Error al buscar el personal bibliotecario:', error);
        alert('Error al buscar el personal bibliotecario.');
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

const guardar = () => {
    //Falta implementar la función para guardar un nuevo personal bibliotecario
}

cargarPersonal();
recuperarTipoRol();