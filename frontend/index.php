<?php 
  if (session_status() === PHP_SESSION_NONE) session_start(); 
  //Incluir la conexión
  require_once 'conexion.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <link rel="stylesheet" href="styles.css">

  <style>
    .catalogo-swiper {
      padding: 2rem 0;
    }
    .catalogo-swiper .swiper-wrapper {
      align-items: stretch;
    }
    .catalogo-swiper .swiper-slide {
      display: flex;
      justify-content: center;
      height: auto;
      padding: 0.25rem;
    }
    .catalogo-swiper .libro {
      max-width: 320px;
      width: 100%;
      margin: 0;
    }
    .catalogo-swiper .libro-img {
      width: 60%;
      height: auto;
    }
    .swiper-button-next, .swiper-button-prev {
      color: var(--boton-marron);
    }
    .swiper-pagination-bullet {
      background: rgba(59,38,35,0.2);
    }
    .swiper-pagination-bullet-active {
      background: var(--boton-marron);
    }

    /* Botón simple de texto a voz */
    .btn-tts {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background-color: var(--boton-marron);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      z-index: 1000;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero hero-medium">
    <h2 class="read-on-hover" data-text="Bienvenido a la Biblioteca">Bienvenido a la Biblioteca</h2>
    <p class="read-on-hover" data-text="Tu espacio para el conocimiento y la investigación en la Universidad Tecnológica de la Huasteca Hidalguense">Tu espacio para el conocimiento y la investigación en la Universidad Tecnológica de la Huasteca Hidalguense</p>
  </section>

  <main>
    <div class="section-header" id="nuevas-adquisiciones">
      <h2 class="read-on-hover" data-text="Nuevas Adquisiciones">Nuevas Adquisiciones</h2>
      <p class="read-on-hover" data-text="Descubre los últimos títulos incorporados a nuestra colección universitaria">Descubre los últimos títulos incorporados a nuestra colección universitaria</p>
    </div>

    <div class="catalogo-swiper swiper mySwiper">
      <div class="swiper-wrapper">
        <?php
         $sql = "SELECT 
          lib.Id_libro,
          lib.Titulo, 
          CASE 
              WHEN CHAR_LENGTH(lib.Sinopsis) > 100 THEN CONCAT(LEFT(lib.Sinopsis, 100), '...')
              ELSE lib.Sinopsis 
          END AS Sinopsis,
          lib.Edicion,
          lib.Imagen,
          edit.Nombre AS 'Editorial', 
          aut.Nombre AS 'Autor', 
          gen.Nombre AS 'Genero', 
          anioEd.Anio_edicion, 
          lib.ISBN, 
          aCon.Area_conocimiento 
        FROM tbl_libros lib 
        INNER JOIN tbl_editoriales edit ON lib.Id_editorial = edit.Id_editorial 
        INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor 
        INNER JOIN tbl_generos gen ON lib.Id_genero = gen.Id_genero 
        INNER JOIN tbl_anios_edicion anioEd ON lib.Id_anio_edicion = anioEd.Id_anio_edicion 
        INNER JOIN tbl_areas_conocimiento aCon ON lib.Id_area_conocimiento = aCon.Id_area_conocimiento 
        WHERE lib.Estado != 0 LIMIT 12;"; // aumenté el límite para ver más en el carrusel

          //Ejecutar la consulta
        $resultado = $conexion->query($sql);
        if($resultado && $resultado->num_rows > 0)
        {
          while($libro = $resultado->fetch_assoc())
          {
            $titulo = htmlspecialchars($libro['Titulo']);
            $autor  = htmlspecialchars($libro['Autor']);
            $sinopsis = htmlspecialchars($libro['Sinopsis']);
            $imagen = htmlspecialchars($libro['Imagen']);
        ?>
          <div class="swiper-slide">
            <div class="libro">
              <img loading="lazy" src="https://biblioteca.grupoctic.com/libros_img/<?php echo $imagen; ?>" alt="<?php echo $titulo; ?>" class="libro-img">
              <div class="libro-content">
                <h3 class="read-on-hover" data-text='Título: <?php echo $titulo ?>'><?php echo $titulo ?></h3>
                <div class="read-on-hover autor" data-text='Autor: <?php echo $autor ?>'><?php echo $autor ?></div>
                <p class="read-on-hover" data-text='<?php echo $sinopsis ?>'><?php echo $sinopsis ?></p>
                <a href="catalogo-publico.php" class="btn">Ver más</a>
              </div>
            </div>
          </div>
        <?php
          }
        } else {
          echo '<p>No se encontraron títulos.</p>';
        }
        ?>
      </div>

      <div class="swiper-pagination" aria-hidden="false"></div>
      <div class="swiper-button-prev" aria-label="Anterior"></div>
      <div class="swiper-button-next" aria-label="Siguiente"></div>
    </div>
  
    <?php
      $sql = "SELECT
                ib.QuienesSomos,
                ib.NuestraHistoria,
                ib.Mision,
                ib.Vision,
                ib.Objetivo
              FROM tbl_informacion_biblioteca ib;"
      ;

      //Ejecutar la consulta
      $resultado = $conexion->query($sql);
      if($resultado && $resultado->num_rows > 0)
      {
        $infoBiblioteca = $resultado->fetch_assoc();
      }
    ?>
    <div class="read-on-hover quienes-somos" data-text="quienes somos" id="quienes-somos">
      <h2 class="read-on-hover" data-text="¿Quiénes Somos?">¿Quiénes Somos?</h2>
      <p class="read-on-hover" data-text="<?php echo $infoBiblioteca['QuienesSomos']; ?>"><?php echo $infoBiblioteca['QuienesSomos']; ?></p>
      
      <h3 class="read-on-hover" data-text="Nuestra Historia">Nuestra Historia</h3>
      <p class="read-on-hover" data-text="<?php echo $infoBiblioteca['NuestraHistoria']; ?>"><?php echo $infoBiblioteca['NuestraHistoria']; ?></p>
      
      <div class="mision-vision">
        <div class="mision-vision-card">
          <h3 class="read-on-hover" data-text="Misión">Misión</h3>
          <p class="read-on-hover" data-text="<?php echo $infoBiblioteca['Mision']; ?>"><?php echo $infoBiblioteca['Mision']; ?></p>
        </div>
        
        <div class="mision-vision-card">
          <h3 class="read-on-hover" data-text="Visión">Visión</h3>
          <p class="read-on-hover" data-text="<?php echo $infoBiblioteca['Vision']; ?>"><?php echo $infoBiblioteca['Vision']; ?></p>
        </div>
        
        <div class="mision-vision-card">
          <h3 class="read-on-hover" data-text="Objetivo">Objetivo</h3>
          <p class="read-on-hover" data-text="<?php echo $infoBiblioteca['Objetivo']; ?>"><?php echo $infoBiblioteca['Objetivo']; ?></p>
        </div>
      </div>
    </div>
    
    <div class="directorio" id="directorio">
      <div class="section-header">
        <h2 class="read-on-hover" data-text="Directorio">Directorio</h2>
      </div>
      <div class="directorio-grid">
        <?php
        $sql = "SELECT
                  trab.Nombre,
                  trab.Apellido_P,
                  trab.Apellido_M,
                  rols.Tipo_rol
                FROM tbl_personal pers
                INNER JOIN tbl_roles rols ON pers.Id_rol = rols.Id_rol
                INNER JOIN tbl_trabajadores trab ON pers.Id_trabajador = trab.Id_trabajador
                WHERE pers.Estado != 0;";

        //Ejecutar la consulta
        $resultado = $conexion->query($sql);
        if($resultado && $resultado->num_rows > 0)
        {

          while($trabajador = $resultado->fetch_assoc())
          {
        ?>
        <div class="directorio-card">
          <img src="./fotoBibliotecario.png" alt="Directora">
          <div class="directorio-card-content">
            <h3 class="read-on-hover" data-text="<?php echo htmlspecialchars($trabajador['Nombre'] . ' ' . $trabajador['Apellido_P'] . ' ' . $trabajador['Apellido_M']); ?>"><?php echo htmlspecialchars($trabajador['Nombre'] . ' ' . $trabajador['Apellido_P'] . ' ' . $trabajador['Apellido_M']); ?></h3>
            <div class="cargo read-on-hover" data-text="<?php echo htmlspecialchars($trabajador['Tipo_rol']); ?>"><?php echo htmlspecialchars($trabajador['Tipo_rol']); ?></div>
          </div>
        </div>
        <?php
          }
        }

        $conexion->close();
        ?>
      </div>
    </div>
  </main>
  <!-- Botón Texto a Voz -->
  <button class="btn-tts" id="btnTTS">🔊</button>

  <?php include 'footer.html'; ?>
  
  <!-- Swiper JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

  <script>
    // Variable simple para controlar
    let ttsActivo = false;

    // Función simple de lectura
    function speakText(text) {
        if (!ttsActivo) return;
        if (!window.speechSynthesis) return;
        
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'es-ES';
        window.speechSynthesis.speak(utter);
    }

    // Control del botón
    document.getElementById('btnTTS').addEventListener('click', function() {
        ttsActivo = !ttsActivo;
        this.textContent = ttsActivo ? '🔇' : '🔊';
    });

    // Eventos simples para los textos
    document.querySelectorAll('.read-on-hover').forEach(el => {
        el.addEventListener('mouseover', () => {
            const txt = el.getAttribute('data-text') || el.innerText;
            speakText(txt);
        });
        
        el.addEventListener('mouseout', () => {
            window.speechSynthesis.cancel();
        });
    });

    // Swiper (se mantiene igual)
    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            320:  { slidesPerView: 1, spaceBetween: 12 },
            640:  { slidesPerView: 2, spaceBetween: 16 },
            900:  { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 24 }
        }
    });
    </script>
</body>
</html>
