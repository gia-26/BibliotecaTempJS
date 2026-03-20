const tblUsuarios = document.getElementById('tblUsuarios');
const inpIdUsuario = document.getElementById('idUsuario');
const inpNombre = document.getElementById('nombre');
const inpApellidoP = document.getElementById('apellido-paterno');
const inpApellidoM = document.getElementById('apellido-materno');
const btnEditar = document.getElementById('btnEditar');
const btnGuardar = document.getElementById('btnGuardar');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('password-confirm');

const recuperarUsuarios = () => {
    fetch('https://backend-biblioteca-two.vercel.app/api/usuarios/todos')
    .then(response => response.json())
    .then(usuarios => {
        tblUsuarios.innerHTML = '';
        usuarios.forEach(usuario => {
            tblUsuarios.innerHTML += `
                <tr>
                    <td>${usuario.Id_usuario}</td>
                    <td>${usuario.Nombre}</td>
                    <td>${usuario.Apellido_P}</td>
                    <td>${usuario.Apellido_M}</td>
                    <td>${usuario.Tipo_usuario}</td>
                    <td class="actions">
                        <a onclick="editarUsuario('${usuario.Id_usuario}', '${usuario.Nombre}', '${usuario.Apellido_P}', '${usuario.Apellido_M}')" class="action-link action-edit" style="cursor: pointer;"><i class="fas fa-edit"></i> Editar</a>
                        <a href="#" class="action-link action-delete" style="cursor: pointer;"><i class="fas fa-trash"></i> Eliminar</a>
                    </td>
                </tr>
            `;
        })
    })
}

const editarUsuario = (id, nombre, apellidoP, apellidoM) => {
    inpIdUsuario.value = id;
    inpNombre.value = nombre;
    inpApellidoP.value = apellidoP;
    inpApellidoM.value = apellidoM;
    location.href = '#form-usuario';
}

btnEditar.addEventListener('click', () => {
    const idUsuario = inpIdUsuario.value;
    const passwordValue = password.value;
    const passwordConfirmValue = passwordConfirm.value;

    if (passwordValue !== passwordConfirmValue) {
        alert('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
        return;
    }

    fetch('https://backend-biblioteca-two.vercel.app/api/usuarios/editar/password', {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            Id_usuario: idUsuario,
            password: passwordValue
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            alert(data.message);
            inpIdUsuario.value = '';
            inpNombre.value = '';
            inpApellidoP.value = '';
            inpApellidoM.value = '';
            password.value = '';
            passwordConfirm.value = '';
        } else {
            alert('Error al actualizar el usuario.');
        }
        recuperarUsuarios();
    })
    .catch(error => {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario.');
    });
});

recuperarUsuarios();