<?php
require_once 'conexion.php';

// ----------------------------------------------
// MENSAJES
// ----------------------------------------------
$mensaje = "";
$tipo_mensaje = "";

// Variables del formulario
$id_genero_form = "";
$genero_form = "";
$modo = "agregar"; // agregar | editar

// ----------------------------------------------
// FUNCIÓN PARA GENERAR NUEVO ID GEN001, GEN002...
// ----------------------------------------------
function generarNuevoIdGenero($conexion) {
    $sql = "SELECT Id_genero FROM tbl_generos ORDER BY Id_genero DESC LIMIT 1";
    $res = $conexion->query($sql);

    if ($res && $res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $ultimo = $row['Id_genero'];  
        $num = intval(substr($ultimo, 3)); 
        $num++;
    } else {
        $num = 1;
    }

    return 'GEN' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

// ----------------------------------------------
// ACCIONES (POST)
// ----------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'agregar_guardar') {

        $genero = trim($_POST['genero'] ?? '');
        $id_genero = trim($_POST['id_genero'] ?? '');
        $modo = $_POST['modo'] ?? 'agregar';

        if ($genero === '') {
            $mensaje = "Ingresa el nombre del género.";
            $tipo_mensaje = "error";
        } else {

            // EDITAR
            if ($modo === 'editar' && $id_genero !== '') {

                $sql = "UPDATE tbl_generos SET Nombre = ? WHERE Id_genero = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $genero, $id_genero);

                if ($stmt->execute()) {
                    $mensaje = "Género actualizado correctamente.";
                    $tipo_mensaje = "ok";
                    $modo = "agregar";
                    $id_genero_form = "";
                    $genero_form = "";
                } else {
                    $mensaje = "Error al actualizar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();

            // AGREGAR
            } else {

                $nuevoID = generarNuevoIdGenero($conexion);

                $sql = "INSERT INTO tbl_generos (Id_genero, Nombre) VALUES (?, ?)";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $nuevoID, $genero);

                if ($stmt->execute()) {
                    $mensaje = "Género agregado correctamente.";
                    $tipo_mensaje = "ok";
                } else {
                    $mensaje = "Error al agregar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }

                $stmt->close();
            }
        }

    } elseif ($accion === 'editar_cargar') {

        $id_genero = trim($_POST['id_genero'] ?? '');

        if ($id_genero !== '') {
            $sql = "SELECT * FROM tbl_generos WHERE Id_genero = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_genero);
            $stmt->execute();
            $res = $stmt->get_result();

            if ($row = $res->fetch_assoc()) {
                $id_genero_form = $row['Id_genero'];
                $genero_form = $row['Nombre'];
                $modo = "editar";
            }
            $stmt->close();
        }

    } elseif ($accion === 'eliminar') {

        $id_genero = trim($_POST['id_genero'] ?? '');

        if ($id_genero !== '') {
            $sql = "DELETE FROM tbl_generos WHERE Id_genero = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_genero);

            if ($stmt->execute()) {
                $mensaje = "Género eliminado correctamente.";
                $tipo_mensaje = "ok";
            } else {
                $mensaje = "Error al eliminar: " . $conexion->error;
                $tipo_mensaje = "error";
            }
            $stmt->close();
        }

    } elseif ($accion === 'cancelar') {
        $id_genero_form = "";
        $genero_form = "";
        $modo = "agregar";
    }
}

// ----------------------------------------------
// LISTA DE GÉNEROS
// ----------------------------------------------
$sql_lista = "SELECT * FROM tbl_generos ORDER BY Nombre ASC";
$lista_generos = $conexion->query($sql_lista);

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configurar Géneros</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: "Segoe UI", Arial, sans-serif;
        }

        .modal-container {
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
        }

        .modal-card {
            width: 500px;
            max-height: 90vh;     
            background: #ffffff;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            overflow-y: auto;     
        }
        body {
            background: transparent;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cerrar-modal {
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
        }

        .cerrar-modal:hover {
            color: #dddddd;
        }

        .modal-header {
            background: #3B2423;
            color: #fff;
            padding: 14px 18px;
            text-align: center;
        }

        .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
        }

        .modal-body {
            padding: 16px 18px 20px;
        }

        .mensaje {
            padding: 8px 10px;
            margin-bottom: 10px;
            border-radius: 3px;
            font-size: 16px;
        }
        .mensaje.ok {
            background: #e3f6e1;
            border: 1px solid #4aa36c;
            color: #2c6b45;
        }
        .mensaje.error {
            background: #ffe5e5;
            border: 1px solid #ff6b6b;
            color: #a32323;
        }

        .label-strong {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .lista-generos {
            margin: 6px 0 18px;
            border-top: 1px solid #ddd;
        }

        .fila-genero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #ddd;
        }

        .genero-texto {
            font-size: 16px;
            color: #333;
        }

        /* Acciones */
        .acciones {
            display: flex;
            gap: 4px;
        }

        .accion-form {
            display: inline-block;
        }

        .icon-btn {
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 4px;
            font-size: 16px;
        }

        .icon-btn.edit i {
            color: #333;
        }

        .icon-btn.delete i {
            color: #d11a1a;
        }

        .icon-btn:focus {
            outline: none;
        }

        .form-principal {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .form-principal label {
            margin-top: 4px;
        }

        .form-principal input[type="text"] {
            width: 100%;
            padding: 7px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 16px;
        }

        .botones {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 8px;
        }

        .btn {
            flex: 1;
            padding: 8px 0;
            font-size: 16px;
            border-radius: 3px;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .btn-secundario {
            background: #ffffff;
            color: #444;
            border-color: #ccc;
        }

        .btn-primario {
            background: #3B2423;
            color: #ffffff;
            border-color: #3B2423;
        }

        .btn:hover {
            opacity: 0.9;
        }
    </style>

    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

<div class="modal-container">
    <div class="modal-card">

        <div class="modal-header">
            <h2>Configurar Géneros</h2>
            <button class="cerrar-modal" onclick="window.parent.closeModal('modalGeneros')">×</button>
        </div>

        <div class="modal-body">

            <?php if ($mensaje !== ""): ?>
                <div class="mensaje <?php echo $tipo_mensaje; ?>">
                    <?php echo htmlspecialchars($mensaje); ?>
                </div>
            <?php endif; ?>

            <p class="label-strong">Géneros existentes:</p>

            <!-- Lista -->
            <div class="lista-generos">
                <?php while ($fila = $lista_generos->fetch_assoc()): ?>
                    <div class="fila-genero">
                        <span class="genero-texto">
                            <?php echo htmlspecialchars($fila['Nombre']); ?>
                        </span>

                        <div class="acciones">
                            <!-- EDITAR -->
                            <form method="post" class="accion-form">
                                <input type="hidden" name="id_genero"
                                       value="<?php echo htmlspecialchars($fila['Id_genero']); ?>">
                                <button type="submit" name="accion" value="editar_cargar"
                                        class="icon-btn edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </form>

                            <!-- ELIMINAR -->
                            <form method="post" class="accion-form"
                                  onsubmit="return confirm('¿Eliminar este género?');">
                                <input type="hidden" name="id_genero"
                                       value="<?php echo htmlspecialchars($fila['Id_genero']); ?>">
                                <button type="submit" name="accion" value="eliminar"
                                        class="icon-btn delete">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>

            <!-- Formulario principal -->
            <form method="post" class="form-principal">
                <label for="genero" class="label-strong">Género:</label>
                <input type="text" id="genero" name="genero"
                       placeholder="<?php echo ($modo === 'editar') ? '' : 'Nuevo género'; ?>"
                       value="<?php echo htmlspecialchars($genero_form); ?>">

                <input type="hidden" name="id_genero"
                       value="<?php echo htmlspecialchars($id_genero_form); ?>">
                <input type="hidden" name="modo"
                       value="<?php echo htmlspecialchars($modo); ?>">

                <div class="botones">
                    <button type="submit" name="accion" value="cancelar"
                            class="btn btn-secundario">
                        Cancelar
                    </button>

                    <button type="submit" name="accion" value="agregar_guardar"
                            class="btn btn-primario">
                        <?php echo ($modo === 'editar') ? 'Editar' : 'Agregar'; ?>
                    </button>
                </div>
            </form>

        </div>

    </div>
</div>

</body>
</html>