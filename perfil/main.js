const token = localStorage.getItem("token");
const idUsuario = localStorage.getItem("id");
const nombreUsuario = localStorage.getItem("nombre");
const rolUsuario = localStorage.getItem("rol");

if (!token) {
    window.location.href = "/BibliotecaTempJS/login/";
}

document.getElementById("nombreUser").textContent = nombreUsuario || "Usuario";
document.getElementById("idUser").textContent = idUsuario || "----";
document.getElementById("categoriaUser").textContent = rolUsuario || "----";

const BASE_URL = "https://backend-biblioteca-two.vercel.app/api";

document.querySelectorAll('.profile-menu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.profile-menu a').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(this.dataset.target).classList.add('active');
    });
});

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

document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const tel = document.getElementById("telefono").value.trim();

    if (!/^[0-9]{10}$/.test(tel)) {
        mostrarAlerta({
            titulo: "Error",
            texto: "El teléfono debe tener exactamente 10 números.",
            tipo: "error"
        });
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
            mostrarAlerta({
                titulo: "Éxito",
                texto: "Teléfono actualizado correctamente.",
                tipo: "success"
            });
        } else {
            mostrarAlerta({
                titulo: "Error",
                texto: data.message || "Error al actualizar teléfono.",
                tipo: "error"
            });
        }
    })
    .catch(err => {
        console.error(err);
        mostrarAlerta({
            titulo: "Error",
            texto: "Ocurrió un error al actualizar el teléfono.",
            tipo: "error"
        });
    });
});

document.getElementById('password-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const actual = document.getElementById("current-password").value.trim();
    const nueva = document.getElementById("new-password").value.trim();
    const confirmar = document.getElementById("confirm-password").value.trim();

    if (!actual || !nueva || !confirmar) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Por favor, completa todos los campos.",
            tipo: "error"
        });
        return;
    }

    if (nueva.length < 8) {
        mostrarAlerta({
            titulo: "Error",
            texto: "La nueva contraseña debe tener mínimo 8 caracteres.",
            tipo: "error"
        });
        return;
    }

    if (nueva !== confirmar) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Las contraseñas no coinciden.",
            tipo: "error"
        });
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
            mostrarAlerta({
                titulo: "Éxito",
                texto: "Contraseña actualizada correctamente.",
                tipo: "success"
            });
            document.getElementById('password-form').reset();
        } else {
            mostrarAlerta({
                titulo: "Error",
                texto: data.message || "Error al cambiar contraseña.",
                tipo: "error"
            });
        }
    })
    .catch(err => {
        console.error(err);
        mostrarAlerta({
            titulo: "Error",
            texto: "Ocurrió un error al cambiar la contraseña.",
            tipo: "error"
        });
    });
});

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const input = document.getElementById(this.dataset.target);
        input.type = input.type === "password" ? "text" : "password";
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
});

document.getElementById("cancelarBtn").addEventListener("click", function () {
    document.getElementById('profile-form').reset();
});