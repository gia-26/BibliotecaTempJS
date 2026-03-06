<?php
require_once 'conexion.php';

// PARCHE DE SEGURIDAD: Aseguramos que la variable de conexión exista
if (!isset($conexion)) {
    if (isset($conn)) $conexion = $conn;
    elseif (isset($mysqli)) $conexion = $mysqli;
    else exit(); // Si no hay conexión, paramos aquí
}

// Si no hay texto que buscar, paramos
if (!isset($_GET['q']) || empty($_GET['q'])) exit();

$busqueda = $conexion->real_escape_string($_GET['q']);
$filtro = isset($_GET['f']) ? $_GET['f'] : 'titulo';
$sugerencias = [];

// Seleccionamos la consulta SQL según el filtro
switch ($filtro) {
    case 'autor':
        // Buscamos en la tabla de Autores
        $sql = "SELECT DISTINCT Nombre as texto FROM tbl_autores WHERE Nombre LIKE '%$busqueda%' LIMIT 5";
        break;
    case 'genero':
        // Buscamos en la tabla de Géneros
        $sql = "SELECT DISTINCT Nombre as texto FROM tbl_generos WHERE Nombre LIKE '%$busqueda%' LIMIT 5";
        break;
    case 'titulo':
    default:
        // Buscamos en la tabla de Libros (solo los activos)
        $sql = "SELECT Titulo as texto FROM tbl_libros WHERE Titulo LIKE '%$busqueda%' AND Estado != 0 LIMIT 5";
        break;
}

$resultado = $conexion->query($sql);

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $sugerencias[] = $fila['texto'];
    }
}

// Devolvemos la respuesta en formato JSON (para que JavaScript la entienda)
echo json_encode($sugerencias);
?>