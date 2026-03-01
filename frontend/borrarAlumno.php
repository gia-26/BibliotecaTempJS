<?php
    if(isset($_GET['id'])) 
    {
        $id = $_GET['id'];
        include_once 'conexion.php';
        $sql_delete = "UPDATE tbl_alumnos SET Estado = 0 WHERE Id_alumno = '$id'";
        $resultado = $conexion->query($sql_delete);
        if($resultado) {
            // Redirigir después de borrar
            header("Location: alumnos.php");
            exit();
        } else {
            echo "Error al borrar el alumno.";
        }
        $conexion->close();
    } 
    else {
        // Redirigir si no se proporciona un ID
        header("Location: alumnos.php");
        exit();
    }
?>