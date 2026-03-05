// Datos simulados (antes venían de sesión PHP)
const usuario = {
    id: "0001",
    nombre: "Cristhian Hernandez",
    categoria: "Alumno",
    telefono: "7711234567"
};

// Cargar datos en pantalla
document.getElementById("nombreUser").textContent = usuario.nombre;
document.getElementById("idUser").textContent = usuario.id;
document.getElementById("categoriaUser").textContent = usuario.categoria;
document.getElementById("telefono").value = usuario.telefono;


// Cambiar secciones
document.querySelectorAll('.profile-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.profile-menu a').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(this.dataset.target).classList.add('active');
    });
});


// VALIDACIÓN TELÉFONO
document.getElementById('profile-form').addEventListener('submit', function(e){
    e.preventDefault();

    let tel = document.getElementById("telefono").value.trim();

    if (!/^[0-9]{10}$/.test(tel)) {
        alert("El teléfono debe tener exactamente 10 números.");
        return;
    }

    usuario.telefono = tel;
    alert("Teléfono actualizado correctamente.");
});


// VALIDACIÓN CONTRASEÑA
document.getElementById('password-form').addEventListener('submit', function(e){
    e.preventDefault();

    let nueva = document.getElementById("new-password").value.trim();
    let confirmar = document.getElementById("confirm-password").value.trim();

    if (nueva.length < 8) {
        alert("La contraseña debe tener mínimo 8 caracteres.");
        return;
    }

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    alert("Contraseña actualizada correctamente.");
});


// Mostrar / ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = document.getElementById(this.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
    });
});