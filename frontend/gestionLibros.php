<?php
  require_once 'conexion.php';

  function obtenerSubgenerosComoArray($id_libro) {
    global $conexion; // Usamos la conexión global

    $subgeneros = [];
    
    $sql = "SELECT g.Id_genero, g.Nombre
            FROM tbl_libros_generos sg 
            INNER JOIN tbl_generos g ON g.Id_genero = sg.Id_genero
            WHERE sg.Id_libro = '$id_libro'";
    
    $result = $conexion->query($sql);
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $subgeneros[] = [
                "idGenero" => $row['Id_genero'], 
                "nombre" => $row['Nombre']
            ];
        }
    }
    
    return json_encode($subgeneros);
  }

  function obtenerCoautoresComoArray($id_libro) {
    global $conexion; // Usamos la conexión global

    $coautores = [];
    
    $sql = "SELECT a.Id_autor, a.Nombre
            FROM tbl_coautores c 
            INNER JOIN tbl_autores a ON a.Id_autor = c.Id_autor
            WHERE c.Id_libro = '$id_libro'";
    
    $result = $conexion->query($sql);
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $coautores[] = [
                "idAutor" => $row['Id_autor'], 
                "nombre" => $row['Nombre']
            ];
        }
    }
    
    return json_encode($coautores);
  }

  function obtenerEditorialesComoArray($id_libro) {
    global $conexion; // Usamos la conexión global

    $editoriales = [];
    
    $sql = "SELECT
              e.Id_editorial, e.Nombre
            FROM tbl_libros_editoriales le 
            INNER JOIN tbl_editoriales e ON le.Id_editorial = e.Id_editorial
            WHERE le.Id_libro = '$id_libro'";
    
    $result = $conexion->query($sql);
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $editoriales[] = [
                "idEditorial" => $row['Id_editorial'], 
                "nombre" => $row['Nombre']
            ];
        }
    }
    
    return json_encode($editoriales);
  }
?> 
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Libros - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
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
      /* Propiedad zoom inicial */
      zoom: 100%;
    }

    /* ===== CONTROLES DE ZOOM ===== */
    .zoom-controls {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      padding: 8px;
      gap: 8px;
    }

    .zoom-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: var(--boton-marron);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .zoom-btn:hover {
      background: #2d1d1d;
      transform: scale(1.1);
    }

    .zoom-display {
      font-size: 14px;
      font-weight: 600;
      color: var(--texto-marron);
      min-width: 50px;
      text-align: center;
    }

    .zoom-reset {
      background: #6c757d;
    }

    .zoom-reset:hover {
      background: #5a6268;
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

    .search-section {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .search-box {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .search-input {
      flex-grow: 1;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .filter-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
      min-width: 150px;
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

    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    .btn-outline {
      min-width: 100px;
      background-color: transparent;
      border: 1px solid var(--boton-marron);
      color: var(--boton-marron);
    }

    .btn-outline:hover {
      background-color: var(--boton-marron);
      color: white;
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

    .form-section {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
      margin-bottom: 2rem;
    }

    .book-form .form-select {
        min-width: 250px;
        width: 100%;
    }

    .book-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group-full {
      grid-column: 1 / -1;
    }

    .form-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--texto-marron);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .config-btn {
      background: none;
      border: none;
      color: var(--boton-marron);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      padding: 0.2rem;
      border-radius: 4px;
    }

    .config-btn:hover {
      background-color: var(--modal-bg);
      transform: scale(1.1);
    }

    .form-input, .form-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: var(--texto-marron);
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    .btn-danger {
      background-color: #d9534f;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c9302c;
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

    /* ===== Estilos para los modales ===== */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      animation: modalFadeIn 0.3s;
    }

    /* IFRAME donde se carga index.php */
    .modal-iframe {
      width: 100%;
      height: 80vh;
      border: none;
      border-radius: 8px;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      background-color: var(--boton-marron);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      font-weight: 500;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .config-list {
      margin-bottom: 1.5rem;
    }

    .config-list h4 {
      margin-bottom: 0.8rem;
      color: var(--texto-marron);
      font-weight: 500;
    }

    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      border-bottom: 1px solid #eee;
    }

    .config-item:last-child {
      border-bottom: none;
    }

    .config-item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .config-item-actions button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--boton-marron);
      font-size: 0.9rem;
      padding: 0.3rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .config-item-actions button:hover {
      background-color: var(--modal-bg);
    }

    .add-item-form {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .add-item-form input {
      flex-grow: 1;
      padding: 0.7rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    /* Estilos para las etiquetas */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
      min-height: 40px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      background-color: var(--boton-marron);
      color: white;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      font-size: 0.85rem;
      gap: 0.5rem;
    }

    .tag-remove {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
    }

    .tag-remove:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .add-tag-form {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .add-tag-form input {
      flex-grow: 1;
    }

    .empty-state {
      color: #888;
      font-style: italic;
      padding: 0.5rem;
    }

    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .image-preview {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      min-height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
    }

    .image-preview img {
      max-width: 100%;
      max-height: 200px;
      border-radius: 4px;
    }

    .no-image {
      color: #888;
      font-style: italic;
    }

    .form-text {
      color: #666;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .form-input[type="file"] {
      padding: 0.5rem;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--texto-marron);
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.3s;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn:hover {
        background-color: rgba(59, 38, 35, 0.1);
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
      
      .search-box {
        flex-direction: column;
        align-items: stretch;
      }
      
      .book-form {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        margin: 1rem;
      }
    }

    .invalid-field {
        border-color: #d9534f !important;
        box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.15) !important;
        background-color: #fdf7f7;
    }

    .valid-field {
        border-color: #5cb85c !important;
    }

    .required-field::after {
        content: " *";
        color: #d9534f;
        font-weight: bold;
    }

    .help-text {
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.25rem;
        display: block;
        font-style: italic;
    }

    .error-message {
        color: #d9534f;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: none;
    }
  </style>
</head>
<body>
  <?php 
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $idLibro = $_GET['id'] ?? '';
        $sql = "SELECT
                    l.Id_libro,
                    l.Sinopsis,
                    l.Imagen,
                    l.Titulo,
                    l.Edicion,
                    ae.N_estante,
                    l.ISBN,
                    ae.Area_conocimiento,
                    l.Id_area_conocimiento,
                    ad.Anio_edicion,
                    l.Id_anio_edicion,
                    g.Nombre AS 'Genero',
                    l.Id_genero,
                    a.Nombre AS 'Autor',
                    l.Id_autor,
                    ed.Nombre AS 'Editorial',
                    l.Id_editorial,
                    COUNT(e.Id_ejemplar) AS 'NoEjemplares'
                FROM tbl_libros l
                LEFT JOIN tbl_ejemplares e ON l.Id_libro = e.Id_libro
                INNER JOIN tbl_areas_conocimiento ae ON ae.Id_area_conocimiento = l.Id_area_conocimiento
                INNER JOIN tbl_anios_edicion ad ON ad.Id_anio_edicion = l.Id_anio_edicion
                INNER JOIN tbl_generos g ON g.Id_genero = l.Id_genero
                INNER JOIN tbl_autores a ON a.Id_autor = l.Id_autor
                INNER JOIN tbl_editoriales ed ON ed.Id_editorial = l.Id_editorial
                WHERE l.Id_libro = '$idLibro' AND l.Estado != 0;
        ";
        $resultado = $conexion->query($sql);
        $libro = $resultado->fetch_assoc();
    }
  ?>
  <main>    
    <div class="form-section" style="position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 class="section-title" style="margin: 0;"><?php echo isset($libro['Id_libro']) ?  'Editar Libro' : 'Agregar Nuevo Libro'; ?></h3>
            <button type="button" class="close-btn" onclick="window.parent.closeModal('modalLibros')" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--texto-marron); padding: 0.5rem; border-radius: 4px; transition: background-color 0.3s;">
            <i class="fas fa-times"></i>
            </button>
        </div>
      <form class="book-form" action="procesar_libro.php" method="post" enctype="multipart/form-data">
        
        <input type="hidden" class="form-input" name="id_libro" value="<?php echo isset($libro['Id_libro']) ? $libro['Id_libro'] : ''; ?>">
        
        <!-- CAMPO TÍTULO -->
        <div class="form-group">
            <label class="form-label required-field">Título</label>
            <input type="text" 
                class="form-input" 
                name="titulo" 
                placeholder="Ingresa título del libro"
                pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,;:¡!¿?\-_()]{5,100}"
                title="Mínimo 5 caracteres, máximo 100. Solo letras, números, espacios y signos de puntuación básicos (.,;:¡!¿?-_()). No se permiten símbolos como @#$%&*/+="
                value="<?php echo isset($libro['Titulo']) ? $libro['Titulo'] : ''; ?>" 
                required
                minlength="5"
                maxlength="100"
                oninput="validarTitulo(this)">
            <small class="help-text">Mínimo 5 caracteres, máximo 100. Solo letras, números, espacios y signos de puntuación básicos.</small>
            <div id="tituloError" class="error-message"></div>
        </div>

        <!-- CAMPO ISBN -->
        <div class="form-group">
            <label class="form-label required-field">ISBN</label>
            <input type="text" 
                class="form-input" 
                name="isbn" 
                placeholder="Ej: 978-0-306-40615-7"
                pattern="(978|979)[\- ]?[0-9]{1,5}[\- ]?[0-9]{1,7}[\- ]?[0-9]{1,6}[\- ]?[0-9X]" 
                title="Formato: 978/979 seguido de números. Ejemplo: 978-0306406157"
                value="<?php echo isset($libro['ISBN']) ? $libro['ISBN'] : ''; ?>" 
                <?php echo isset($libro['ISBN']) ? 'readonly' : ''; ?> 
                required
                oninput="validarISBN(this)">
            <small class="help-text">Formato: 978/979 seguido de números. Ejemplo: 978-0306406157</small>
            <div id="isbnError" class="error-message"></div>
        </div>

        <!-- CAMPO EDICIÓN -->
        <div class="form-group">
            <label class="form-label required-field">Edición</label>
            <input type="text" 
                class="form-input" 
                name="edicion" 
                placeholder="Ej: 1ra, 2da, 3ra edición" 
                value="<?php echo isset($libro['Edicion']) ? $libro['Edicion'] : ''; ?>" 
                required
                minlength="2"
                maxlength="20"
                oninput="validarEdicion(this)">
            <small class="help-text">Ejemplo: 1ra, 2da, 3ra edición (mínimo 2 caracteres)</small>
            <div id="edicionError" class="error-message"></div>
        </div>

        <!-- CAMPO AÑO DE EDICIÓN -->
        <div class="form-group">
            <label class="form-label required-field">
                Año de edición:
                <button type="button" class="config-btn" title="Configurar años de edición" onclick="openModal('modalAnios')">
                <i class="fas fa-cog"></i>
                </button>
            </label>
            <select class="form-select" name="id_anio_edicion" required onchange="validarSelect(this, 'anio')">
                <option value="">Selecciona un año</option>
                <?php 
                $anioSeleccionado = isset($libro['Anio_edicion']) ? $libro['Anio_edicion'] : '';

                $sql = "SELECT Id_anio_edicion, Anio_edicion FROM tbl_anios_edicion ORDER BY Anio_edicion DESC";
                $resultadoAnios = $conexion->query($sql);
                while ($anio = $resultadoAnios->fetch_assoc()) {
                    $selected = ($anio['Anio_edicion'] == $anioSeleccionado) ? 'selected' : '';
                    echo "<option value='{$anio['Id_anio_edicion']}' $selected>{$anio['Anio_edicion']}</option>";
                }
                ?>
            </select>
            <small class="help-text">Selecciona el año de publicación del libro</small>
            <div id="anioError" class="error-message"></div>
        </div>

        <!-- CAMPO ÁREA DE CONOCIMIENTO -->
        <div class="form-group">
            <label class="form-label required-field">
                Área de conocimiento:
                <button type="button" class="config-btn" title="Configurar áreas de conocimiento" onclick="openModal('modalAreas')">
                <i class="fas fa-cog"></i>
                </button>
            </label>
            <select class="form-select" name="id_area_conocimiento" required onchange="validarSelect(this, 'area')">
                <option value="">Selecciona un área</option>
                <?php 
                $areaSeleccionada = isset($libro['Area_conocimiento']) ? $libro['Area_conocimiento'] : '';

                $sql = "SELECT Id_area_conocimiento, Area_conocimiento FROM tbl_areas_conocimiento ORDER BY Area_conocimiento";
                $resultadoAreas = $conexion->query($sql);
                while ($area = $resultadoAreas->fetch_assoc()) {
                    $selected = ($area['Area_conocimiento'] == $areaSeleccionada) ? 'selected' : '';
                    echo "<option value='{$area['Id_area_conocimiento']}' $selected>{$area['Area_conocimiento']}</option>";
                }
                ?>
            </select>
            <small class="help-text">Selecciona el área de conocimiento principal del libro</small>
            <div id="areaError" class="error-message"></div>
        </div>

        <!-- CAMPO GÉNERO PRINCIPAL -->
        <div class="form-group">
            <label class="form-label required-field">
                Género principal:
                <button type="button" class="config-btn" title="Configurar géneros principales" onclick="openModal('modalGeneros')">
                <i class="fas fa-cog"></i>
                </button>
            </label>
            <select class="form-select" name="id_genero" required onchange="validarSelect(this, 'genero')">
                <option value="">Selecciona un género</option>
                <?php 
                $generoSeleccionado = isset($libro['Genero']) ? $libro['Genero'] : '';

                $sql = "SELECT Id_genero, Nombre FROM tbl_generos ORDER BY Nombre";
                $resultadoGeneros = $conexion->query($sql);
                while ($genero = $resultadoGeneros->fetch_assoc()) {
                    $selected = ($genero['Nombre'] == $generoSeleccionado) ? 'selected' : '';
                    echo "<option value='{$genero['Id_genero']}' $selected>{$genero['Nombre']}</option>";
                }
                ?>
            </select>
            <small class="help-text">Selecciona el género principal del libro</small>
            <div id="generoError" class="error-message"></div>
        </div>

        <!-- SUBGÉNEROS (OPCIONAL) -->
        <div class="form-group">
            <label class="form-label">Subgéneros</label>
            <div class="add-tag-form">
                <select class="form-select" id="selectSubgeneros">
                <option value="">Selecciona un género</option>
                <?php 
                    $sql = "SELECT Id_genero, Nombre FROM tbl_generos ORDER BY Nombre";
                    $resultadoGeneros = $conexion->query($sql);
                    while ($genero = $resultadoGeneros->fetch_assoc()) {
                    echo "<option value='{$genero['Id_genero']}'>{$genero['Nombre']}</option>";
                    }
                ?>
                </select>
                <button type="button" class="btn btn-small btn-outline" onclick="window.agregarTag('subgeneros')">
                <i class="fas fa-plus"></i> Agregar
                </button>
            </div>
            <div class="tags-container" id="subgenerosContainer">
                <?php
                if (isset($libro['Id_libro'])) {
                $sqlSubgeneros = "SELECT g.Id_genero, g.Nombre FROM tbl_libros_generos sg 
                                    INNER JOIN tbl_generos g ON g.Id_genero = sg.Id_genero  
                                    WHERE sg.Id_libro = '{$libro['Id_libro']}'";
                $resultSubgeneros = $conexion->query($sqlSubgeneros);
                if ($resultSubgeneros && $resultSubgeneros->num_rows > 0) {
                    while ($subgenero = $resultSubgeneros->fetch_assoc()) {
                    echo "<div class='tag' data-id='{$subgenero['Id_genero']}'>
                            {$subgenero['Nombre']}
                            <button type='button' class='tag-remove' onclick=\"window.remover(this, 'subgeneros')\">×</button>
                            </div>";
                    }
                }
                }
                ?>
            </div>
            <input type="hidden" name="subgeneros" id="subgenerosInput">
            <small class="help-text">Opcional: Agrega géneros secundarios del libro</small>
        </div>

        <!-- CAMPO AUTOR PRINCIPAL -->
        <div class="form-group">
            <label class="form-label required-field">
                Autor principal:
                <button type="button" class="config-btn" title="Configurar autores principales" onclick="openModal('modalAutores')">
                <i class="fas fa-cog"></i>
                </button>
            </label>
            <select class="form-select" name="id_autor" required onchange="validarSelect(this, 'autor')">
                <option value="">Selecciona un autor</option>
                <?php 
                $autorSeleccionado = isset($libro['Autor']) ? $libro['Autor'] : '';

                $sql = "SELECT Id_autor, Nombre FROM tbl_autores ORDER BY Nombre";
                $resultadoAutores = $conexion->query($sql);
                while ($autor = $resultadoAutores->fetch_assoc()) {
                    $selected = ($autor['Nombre'] == $autorSeleccionado) ? 'selected' : '';
                    echo "<option value='{$autor['Id_autor']}' $selected>{$autor['Nombre']}</option>";
                }
                ?>
            </select>
            <small class="help-text">Selecciona el autor principal del libro</small>
            <div id="autorError" class="error-message"></div>
        </div>

        <!-- COAUTORES (OPCIONAL) -->
        <div class="form-group">
            <label class="form-label">Coautores</label>
            <div class="add-tag-form">
                <select class="form-select" id="selectCoautores">
                <option value="">Selecciona un autor</option>
                <?php 
                    $sql = "SELECT Id_autor, Nombre FROM tbl_autores ORDER BY Nombre";
                    $resultadoAutores = $conexion->query($sql);
                    while ($autor = $resultadoAutores->fetch_assoc()) {
                    echo "<option value='{$autor['Id_autor']}'>{$autor['Nombre']}</option>";
                    }
                ?>
                </select>
                <button type="button" class="btn btn-small btn-outline" onclick="window.agregarTag('coautores')">
                <i class="fas fa-plus"></i> Agregar
                </button>
            </div>
            <div class="tags-container" id="coautoresContainer">
                <?php
                if (isset($libro['Id_libro'])) {
                $sqlCoautores = "SELECT a.Id_autor, a.Nombre 
                                FROM tbl_coautores c
                                INNER JOIN tbl_autores a ON a.Id_autor = c.Id_autor  
                                WHERE c.Id_libro = '{$libro['Id_libro']}'";
                $resultCoautores = $conexion->query($sqlCoautores);
                if ($resultCoautores && $resultCoautores->num_rows > 0) {
                    while ($coautor = $resultCoautores->fetch_assoc()) {
                    echo "<div class='tag' data-id='{$coautor['Id_autor']}'>
                            {$coautor['Nombre']}
                            <button type='button' class='tag-remove' onclick=\"window.remover(this, 'coautores')\">×</button>
                            </div>";
                    }
                }
                }
                ?>
            </div>
            <input type="hidden" name="coautores" id="coautoresInput">
            <small class="help-text">Opcional: Agrega coautores del libro</small>
        </div>

        <!-- CAMPO EDITORIAL PRINCIPAL -->
        <div class="form-group">
            <label class="form-label required-field">
                Editorial principal:
                <button type="button" class="config-btn" title="Configurar editoriales principales" onclick="openModal('modalEditoriales')">
                <i class="fas fa-cog"></i>
                </button>
            </label>
            <select class="form-select" name="id_editorial" required onchange="validarSelect(this, 'editorial')">
                <option value="">Selecciona una editorial</option>
                <?php 
                $editorialSeleccionada = isset($libro['Editorial']) ? $libro['Editorial'] : '';

                $sql = "SELECT Id_editorial, Nombre FROM tbl_editoriales ORDER BY Nombre";
                $resultadoEditoriales = $conexion->query($sql);
                while ($editorial = $resultadoEditoriales->fetch_assoc()) {
                    $selected = ($editorial['Nombre'] == $editorialSeleccionada) ? 'selected' : '';
                    echo "<option value='{$editorial['Id_editorial']}' $selected>{$editorial['Nombre']}</option>";
                }
                ?>
            </select>
            <small class="help-text">Selecciona la editorial principal del libro</small>
            <div id="editorialError" class="error-message"></div>
        </div>

        <!-- EDITORIALES SECUNDARIAS (OPCIONAL) -->
        <div class="form-group">
            <label class="form-label">Editoriales secundarias</label>
            <div class="add-tag-form">
                <select class="form-select" id="selectEditoriales">
                <option value="">Selecciona una editorial</option>
                <?php 
                    $sql = "SELECT Id_editorial, Nombre FROM tbl_editoriales ORDER BY Nombre";
                    $resultadoEditoriales = $conexion->query($sql);
                    while ($editorial = $resultadoEditoriales->fetch_assoc()) {
                    echo "<option value='{$editorial['Id_editorial']}'>{$editorial['Nombre']}</option>";
                    }
                ?>
                </select>
                <button type="button" class="btn btn-small btn-outline" onclick="window.agregarTag('editoriales')">
                <i class="fas fa-plus"></i> Agregar
                </button>
            </div>
            <div class="tags-container" id="editorialesContainer">
                <?php
                if (isset($libro['Id_libro'])) {
                $sqlEditoriales = "SELECT
                                    e.Id_editorial, e.Nombre
                                FROM tbl_libros_editoriales le 
                                INNER JOIN tbl_editoriales e ON le.Id_editorial = e.Id_editorial
                                WHERE le.Id_libro = '{$libro['Id_libro']}'";
                $resultEditoriales = $conexion->query($sqlEditoriales);
                if ($resultEditoriales && $resultEditoriales->num_rows > 0) {
                    while ($editorial = $resultEditoriales->fetch_assoc()) {
                    echo "<div class='tag' data-id='{$editorial['Id_editorial']}'>
                            {$editorial['Nombre']}
                            <button type='button' class='tag-remove' onclick=\"window.remover(this, 'editoriales')\">×</button>
                            </div>";
                    }
                }
                }
                ?>
            </div>
            <input type="hidden" name="editoriales" id="editorialesInput">
            <small class="help-text">Opcional: Agrega editoriales secundarias del libro</small>
        </div>

        <!-- CAMPO SINOPSIS -->
        <div class="form-group">
            <label class="form-label required-field">Sinopsis</label>
            <textarea class="form-input" 
                name="sinopsis" 
                rows="4" 
                placeholder="Escribe la sinopsis aquí..." 
                required
                minlength="50"
                maxlength="2000"
                oninput="validarSinopsis(this)"><?php echo isset($libro['Sinopsis']) ? $libro['Sinopsis'] : ''; ?></textarea>
            <small class="help-text">Mínimo 50 caracteres, máximo 2000. Describe el contenido del libro.</small>
            <div id="sinopsisError" class="error-message"></div>
        </div>

        <!-- CAMPO NÚMERO DE EJEMPLARES -->
        <div class="form-group">
            <label class="form-label required-field">Número de ejemplares</label>
            <?php 
                $numEjemplares = isset($libro['NoEjemplares']) ? $libro['NoEjemplares'] : 1;
            ?>
            <input type="number" 
                name="no_ejemplares" 
                class="form-input" 
                value="<?php echo $numEjemplares; ?>" 
                min="1" 
                max="100" 
                required
                oninput="validarEjemplares(this)">
            <small class="help-text">Número de copias físicas disponibles (1-100)</small>
            <div id="ejemplaresError" class="error-message"></div>
        </div>

        <!-- CAMPO IMAGEN -->
        <div class="form-group">
            <label class="form-label <?php if (!isset($libro['Id_libro'])) echo 'required-field'; ?>">
                Imagen del libro
                <?php if (!isset($libro['Id_libro'])): ?>
                <span style="color: #d9534f; font-size: 0.8rem;">(Obligatorio para nuevos libros)</span>
                <?php endif; ?>
            </label>
            <div class="image-upload-container">
                <div class="image-preview" id="imagePreview">
                <?php if (isset($libro['Imagen']) && !empty($libro['Imagen'])): ?>
                    <div style="text-align: center;">
                    <img src="https://biblioteca.grupoctic.com/libros_img/<?php echo $libro['Imagen']; ?>" 
                        alt="Portada del libro" 
                        style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                    <div style="margin-top: 8px; font-size: 12px; color: #666;">
                        Imagen actual
                    </div>
                    </div>
                <?php else: ?>
                    <div class="no-image" style="text-align: center; padding: 20px;">
                    <i class="fas fa-image" style="font-size: 48px; color: #ddd; margin-bottom: 10px;"></i>
                    <div>
                        <?php echo isset($libro['Id_libro']) ? 'No hay imagen seleccionada' : 'Imagen requerida para nuevo libro'; ?>
                    </div>
                    <?php if (!isset($libro['Id_libro'])): ?>
                        <small style="color: #d9534f; display: block; margin-top: 5px;">
                        <i class="fas fa-exclamation-triangle"></i> Obligatorio
                        </small>
                    <?php endif; ?>
                    </div>
                <?php endif; ?>
                </div>
                
                <input type="file" 
                class="form-input" 
                id="imagenInput" 
                name="imagen" 
                accept="image/jpeg, image/jpg, image/png" 
                onchange="previewImage(this); validarImagen(this)"
                <?php if (!isset($libro['Id_libro'])) echo 'required'; ?>>
                
                <small class="help-text">
                Formatos: JPG, JPEG, PNG. Tamaño máximo: 2MB
                <?php if (!isset($libro['Id_libro'])): ?>
                    <span style="color: #d9534f;">• Obligatorio para nuevos libros</span>
                <?php endif; ?>
                </small>
                <div id="imagenError" class="error-message"></div>
                
                <input type="hidden" name="imagen_nombre" id="imagenNombre" 
                    value="<?php echo isset($libro['Imagen']) ? $libro['Imagen'] : ''; ?>">
                <input type="hidden" name="imagen_anterior" 
                    value="<?php echo isset($libro['Imagen']) ? $libro['Imagen'] : ''; ?>">
            </div>
        </div>
        
        <div class="form-actions">
            <?php 
                if (isset($libro['Id_libro']))
                    echo '<button type="submit" name="accion" value="editar" class="btn btn-secondary">Editar</button>';
                else
                    echo '<button type="submit" name="accion" value="guardar" class="btn">Guardar</button>';
            ?>
        </div>
      </form>
    </div>
  </main>

  <!--  Modal para Años de Edición  -->
  <div id="modalAnios" class="modal">
    <div class="modal-content" style="background: transparent; box-shadow: none; padding: 0;">
      <!-- Cargamos anio_edicion.php completo  -->
      <iframe src="anio_edicion.php" class="modal-iframe"></iframe>
    </div>
  </div>

  <!-- Modal para Áreas de Conocimiento -->
  <div id="modalAreas" class="modal">
    <div class="modal-content" style="background: transparent; box-shadow: none; padding: 0;">
      <iframe src="area_conocimiento.php" class="modal-iframe"></iframe>
    </div>
  </div>

  <!-- Modal para Géneros Principales -->
  <div id="modalGeneros" class="modal">
    <div class="modal-content" style="background: transparent; box-shadow: none; padding: 0;">
      <iframe src="generos.php" class="modal-iframe"></iframe>
    </div>
  </div>

  <!-- Modal para Autores Principales -->
  <div id="modalAutores" class="modal">
    <div class="modal-content" style="background: transparent; box-shadow: none; padding: 0;">
      <iframe src="autores.php" class="modal-iframe"></iframe>
    </div>
  </div>

  <!-- Modal para Editoriales Principales -->
  <div id="modalEditoriales" class="modal">
    <div class="modal-content" style="background: transparent; box-shadow: none; padding: 0;">
      <iframe src="editoriales.php" class="modal-iframe"></iframe>
    </div>
  </div>

  <script>
    // Inicializar las variables globales primero
    window.subgeneros = <?php echo isset($libro['Id_libro']) ? obtenerSubgenerosComoArray($libro['Id_libro']) : '[]'; ?>;
    window.coautores = <?php echo isset($libro['Id_libro']) ? obtenerCoautoresComoArray($libro['Id_libro']) : '[]'; ?>;
    window.editoriales = <?php echo isset($libro['Id_libro']) ? obtenerEditorialesComoArray($libro['Id_libro']) : '[]'; ?>;

    // ========== FUNCIONES DE VALIDACIÓN ==========

    // Función para validar título en tiempo real
    function validarTitulo(input) {
        const errorDiv = document.getElementById('tituloError');
        const valor = input.value;
        
        // Limpiar mensajes previos
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        input.classList.remove('invalid-field', 'valid-field');
        
        // Si está vacío, dejar que la validación required se encargue
        if (valor.length === 0) {
            return true;
        }
        
        // Validar longitud
        if (valor.length < 5) {
            errorDiv.textContent = 'El título debe tener al menos 5 caracteres';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        if (valor.length > 100) {
            errorDiv.textContent = 'El título no puede tener más de 100 caracteres';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        // Validar caracteres permitidos
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,;:¡!¿?\-_()]*$/;
        if (!regex.test(valor)) {
            errorDiv.textContent = 'No se permiten símbolos como @#$%&*/+=. Solo letras, números, espacios y signos de puntuación básicos.';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        // Si pasa todas las validaciones
        input.classList.add('valid-field');
        return true;
    }

    // Función para validar ISBN
    function validarISBN(input) {
        const errorDiv = document.getElementById('isbnError');
        const valor = input.value;
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        input.classList.remove('invalid-field', 'valid-field');
        
        if (valor.length === 0) {
            return true;
        }
        
        const regex = /^(978|979)[\- ]?[0-9]{1,5}[\- ]?[0-9]{1,7}[\- ]?[0-9]{1,6}[\- ]?[0-9X]$/;
        if (!regex.test(valor)) {
            errorDiv.textContent = 'Formato inválido. Debe empezar con 978 o 979 seguido de números. Ejemplo: 978-0-306-40615-7';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        input.classList.add('valid-field');
        return true;
    }

    // Función para validar edición
    function validarEdicion(input) {
        const errorDiv = document.getElementById('edicionError');
        const valor = input.value;
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        input.classList.remove('invalid-field', 'valid-field');
        
        if (valor.length === 0) {
            return true;
        }
        
        if (valor.length < 2) {
            errorDiv.textContent = 'La edición debe tener al menos 2 caracteres';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        if (valor.length > 20) {
            errorDiv.textContent = 'La edición no puede tener más de 20 caracteres';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        input.classList.add('valid-field');
        return true;
    }

    // Función para validar selects
    function validarSelect(select, tipo) {
        const errorDiv = document.getElementById(tipo + 'Error');
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        select.classList.remove('invalid-field', 'valid-field');
        
        if (!select.value) {
            errorDiv.textContent = 'Este campo es obligatorio';
            errorDiv.style.display = 'block';
            select.classList.add('invalid-field');
            return false;
        }
        
        select.classList.add('valid-field');
        return true;
    }

    // Función para validar sinopsis
    function validarSinopsis(textarea) {
        const errorDiv = document.getElementById('sinopsisError');
        const valor = textarea.value;
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        textarea.classList.remove('invalid-field', 'valid-field');
        
        if (valor.length === 0) {
            return true;
        }
        
        if (valor.length < 50) {
            errorDiv.textContent = 'La sinopsis debe tener al menos 50 caracteres';
            errorDiv.style.display = 'block';
            textarea.classList.add('invalid-field');
            return false;
        }
        
        if (valor.length > 2000) {
            errorDiv.textContent = 'La sinopsis no puede tener más de 2000 caracteres';
            errorDiv.style.display = 'block';
            textarea.classList.add('invalid-field');
            return false;
        }
        
        textarea.classList.add('valid-field');
        return true;
    }

    // Función para validar número de ejemplares
    function validarEjemplares(input) {
        const errorDiv = document.getElementById('ejemplaresError');
        const valor = parseInt(input.value);
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        input.classList.remove('invalid-field', 'valid-field');
        
        if (isNaN(valor)) {
            return true;
        }
        
        if (valor < 1) {
            errorDiv.textContent = 'El número de ejemplares debe ser al menos 1';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        if (valor > 100) {
            errorDiv.textContent = 'El número de ejemplares no puede ser mayor a 100';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        input.classList.add('valid-field');
        return true;
    }

    // Función para validar imagen
    function validarImagen(input) {
        const errorDiv = document.getElementById('imagenError');
        
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        input.classList.remove('invalid-field', 'valid-field');
        
        if (!input.files || input.files.length === 0) {
            const idLibro = document.querySelector('input[name="id_libro"]').value;
            if (!idLibro) {
                errorDiv.textContent = 'Para registrar un nuevo libro es obligatorio subir una imagen';
                errorDiv.style.display = 'block';
                input.classList.add('invalid-field');
                return false;
            }
            return true;
        }
        
        const file = input.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 2 * 1024 * 1024;
        
        if (!allowedTypes.includes(file.type)) {
            errorDiv.textContent = 'Solo se permiten archivos JPG, JPEG o PNG';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        if (file.size > maxSize) {
            errorDiv.textContent = 'El archivo es demasiado grande. El tamaño máximo es 2MB';
            errorDiv.style.display = 'block';
            input.classList.add('invalid-field');
            return false;
        }
        
        input.classList.add('valid-field');
        return true;
    }

    // ========== FUNCIONES EXISTENTES ==========

    // Función para agregar tags
    function agregarTag(tipo) {
        let select, array, idKey;
        
        // Configurar según el tipo
        switch(tipo) {
            case 'subgeneros':
                select = document.getElementById('selectSubgeneros');
                array = window.subgeneros;
                idKey = 'idGenero';
                break;
            case 'coautores':
                select = document.getElementById('selectCoautores');
                array = window.coautores;
                idKey = 'idAutor';
                break;
            case 'editoriales':
                select = document.getElementById('selectEditoriales');
                array = window.editoriales;
                idKey = 'idEditorial';
                break;
            default:
                return;
        }
        
        // Obtenemos el valor seleccionado
        const idElemento = select.value;
        const nombreElemento = select.options[select.selectedIndex].text;
        
        // Verificamos que se haya seleccionado algo
        if (!idElemento) {
            alert('Por favor selecciona un elemento de la lista');
            return;
        }
        
        // Verificamos que no esté ya en la lista
        if (array.some(item => item[idKey] === idElemento)) {
            alert('Este elemento ya está agregado');
            return;
        }
        
        // Creamos un objeto con la información
        let nuevoItem = { 
            [idKey]: idElemento, 
            nombre: nombreElemento 
        };
        
        // Agregamos a la lista correspondiente
        array.push(nuevoItem);
        
        // Actualizamos la visualización
        actualizarTags(tipo);
        
        // Actualizamos el input hidden
        actualizarInputHidden(tipo);
        
        // Reiniciamos el select
        select.selectedIndex = 0;
    }

    // Función para eliminar tags
    function remover(boton, tipo) {
        // El botón está dentro del tag, así que subimos al tag padre
        const tag = boton.parentElement;
        const idElemento = tag.getAttribute('data-id');
        
        let array;
        
        // Filtramos el array correspondiente
        switch(tipo) {
            case 'subgeneros':
                array = window.subgeneros;
                window.subgeneros = array.filter(genero => genero.idGenero !== idElemento);
                break;
            case 'coautores':
                array = window.coautores;
                window.coautores = array.filter(autor => autor.idAutor !== idElemento);
                break;
            case 'editoriales':
                array = window.editoriales;
                window.editoriales = array.filter(editorial => editorial.idEditorial !== idElemento);
                break;
            default:
                return;
        }
        
        // Actualizamos la pantalla y el input hidden
        actualizarTags(tipo);
        actualizarInputHidden(tipo);
    }

    // Función para actualizar la visualización de tags
    function actualizarTags(tipo) {
        let container, array, idKey, emptyMessage;
        
        // Configurar según el tipo
        switch(tipo) {
            case 'subgeneros':
                container = document.getElementById('subgenerosContainer');
                array = window.subgeneros;
                idKey = 'idGenero';
                emptyMessage = 'No hay subgéneros agregados.';
                break;
            case 'coautores':
                container = document.getElementById('coautoresContainer');
                array = window.coautores;
                idKey = 'idAutor';
                emptyMessage = 'No hay coautores agregados.';
                break;
            case 'editoriales':
                container = document.getElementById('editorialesContainer');
                array = window.editoriales;
                idKey = 'idEditorial';
                emptyMessage = 'No hay editoriales agregadas.';
                break;
            default:
                return;
        }
        
        // Limpiamos el contenedor
        container.innerHTML = '';

        // Si no hay elementos, mostrar mensaje
        if (array.length === 0) {
            container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
            return;
        }
        
        // Por cada elemento en nuestra lista, creamos un tag visual
        array.forEach(item => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.setAttribute('data-id', item[idKey]);
            tag.innerHTML = `
                ${item.nombre}
                <button type="button" class="tag-remove" onclick="remover(this, '${tipo}')">×</button>
            `;
            container.appendChild(tag);
        });
    }

    // Función para actualizar inputs hidden
    function actualizarInputHidden(tipo) {
        let inputId, array;
        
        switch(tipo) {
            case 'subgeneros':
                inputId = 'subgenerosInput';
                array = window.subgeneros;
                break;
            case 'coautores':
                inputId = 'coautoresInput';
                array = window.coautores;
                break;
            case 'editoriales':
                inputId = 'editorialesInput';
                array = window.editoriales;
                break;
            default:
                return;
        }
        
        // Convertimos el array a texto JSON y lo guardamos en el input hidden
        document.getElementById(inputId).value = JSON.stringify(array);
    }

    // Función para vista previa de imagen
    function previewImage(input) {
        const preview = document.getElementById('imagePreview');
        const nombreInput = document.getElementById('imagenNombre');
        
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const reader = new FileReader();
            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 2 * 1024 * 1024;
            
            if (!allowedTypes.includes(file.type)) {
                alert('Solo se permiten archivos JPG, JPEG o PNG.');
                input.value = '';
                mostrarEstadoSinImagen();
                return;
            }
            
            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. El tamaño máximo es 2MB.');
                input.value = '';
                mostrarEstadoSinImagen();
                return;
            }
            
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${e.target.result}" alt="Vista previa" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                        <div style="margin-top: 8px; font-size: 12px; color: #666;">
                            ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                        </div>
                    </div>
                `;
            };
            
            reader.onerror = function() {
                alert('Error al leer el archivo de imagen.');
                input.value = '';
                mostrarEstadoSinImagen();
            };
            
            reader.readAsDataURL(file);
            nombreInput.value = file.name;
            
        } else {
            mostrarEstadoSinImagen();
        }
    }

    function mostrarEstadoSinImagen() {
        const preview = document.getElementById('imagePreview');
        const idLibro = document.querySelector('input[name="id_libro"]').value;
        
        if (idLibro) {
            const imagenActual = document.querySelector('input[name="imagen_anterior"]').value;
            if (imagenActual) {
                preview.innerHTML = `
                    <div style="text-align: center;">
                        <img src="https://biblioteca.grupoctic.com/libros_img/${imagenActual}" 
                            alt="Portada actual" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                        <div style="margin-top: 8px; font-size: 12px; color: #666;">
                            Imagen actual
                        </div>
                    </div>
                `;
            } else {
                preview.innerHTML = '<div class="no-image">No hay imagen seleccionada</div>';
            }
        } else {
            preview.innerHTML = `
                <div class="no-image" style="text-align: center; padding: 20px;">
                    <i class="fas fa-image" style="font-size: 48px; color: #ddd; margin-bottom: 10px;"></i>
                    <div>Imagen requerida para nuevo libro</div>
                    <small style="color: #d9534f; display: block; margin-top: 5px;">
                        <i class="fas fa-exclamation-triangle"></i> Obligatorio
                    </small>
                </div>
            `;
        }
    }

    // VALIDACIÓN DEL FORMULARIO COMPLETO
    function validarFormulario(e) {
        let esValido = true;
        const formulario = e.target;
        
        // Validar todos los campos
        const validaciones = [
            validarTitulo(document.querySelector('input[name="titulo"]')),
            validarISBN(document.querySelector('input[name="isbn"]')),
            validarEdicion(document.querySelector('input[name="edicion"]')),
            validarSelect(document.querySelector('select[name="id_anio_edicion"]'), 'anio'),
            validarSelect(document.querySelector('select[name="id_area_conocimiento"]'), 'area'),
            validarSelect(document.querySelector('select[name="id_genero"]'), 'genero'),
            validarSelect(document.querySelector('select[name="id_autor"]'), 'autor'),
            validarSelect(document.querySelector('select[name="id_editorial"]'), 'editorial'),
            validarSinopsis(document.querySelector('textarea[name="sinopsis"]')),
            validarEjemplares(document.querySelector('input[name="no_ejemplares"]')),
            validarImagen(document.getElementById('imagenInput'))
        ];
        
        // Verificar si alguna validación falló
        esValido = validaciones.every(result => result === true);
        
        if (!esValido) {
            e.preventDefault();
            // Enfocar el primer campo con error
            const primerError = document.querySelector('.invalid-field');
            if (primerError) {
                primerError.focus();
            }
            return false;
        }
        
        return true;
    }

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM completamente cargado');
        
        // Configurar validación en tiempo real para todos los campos
        const campos = document.querySelectorAll('input, select, textarea');
        
        campos.forEach(campo => {
            // Para campos que ya tienen validación específica, no agregar listeners adicionales
            if (campo.name === 'titulo' || campo.name === 'isbn' || campo.name === 'edicion' || 
                campo.name === 'sinopsis' || campo.name === 'no_ejemplares' || campo.id === 'imagenInput') {
                return;
            }
            
            // Para selects, usar validación genérica
            if (campo.tagName === 'SELECT') {
                campo.addEventListener('change', function() {
                    const tipo = this.name.replace('id_', '').replace('_conocimiento', '');
                    validarSelect(this, tipo);
                });
            }
        });
        
        // Agregar event listener al formulario
        const formulario = document.querySelector('.book-form');
        if (formulario) {
            formulario.addEventListener('submit', validarFormulario);
        }
        
        // Actualizar la visualización inicial de tags
        actualizarTags('subgeneros');
        actualizarTags('coautores');
        actualizarTags('editoriales');
        actualizarInputHidden('subgeneros');
        actualizarInputHidden('coautores');
        actualizarInputHidden('editoriales');
        
        console.log('Inicialización completada');
    });

    // Funciones para abrir y cerrar modales
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
  </script>
</body>
</html>