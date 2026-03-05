<?php
session_start();
include 'conexion.php'; 

if (!isset($_SESSION['idUsuario'])) {
    echo "Error: sesión no iniciada o caducada.";
    exit();
}

$idUsuario = $_SESSION['idUsuario']; 
$tipoUser  = $_SESSION['tipoUsuario'];
$accion    = $_POST['accion'] ?? "";


if ($accion == "telefono") {

    $telefono = trim($_POST['telefono']);

    // Las validaciones de PHP son una segunda capa de seguridad (backend)
    if ($telefono === "") {
        echo "El teléfono no puede estar vacío.";
        exit();
    }
    // Revalidación: El uso de preg_match es correcto
    if (!preg_match('/^[0-9]+$/', $telefono) || strlen($telefono) !== 10) {
        echo "Formato de teléfono no válido (debe ser de 10 dígitos numéricos).";
        exit();
    }
    
    $success = false;
    $table_to_update = "";

    if ($tipoUser === "Miembro") {

        // 1. Primero verificamos si es alumno
        $sql = "SELECT Id_alumno FROM tbl_alumnos WHERE Id_alumno = ?;";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("s", $idUsuario);
        $stmt->execute();
        $res = $stmt->get_result();
    
        if ($res->num_rows > 0) {
            // Es alumno → actualizar tabla alumnos
            $sqlUpdate = "UPDATE tbl_alumnos SET Telefono = ? WHERE Id_alumno = ?;";
            $stmtUpdate = $conexion->prepare($sqlUpdate);
            $stmtUpdate->bind_param("ss", $telefono, $idUsuario);
            $stmtUpdate->execute();
            $success=true;
    
        } else {
            // No es alumno → intentar actualizar en trabajadores
            $sqlUpdate = "UPDATE tbl_trabajadores SET Telefono = ? WHERE Id_trabajador = ?;";
            $stmtUpdate = $conexion->prepare($sqlUpdate);
            $stmtUpdate->bind_param("ss", $telefono, $idUsuario);
            $stmtUpdate->execute();
            $success=true;
        }
    
    } else {
        // Personal interno: Administrador o Bibliotecario
        $sqlUpdate = "UPDATE tbl_trabajadores t 
                        INNER JOIN tbl_personal p ON p.Id_trabajador = t.Id_trabajador
                        SET t.Telefono = ?
                        WHERE p.Id_personal = ?;";
        $stmtUpdate = $conexion->prepare($sqlUpdate);
        $stmtUpdate->bind_param("ss", $telefono, $idUsuario);
        $stmtUpdate->execute();
        $success=true;
    }

    if ($success) {
        echo "Teléfono actualizado correctamente para el usuario ID: $idUsuario.";
    } else {
        echo "Error al actualizar el teléfono.";
    }
    exit();
}


if ($accion == "password") {

    $actual    = trim($_POST['actual']);
    $nueva     = trim($_POST['nueva']);
    $confirmar = trim($_POST['confirmar']);

    if ($actual === "" || $nueva === "" || $confirmar === "") {
        echo "Debes llenar todos los campos.";
        exit();
    }
    
    if (strlen($nueva) < 8 || strlen($nueva) > 25) {
        echo "La contraseña debe tener entre 8 y 25 caracteres.";
        exit();
    }
    if (!preg_match('/[A-Z]/', $nueva)) {
        echo "La contraseña debe incluir al menos una mayúscula.";
        exit();
    }
    if (!preg_match('/[0-9]/', $nueva)) {
        echo "La contraseña debe incluir un número.";
        exit();
    }
    if (!preg_match('/[!@#$%^&*(),.?\":{}|<>_\-]/', $nueva)) {
        echo "La contraseña debe incluir un carácter especial.";
        exit();
    }
    if ($nueva !== $confirmar) {
        echo "Las contraseñas no coinciden.";
        exit();
    }

    
    $stmt_check = $conexion->prepare("SELECT Password FROM tbl_usuarios WHERE Id_usuario = ?");
    $stmt_check->bind_param("s", $idUsuario);
    $stmt_check->execute();
    $res_check = $stmt_check->get_result();

    if ($res_check->num_rows > 0) {
        $rowPass = $res_check->fetch_assoc();
        $origen = "usuarios";
    } 
    else {

        $stmt_check = $conexion->prepare("SELECT Password FROM tbl_personal WHERE Id_personal = ?");
        $stmt_check->bind_param("s", $idUsuario);
        $stmt_check->execute();
        $res_check = $stmt_check->get_result();

        if ($res_check->num_rows === 0) {
            echo "Error: Usuario no encontrado en ninguna tabla de credenciales.";
            exit();
        }

        $rowPass = $res_check->fetch_assoc();
        $origen = "personal";
    }

    $stmt_check->close();


    if ($rowPass['Password'] != md5($actual)) {
        echo "La contraseña actual es incorrecta.";
        exit();
    }

    
    $newPass = md5($nueva);

    if ($origen === "usuarios") {
        $stmt_update = $conexion->prepare("UPDATE tbl_usuarios SET Password = ? WHERE Id_usuario = ?");
    } else {
        $stmt_update = $conexion->prepare("UPDATE tbl_personal SET Password = ? WHERE Id_personal = ?");
    }

    if ($stmt_update) {
        $stmt_update->bind_param("ss", $newPass, $idUsuario);
        $success = $stmt_update->execute();
        $stmt_update->close();
    } else {
        echo "Error al preparar actualización de contraseña.";
        exit();
    }

    if ($success) {
        echo "Contraseña actualizada correctamente.";
    } else {
        echo "Error al actualizar contraseña.";
    }

    exit();
}

?>