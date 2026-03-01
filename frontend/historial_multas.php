<?php 
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!isset($_SESSION['idTipoUsuario'])) 
  {
    header("Location: login.php");
    exit();
  }
  require_once 'conexion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Historial de Multas - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
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

    nav a {
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
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
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

    .user-info-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--boton-marron);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    .user-details h3 {
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
    }

    .user-details p {
      color: var(--texto-marron);
      opacity: 0.7;
    }

    .resumen-multas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .resumen-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 5px 15px var(--sombra);
      text-align: center;
    }

    .resumen-card.pagadas {
      border-top: 4px solid var(--verde);
    }

    .resumen-card.pendientes {
      border-top: 4px solid var(--naranja);
    }

    .resumen-card.totales {
      border-top: 4px solid var(--boton-marron);
    }

    .resumen-number {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
    }

    .resumen-label {
      color: var(--texto-marron);
      opacity: 0.7;
      font-size: 0.9rem;
    }

    .multas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .multa-card {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 5px 15px var(--sombra);
      transition: all 0.3s ease;
    }

    .multa-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px var(--sombra);
    }

    .multa-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .multa-concepto {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .multa-monto {
      font-size: 1.3rem;
      font-weight: 500;
    }

    .multa-body {
      padding: 1.5rem;
    }

    .multa-info {
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid #f5f5f5;
    }

    .info-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .info-label {
      color: var(--texto-marron);
      opacity: 0.7;
    }

    .info-value {
      font-weight: 500;
    }

    .estado {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-align: center;
      width: 100%;
    }

    .pagada {
      background-color: #e8f5e8;
      color: var(--verde);
    }

    .pendiente {
      background-color: #fff3e0;
      color: var(--naranja);
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

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        padding: 1rem;
      }
      
      nav {
        margin-top: 1rem;
      }
      
      nav a {
        margin: 0 0.5rem;
      }
      
      .hero h2 {
        font-size: 1.8rem;
      }
      
      .user-info-card {
        flex-direction: column;
        text-align: center;
      }
      
      .multas-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Historial de Multas</h2>
    <p>Consulta el estado de tus multas y cargos en la biblioteca</p>
  </section>

  <?php include 'header-dashboard.php'; ?>

  <main>
    <div class="section-header">
      <h2>Mis Multas</h2>
      <p>Revisa el detalle de las multas aplicadas a tu cuenta</p>
    </div>

    <div class="user-info-card">
      <div class="user-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="user-details">
        <h3><?php echo $_SESSION['nombreUsuario']; ?></h3>
        <p><?php echo $_SESSION['carrera_o_tipo_trabajador']; ?></p>
      </div>
    </div>

    <?php 
      $sql = "SELECT
                SUM(mult.Monto) AS 'MontoTotal'
              FROM tbl_multas mult
              INNER JOIN tbl_prestamos prest ON mult.Id_prestamo = prest.Id_prestamo
              WHERE prest.Id_usuario = '$_SESSION[idUsuario]';";
      $result = $conexion->query($sql);
      $montoTotal = 0;
      if ($result && $row = $result->fetch_assoc()) {
          $montoTotal = $row['MontoTotal'];
      }
    ?>

    <div class="resumen-multas">
      <div class="resumen-card totales">
        <div class="resumen-number">$<?php echo number_format($montoTotal, 2); ?></div>
        <div class="resumen-label">Multas Totales</div>
      </div>
    </div>

    <div class="multas-grid">
      <?php 
        $sql = "SELECT
                  mult.Monto,
                  mult.Dias_excedidos,
                  prest.Fecha_devolucion_real,
                  prest.Fecha_devolucion,
                  libs.Titulo
                FROM tbl_multas mult
                INNER JOIN tbl_prestamos prest ON mult.Id_prestamo = prest.Id_prestamo
                INNER JOIN tbl_ejemplares ejem ON prest.Id_ejemplar = ejem.Id_ejemplar
                INNER JOIN tbl_libros libs ON ejem.Id_libro = libs.Id_libro
                WHERE prest.Id_usuario = '$_SESSION[idUsuario]';";
        $result = $conexion->query($sql);
        if ($result && $result->num_rows > 0) 
          {
            while ($row = $result->fetch_assoc()) 
              {
      ?>
                <div class="multa-card">
                  <div class="multa-header">
                    <div class="multa-concepto">Devolución Tardía</div>
                    <div class="multa-monto">$<?php echo number_format($row['Monto'], 2); ?></div>
                  </div>
                  <div class="multa-body">
                    <div class="multa-info">
                      <div class="info-item">
                        <span class="info-label">Libro:</span>
                        <span class="info-value"><?php echo $row['Titulo']; ?></span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Fecha de Devolución:</span>
                        <span class="info-value"><?php echo ($row['Fecha_devolucion_real'] == null) ? 'No se ha devuelto' : $row['Fecha_devolucion_real']; ?></span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Fecha Límite:</span>
                        <span class="info-value"><?php echo $row['Fecha_devolucion']; ?></span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">Días de Retraso:</span>
                        <span class="info-value"><?php echo $row['Dias_excedidos']; ?> días</span>
                      </div>
                    </div>
                  </div>
                </div>
      <?php
              }
          }
      ?>      
    </div>
  </main>

  <?php include 'footer.html'; ?>
</body>
</html>