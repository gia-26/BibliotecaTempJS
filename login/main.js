// REFERENCIAS DEL DOM
const btnEntrar = document.getElementById("btnEntrar");
const slcSesion = document.getElementById("sesion");
const inputPassword = document.getElementById("password");
const inpUsuario = document.getElementById("usuario");
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

btnEntrar.addEventListener("click", () => {
    iniciarSesion();
});

const iniciarSesion = () => {
    const sesionSeleccionada = slcSesion.value;
    const usuarioIngresado = inpUsuario.value;
    const passwordIngresada = inputPassword.value;
    
    if (!sesionSeleccionada || !usuarioIngresado || !passwordIngresada) {
        mostrarAlerta({
            titulo: "Error",
            texto: "Por favor, completa todos los campos.",
            tipo: "error"
        });
        return;
    }
    
    fetch("https://backend-biblioteca-two.vercel.app/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            sesion: sesionSeleccionada,
            idUsuario: usuarioIngresado,
            password: passwordIngresada
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.token) {
            localStorage.setItem("id", data.usuario.id);
            localStorage.setItem("nombre", data.usuario.nombre);
            localStorage.setItem("rol", data.usuario.rol);
            localStorage.setItem("token", data.token);
            mostrarAlerta({
                titulo: "Inicio de sesión exitoso",
                texto: "Bienvenido al sistema SisGPL",
                tipo: "success",
                redireccion: "/BibliotecaTempJS/dashboard/"
            });
        } else {
            console.log(data);
            mostrarAlerta({
                titulo: "Error",
                texto: data.message || data.error || "Credenciales incorrectas. Inténtalo de nuevo.",
                tipo: "error"
            });
        }
    })
    .catch(error => {
        console.error("Error:", error);
        mostrarAlerta({
            titulo: "Error",
            texto: "Ocurrió un error al intentar iniciar sesión.",
            tipo: "error"
        });
    });
}