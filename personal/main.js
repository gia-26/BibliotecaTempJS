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

const recuperarPersonal = () => {
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
        recuperarPersonal();
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

const guardar = () => {
    //Falta implementar la función para guardar un nuevo personal bibliotecario
}

recuperarPersonal();
recuperarTipoRol();