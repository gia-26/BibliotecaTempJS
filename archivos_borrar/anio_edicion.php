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

.lista-anios {
    margin: 6px 0 18px;
    border-top: 1px solid #ddd;
}

.fila-anio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #ddd;
}

.anio-texto {
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


<?php
require_once 'conexion.php';

// Mensajes
$mensaje = "";
$tipo_mensaje = "";

// Valores del formulario de abajo
$id_anio_form = "";
$anio_form    = "";
$modo         = "agregar"; // agregar | editar

//  función para generar AE001, AE002, ... 
function generarNuevoId($conexion) {
    $sql = "SELECT Id_anio_edicion
            FROM tbl_anios_edicion
            ORDER BY Id_anio_edicion DESC
            LIMIT 1";

    $res = $conexion->query($sql);

    if ($res && $row = $res->fetch_assoc()) {
        // Ej: AE006
        $ultimo = $row['Id_anio_edicion'];
        $num    = intval(substr($ultimo, 2)); // 6
        $num++;
    } else {
        $num = 1;
    }

    return 'AE' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

//  ACCIONES (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    // AGREGAR o GUARDAR CAMBIO
    if ($accion === 'agregar_guardar') {

        $anio    = trim($_POST['anio'] ?? '');
        $id_anio = $_POST['id_anio'] ?? '';
        $modo    = $_POST['modo'] ?? 'agregar';

        if ($anio === '') {
            $mensaje = "Escribe el año de edición.";
            $tipo_mensaje = "error";
        } elseif (!ctype_digit($anio) || strlen($anio) != 4) {
            $mensaje = "El año debe ser numérico de 4 dígitos (ej. 2024).";
            $tipo_mensaje = "error";
        } else {

            // EDITAR
            if ($modo === 'editar' && $id_anio !== '') {

                $sql = "UPDATE tbl_anios_edicion
                        SET Anio_edicion = ?
                        WHERE Id_anio_edicion = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $anio, $id_anio);

                if ($stmt->execute()) {
                    $mensaje = "Año de edición actualizado correctamente.";
                    $tipo_mensaje = "ok";
                    $modo = "agregar";
                    $id_anio_form = "";
                    $anio_form    = "";
                } else {
                    $mensaje = "Error al actualizar.";
                    $tipo_mensaje = "error";
                }
                $stmt->close();

            // AGREGAR
            } else {

                $nuevoId = generarNuevoId($conexion);

                $sql = "INSERT INTO tbl_anios_edicion
                        (Id_anio_edicion, Anio_edicion)
                        VALUES (?, ?)";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("ss", $nuevoId, $anio);

                if ($stmt->execute()) {
                    $mensaje = "Año de edición agregado correctamente.";
                    $tipo_mensaje = "ok";
                } else {
                    $mensaje = "Error al agregar.";
                    $tipo_mensaje = "error";
                }
                $stmt->close();
            }
        }

    // CARGAR DATOS PARA EDITAR (icono lápiz)
    } elseif ($accion === 'editar_cargar') {

        $id_anio = $_POST['id_anio'] ?? '';
        if ($id_anio !== '') {
            $sql = "SELECT Id_anio_edicion, Anio_edicion
                    FROM tbl_anios_edicion
                    WHERE Id_anio_edicion = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_anio);
            $stmt->execute();
            $resultado = $stmt->get_result();

            if ($fila = $resultado->fetch_assoc()) {
                $id_anio_form = $fila['Id_anio_edicion'];
                $anio_form    = $fila['Anio_edicion'];
                $modo         = "editar";
            }
            $stmt->close();
        }

    // ELIMINAR (icono elimar)
    } elseif ($accion === 'eliminar') {

        $id_anio = $_POST['id_anio'] ?? '';
        if ($id_anio !== '') {
            $sql = "DELETE FROM tbl_anios_edicion
                    WHERE Id_anio_edicion = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_anio);

            if ($stmt->execute()) {
                $mensaje = "Año de edición eliminado correctamente.";
                $tipo_mensaje = "ok";
            } else {
                $mensaje = "Error al eliminar.";
                $tipo_mensaje = "error";
            }
            $stmt->close();
        }

    // CANCELAR (limpia el formulario)
    } elseif ($accion === 'cancelar') {
        $id_anio_form = "";
        $anio_form    = "";
        $modo         = "agregar";
    }
}

//  LISTA DE AÑOS
$sql_lista   = "SELECT Id_anio_edicion, Anio_edicion
                FROM tbl_anios_edicion
                ORDER BY Anio_edicion DESC";
$lista_anios = $conexion->query($sql_lista);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configurar Años de Edición</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
    <!-- Iconos Font Awesome -->
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

<div class="modal-container">
    <div class="modal-card">

        <div class="modal-header">
    <h2>Configurar Años de Edición</h2>
    <button class="cerrar-modal" onclick="window.parent.closeModal('modalAnios')">×</button>
</div>


        <div class="modal-body">
            <?php if ($mensaje !== ""): ?>
                <div class="mensaje <?php echo $tipo_mensaje; ?>">
                    <?php echo htmlspecialchars($mensaje); ?>
                </div>
            <?php endif; ?>

            <p class="label-strong">Años existentes:</p>

            <!-- Lista -->
            <div class="lista-anios">
                <?php while ($fila = $lista_anios->fetch_assoc()): ?>
                    <div class="fila-anio">
                        <span class="anio-texto">
                            <?php echo htmlspecialchars($fila['Anio_edicion']); ?>
                        </span>

                        <div class="acciones">
                            <!-- EDITAR -->
                            <form method="post" class="accion-form">
                                <input type="hidden" name="id_anio"
                                       value="<?php echo htmlspecialchars($fila['Id_anio_edicion']); ?>">
                                <button type="submit" name="accion" value="editar_cargar"
                                        class="icon-btn edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </form>

                            <!-- ELIMINAR -->
                            <form method="post" class="accion-form"
                                  onsubmit="return confirm('¿Eliminar este año?');">
                                <input type="hidden" name="id_anio"
                                       value="<?php echo htmlspecialchars($fila['Id_anio_edicion']); ?>">
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
                <label for="anio" class="label-strong">Año edición:</label>
                <input type="text" id="anio" name="anio"
                       placeholder="<?php echo ($modo === 'editar') ? '' : 'Nuevo año de edición'; ?>"
                       value="<?php echo htmlspecialchars($anio_form); ?>">

                <input type="hidden" name="id_anio"
                       value="<?php echo htmlspecialchars($id_anio_form); ?>">
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
<script>
document.addEventListener('DOMContentLoaded', function () {

    const inputAnio = document.getElementById('anio');
    const form      = document.querySelector('.form-principal');

    // Crear mensaje de error debajo del input
    const msgCampo = document.createElement('div');
    msgCampo.className = 'mensaje error';
    msgCampo.style.display = 'none';
    msgCampo.style.marginTop = '6px';
    inputAnio.parentNode.insertBefore(msgCampo, inputAnio.nextSibling);

    // Validación mientras escribe
    inputAnio.addEventListener('input', function () {

        let valor = inputAnio.value;

        if (/[^0-9]/.test(valor)) {
            inputAnio.value = valor.replace(/[^0-9]/g, '');
            msgCampo.textContent = 'Solo se aceptan números.';
            msgCampo.style.display = 'block';
        } else {
            msgCampo.style.display = 'none';
        }

        if (valor.length > 4) {
            inputAnio.value = valor.slice(0, 4);
        }
    });

    // VALIDACIÓN AL ENVIAR
    form.addEventListener('submit', function (e) {

        const accion = document.activeElement.value;

        // SI ES CANCELAR → NO VALIDAR
        if (accion === 'cancelar') {
            msgCampo.style.display = 'none';
            return;
        }

        // VALIDAR SOLO EN GUARDAR
        const valor = inputAnio.value.trim();

        if (!/^\d{4}$/.test(valor)) {
            e.preventDefault();
            msgCampo.textContent = 'El año debe ser numérico de 4 dígitos (ej. 2024).';
            msgCampo.style.display = 'block';
            inputAnio.focus();
        }
    });
});
</script>
</body>
</html>
