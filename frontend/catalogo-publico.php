<?php if (session_status() === PHP_SESSION_NONE) session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo de Libros - Biblioteca UTHH</title>
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

    .search-input {
      flex-grow: 1;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
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

    .catalogo {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2.5rem;
    }

    .libro {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .libro:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px var(--sombra);
    }

    .libro-img {
      margin-top: 5%;
      align-self: center;
      width: 50%;
      height: 50%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .libro:hover .libro-img {
      transform: scale(1.05);
    }

    .libro-content {
      padding: 1.5rem;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .libro-content h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .libro-content .autor {
      color: var(--texto-marron);
      opacity: 0.7;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .libro-content p {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }

    .estado {
      display: inline-block;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .disponible {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .prestado {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    /* Estilos para la paginación */
    .paginacion {
      display: flex;
      justify-content: center;
      margin: 3rem 0;
      gap: 0.5rem;
    }

    .paginacion a, .paginacion span {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      color: var(--texto-marron);
      border: 1px solid #ddd;
      transition: all 0.3s;
    }

    .paginacion a:hover {
      background-color: #f0f0f0;
    }

    .paginacion .pagina-actual {
      background-color: var(--boton-marron);
      color: white;
      border-color: var(--boton-marron);
    }

    .btn-volver {
      display: block;
      width: 200px;
      margin: 3rem auto 0;
      text-align: center;
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

    .libro-popular-indicador {
        position: absolute;
        top: 12px;
        right: 12px;
        background: linear-gradient(135deg, #d32f2f, #f44336);
        color: white;
        padding: 0.35rem 0.9rem;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 4px;
        z-index: 10;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        gap: 0.4rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .libro-popular-indicador::before {
        content: "🔥";
        font-size: 0.85rem;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
    }

    /* Pequeño triángulo decorativo en la parte inferior */
    .libro-popular-indicador::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: #d32f2f transparent transparent transparent;
    }

    /* Efecto sutil de brillo */
    .libro-popular-indicador {
        animation: suave-brillo 3s infinite alternate;
    }

    @keyframes suave-brillo {
        0% {
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
        }
        100% {
            box-shadow: 0 3px 15px rgba(211, 47, 47, 0.4);
        }
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
      
      .search-box {
        flex-direction: column;
      }
      
      .paginacion {
        flex-wrap: wrap;
      }
    }

  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Catálogo de Libros</h2>
    <p>Explora nuestra completa colección bibliográfica</p>
  </section>

  <main>
    <div class="section-header">
      <h2>Nuestro Acervo Bibliográfico</h2>
    </div>

    <div class="search-section">
      <div class="search-box">
        <select id="criterio-busqueda">
            <option value="titulo">Título</option>
            <option value="autor">Autor</option>
            <option value="genero">Género</option>
        </select>
        <input type="text" class="search-input" id="input-busqueda" placeholder="Buscar por título, autor o género...">
      </div>
    </div>
    
    <div class="catalogo" id="contenedor-libros">
      <?php
      // Incluir la conexión
      require_once 'conexion.php';
      
      // Configuración de paginación
      $librosPorPagina = 6;
      $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
      if ($pagina < 1) $pagina = 1;
      $offset = ($pagina - 1) * $librosPorPagina;
      
      // Consulta para obtener el total de libros
      $sqlTotal = "SELECT COUNT(DISTINCT lib.Id_libro) as total
                   FROM tbl_ejemplares ejem
                   INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
                   INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
                   INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
                   WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado'";
      
      $resultadoTotal = $conexion->query($sqlTotal);
      $totalLibros = $resultadoTotal->fetch_assoc()['total'];
      $totalPaginas = ceil($totalLibros / $librosPorPagina);
      
      // Consulta para obtener los libros de la página actual
      $sql = "SELECT
                lib.Id_libro,
                lib.Titulo,
                aut.Nombre,
                CASE 
                  WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
                  ELSE lib.Sinopsis
                END AS Sinopsis,
                lib.Imagen,
                COUNT(*) AS Ejemplares_Disponibles
              FROM tbl_ejemplares ejem
              INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
              INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
              INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
              WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado'
              GROUP BY lib.Id_libro
              LIMIT $librosPorPagina OFFSET $offset";

      $resultado = $conexion->query($sql);
      
      if($resultado && $resultado->num_rows > 0) {
        while($libro = $resultado->fetch_assoc()) {
          $estado = ($libro['Ejemplares_Disponibles'] > 1) ? 'Disponible' : 'Prestado';
          $esPopular = ($libro['Id_libro'] == "LIB0037");
      ?>
      <div class="libro" style="position: relative;">
        <?php if ($esPopular): ?>
          <div class="libro-popular-indicador">Más popular</div>
        <?php endif; ?>
        <img src="https://biblioteca.grupoctic.com/libros_img/<?php echo $libro['Imagen']; ?>" class="libro-img">
        <div class="libro-content">
          <h3><?php echo $libro['Titulo']; ?></h3>
          <div class="autor"><?php echo $libro['Nombre']; ?></div>
          <span class="estado <?php echo strtolower($estado); ?>"><?php echo $estado;?></span>
          <p><?php echo $libro['Sinopsis']; ?></p>
          <a href="libro-detalle.php?id=<?php echo $libro['Id_libro']; ?>&estado=<?php echo $estado; ?>" class="btn">Ver más</a>
        </div>
      </div>
      <?php
        }
      } else {
        echo "<p>No se encontraron libros en el catálogo.</p>";
      }
      ?>
    </div>
    
    <!-- Paginación -->
    <?php if ($totalPaginas > 1): ?>
    <div class="paginacion" id="paginacion-container">
      <?php
      $maxPaginasAMostrar = 10;
      $inicio = 1;
      $fin = min($maxPaginasAMostrar, $totalPaginas);
      
      if ($totalPaginas > $maxPaginasAMostrar) {
        $mitad = floor($maxPaginasAMostrar / 2);
        $inicio = max(1, $pagina - $mitad);
        $fin = $inicio + $maxPaginasAMostrar - 1;
        
        if ($fin > $totalPaginas) {
          $fin = $totalPaginas;
          $inicio = max(1, $fin - $maxPaginasAMostrar + 1);
        }
      }
      
      for ($i = $inicio; $i <= $fin; $i++) {
        if ($i == $pagina) {
          echo '<span class="pagina-actual">' . $i . '</span>';
        } else {
          echo '<a href="?pagina=' . $i . '">' . $i . '</a>';
        }
      }
      ?>
    </div>
    <?php endif; ?>
  </main>

  <?php include 'footer.html'; ?>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
        const inputBusqueda = document.getElementById('input-busqueda');
        const criterioBusqueda = document.getElementById('criterio-busqueda');
        const contenedorLibros = document.getElementById('contenedor-libros');
        const paginacionContainer = document.getElementById('paginacion-container');
        let timeoutBusqueda;

        // Función para buscar libros
        function buscarLibros(termino) {
            const criterio = criterioBusqueda.value;
            
            // Mostrar loader
            contenedorLibros.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--boton-marron);"></i>
                    <p style="margin-top: 1rem;">Buscando libros...</p>
                </div>
            `;
            
            if (paginacionContainer) {
                paginacionContainer.style.display = 'none';
            }
            
            const formData = new FormData();
            formData.append('termino', termino);
            formData.append('criterio', criterio);

            fetch('buscar-libros.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                contenedorLibros.innerHTML = data;
                
                // Mostrar mensaje si no hay resultados
                if (data.includes('No se encontraron')) {
                    console.log('No se encontraron resultados');
                }
            })
            .catch(error => {
                console.error('Error en la búsqueda:', error);
                contenedorLibros.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: red;">
                        <p>Error al cargar los resultados. Intenta nuevamente.</p>
                        <small>${error.message}</small>
                    </div>
                `;
            });
        }

        // Evento input para búsqueda en tiempo real
        inputBusqueda.addEventListener('input', function(e) {
            const termino = e.target.value.trim();
            
            clearTimeout(timeoutBusqueda);
            
            timeoutBusqueda = setTimeout(() => {
                buscarLibros(termino);
            }, 500); // Aumenté a 500ms para dar más tiempo
        });

        // Buscar al cambiar el criterio si hay texto
        criterioBusqueda.addEventListener('change', function() {
            if (inputBusqueda.value.trim().length > 0) {
                buscarLibros(inputBusqueda.value.trim());
            }
        });
    });
      document.addEventListener('DOMContentLoaded', function() {
          // Asegurar que los indicadores populares no se salgan del contenedor
          const indicadores = document.querySelectorAll('.libro-popular-indicador, .libro-popular-estrella');
          
          indicadores.forEach(indicador => {
              const libro = indicador.closest('.libro');
              if (libro) {
                  const libroRect = libro.getBoundingClientRect();
                  const indicadorRect = indicador.getBoundingClientRect();
                  
                  // Si el indicador se sale por la derecha
                  if (indicadorRect.right > libroRect.right - 10) {
                      indicador.style.right = '10px';
                  }
              }
          });
      });
    </script>
</body>
</html>