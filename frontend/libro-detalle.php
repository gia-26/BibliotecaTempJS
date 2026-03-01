<?php
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!isset($_GET['id'])) {
    header('Location: catalogo-publico.php');
    exit();
  }
  else
  {
    $estado = $_GET['estado'];
    $idLibro = $_GET['id'];
  }
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detalle del Libro - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
      max-width: 1200px;
      margin: auto;
    }

    .breadcrumb {
      margin-bottom: 2rem;
    }

    .breadcrumb a {
      color: var(--texto-marron);
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .libro-detalle {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 3rem;
      background-color: white;
      border-radius: 12px;
      padding: 3rem;
      box-shadow: 0 10px 30px var(--sombra);
      margin-bottom: 3rem;
    }

    .libro-portada {
      text-align: center;
    }

    .libro-portada img {
      width: 100%;
      max-width: 400px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .estado-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .disponible {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .prestado {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .libro-info h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--texto-marron);
      font-weight: 400;
    }

    .libro-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f9f5f0;
      border-radius: 8px;
    }

    .meta-item h3 {
      font-size: 0.9rem;
      color: var(--texto-marron);
      opacity: 0.7;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .meta-item p {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .sinopsis {
      margin: 2rem 0;
    }

    .sinopsis h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--texto-marron);
      border-bottom: 2px solid var(--boton-marron);
      padding-bottom: 0.5rem;
    }

    .sinopsis p {
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .btn {
      display: inline-block;
      background-color: var(--boton-marron);
      color: #fff;
      padding: 0.8rem 2rem;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 1rem;
      margin-top: 1rem;
    }

    .btn:hover {
      background-color: #2d1d1d;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: transparent;
      border: 2px solid var(--boton-marron);
      color: var(--boton-marron);
    }

    .btn-secondary:hover {
      background-color: var(--boton-marron);
      color: white;
    }

    .libros-relacionados {
      margin-top: 4rem;
    }

    .libros-relacionados h2 {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      color: var(--texto-marron);
      text-align: center;
    }

    .catalogo-relacionado {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .libro-relacionado {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .libro-relacionado:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px var(--sombra);
    }

    .libro-relacionado img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .libro-relacionado-content {
      padding: 1.5rem;
    }

    .libro-relacionado h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .libro-relacionado .autor {
      color: var(--texto-marron);
      opacity: 0.7;
      font-size: 0.9rem;
      margin-bottom: 1rem;
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

    .realidad-aumentada {
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(59, 38, 35, 0.05), rgba(59, 38, 35, 0.1));
        border-radius: 10px;
        border-left: 4px solid var(--boton-marron);
        text-align: center;
    }

    .ar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--texto-marron);
        font-weight: 600;
        font-size: 1.1rem;
    }

    .ar-icono {
        color: #4a69bd;
        font-size: 1.3rem;
        animation: flotar 3s ease-in-out infinite;
    }

    @keyframes flotar {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    .ar-descripcion {
        font-size: 0.95rem;
        color: var(--texto-marron);
        opacity: 0.9;
        margin-bottom: 1rem;
        line-height: 1.5;
    }

    .qr-container {
        display: inline-block;
        padding: 15px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        margin-top: 0.5rem;
    }

    .qr-container:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .qr-imagen {
        width: 180px;
        height: 180px;
        border-radius: 8px;
        display: block;
    }

    .qr-leyenda {
        font-size: 0.8rem;
        color: var(--texto-marron);
        opacity: 0.7;
        margin-top: 0.5rem;
        font-style: italic;
    }

    /* Versión alternativa con efecto más llamativo */
    .ar-destacado {
        background: linear-gradient(135deg, rgba(74, 105, 189, 0.1), rgba(59, 38, 35, 0.05));
        border-left: 4px solid #4a69bd;
    }

    .ar-destacado .ar-icono {
        background: linear-gradient(135deg, #4a69bd, #6a89cc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
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
      
      .libro-detalle {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem;
      }
      
      .libro-portada img {
        max-width: 300px;
      }
      
      .libro-info h1 {
        font-size: 2rem;
      }
    }

  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Detalle del Libro</h2>
    <p>Información completa sobre el libro seleccionado</p>
  </section>

  <main>
    <div class="breadcrumb">
      <a href="index.php">Inicio</a> > 
      <a href="catalogo-publico.php">Catálogo</a> > 
      <span>Detalle del libro</span>
    </div>

    <?php
      //Incluir la conexión
      require_once 'conexion.php';

      //Consulta
      $sql = "SELECT
                lib.Titulo,
                lib.Sinopsis,
                lib.Edicion,
            
                (SELECT aut.Nombre
                 FROM tbl_autores aut
                 WHERE aut.Id_autor = lib.Id_autor) AS Autor,
            
                (SELECT edit.Nombre
                 FROM tbl_editoriales edit
                 WHERE edit.Id_editorial = lib.Id_editorial) AS Editorial,
            
                (SELECT gen.Nombre
                 FROM tbl_generos gen
                 WHERE gen.Id_genero = lib.Id_genero) AS Genero,
            
                lib.ISBN,
                lib.Imagen,
            
                (SELECT anios.Anio_edicion
                 FROM tbl_anios_edicion anios
                 WHERE anios.Id_anio_edicion = lib.Id_anio_edicion) AS Anio
            
            FROM tbl_libros lib
            WHERE lib.Id_libro = '$idLibro';";

      //Ejecutar la consulta
      $resultado = $conexion->query($sql);
      if($resultado && $resultado->num_rows > 0)
      {

        while($libro = $resultado->fetch_assoc())
        {
    ?>
          <div class="libro-detalle">
            <div class="libro-portada">
              <img src="https://biblioteca.grupoctic.com/libros_img/<?php echo $libro['Imagen']; ?>" alt="Cien años de soledad" id="libro-imagen">
              <div class="estado-badge <?php echo strtolower($estado); ?>" id="estado-libro"><?php echo $estado;?></div>
              
              <?php 
              if ($idLibro == "LIB0037") {
                  echo '
                  <div style="margin-top: 1.5rem; text-align: center;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1rem;">
                          <i class="fas fa-mobile-alt" style="color: #4a69bd; font-size: 1.2rem;"></i>
                          <span style="font-weight: 600; color: var(--texto-marron);">Escanea para Realidad Aumentada</span>
                      </div>
                      <div style="padding: 10px; background: white; border-radius: 10px; display: inline-block;">
                          <img src="https://biblioteca.grupoctic.com/libros_img/qrHarryPotter.jpg" 
                              alt="QR para AR" 
                              style="width: 150px; height: 150px; border-radius: 5px;">
                      </div>
                      <p style="font-size: 0.85rem; color: var(--texto-marron); opacity: 0.7; margin-top: 0.5rem;">
                          Usa la cámara de tu dispositivo móvil
                      </p>
                  </div>
                  ';
              }
              ?>
          </div>

            <div class="libro-info">
              <h1 id="libro-titulo"><?php echo $libro['Titulo']; ?></h1>
              <div class="autor" id="libro-autor"><?php echo $libro['Autor']; ?></div>

              <div class="libro-meta">
                <div class="meta-item">
                  <h3>Género</h3>
                  <p id="libro-genero"><?php echo $libro['Genero']; ?></p>
                </div>
                <div class="meta-item">
                  <h3>ISBN</h3>
                  <p id="libro-isbn"><?php echo $libro['ISBN']; ?></p>
                </div>
                <div class="meta-item">
                  <h3>Editorial</h3>
                  <p id="libro-editorial"><?php echo $libro['Editorial']; ?></p>
                </div>
                <div class="meta-item">
                  <h3>Año de publicación</h3>
                  <p id="libro-anio"><?php echo $libro['Anio']; ?></p>
                </div>
              </div>

              <div class="sinopsis">
                <h2>Sinopsis</h2>
                <p id="libro-sinopsis"><?php echo $libro['Sinopsis']; ?></p>
              </div>

              <div class="acciones">
                <a href="catalogo-publico.php" class="btn btn-secondary">
                  <i class="fas fa-arrow-left"></i> Volver al Catálogo
                </a>
              </div>  
            </div>
          </div>
      <?php
        }
      }
      ?>
  </main>

  <?php include 'footer.html'; ?>

</body>
</html>