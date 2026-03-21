const token = localStorage.getItem("token");
const idUsuario = localStorage.getItem("id");
const nombreUsuario = localStorage.getItem("nombre");
const rolUsuario = localStorage.getItem("rol");

// Redirigir si no hay sesión
if (!token) {
    window.location.href = "/BibliotecaTempJS/login/";
}

// Cargar datos en pantalla
document.getElementById("nombreUser").textContent = nombreUsuario || "Usuario";
document.getElementById("idUser").textContent = idUsuario || "----";
document.getElementById("categoriaUser").textContent = rolUsuario || "----";

const BASE_URL = "https://backend-biblioteca-two.vercel.app";

// CAMBIAR SECCIONES
document.querySelectorAll('.profile-menu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.profile-menu a').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(this.dataset.target).classList.add('active');
    });
});

// CARGAR TELÉFONO ACTUAL
fetch(`${BASE_URL}/perfil/${idUsuario}`, {
    headers: { "Authorization": `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
    if (data.telefono) {
        document.getElementById("telefono").value = data.telefono;
    }
})
.catch(err => console.error("Error al cargar perfil:", err));

// ACTUALIZAR TELÉFONO
document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const tel = document.getElementById("telefono").value.trim();

    if (!/^[0-9]{10}$/.test(tel)) {
        alert("El teléfono debe tener exactamente 10 números.");
        return;
    }

    fetch(`${BASE_URL}/perfil/telefono`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idUsuario, telefono: tel })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Teléfono actualizado correctamente.");
        } else {
            alert(data.message || "Error al actualizar teléfono.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Ocurrió un error al actualizar el teléfono.");
    });
});

// CAMBIAR CONTRASEÑA 
document.getElementById('password-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const actual = document.getElementById("current-password").value.trim();
    const nueva = document.getElementById("new-password").value.trim();
    const confirmar = document.getElementById("confirm-password").value.trim();

    if (!actual || !nueva || !confirmar) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (nueva.length < 8) {
        alert("La nueva contraseña debe tener mínimo 8 caracteres.");
        return;
    }

    if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    fetch(`${BASE_URL}/perfil/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ idUsuario, passwordActual: actual, passwordNueva: nueva })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Contraseña actualizada correctamente.");
            document.getElementById('password-form').reset();
        } else {
            alert(data.message || "Error al cambiar contraseña.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Ocurrió un error al cambiar la contraseña.");
    });
});

// MOSTRAR / OCULTAR CONTRASEÑA 
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const input = document.getElementById(this.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
});

// CANCELAR
document.getElementById("cancelarBtn").addEventListener("click", function () {
    document.getElementById('profile-form').reset();
});