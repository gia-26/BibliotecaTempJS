<?php 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'conexion.php';
        $id = $_GET['id'];
        $nombre = $_POST['nombre'];
        $apellido_paterno = $_POST['apellido_p'];
        $apellido_materno = $_POST['apellido_m'];
        $telefono = $_POST['telefono'];
        $codigo_postal = $_POST['codigo_postal'];
        $calle = $_POST['calle'];
        $colonia = $_POST['colonia'];
        $numero_interior = $_POST['numero_interior'];
        $numero_exterior = $_POST['numero_exterior'];
        $id_carrera = $_POST['carrera'];

        $sql_update = "UPDATE tbl_alumnos SET 
            Nombre = '$nombre',
            Apellido_P = '$apellido_paterno',
            Apellido_M = '$apellido_materno',
            Telefono = '$telefono',
            Codigo_P = '$codigo_postal',
            Calle = '$calle',
            Colonia = '$colonia',
            N_exterior = '$numero_exterior',
            N_interior = '$numero_interior',
            Id_carrera = '$id_carrera'
            WHERE Id_alumno = '$id'";

        $resultado = $conexion->query($sql_update);
        if ($resultado) {
            // Redirigir después de editar
            header("Location: alumnos.php");
            exit();
        } else {
            echo "Error al editar el alumno.";
        }
        $conexion->close();
    } else {
        // Redirigir si no es una solicitud POST
        header("Location: alumnos.php");
        exit();
    }
?>