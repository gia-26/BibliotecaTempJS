<?php
require_once 'conexion.php';

$mensaje = "";
$tipo_mensaje = "";

$id_autor_form = "";
$nombre_form   = "";
$modo = "agregar";


function generarNuevoIdAutor($conexion) {
    $sql = "SELECT Id_autor FROM tbl_autores ORDER BY Id_autor DESC LIMIT 1";
    $res = $conexion->query($sql);
    if ($res && $row = $res->fetch_assoc()) {
        $ultimo = $row['Id_autor'];
        $num = intval(substr($ultimo, 3)) + 1;
    } else {
        $num = 1;
    }
    return 'AUT' . str_pad($num, 3, '0', STR_PAD_LEFT);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'agregar_guardar') {
        $nombre = trim($_POST['nombre'] ?? '');
        $id_autor = $_POST['id_autor'] ?? '';
        $modo = $_POST['modo'] ?? 'agregar';

        $regexNombre = "/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u";

        if ($nombre === '') {
            $mensaje = "Escribe el nombre del autor.";
            $tipo_mensaje = "error";
        } elseif (!preg_match($regexNombre, $nombre)) {
            $mensaje = "El nombre solo puede contener letras, espacios, tildes, ñ, ü, apóstrofos y guiones.";
            $tipo_mensaje = "error";
            $nombre_form = $nombre;
        } else {

            if ($modo === 'editar' && $id_autor !== '') {
                $sql = "UPDATE tbl_autores SET Nombre = ? WHERE Id_autor = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $nombre, $id_autor);
                if ($stmt->execute()) {
                    $mensaje = "Autor actualizado correctamente.";
                    $tipo_mensaje = "ok";
                    $modo = "agregar";
                    $id_autor_form = "";
                    $nombre_form = "";
                } else {
                    $mensaje = "Error al actualizar: " . $conexion->error;
                    $tipo_mensaje = "error";
                    $nombre_form = $nombre;
                }
                $stmt->close();
            } else {
                $nuevoId = generarNuevoIdAutor($conexion);
                $sql = "INSERT INTO tbl_autores (Id_autor, Nombre) VALUES (?, ?)";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $nuevoId, $nombre);
                if ($stmt->execute()) {
                    $mensaje = "Autor agregado correctamente.";
                    $tipo_mensaje = "ok";
                } else {
                    $mensaje = "Error al agregar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();
            }
        }

    } elseif ($accion === 'editar_cargar') {
        $id = $_POST['id_autor'] ?? '';
        if ($id !== '') {
            $sql = "SELECT Id_autor, Nombre FROM tbl_autores WHERE Id_autor = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $res = $stmt->get_result();
            if ($row = $res->fetch_assoc()) {
                $id_autor_form = $row['Id_autor'];
                $nombre_form = $row['Nombre'];
                $modo = "editar";
            }
            $stmt->close();
        }
    } elseif ($accion === 'eliminar') {
        $id = $_POST['id_autor'] ?? '';
        if ($id !== '') {
            $sql = "DELETE FROM tbl_autores WHERE Id_autor = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id);
            if ($stmt->execute()) {
                $mensaje = "Autor eliminado correctamente.";
                $tipo_mensaje = "ok";
            } else {
                $mensaje = "Error al eliminar: " . $conexion->error;
                $tipo_mensaje = "error";
            }
            $stmt->close();
        }
    } elseif ($accion === 'cancelar') {
        $id_autor_form = "";
        $nombre_form = "";
        $modo = "agregar";
    }
}


$sql_lista = "SELECT Id_autor, Nombre FROM tbl_autores ORDER BY Nombre ASC";
$lista_autores = $conexion->query($sql_lista);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Configurar Autores Principales</title>


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
    .mensaje.error{background:#ffe5e5;border:1px solid #ff6b6b;color:#a32323;}
    .label-strong{font-size:16px;font-weight:600;margin-bottom:6px;display:block;}
    .lista-items{margin:6px 0 18px;border-top:1px solid #ddd;}
    .fila-item{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #ddd;}
    .item-text{font-size:16px;color:#333;}
    .acciones{display:flex;gap:6px;}
    .accion-form{display:inline-block;margin:0;}
    .icon-btn{border:none;background:transparent;cursor:pointer;padding:6px;font-size:16px;}
    .form-principal{display:flex;flex-direction:column;gap:10px;}
    .form-principal input[type="text"]{width:100%;padding:8px;border:1px solid #ccc;border-radius:3px;font-size:15px;}
    .botones{display:flex;justify-content:space-between;gap:10px;margin-top:8px;}
    .btn{flex:1;padding:8px 0;font-size:15px;border-radius:3px;cursor:pointer;border:1px solid transparent;}
    .btn-secundario{background:#ffffff;color:#444;border-color:#ccc;}
    .btn-primario{background:#3B2423;color:#fff;border-color:#3B2423;}
    .icon-btn.delete i {color: #d11a1a;}
    </style>
</head>
<body>

<div class="modal-container">
    <div class="modal-card">
        <div class="modal-header">
            <h2>Configurar Autores Principales</h2>
            <button class="cerrar-modal" onclick="window.parent.closeModal && window.parent.closeModal('modalAutores')">×</button>
        </div>

        <div class="modal-body">
            <?php if ($mensaje !== ""): ?>
                <div class="mensaje <?php echo ($tipo_mensaje === 'ok') ? 'ok' : 'error'; ?>">
                    <?php echo htmlspecialchars($mensaje); ?>
                </div>
            <?php endif; ?>

            <p class="label-strong">Autores existentes:</p>

            <div class="lista-items">
                <?php while ($fila = $lista_autores->fetch_assoc()): ?>
                    <div class="fila-item">
                        <span class="item-text"><?php echo htmlspecialchars($fila['Nombre']); ?></span>

                        <div class="acciones">
                            <form method="post" class="accion-form" style="display:inline-block;">
                                <input type="hidden" name="id_autor" value="<?php echo htmlspecialchars($fila['Id_autor']); ?>">
                                <button type="submit" name="accion" value="editar_cargar" class="icon-btn" title="Editar">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </form>

                            <form method="post" class="accion-form" onsubmit="return confirm('¿Eliminar este autor?');" style="display:inline-block;">
                                <input type="hidden" name="id_autor" value="<?php echo htmlspecialchars($fila['Id_autor']); ?>">
                                <button type="submit" name="accion" value="eliminar" class="icon-btn delete" title="Eliminar">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>

            <form method="post" class="form-principal" novalidate>
                <label class="label-strong">Nombre del autor:</label>
                <input type="text" name="nombre" id="nombre-autor" placeholder="<?php echo ($modo === 'editar') ? '' : 'Nuevo autor principal'; ?>" value="<?php echo htmlspecialchars($nombre_form); ?>">

                <input type="hidden" name="id_autor" value="<?php echo htmlspecialchars($id_autor_form); ?>">
                <input type="hidden" name="modo" value="<?php echo htmlspecialchars($modo); ?>">

                <div class="botones">
                    <button type="submit" name="accion" value="cancelar" class="btn btn-secundario">Cancelar</button>
                    <button type="submit" name="accion" value="agregar_guardar" class="btn btn-primario"><?php echo ($modo === 'editar') ? 'Guardar' : 'Agregar'; ?></button>
                </div>
            </form>
        </div>
    </div>
</div>


<script>
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('nombre-autor');
    if (!input) return;


    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/u;

    const msg = document.createElement('div');
    msg.className = 'mensaje error';
    msg.style.display = 'none';
    msg.style.marginTop = '6px';
    input.parentNode.insertBefore(msg, input.nextSibling);

    input.addEventListener("input", () => {
        let value = input.value;

        if (/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/u.test(value)) {
            input.value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]/gu, '');
            msg.textContent = 'Solo se pueden usar letras.El tipo de caracter es invalido';
            msg.style.display = 'block';
        } else {
            msg.style.display = 'none';
        }
    });


    const form = input.closest('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const valor = input.value.trim();
            if (valor === '') {
                return;
            }
            if (!regex.test(valor)) {
                e.preventDefault();
                msg.textContent = 'El nombre solo puede contener letras, espacios, tildes, ñ, ü, apóstrofos y guiones.';
                msg.style.display = 'block';
                input.focus();
            }
        });
    }
});
</script>

</body>
</html>