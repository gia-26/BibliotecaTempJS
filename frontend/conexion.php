<?php
    $host = "localhost"; //127.0.0.1
    $user = "root"; //u138650717_giovanni
    $pass = ""; //kb~yo7Q0wA^6
    $db = "db_biblioteca_escolar"; //$user

    $conexion = new mysqli($host, $user, $pass, $db);

    if ($conexion->connect_error) {
        die("Error de conexión: " . $conexion->connect_error);
    }
?>