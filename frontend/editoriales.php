<?php
require_once 'conexion.php';

$mensaje = "";
$tipo_mensaje = "";

$id_form = "";
$nombre_form = "";
$pais_form = "";
$modo = "agregar";

function generarNuevoIdEditorial($conexion) {
    $sql = "SELECT Id_editorial FROM tbl_editoriales ORDER BY Id_editorial DESC LIMIT 1";
    $res = $conexion->query($sql);
    if ($res && $row = $res->fetch_assoc()) {
        $ultimo = $row['Id_editorial'];
        $num = intval(substr($ultimo, 3)) + 1;
    } else {
        $num = 1;
    }
    return 'EDI' . str_pad($num, 3, '0', STR_PAD_LEFT);
}


function validarNombreEditorial($nombre) {

    return preg_match('/^[A-Za-zÁÉÍÓÚáéíóúñÑ\.\,\-\s]{2,60}$/', $nombre);
}

function validarPaisEditorial($pais) {
    return preg_match('/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,40}$/', $pais);
}

function editorialYaExiste($conexion, $nombre, $id_actual = null) {
    $sql = "SELECT Id_editorial FROM tbl_editoriales WHERE LOWER(Nombre) = LOWER(?)";
    if ($id_actual) {
        $sql .= " AND Id_editorial <> ?";
    }

    $stmt = $conexion->prepare($sql);
    if ($id_actual) {
        $stmt->bind_param("ss", $nombre, $id_actual);
    } else {
        $stmt->bind_param("s", $nombre);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    return ($result->num_rows > 0);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'agregar_guardar') {
        $nombre = trim($_POST['nombre'] ?? '');
        $pais = trim($_POST['pais'] ?? '');
        $id = $_POST['id_editorial'] ?? '';
        $modo = $_POST['modo'] ?? 'agregar';

        $nombre = preg_replace('/\s+/', ' ', $nombre);
        $pais = preg_replace('/\s+/', ' ', $pais);

        if ($nombre === '' || $pais === '') {
            $mensaje = "Escribe el nombre y país.";
            $tipo_mensaje = "error";
        }
        elseif (!validarNombreEditorial($nombre)) {
            $mensaje = "El nombre solo puede contener letras";
            $tipo_mensaje = "error";
        }
        elseif (!validarPaisEditorial($pais)) {
            $mensaje = "El país solo puede contener letras.";
            $tipo_mensaje = "error";
        }
        elseif (editorialYaExiste($conexion, $nombre, $modo === 'editar' ? $id : null)) {
            $mensaje = "Ya existe una editorial con ese nombre.";
            $tipo_mensaje = "error";
        }
        else {

            if ($modo === 'editar' && $id !== '') {

                $sql = "UPDATE tbl_editoriales SET Nombre=?, Pais=? WHERE Id_editorial=?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("sss", $nombre, $pais, $id);

                if ($stmt->execute()) {
                    $mensaje = "Editorial actualizada correctamente.";
                    $tipo_mensaje = "ok";
                    $modo = "agregar";
                    $id_form = $nombre_form = $pais_form = "";
                } else {
                    $mensaje = "Error al actualizar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();
            } 
            else {
                $nuevoId = generarNuevoIdEditorial($conexion);
                $sql = "INSERT INTO tbl_editoriales (Id_editorial, Nombre, Pais) VALUES (?, ?, ?)";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("sss", $nuevoId, $nombre, $pais);

                if ($stmt->execute()) {
                    $mensaje = "Editorial agregada correctamente.";
                    $tipo_mensaje = "ok";
                } else {
                    $mensaje = "Error al agregar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();
            }
        }

    } elseif ($accion === 'editar_cargar') {

        $id = $_POST['id_editorial'] ?? '';

        if ($id !== '') {
            $sql = "SELECT Id_editorial, Nombre, Pais FROM tbl_editoriales WHERE Id_editorial = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $id_form = $row['Id_editorial'];
                $nombre_form = $row['Nombre'];
                $pais_form = $row['Pais'];
                $modo = "editar";
            }
            $stmt->close();
        }

    } elseif ($accion === 'eliminar') {

        $id = $_POST['id_editorial'] ?? '';
        if ($id !== '') {
            $sql = "DELETE FROM tbl_editoriales WHERE Id_editorial = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id);

            if ($stmt->execute()) {
                $mensaje = "Editorial eliminada correctamente.";
                $tipo_mensaje = "ok";
            } else {
                $mensaje = "Error al eliminar: " . $conexion->error;
                $tipo_mensaje = "error";
            }
            $stmt->close();
        }

    } elseif ($accion === 'cancelar') {

        $id_form = $nombre_form = $pais_form = "";
        $modo = "agregar";

    }
}

$sql_lista = "SELECT Id_editorial, Nombre, Pais FROM tbl_editoriales ORDER BY Nombre ASC";
$lista = $conexion->query($sql_lista);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Configurar Editoriales Principales</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossorigin="anonymous" referrerpolicy="no-referrer" />

    <?php if (file_exists(__DIR__ . '/styles.css')): ?>
        <link rel="stylesheet" href="styles.css?v=<?php echo time(); ?>">
    <?php endif; ?>

    <style>
    .modal-container{width:100%;padding:20px;display:flex;justify-content:center;}
    .modal-card{width:500px;max-height:90vh;background:#fff;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.25);overflow-y:auto;}
    body{background:transparent;}
    .modal-header{display:flex;justify-content:space-between;align-items:center;background:#3B2423;color:#fff;padding:14px 18px;}
    .modal-header h2{font-size:18px;font-weight:600;}
    .cerrar-modal{background:transparent;border:none;color:#fff;font-size:22px;font-weight:bold;cursor:pointer;padding:0 8px;}
    .modal-body{padding:16px 18px 20px;}
    .mensaje{padding:8px 10px;margin-bottom:10px;border-radius:3px;font-size:16px;}
    .mensaje.ok{background:#e3f6e1;border:1px solid #4aa36c;color:#2c6b45;}
    .mensaje.error{background:#ffe5e5;border:1px solid:#ff6b6b;color:#a32323;}
    .label-strong{font-size:16px;font-weight:600;margin-bottom:6px;display:block;}
    .lista-items{margin:6px 0 18px;border-top:1px solid #ddd;}
    .fila-item{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #ddd;}
    .item-text{font-size:16px;color:#333;}
    .acciones{display:flex;gap:6px;}
    .accion-form{display:inline-block;margin:0;}
    .icon-btn{border:none;background:transparent;cursor:pointer;padding:6px;font-size:16px;}
    .form-principal{display:flex;flex-direction:column;gap:10px;}
    .form-principal input[type="text"]{width:100%;padding:8px;border:1px solid:#ccc;border-radius:3px;font-size:15px;}
    .botones{display:flex;justify-content:space-between;gap:10px;margin-top:8px;}
    .btn{flex:1;padding:8px 0;font-size:15px;border-radius:3px;cursor:pointer;border:1px solid transparent;}
    .btn-secundario{background:#ffffff;color:#444;border-color:#ccc;}
    .btn-primario{background:#3B2423;color:#fff;border-color:#3B2423;}
    .modal-card {overflow-x: hidden;}
    .icon-btn.delete i {color: #d11a1a;}
    </style>
</head>
<body>

<div class="modal-container">
    <div class="modal-card">
        <div class="modal-header">
            <h2>Configurar Editoriales Principales</h2>
            <button class="cerrar-modal" onclick="window.parent.closeModal && window.parent.closeModal('modalEditoriales')">×</button>
        </div>

        <div class="modal-body">
            <?php if ($mensaje !== ""): ?>
                <div class="mensaje <?php echo ($tipo_mensaje === 'ok') ? 'ok' : 'error'; ?>">
                    <?php echo htmlspecialchars($mensaje); ?>
                </div>
            <?php endif; ?>

            <p class="label-strong">Editoriales existentes:</p>

            <div class="lista-items">
                <?php while ($fila = $lista->fetch_assoc()): ?>
                    <div class="fila-item">
                        <span class="item-text"><?php echo htmlspecialchars($fila['Nombre'] . ($fila['Pais'] ? " ({$fila['Pais']})" : "")); ?></span>

                        <div class="acciones">
                            <form method="post" class="accion-form">
                                <input type="hidden" name="id_editorial" value="<?php echo htmlspecialchars($fila['Id_editorial']); ?>">
                                <button type="submit" name="accion" value="editar_cargar" class="icon-btn" title="Editar">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </form>

                            <form method="post" class="accion-form" onsubmit="return confirm('¿Eliminar esta editorial?');">
                                <input type="hidden" name="id_editorial" value="<?php echo htmlspecialchars($fila['Id_editorial']); ?>">
                                <button type="submit" name="accion" value="eliminar" class="icon-btn delete" title="Eliminar">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>

            <form method="post" class="form-principal">
                <label class="label-strong">Nombre de la editorial:</label>
                <input type="text" name="nombre" placeholder="<?php echo ($modo === 'editar') ? '' : 'Nueva editorial'; ?>" value="<?php echo htmlspecialchars($nombre_form); ?>">

                <label class="label-strong">País:</label>
                <input type="text" name="pais" placeholder="<?php echo ($modo === 'editar') ? '' : 'País'; ?>" value="<?php echo htmlspecialchars($pais_form); ?>">

                <input type="hidden" name="id_editorial" value="<?php echo htmlspecialchars($id_form); ?>">
                <input type="hidden" name="modo" value="<?php echo htmlspecialchars($modo); ?>">

                <div class="botones">
                    <button type="submit" name="accion" value="cancelar" class="btn btn-secundario">Cancelar</button>
                    <button type="submit" name="accion" value="agregar_guardar" class="btn btn-primario"><?php echo ($modo === 'editar') ? 'Guardar' : 'Agregar'; ?></button>
                </div>
            </form>
        </div>
    </div>
</div>

</body>
</html>