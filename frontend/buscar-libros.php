<?php
require_once 'conexion.php';

// Configuración
$librosPorPagina = 6;
$pagina = 1; // Para búsqueda simple, siempre página 1
$offset = ($pagina - 1) * $librosPorPagina;

// Obtener parámetros de búsqueda
$termino = isset($_POST['termino']) ? trim($_POST['termino']) : '';
$criterio = isset($_POST['criterio']) ? $_POST['criterio'] : 'titulo';

// Consulta base
$sqlBase = "FROM tbl_ejemplares ejem
           INNER JOIN tbl_libros lib ON ejem.Id_libro = lib.Id_libro
           INNER JOIN tbl_autores aut ON lib.Id_autor = aut.Id_autor
           INNER JOIN tbl_generos gen ON gen.Id_genero = lib.Id_genero
           INNER JOIN tbl_estado_ejemplar estEjem ON ejem.Id_estado_ejemplar = estEjem.Id_estado_ejemplar
           WHERE lib.Estado != 0 AND estEjem.Estado_ejemplar != 'Prestado'";

// Agregar condiciones de búsqueda
if (!empty($termino)) {
    switch($criterio) {
        case 'titulo':
            $sqlBase .= " AND lib.Titulo LIKE ?";
            $parametro = "%$termino%";
            break;
        case 'autor':
            $sqlBase .= " AND aut.Nombre LIKE ?";
            $parametro = "%$termino%";
            break;
        case 'genero':
            $sqlBase .= " AND gen.Nombre LIKE ?";
            $parametro = "%$termino%";
            break;
        default:
            $sqlBase .= " AND (lib.Titulo LIKE ? OR aut.Nombre LIKE ?)";
            $parametros = ["%$termino%", "%$termino%"];
    }
}

// Consulta para obtener libros
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
        $sqlBase
        GROUP BY lib.Id_libro
        LIMIT ? OFFSET ?";

$stmt = $conexion->prepare($sql);

if (!empty($termino)) {
    if ($criterio == 'titulo' || $criterio == 'autor' || $criterio == 'genero') {
        $stmt->bind_param("sii", $parametro, $librosPorPagina, $offset);
    } else {
        $stmt->bind_param("ssii", $parametros[0], $parametros[1], $librosPorPagina, $offset);
    }
} else {
    $stmt->bind_param("ii", $librosPorPagina, $offset);
}

$stmt->execute();
$resultado = $stmt->get_result();

if($resultado && $resultado->num_rows > 0) {
    while($libro = $resultado->fetch_assoc()) {
        $estado = ($libro['Ejemplares_Disponibles'] > 1) ? 'Disponible' : 'Prestado';
?>
<div class="libro">
  <img src="https://biblioteca.grupoctic.com/libros_img/<?php echo $libro['Imagen']; ?>" class="libro-img">
  <div class="libro-content">
    <h3><?php echo htmlspecialchars($libro['Titulo']); ?></h3>
    <div class="autor"><?php echo htmlspecialchars($libro['Nombre']); ?></div>
    <span class="estado <?php echo strtolower($estado); ?>"><?php echo $estado;?></span>
    <p><?php echo htmlspecialchars($libro['Sinopsis']); ?></p>
    <a href="libro-detalle.php?id=<?php echo $libro['Id_libro']; ?>&estado=<?php echo $estado; ?>" class="btn">Ver más</a>
  </div>
</div>
<?php
    }
} else {
    echo "<p>No se encontraron libros que coincidan con tu búsqueda.</p>";
}

$stmt->close();
$conexion->close();
?>