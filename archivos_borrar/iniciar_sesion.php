<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Limpiar y validar campos
    $sesion = trim($_POST['sesion'] ?? '');
    $usuario = trim($_POST['usuario'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validar que no estén vacíos
    if (empty($sesion) || empty($usuario) || empty($password)) {
        echo '<script>alert("Por favor, complete todos los campos."); window.location.href = "login.php";</script>';
        exit();
    }

    // Validar longitud mínima de usuario y password
    if (strlen($password) < 3) {
        echo '<script>alert("La contraseña debe tener al menos 3 caracteres."); window.location.href = "login.php";</script>';
        exit();
    }

    if ($sesion != 'Miembro') {
        // Consulta preparada para personal
        $sql = "SELECT
                    pers.Id_personal AS 'id',
                    trab.Nombre,
                    trab.Apellido_P,
                    trab.Apellido_M,
                    rols.Tipo_rol
                FROM tbl_personal pers
                INNER JOIN tbl_trabajadores trab ON pers.Id_trabajador = trab.Id_trabajador
                INNER JOIN tbl_roles rols ON pers.Id_rol = rols.Id_rol
                WHERE pers.Id_personal = ? AND pers.Password = MD5(?) AND pers.Id_rol = ? AND pers.Estado != 0";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("sss", $usuario, $password, $sesion);
    } else {
        // Consulta preparada para miembros
        $sql = "SELECT 
                    users.Id_usuario AS 'id',
                    alum.Nombre,
                    alum.Apellido_P,
                    alum.Apellido_M,
                    carr.Nombre_carrera
                FROM tbl_usuarios users
                INNER JOIN tbl_alumnos alum ON users.Id_usuario = alum.Id_alumno
                INNER JOIN tbl_carreras carr ON alum.Id_carrera = carr.Id_carrera
                WHERE users.Id_usuario = ? AND users.Password = MD5(?) AND users.Estado != 0
                UNION ALL
                SELECT 
                    users.Id_usuario AS 'id',
                    trab.Nombre,
                    trab.Apellido_P,
                    trab.Apellido_M,
                    tipotrab.Tipo_trabajador AS 'Nombre_carrera'
                FROM tbl_usuarios users
                INNER JOIN tbl_trabajadores trab ON users.Id_usuario = trab.Id_trabajador 
                INNER JOIN tbl_tipo_trabajador tipotrab ON trab.Id_tipo_trabajador = tipotrab.Id_tipo_trabajador
                WHERE users.Id_usuario = ? AND users.Password = MD5(?) AND users.Estado != 0";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ssss", $usuario, $password, $usuario, $password);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        session_start();
        $_SESSION['idTipoUsuario'] = $sesion;
        $_SESSION['idUsuario'] = $row['id'];
        $_SESSION['nombreUsuario'] = $row['Nombre'] . ' ' . $row['Apellido_P'] . ' ' . $row['Apellido_M'];
        $_SESSION['tipoUsuario'] = ($row['Tipo_rol']) ? $row['Tipo_rol'] : 'Miembro';
        $_SESSION['carrera_o_tipo_trabajador'] = $row['Nombre_carrera'];

        $stmt->close();
        $conexion->close();
        
        header("Location: dashboard.php");
        exit();
    } else {
        $stmt->close();
        $conexion->close();
        
        header("Location: login.php?message=error");
        exit();
    }
    
} else {
    header("Location: login.php");
    exit();
}