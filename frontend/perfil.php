<?php
session_start();
// Asegúrate de que 'conexion.php' contiene la lógica para establecer la conexión $conexion
include 'conexion.php'; 


if (!isset($_SESSION['idUsuario'])) {
    header("Location: login.php");
    exit();
}

// Variables de sesión
$idUsuario   = $_SESSION['idUsuario'];
$idTipo      = $_SESSION['idTipoUsuario'];
$nombreUser  = $_SESSION['nombreUsuario'];
$tipoUser    = $_SESSION['tipoUsuario'];   // Administrador, Bibliotecario o Miembro
$categoria   = $_SESSION['carrera_o_tipo_trabajador'];
$telefono = ""; // Inicializar la variable de teléfono


if ($tipoUser === "Miembro") {
    // Miembros pueden ser Alumnos o Trabajadores
    
    // 1. Buscamos en alumnos
    $sql = "SELECT Telefono FROM tbl_alumnos WHERE Id_alumno = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        $telefono = $res->fetch_assoc()['Telefono'];
    } else {
        // 2. Si no es alumno, buscamos en trabajadores
        $sql = "SELECT Telefono FROM tbl_trabajadores WHERE Id_trabajador = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $res = $stmt->get_result();

        $telefono = ($res->num_rows > 0) ? $res->fetch_assoc()['Telefono'] : "";
    }

} else {
    // Personal interno (Administrador o Bibliotecario, que son trabajadores)
    $sql = "SELECT Telefono FROM tbl_trabajadores WHERE Id_trabajador = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $res = $stmt->get_result();
    $telefono = ($res->num_rows > 0) ? $res->fetch_assoc()['Telefono'] : "";
}

// Cerrar la conexión si se usa PDO o si se requiere al final del script
// Aquí se asume que la conexión se cerrará al final del script o que 'conexion.php' lo maneja.

?>


<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mi Perfil - Biblioteca UTHH</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
/* --- Mantener todo tu CSS original sin cambios --- */
:root {
      --modal-bg: #e6d7c8;
      --texto-marron: #3b2423;
      --boton-marron: #3b2626;
      --sombra: rgba(59, 38, 35, 0.1);
      --verde: #2e7d32;
      --rojo: #c62828;
      --naranja: #ef6c00;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background-color: var(--modal-bg);
      color: var(--texto-marron);
      line-height: 1.6;
    }

    /*nav a {
      color: #fff;
      margin-left: 2rem;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      position: relative;
    }

    nav a:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 0;
      background-color: #fff;
      transition: width 0.3s;
    }

    nav a:hover:after {
      width: 100%;
    }*/

    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      background: linear-gradient(rgba(59, 38, 35, 0.7), rgba(59, 38, 35, 0.7)),
                      url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80');
      background-size: cover;
      background-position: center;
      text-align: center;
      color: white;
      padding: 0 2rem;
    }

    .hero h2 {
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 1rem;
    }

    main {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    footer {
      background-color: var(--boton-marron);
      color: #fff;
      text-align: center;
      padding: 2.5rem 1rem;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      text-align: left;
    }

    .footer-section h3 {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .footer-section p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.8rem;
      display: block;
    }

    .copyright {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .user-info i {
      font-size: 1.2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
    }

    .account-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-header h2 {
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
    }

    .section-header h2:after {
      content: '';
      position: absolute;
      width: 50%;
      height: 2px;
      background-color: var(--boton-marron);
      bottom: -10px;
      left: 25%;
    }

    .section-header p {
      color: var(--texto-marron);
      opacity: 0.8;
      max-width: 600px;
      margin: 1rem auto 0;
    }

    .profile-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }

    .profile-sidebar {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
      height: fit-content;
    }

    .profile-avatar {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .avatar-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: var(--boton-marron);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      margin: 0 auto 1rem;
    }

    .profile-name {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 0.3rem;
    }

    .profile-id {
      color: var(--texto-marron);
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .profile-menu {
      list-style: none;
      margin-top: 2rem;
    }

    .profile-menu li {
      margin-bottom: 0.5rem;
    }

    .profile-menu a {
      display: block;
      padding: 0.8rem 1rem;
      text-decoration: none;
      color: var(--texto-marron);
      border-radius: 4px;
      transition: all 0.3s;
    }

    .profile-menu a:hover, .profile-menu a.active {
      background-color: rgba(59, 38, 35, 0.1);
      color: var(--boton-marron);
    }

    .profile-menu a i {
      margin-right: 0.5rem;
      width: 20px;
      text-align: center;
    }

    .profile-content {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .content-section {
      display: none;
    }

    .content-section.active {
      display: block;
    }

    .content-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .content-header h3 {
      font-size: 1.5rem;
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border 0.3s;
    }

    .form-control:focus {
      border-color: var(--boton-marron);
      outline: none;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .btn {
      display: inline-block;
      background-color: var(--boton-marron);
      color: #fff;
      padding: 0.7rem 1.5rem;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }

    .btn:hover {
      background-color: #2d1d1d;
      transform: translateY(-2px);
    }

    .btn-outline {
      background-color: transparent;
      border: 1px solid var(--boton-marron);
      color: var(--boton-marron);
    }

    .btn-outline:hover {
      background-color: rgba(59, 38, 35, 0.1);
    }


  .password-container {
      position: relative;
  }

  .password-container i {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #999;
  }

  .password-container {
    position: relative;
}

  .password-container input {
      width: 100%;
      padding-right: 40px; /* espacio para el ojo */
  }

  .password-container i {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #999;
      font-size: 1rem;
      transition: color 0.2s;
  }

  .password-container i:hover {
      color: var(--boton-marron);
  }

  .password-container i:hover {
      color: var(--boton-marron);
  }

  /* Contenedor de input con ojo */
  .password-container {
      display: flex;
      align-items: center;
      position: relative;
  }

  .password-container input {
      flex: 1;
      padding-right: 40px; /* espacio para el icono */
      height: 42px; /* altura consistente */
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
  }

  .password-container i {
      position: absolute;
      right: 10px;
      cursor: pointer;
      color: #999;
      font-size: 1rem;
      top: 50%;
      transform: translateY(-50%);
      transition: color 0.2s;
  }

  .password-container i:hover {
      color: var(--boton-marron);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr; /* solo una columna */
    gap: 1rem;
}
@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr; 
  }
}
</style>
</head>
<body>
<?php include 'header.php'; ?>

<section class="hero">
    <h2>Mi Perfil</h2>
    <p>Gestiona tu información personal y preferencias</p>
</section>

<?php include 'header-dashboard.php'; ?>

<main>
<div class="section-header">
    <h2>Configuración de Cuenta</h2>
    <p>Actualiza tu información personal y configura tus preferencias</p>
</div>

<div class="profile-container">
    <div class="profile-sidebar">
        <div class="profile-avatar">
            <div class="avatar-img"><i class="fas fa-user"></i></div>
            <div class="profile-name"><?php echo htmlspecialchars($nombreUser); ?></div>
            <div class="profile-id">ID: <?php echo htmlspecialchars($idUsuario); ?></div>
            <div class="profile-id"><?php echo htmlspecialchars($categoria); ?></div>
        </div>

        <ul class="profile-menu">
            <li><a href="#" class="active" data-target="informacion"><i class="fas fa-user-edit"></i> Información Personal</a></li>
            <li><a href="#" data-target="seguridad"><i class="fas fa-shield-alt"></i> Seguridad</a></li>
        </ul>
    </div>

    <div class="profile-content">

        <div id="informacion" class="content-section active">
            <div class="content-header"><h3>Información Personal</h3></div>

            <form id="profile-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" name="telefono" class="form-control" value="<?php echo htmlspecialchars($telefono); ?>">
                    </div>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button type="submit" class="btn">Guardar Cambios</button>
                    <button type="button" class="btn btn-outline">Cancelar</button>
                </div>
            </form>
        </div>

        <div id="seguridad" class="content-section">
            <div class="content-header"><h3>Seguridad</h3></div>

            <form id="password-form">
                <div class="form-group">
                    <label for="current-password">Contraseña Actual</label>
                    <div class="password-container">
                        <input type="password" id="current-password" class="form-control" name="actual">
                        <i class="fas fa-eye toggle-password" data-target="current-password"></i>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="new-password">Nueva Contraseña</label>
                        <div class="password-container">
                            <input type="password" id="new-password" class="form-control" name="nueva">
                            <i class="fas fa-eye toggle-password" data-target="new-password"></i>
                        </div>
                    </div>
                

                    <div class="form-group">
                        <label for="confirm-password">Confirmar Nueva Contraseña</label>
                        <div class="password-container">
                            <input type="password" id="confirm-password" class="form-control" name="confirmar">
                            <i class="fas fa-eye toggle-password" data-target="confirm-password"></i>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 1rem;">
                    <button type="submit" class="btn">Cambiar Contraseña</button>
                </div>
            </form>

        </div>

    </div>
</div>
</main>

<script>
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

// ================================
// VALIDACIÓN TELÉFONO (JS)
// ================================
document.getElementById('profile-form').addEventListener('submit', function(e){
    e.preventDefault();

    let tel = document.getElementById("telefono").value.trim();

    if (tel === "") {
        alert("⚠ El número de teléfono no puede estar vacío.");
        return;
    }

    if (!/^[0-9]+$/.test(tel)) {
        alert("⚠ El teléfono solo debe contener números.\nEjemplo válido: 7711234567");
        return;
    }

    if (tel.length !== 10) {
        alert("⚠ El teléfono debe tener exactamente 10 dígitos.\nEjemplo válido: 7711234567");
        return;
    }

    // Uso de FormData para enviar datos (más moderno, aunque tu forma con URLSearchParams también funciona)
    const formData = new FormData();
    formData.append("accion", "telefono");
    formData.append("telefono", tel);

    fetch("update_profile.php", {
        method: "POST",
        body: new URLSearchParams(formData) // Envía como application/x-www-form-urlencoded
    })
    .then(r => r.text())
    .then(d => alert(d));
});

// ================================
// VALIDACIÓN CONTRASEÑAS (JS)
// ================================
document.getElementById('password-form').addEventListener('submit', function(e){
    e.preventDefault();

    let actual = document.getElementById("current-password").value.trim();
    let nueva = document.getElementById("new-password").value.trim();
    let confirmar = document.getElementById("confirm-password").value.trim();

    // Validar vacío
    if (actual === "" || nueva === "" || confirmar === "") {
        alert("⚠ Debes llenar todos los campos de contraseña.");
        return;
    }

    // Longitud
    if (nueva.length < 8 || nueva.length > 25) {
        alert("⚠ La nueva contraseña debe tener entre 8 y 25 caracteres.");
        return;
    }

    // Validaciones con RegEx
    if (!/[A-Z]/.test(nueva)) {
        alert("⚠ La contraseña debe incluir al menos UNA mayúscula.\nEjemplo: Biblioteca#2024");
        return;
    }

    if (!/[0-9]/.test(nueva)) {
        alert("⚠ La contraseña debe incluir al menos UN número.\nEjemplo: LibroSeguridad1!");
        return;
    }

    if (!/[!@#$%^&*(),.?\":{}|<>_\-]/.test(nueva)) {
        alert("⚠ La contraseña debe incluir al menos UN carácter especial.\nEjemplos válidos: !  @  #  $  %  &");
        return;
    }

    if (nueva !== confirmar) {
        alert("⚠ Las contraseñas no coinciden.");
        return;
    }

    // Preparar datos para el envío
    const data = new URLSearchParams();
    data.append("accion", "password");
    data.append("actual", actual);
    data.append("nueva", nueva);
    data.append("confirmar", confirmar);

    fetch("update_profile.php", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: data
    })
    .then(r => r.text())
    .then(d => alert(d));
    
    limpiarCamposPassword()
});

// Mostrar / ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = document.getElementById(this.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = "password";
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
    
    
});
function limpiarCamposPassword() {
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
}

</script>


<?php include 'footer.html'; ?>
</body>
</html>