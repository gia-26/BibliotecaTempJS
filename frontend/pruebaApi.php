<?php
    header("Content-Type: application/json");

    include_once __DIR__ . '/conexion.php';

    $sql = "SELECT * FROM tbl_prestamos";
    $resultado = $conexion->query($sql);

    $prestamos = array();

    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $prestamos[] = $fila;
        }
        echo json_encode($prestamos, JSON_UNESCAPED_UNICODE);
    }
    else
    {
        //Enviar un JSON vacío si no hay películas
        echo json_encode([]);
    }
    $conexion->close();
?>