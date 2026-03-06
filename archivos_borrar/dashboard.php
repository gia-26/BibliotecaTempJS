<?php 
  session_start(); 
  if (!isset($_SESSION['idTipoUsuario'])) 
  {
    header("Location: login.php");
    exit();
  }
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Administración - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
  <style>
    :root {
      --modal-bg: #e6d7c8;
      --texto-marron: #3b2423;
      --boton-marron: #3b2626;
      --sombra: rgba(59, 38, 35, 0.1);
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
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background-color: var(--boton-marron);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    header h1 {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 300;
      letter-spacing: 1px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-info i {
      font-size: 1.2rem;
    }

    .logout-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
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
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      flex-grow: 1;
      width: 100%;
    }

    .dashboard {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
      justify-items: center;
    }

    .dashboard-row {
      display: contents;
    }

    .dashboard-card {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
      text-align: center;
      transition: transform 0.3s;
      width: 100%;
      max-width: 300px;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
    }

    .dashboard-card i {
      font-size: 3rem;
      color: var(--boton-marron);
      margin-bottom: 1rem;
    }

    .dashboard-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--texto-marron);
    }

    .dashboard-card p {
      color: var(--texto-marron);
      opacity: 0.8;
      margin-bottom: 1.5rem;
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
      width: 100%;
    }

    .btn:hover {
      background-color: #2d1d1d;
      transform: translateY(-2px);
    }

    footer {
      background-color: var(--boton-marron);
      color: #fff;
      text-align: center;
      padding: 2rem 1rem;
      margin-top: auto;
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

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
      }
      
      .user-info {
        flex-direction: column;
        gap: 1rem;
      }
      
      .hero h2 {
        font-size: 1.5rem;
      }
      
      .dashboard {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .dashboard-card {
        max-width: 100%;
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .dashboard {
        grid-template-columns: repeat(2, 1fr);
      }
    }

  </style>
</head>
<body>
  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Panel de control</h2>
    <p></p>
  </section>

  <?php include 'header-dashboard.php'; ?>
  
  <main>
    <div class="dashboard">
      <?php
          $sesion = $_SESSION['idTipoUsuario'];

          switch ($sesion) 
          {
            case 'ROL003':
              echo '
                    <div class="dashboard-card">
                      <i class="fas fa-exchange-alt"></i>
                      <h3>Préstamos</h3>
                      <p>Gestionar los préstamos de libros</p>
                      <a href="./prestamos.php" class="btn">Ver préstamos</a>
                    </div>
                    
                    <div class="dashboard-card">
                      <i class="fas fa-undo-alt"></i>
                      <h3>Devoluciones</h3>
                      <p>Gestión de las devoluciones y multas</p>
                      <a href="./devoluciones.php" class="btn">Gestionar devoluciones</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-chart-bar"></i>
                      <h3>Reportes</h3>
                      <p>Genera reportes trimestrales</p>
                      <a href="./reportes.php" class="btn">Ver reportes</a>
                    </div>
                    
                    <!-- Segunda fila -->
                    <div class="dashboard-card">
                      <i class="fas fa-book"></i>
                      <h3>Libros</h3>
                      <p>Administra el inventario de libros</p>
                      <a href="./libros.php" class="btn">Gestionar Libros</a>
                    </div>
                    
                    <div class="dashboard-card">
                      <i class="fas fa-users"></i>
                      <h3>Personal</h3>
                      <p>Gestiona el personal de la biblioteca</p>
                      <a href="./personal.php" class="btn">Administrar Personal</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-info-circle"></i>
                      <h3>Información de la biblioteca</h3>
                      <p>Gestiona la información de la biblioteca (Misión, visión, objetivo y ¿quiénes somos?)</p>
                      <a href="./Informacion_biblioteca.php" class="btn">Administrar Información</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-user-circle"></i>
                      <h3>Perfil</h3>
                      <p>Visualiza y edita tu perfil</p>
                      <a href="./perfil.php" class="btn">Ver perfil</a>
                    </div>
                    ';
              break;
            case 'ROL002':
              echo '
                    <div class="dashboard-card">
                      <i class="fas fa-exchange-alt"></i>
                      <h3>Préstamos</h3>
                      <p>Gestionar los préstamos de libros</p>
                      <a href="./prestamos.php" class="btn">Ver préstamos</a>
                    </div>
                    
                    <div class="dashboard-card">
                      <i class="fas fa-undo-alt"></i>
                      <h3>Devoluciones</h3>
                      <p>Gestión de las devoluciones y multas</p>
                      <a href="./devoluciones.php" class="btn">Gestionar devoluciones</a>
                    </div>
                    
                    <div class="dashboard-card">
                      <i class="fas fa-book"></i>
                      <h3>Libros</h3>
                      <p>Administra el inventario de libros</p>
                      <a href="./libros.php" class="btn">Gestionar Libros</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-user-circle"></i>
                      <h3>Perfil</h3>
                      <p>Visualiza y edita tu perfil</p>
                      <a href="./perfil.php" class="btn">Ver perfil</a>
                    </div>
                    ';
              break;
            case 'ROL001':
              echo '
                    <div class="dashboard-card">
                      <i class="fas fa-exchange-alt"></i>
                      <h3>Préstamos</h3>
                      <p>Gestionar los préstamos de libros</p>
                      <a href="./prestamos.php" class="btn">Ver préstamos</a>
                    </div>
                    
                    <div class="dashboard-card">
                      <i class="fas fa-undo-alt"></i>
                      <h3>Devoluciones</h3>
                      <p>Gestión de las devoluciones y multas</p>
                      <a href="./devoluciones.php" class="btn">Gestionar devoluciones</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-user-circle"></i>
                      <h3>Perfil</h3>
                      <p>Visualiza y edita tu perfil</p>
                      <a href="./perfil.php" class="btn">Ver perfil</a>
                    </div>
                    ';
              break;
            case 'Miembro':
              echo '
                    <div class="dashboard-card">
                      <i class="fas fa-history"></i>
                      <h3>Historial de préstamos</h3>
                      <p>Visualiza el historial de préstamos de libros</p>
                      <a href="./historial_prestamos.php" class="btn">Ver préstamos</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-exclamation-triangle"></i>
                      <h3>Historial de multas</h3>
                      <p>Visualiza el historial de multas de libros</p>
                      <a href="./historial_multas.php" class="btn">Ver multas</a>
                    </div>

                    <div class="dashboard-card">
                      <i class="fas fa-user-circle"></i>
                      <h3>Perfil</h3>
                      <p>Visualiza y edita tu perfil</p>
                      <a href="./perfil.php" class="btn">Ver perfil</a>
                    </div>
                    ';
              break;
            default:
              break;
          }
      ?>
    </div>
  </main>

  <?php include 'footer.html'; ?>

</body>
</html>