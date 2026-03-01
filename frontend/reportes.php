<?php 
if (session_status() === PHP_SESSION_NONE) session_start();
if (!isset($_SESSION['idTipoUsuario'])) 
{
  header("Location: login.php");
  exit();
}
require_once 'conexion.php';

// Procesar solicitud de generación de PDF
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generar_pdf'])) {
    require_once('tcpdf/tcpdf.php');
    
    // Obtener parámetros del formulario
    $tipo_reporte = $_POST['tipo_reporte'];
    $fecha_inicio = $_POST['fecha_inicio'];
    $fecha_fin = $_POST['fecha_fin'];

    if (empty($tipo_reporte) || empty($fecha_inicio) || empty($fecha_fin)) {
        echo '<script>alert("Por favor, complete todos los campos del formulario."); window.location.href = "reportes.php";</script>';
        exit();
    }

    if (strtotime($fecha_inicio) > strtotime($fecha_fin)) {
        echo '<script>alert("La fecha de inicio no puede ser mayor que la fecha fin."); window.location.href = "reportes.php";</script>';
        exit();
    }
    
    // Crear nuevo PDF
    $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    
    // Configurar información del documento
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Biblioteca UTHH');
    $pdf->SetTitle('Reporte de ' . ucfirst($tipo_reporte));
    $pdf->SetSubject('Reporte del Sistema de Gestión de Préstamos de Libros para una Biblioteca Escolar');
    
    // Configurar márgenes
    $pdf->SetMargins(10, 25, 10);
    $pdf->SetHeaderMargin(10);
    $pdf->SetFooterMargin(10);
    
    // Configurar saltos de página automáticos
    $pdf->SetAutoPageBreak(TRUE, 15);
    
    // Agregar una página
    $pdf->AddPage();
    
    // Configurar fuente
    $pdf->SetFont('helvetica', '', 10);
    
    // Título del reporte
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->Cell(0, 10, 'Reporte de ' . ucfirst($tipo_reporte), 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 12);
    $pdf->Cell(0, 10, 'Del ' . $fecha_inicio . ' al ' . $fecha_fin, 0, 1, 'C');
    $pdf->Ln(10);
    
    // Obtener datos según el tipo de reporte
    if ($tipo_reporte === 'multas') {
        $sql = "CALL sp_reporte_multas('$fecha_inicio', '$fecha_fin');";
        $result = $conexion->query($sql);
        
        // Cabecera de la tabla - ANCHOS MÁS GRANDES Y ESPACIADOS
        $pdf->SetFont('helvetica', 'B', 9); // Fuente más pequeña para encabezados
        $header = array('Usuario', 'Apellido Paterno', 'Apellido Materno', 'Título del Libro', 'Fecha Devolución', 'Fecha Entrega', 'Días Excedidos', 'Monto');
        $widths = array(30, 35, 35, 60, 30, 30, 25, 25);
        
        // COLOR DE FONDO PARA ENCABEZADOS (gris claro)
        $pdf->SetFillColor(240, 240, 240);
        $pdf->SetTextColor(0, 0, 0); // Texto negro
        
        // Crear tabla con más espacio
        for($i = 0; $i < count($header); $i++) {
            $pdf->Cell($widths[$i], 10, $header[$i], 1, 0, 'C', 1); // Altura aumentada a 10 y fill=1
        }
        $pdf->Ln();
        
        // Restaurar color para datos
        $pdf->SetFillColor(255, 255, 255); // Fondo blanco para datos
        
        // Datos de la tabla
        $pdf->SetFont('helvetica', '', 8);
        $totalMultas = 0;
        while ($row = $result->fetch_assoc()) {
            $pdf->Cell($widths[0], 8, $row['Nombre'], 1, 0, 'L'); // Altura aumentada a 8
            $pdf->Cell($widths[1], 8, $row['Apellido_P'], 1, 0, 'L');
            $pdf->Cell($widths[2], 8, $row['Apellido_M'], 1, 0, 'L');
            $pdf->Cell($widths[3], 8, $row['Titulo'], 1, 0, 'L');
            $pdf->Cell($widths[4], 8, $row['Fecha_devolucion'], 1, 0, 'C');
            $pdf->Cell($widths[5], 8, $row['Fecha_devolucion_real'], 1, 0, 'C');
            $pdf->Cell($widths[6], 8, $row['Dias_excedidos'], 1, 0, 'C');
            $pdf->Cell($widths[7], 8, '$' . number_format($row['Monto'], 2), 1, 0, 'R');
            $pdf->Ln();
            $totalMultas += $row['Monto'];
        }
        
        // Total
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->SetFillColor(220, 220, 220); // Gris más oscuro para el total
        $pdf->Cell(array_sum($widths) - $widths[7], 10, 'TOTAL:', 1, 0, 'R', 1);
        $pdf->Cell($widths[7], 10, '$' . number_format($totalMultas, 2), 1, 1, 'R', 1);
        
    } else if ($tipo_reporte === 'prestamos') {
        // Consulta para reporte de préstamos
        $sql = "CALL sp_reporte_prestamos('$fecha_inicio', '$fecha_fin');";
        
        $result = $conexion->query($sql);
        
        // Cabecera de la tabla - ANCHOS MÁS GRANDES Y ESPACIADOS
        $pdf->SetFont('helvetica', 'B', 9); // Fuente más pequeña para encabezados
        $header = array('ID Usuario', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'ID Libro', 'Título', 'Fecha Préstamo', 'Fecha Devolución', 'Fecha Entrega');
        $widths = array(25, 25, 30, 30, 25, 55, 28, 28, 28);
        
        // COLOR DE FONDO PARA ENCABEZADOS (gris claro)
        $pdf->SetFillColor(240, 240, 240);
        $pdf->SetTextColor(0, 0, 0); // Texto negro
        
        // Crear tabla con más espacio
        for($i = 0; $i < count($header); $i++) {
            $pdf->Cell($widths[$i], 10, $header[$i], 1, 0, 'C', 1); // Altura aumentada a 10 y fill=1
        }
        $pdf->Ln();
        
        // Restaurar color para datos
        $pdf->SetFillColor(255, 255, 255); // Fondo blanco para datos
        
        // Datos de la tabla
        $pdf->SetFont('helvetica', '', 8);
        while ($row = $result->fetch_assoc()) {
            $pdf->Cell($widths[0], 8, $row['Id'], 1, 0, 'C'); // Altura aumentada a 8
            $pdf->Cell($widths[1], 8, $row['Nombre'], 1, 0, 'L');
            $pdf->Cell($widths[2], 8, $row['Apellido_P'], 1, 0, 'L');
            $pdf->Cell($widths[3], 8, $row['Apellido_M'], 1, 0, 'L');
            $pdf->Cell($widths[4], 8, $row['Id_libro'], 1, 0, 'C');
            $pdf->Cell($widths[5], 8, $row['Titulo'], 1, 0, 'L');
            $pdf->Cell($widths[6], 8, $row['Fecha_prestamo'], 1, 0, 'C');
            $pdf->Cell($widths[7], 8, $row['Fecha_devolucion'], 1, 0, 'C');
            $pdf->Cell($widths[8], 8, ($row['Fecha_devolucion_real']) ? $row['Fecha_devolucion_real'] : 'No entregado', 1, 0, 'C');
            $pdf->Ln();
        }
    }
    
    // Pie de página
    $pdf->SetY(-15);
    $pdf->SetFont('helvetica', 'I', 8);
    $pdf->Cell(0, 10, 'Página ' . $pdf->getAliasNumPage() . '/' . $pdf->getAliasNbPages(), 0, 0, 'C');
    
    // Generar y descargar PDF
    $pdf->Output('reporte_' . $tipo_reporte . '_' . date('Y-m-d') . '.pdf', 'D');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reportes - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* Tu CSS actual aquí (sin cambios) */
    :root {
      --modal-bg: #e6d7c8;
      --texto-marron: #3b2423;
      --boton-marron: #3b2423;
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

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      position: relative;
      padding: 0.5rem 0;
    }

    nav a:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #fff;
      transition: width 0.3s;
    }

    nav a:hover:after,
    nav a.active:after {
      width: 100%;
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

    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 150px;
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
      max-width: 1400px;
      margin: auto;
    }

    .filters-section {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--texto-marron);
    }

    .form-input, .form-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .filter-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
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

    .btn-secondary {
      background-color: #f5f5f5;
      color: var(--texto-marron);
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .btn-pdf {
      background-color: #d32f2f;
    }

    .btn-pdf:hover {
      background-color: #b71c1c;
    }

    .table-container {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 5px 15px var(--sombra);
      margin-bottom: 2rem;
      overflow-x: auto;
    }

    .catalog-table {
      width: 100%;
      border-collapse: collapse;
    }

    .catalog-table th {
      background-color: var(--boton-marron);
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 500;
    }

    .catalog-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .catalog-table tr:hover {
      background-color: #f9f5f0;
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--texto-marron);
      font-weight: 300;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 5px 15px var(--sombra);
      text-align: center;
    }

    .stat-card h3 {
      font-size: 0.9rem;
      color: var(--texto-marron);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--boton-marron);
      margin-bottom: 0.5rem;
    }

    .stat-description {
      font-size: 0.9rem;
      color: #666;
    }

    footer {
      background-color: var(--boton-marron);
      color: #fff;
      text-align: center;
      padding: 2rem 1rem;
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

    .report-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
      }
      
      nav {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .user-info {
        flex-direction: column;
        gap: 1rem;
      }
      
      .hero h2 {
        font-size: 1.5rem;
      }
      
      .filters-grid {
        grid-template-columns: 1fr;
      }
      
      .report-actions {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Reportes del sistema</h2>
  </section>

  <?php include 'header-dashboard.php'; ?>

  <?php 
    $sqlDashboard = "
    SELECT
        IFNULL((SELECT SUM(Monto) FROM tbl_multas),0) AS TotalMultas,
        (SELECT COUNT(*) FROM tbl_prestamos) AS TotalPrestamos,
        (SELECT COUNT(*) 
            FROM tbl_prestamos 
            WHERE Fecha_devolucion_real IS NULL) AS LibrosDevolver
    ";

    $result = $conexion->query($sqlDashboard);
    $dashboard = $result->fetch_assoc();
  ?>

  <main>
    <div class="stats-cards">
      <div class="stat-card">
        <h3>Monto Total Multas</h3>
        <div class="stat-value">$<?php echo number_format($dashboard['TotalMultas'], 2); ?></div>
        <div class="stat-description">Suma total de multas</div>
      </div>
      <div class="stat-card">
        <h3>Préstamos</h3>
        <div class="stat-value"><?php echo $dashboard['TotalPrestamos']; ?></div>
        <div class="stat-description">Libros prestados</div>
      </div>
      <div class="stat-card">
        <h3>Devoluciones Pendientes</h3>
        <div class="stat-value"><?php echo $dashboard['LibrosDevolver']; ?></div>
        <div class="stat-description">Libros por devolver</div>
      </div>
    </div>

    <div class="filters-section">
      <form action="reportes.php" method="POST">
          <div class="filters-grid">
            <div class="form-group">
              <label class="form-label">Tipo de Reporte</label>
              <select class="form-select" name="tipo_reporte" id="tipo_reporte" required>
                <option value="multas">Multas</option>
                <option value="prestamos">Préstamos</option>
              </select>
            </div>
            <div class="form-group">  
              <label class="form-label">Fecha Inicio</label>
              <input type="date" class="form-input" name="fecha_inicio" id="fecha_inicio" required>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha Fin</label>
              <input type="date" class="form-input" name="fecha_fin" id="fecha_fin" required>
            </div>
          </div>
          <div class="filter-actions">
            <a class="btn btn-secondary" href="reportes.php">
              <i class="fas fa-sync-alt"></i> Limpiar Filtros
            </a>
            <!--<button class="btn" type="submit">
              <i class="fas fa-file-alt"></i> Generar Reporte
            </button>-->
            <button class="btn btn-pdf" type="submit" name="generar_pdf" value="1">
              <i class="fas fa-file-pdf"></i> Generar PDF
            </button>
          </div>
        </form>
    </div>
    <?php
      if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['generar_pdf']) && $_GET['option'] != 'reset') 
      { 
        if ($_POST['tipo_reporte'] === 'multas') {
    ?>
        <div class="report-actions">
          <form action="reportes.php" method="POST" style="display: inline;">
            <input type="hidden" name="tipo_reporte" value="prestamos">
            <input type="hidden" name="fecha_inicio" value="<?php echo $_POST['fecha_inicio']; ?>">
            <input type="hidden" name="fecha_fin" value="<?php echo $_POST['fecha_fin']; ?>">
            <button class="btn btn-pdf" type="submit" name="generar_pdf" value="1">
              <i class="fas fa-file-pdf"></i> Descargar PDF
            </button>
          </form>
        </div>

        <h3 class="section-title">Reporte de Multas</h3>
        
        <div class="table-container">
          <table class="catalog-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Apellido paterno</th>
                <th>Apellido materno</th>
                <th>Título del libro</th>
                <th>Fecha de devolución</th>
                <th>Fecha de entrega</th>
                <th>Días excedidos</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <?php 
                $fecha_inicio = $_POST['fecha_inicio'];
                $fecha_fin = $_POST['fecha_fin'];
                $sql = "SELECT
                          alu.Nombre,
                          alu.Apellido_P,
                          alu.Apellido_M,
                          lib.Titulo,
                          p.Fecha_devolucion,
                          p.Fecha_devolucion_real,
                          m.Dias_excedidos,
                          m.Monto
                        FROM tbl_multas m
                        INNER JOIN tbl_prestamos p ON m.Id_prestamo = p.Id_prestamo
                        INNER JOIN tbl_ejemplares ej ON p.Id_ejemplar = ej.Id_ejemplar
                        INNER JOIN tbl_libros lib ON ej.Id_libro = lib.Id_libro
                        INNER JOIN tbl_alumnos alu ON p.Id_usuario = alu.Id_alumno
                        WHERE p.Fecha_prestamo BETWEEN '$fecha_inicio' AND '$fecha_fin'

                        UNION ALL

                        SELECT
                          trab.Nombre,
                          trab.Apellido_P,
                          trab.Apellido_M,
                          lib.Titulo,
                          p.Fecha_devolucion,
                          p.Fecha_devolucion_real,
                          m.Dias_excedidos,
                          m.Monto
                        FROM tbl_multas m
                        INNER JOIN tbl_prestamos p ON m.Id_prestamo = p.Id_prestamo
                        INNER JOIN tbl_ejemplares ej ON p.Id_ejemplar = ej.Id_ejemplar
                        INNER JOIN tbl_libros lib ON ej.Id_libro = lib.Id_libro
                        INNER JOIN tbl_trabajadores trab ON p.Id_usuario = trab.Id_trabajador
                        WHERE p.Fecha_prestamo BETWEEN '$fecha_inicio' AND '$fecha_fin';
                        ";
                $result = $conexion->query($sql);
                while ($row = $result->fetch_assoc()) 
                  {
              ?>
                    <tr>
                      <td><?php echo $row['Nombre']; ?></td>
                      <td><?php echo $row['Apellido_P']; ?></td>
                      <td><?php echo $row['Apellido_M']; ?></td>
                      <td><?php echo $row['Titulo']; ?></td>
                      <td><?php echo $row['Fecha_devolucion']; ?></td>
                      <td><?php echo $row['Fecha_devolucion_real']; ?></td>
                      <td><?php echo $row['Dias_excedidos']; ?></td>
                      <td>$<?php echo number_format($row['Monto'], 2); ?></td>
                    </tr>
              <?php
                  }
              ?>
            </tbody>
          </table>
        </div>
    <?php
        } else if ($_POST['tipo_reporte'] === 'prestamos') {
    ?>
        <div class="report-actions">
          <form action="reportes.php" method="POST" style="display: inline;">
            <input type="hidden" name="tipo_reporte" value="prestamos">
            <input type="hidden" name="fecha_inicio" value="<?php echo $_POST['fecha_inicio']; ?>">
            <input type="hidden" name="fecha_fin" value="<?php echo $_POST['fecha_fin']; ?>">
            <button class="btn btn-pdf" type="submit" name="generar_pdf" value="1">
              <i class="fas fa-file-pdf"></i> Descargar PDF
            </button>
          </form>
        </div>

        <h3 class="section-title">Reporte de Préstamos Realizados</h3>
        <div class="table-container">
          <table class="catalog-table">
            <thead>
              <tr>
                <th>Id del usuario</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Id del libro</th>
                <th>Título</th>
                <th>Fecha de préstamo</th>
                <th>Fecha de devolución</th>
                <th>Fecha de entrega</th>
              </tr>
            </thead>
            <tbody>
              <?php
                $fecha_inicio = $_POST['fecha_inicio'];
                $fecha_fin = $_POST['fecha_fin'];
                $sql = "SELECT
                          alu.Id_alumno AS 'Id',
                          alu.Nombre,
                          alu.Apellido_P,
                          alu.Apellido_M,
                          lib.Id_libro,
                          lib.Titulo,
                          p.Fecha_prestamo,
                          p.Fecha_devolucion,
                          p.Fecha_devolucion_real
                        FROM tbl_prestamos p 
                        INNER JOIN tbl_ejemplares ej ON p.Id_ejemplar = ej.Id_ejemplar
                        INNER JOIN tbl_libros lib ON ej.Id_libro = lib.Id_libro
                        INNER JOIN tbl_alumnos alu ON p.Id_usuario = alu.Id_alumno
                        WHERE p.Fecha_prestamo BETWEEN '$fecha_inicio' AND '$fecha_fin'
                        UNION ALL
                        SELECT
                          trab.Id_trabajador AS 'Id',
                          trab.Nombre,
                          trab.Apellido_P,
                          trab.Apellido_M,
                          lib.Id_libro,
                          lib.Titulo,
                          p.Fecha_prestamo,
                          p.Fecha_devolucion,
                          p.Fecha_devolucion_real
                        FROM tbl_prestamos p 
                        INNER JOIN tbl_ejemplares ej ON p.Id_ejemplar = ej.Id_ejemplar
                        INNER JOIN tbl_libros lib ON ej.Id_libro = lib.Id_libro
                        INNER JOIN tbl_trabajadores trab ON p.Id_usuario = trab.Id_trabajador
                        WHERE p.Fecha_prestamo BETWEEN '$fecha_inicio' AND '$fecha_fin';";
                $result = $conexion->query($sql);
                while ($row = $result->fetch_assoc())
                  {
              ?>
                    <tr>
                      <td><?php echo $row['Id']; ?></td>
                      <td><?php echo $row['Nombre']; ?></td>
                      <td><?php echo $row['Apellido_P']; ?></td>
                      <td><?php echo $row['Apellido_M']; ?></td>
                      <td><?php echo $row['Id_libro']; ?></td>
                      <td><?php echo $row['Titulo']; ?></td>
                      <td><?php echo $row['Fecha_prestamo']; ?></td>
                      <td><?php echo $row['Fecha_devolucion']; ?></td>
                      <td><?php echo ($row['Fecha_devolucion_real']) ? $row['Fecha_devolucion_real'] : 'No entregado'; ?></td>
                    </tr>
              <?php
                  }
              ?>
            </tbody>
          </table>
        </div>
    <?php
        }
      }
      $conexion->close();
    ?>
  </main>
  <?php include 'footer.html'; ?>

</body>
</html>