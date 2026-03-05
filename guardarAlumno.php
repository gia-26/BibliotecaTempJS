<?php 
    require_once 'conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $sql_recuperarID = "SELECT MAX(Id_alumnoAI) as max_id FROM tbl_alumnos";
        $resultado = $conexion->query($sql_recuperarID);
        $row = $resultado->fetch_assoc();
        $nuevo_id = "ALU00" . ((int) $row['max_id'] + 1);

        $nombre = $_POST['nombre'];
        $apellido_paterno = $_POST['apellido_p'];
        $apellido_materno = $_POST['apellido_m'];
        $telefono = $_POST['telefono'];
        $codigo_postal = $_POST['codigo_postal'];
        $calle = $_POST['calle'];
        $colonia = $_POST['colonia'];
        $numero_exterior = $_POST['numero_exterior'];
        $numero_interior = $_POST['numero_interior'];
        $correo = $_POST['correo'];
        $id_carrera = $_POST['carrera'];
        $estado = 1; // Estado activo por defecto

        $sql_update = "INSERT INTO tbl_alumnos (
            Id_alumno,
            Nombre,
            Apellido_P,
            Apellido_M,
            Telefono,
            Codigo_P,
            Calle,
            Colonia,
            N_exterior,
            N_interior,
            Correo,
            Id_carrera,
            Estado
        ) VALUES (
            '$nuevo_id',
            '$nombre',
            '$apellido_paterno',
            '$apellido_materno',
            '$telefono',
            '$codigo_postal',
            '$calle',
            '$colonia',
            '$numero_exterior',
            '$numero_interior',
            '$correo',
            '$id_carrera',
            '$estado'
        )";
        $resultado = $conexion->query($sql_update);
        if ($resultado) {
            header("Location: alumnos.php");
            exit();
        } else {
            echo "Error al editar el alumno.";
        }
        $conexion->close();
    } else {
        header("Location: alumnos.php");
        exit();
    }
?>