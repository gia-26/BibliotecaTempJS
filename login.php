<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso al Sistema - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
  <style>
    :root {
      --modal-bg: #e6d7c8;
      --texto-marron: #3b2423;
      --boton-marron: #3b2423;
      --sombra: rgba(59, 38, 35, 0.1);
    }

    .login-container {
      align-self: center;
      margin-top: 3rem;
      margin-bottom: 3rem;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px var(--sombra);
      width: 100%;
      max-width: 450px;
      overflow: hidden;
    }

    .login-header {
      background-color: var(--boton-marron);
      color: white;
      padding: 1.5rem;
      text-align: center;
    }

    .login-header h1 {
      font-size: 1.8rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
    }

    .login-header p {
      opacity: 0.9;
      font-size: 1rem;
    }

    .login-body {
      padding: 2rem;
    }

    .form-group {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--texto-marron);
    }

    .form-input {
      width: 100%;
      padding: 0.8rem 3rem 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--boton-marron);
    }

    .btn {
      display: inline-block;
      background-color: var(--boton-marron);
      color: #fff;
      padding: 0.8rem 1.5rem;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      width: 100%;
      font-size: 1rem;
    }

    .btn:hover {
      background-color: #2d1d1d;
      transform: translateY(-2px);
    }

    .session-select {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
      margin-bottom: 1.5rem;
      box-sizing: border-box;
    }

    /* ESTILOS PERFECTOS PARA EL TOGGLE PASSWORD */
    .password-wrapper {
      position: relative;
      display: block;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 1.1rem;
      color: #666;
      opacity: 0.7;
      transition: all 0.3s ease;
      background: none;
      border: none;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-password:hover {
      opacity: 1;
      color: #333;
    }

    /* Ocultar controles nativos de contraseña */
    input::-ms-reveal,
    input::-ms-clear {
      display: none !important;
    }

    input[type="password"]::-webkit-textfield-decoration-container,
    input[type="password"]::-webkit-clear-button {
      display: none !important;
    }

    @media (max-width: 480px) {
      body {
        padding: 1rem;
      }
      
      .login-body {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <?php include 'header.php'; ?>
  
  <div class="login-container">
    <div class="login-header">
      <h1>Inicio de sesión</h1>
    </div>
    
    <div class="login-body">
      <form id="loginForm" action="iniciar_sesion.php" method="POST">
        <div class="form-group">
          <label class="form-label">Sesión:</label>
          <select class="session-select" id="sesion" name="sesion">
            <option value="Miembro">Estudiante/Miembro de la UTHH</option>
            <option value="ROL001">Bibliotecario</option>
            <option value="ROL002">Coordinador/a bibliotecario</option>
            <option value="ROL003">Jefe de Departamento</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Usuario:</label>
          <input type="text" class="form-input" placeholder="Ingresa tu usuario" name="usuario" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Contraseña:</label>
          <div class="password-wrapper">
            <input type="password" class="form-input" placeholder="Ingresa tu contraseña" 
               name="password" id="password" 
               pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
               title="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
               required>
            <button type="button" class="toggle-password" id="togglePassword">
              <i class="fa-solid fa-eye-slash"></i>
            </button>
          </div>
        </div>
        
        <button type="submit" class="btn">
          <i class="fas fa-sign-in-alt"></i> Entrar
        </button>
      </form>
    </div>
  </div>
  <?php include 'footer.html'; ?>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const input = document.getElementById("password");
      const toggleButton = document.getElementById("togglePassword");
      const icon = toggleButton.querySelector('i');

      if (input && toggleButton) {
        toggleButton.addEventListener("click", function(e) {
          e.preventDefault();
          const isPassword = input.type === "password";
          input.type = isPassword ? "text" : "password";
          
          // Cambiar icono
          if (isPassword) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        });

        // Prevenir que el formulario se envíe al hacer clic en el botón
        toggleButton.addEventListener("mousedown", function(e) {
          e.preventDefault();
        });
      }
    });
  </script>
</body>
</html>