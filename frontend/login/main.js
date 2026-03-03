// REFERENCIAS DEL DOM
const loginForm = document.getElementById("loginForm");
const slcSesion = document.getElementById("sesion");
const inputPassword = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");
const iconToggle = togglePasswordBtn.querySelector("i");

// EVENTO MOSTRAR / OCULTAR CONTRASEÑA
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

// EVENTO ENVÍO DE FORMULARIO
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const datosLogin = {
        sesion: slcSesion.value,
        usuario: loginForm.usuario.value,
        password: loginForm.password.value
    };

    console.log("Datos del login:", datosLogin);

});

//MENSAJE
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const datosLogin = {
        sesion: slcSesion.value,
        usuario: loginForm.usuario.value,
        password: loginForm.password.value
    };

    console.log("Datos del login:", datosLogin);

    alert("Login listo para conectarse al backend.");

});