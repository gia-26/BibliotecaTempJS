// REFERENCIAS DEL DOM
const loginForm = document.getElementById("loginForm");
const slcSesion = document.getElementById("sesion");
const inputPassword = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");
const iconToggle = togglePasswordBtn.querySelector("i");

// MOSTRAR / OCULTAR CONTRASEÑA
togglePasswordBtn.addEventListener("click", () => {

    const esPassword = inputPassword.type === "password";

    inputPassword.type = esPassword ? "text" : "password";

    if (esPassword) {
        iconToggle.classList.remove("fa-eye-slash");
        iconToggle.classList.add("fa-eye");
    } else {
        iconToggle.classList.remove("fa-eye");
        iconToggle.classList.add("fa-eye-slash");
    }

});

// ENVÍO DEL FORMULARIO
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const datosLogin = {
        sesion: slcSesion.value,
        usuario: loginForm.usuario.value,
        password: loginForm.password.value
    };

    console.log("Datos enviados:", datosLogin);

    fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosLogin)
    })
    .then(response => response.json())
    .then(result => {

        console.log("Respuesta del servidor:", result);

        if (result.success) {

            alert(result.mensaje);

            // Guardar datos en localStorage si quieres
            localStorage.setItem("usuario", result.usuario);
            localStorage.setItem("rol", result.rol);

            // Redireccionar según rol
            redirigirSegunRol(result.rol);

        } else {
            alert(result.mensaje);
        }

    })
    .catch(error => {
        console.error("Error en login:", error);
        alert("Error al conectar con el servidor.");
    });

});

// FUNCIÓN PARA REDIRIGIR SEGÚN ROL
function redirigirSegunRol(rol) {

    switch (rol) {

        case "ROL001":
            window.location.href = "../dashboard_bibliotecario/index.html";
            break;

        case "ROL002":
            window.location.href = "../dashboard_coordinador/index.html";
            break;

        case "ROL003":
            window.location.href = "../dashboard_jefe/index.html";
            break;

        case "Miembro":
            window.location.href = "../catalogo/index.html";
            break;

        default:
            window.location.href = "../index.html";
            break;
    }
}