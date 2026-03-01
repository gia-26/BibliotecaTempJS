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
    background: #3B2423;
    color: #fff;
    padding: 14px 18px;
}

.modal-header h2 {
    font-size: 18px;
    font-weight: 600;
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

.encabezado-areas {
    display: grid;
    grid-template-columns: 2fr 1fr 0.6fr; 
    font-size: 16px;
    font-weight: 600;
    margin: 5px 0;
}

.lista-areas {
    border-top: 1px solid #ddd;
    margin-bottom: 18px;
}

.fila-area {
    display: grid;
    grid-template-columns: 2fr 1fr 0.6fr;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
}

.area-texto,
.estante-texto {
    font-size: 16px;
    color: #333;
}

.estante-texto {
    text-align: center;
}

</style>

<?php
require_once 'conexion.php';

// Mensajes
$mensaje = "";
$tipo_mensaje = "";

// Valores del formulario de abajo
$id_area_form = "";
$area_form    = "";
$estante_form = "";
$modo         = "agregar"; // agregar | editar

//  función para generar AC001, AC002, ... 
function generarNuevoIdArea($conexion) {
    $sql = "SELECT Id_area_conocimiento
            FROM tbl_areas_conocimiento
            ORDER BY Id_area_conocimiento DESC
            LIMIT 1";

    $res = $conexion->query($sql);

    if ($res && $res->num_rows > 0) {
        $row    = $res->fetch_assoc();
        $ultimo = $row['Id_area_conocimiento'];
        $num    = intval(substr($ultimo, 2));  
        $num++;
    } else {
        $num = 1;
    }

    return 'AC' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

//  ACCIONES (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'agregar_guardar') {

        $area    = trim($_POST['area'] ?? '');
        $estante = trim($_POST['estante'] ?? '');
        $id_area = trim($_POST['id_area'] ?? '');
        $modo    = $_POST['modo'] ?? 'agregar';

        if ($area === '' || $estante === '') {
            $mensaje = "Completa el área de conocimiento y el número de estante.";
            $tipo_mensaje = "error";

        } else {

            if ($modo === 'editar' && $id_area !== '') {

                $sql = "UPDATE tbl_areas_conocimiento
                        SET Area_conocimiento = ?, N_estante = ?
                        WHERE Id_area_conocimiento = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("sss", $area, $estante, $id_area);

                if ($stmt->execute()) {
                    $mensaje = "Área de conocimiento actualizada correctamente.";
                    $tipo_mensaje = "ok";
                    $modo = "agregar";
                    $id_area_form = "";
                    $area_form    = "";
                    $estante_form = "";
                } else {
                    $mensaje = "Error al actualizar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();

            } else {

                $nuevoId = generarNuevoIdArea($conexion);

                $sql = "INSERT INTO tbl_areas_conocimiento
                        (Id_area_conocimiento, Area_conocimiento, N_estante)
                        VALUES (?, ?, ?)";
                $stmt = $conexion->prepare($sql);
                $stmt->bind_param("sss", $nuevoId, $area, $estante);

                if ($stmt->execute()) {
                    $mensaje = "Área de conocimiento agregada correctamente.";
                    $tipo_mensaje = "ok";
                } else {
                    $mensaje = "Error al agregar: " . $conexion->error;
                    $tipo_mensaje = "error";
                }
                $stmt->close();
            }
        }

    } elseif ($accion === 'editar_cargar') {

        $id_area = trim($_POST['id_area'] ?? '');
        if ($id_area !== '') {
            $sql = "SELECT Id_area_conocimiento, Area_conocimiento, N_estante
                    FROM tbl_areas_conocimiento
                    WHERE Id_area_conocimiento = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_area);
            $stmt->execute();
            $resultado = $stmt->get_result();

            if ($fila = $resultado->fetch_assoc()) {
                $id_area_form = $fila['Id_area_conocimiento'];
                $area_form    = $fila['Area_conocimiento'];
                $estante_form = $fila['N_estante'];
                $modo         = "editar";
            }
            $stmt->close();
        }

    } elseif ($accion === 'eliminar') {

        $id_area = trim($_POST['id_area'] ?? '');
        if ($id_area !== '') {
            $sql = "DELETE FROM tbl_areas_conocimiento
                    WHERE Id_area_conocimiento = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("s", $id_area);

            if ($stmt->execute()) {
                $mensaje = "Área de conocimiento eliminada correctamente.";
                $tipo_mensaje = "ok";
            } else {
                $mensaje = "Error al eliminar: " . $conexion->error;
                $tipo_mensaje = "error";
            }
            $stmt->close();
        }

    } elseif ($accion === 'cancelar') {
        $id_area_form = "";
        $area_form    = "";
        $estante_form = "";
        $modo         = "agregar";
    }
}

//  LISTA DE ÁREAS
$sql_lista   = "SELECT Id_area_conocimiento, Area_conocimiento, N_estante
                FROM tbl_areas_conocimiento
                ORDER BY N_estante ASC";
$lista_areas = $conexion->query($sql_lista);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Configurar Áreas de Conocimiento</title>
    <link rel="stylesheet" href="style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossorigin="anonymous" />
</head>
<body>

<div class="modal-container">
    <div class="modal-card">

        <div class="modal-header">
            <h2>Configurar Áreas de Conocimiento</h2>
            <button class="cerrar-modal" onclick="window.parent.closeModal('modalAreas')">×</button>
        </div>

        <div class="modal-body">
            <?php if ($mensaje !== ""): ?>
                <div class="mensaje <?php echo $tipo_mensaje; ?>">
                    <?php echo htmlspecialchars($mensaje); ?>
                </div>
            <?php endif; ?>

            <p class="label-strong">Áreas existentes:</p>

            <div class="encabezado-areas">
                <span>Área conocimiento</span>
                <span>N. Estante</span>
                <span></span>
            </div>

            <div class="lista-areas">
                <?php while ($fila = $lista_areas->fetch_assoc()): ?>
                    <div class="fila-area">
                        <span class="area-texto">
                            <?php echo htmlspecialchars($fila['Area_conocimiento']); ?>
                        </span>

                        <span class="estante-texto">
                            <?php echo htmlspecialchars($fila['N_estante']); ?>
                        </span>

                        <div class="acciones">
                            <form method="post" class="accion-form">
                                <input type="hidden" name="id_area"
                                       value="<?php echo htmlspecialchars($fila['Id_area_conocimiento']); ?>">
                                <button type="submit" name="accion" value="editar_cargar"
                                        class="icon-btn edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                            </form>

                            <form method="post" class="accion-form"
                                  onsubmit="return confirm('¿Eliminar esta área?');">
                                <input type="hidden" name="id_area"
                                       value="<?php echo htmlspecialchars($fila['Id_area_conocimiento']); ?>">
                                <button type="submit" name="accion" value="eliminar"
                                        class="icon-btn delete">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>

            <form method="post" class="form-principal">
                <label class="label-strong">Área conocimiento:</label>
                <input type="text" name="area"
                       placeholder="<?php echo ($modo === 'editar') ? '' : 'Nueva área de conocimiento'; ?>"
                       value="<?php echo htmlspecialchars($area_form); ?>">

                <label class="label-strong">Número de Estante:</label>
                <input type="text" name="estante" id="estante" maxlength="10"
                       placeholder="<?php echo ($modo === 'editar') ? '' : 'Número de Estante'; ?>"
                       value="<?php echo htmlspecialchars($estante_form); ?>">

                <input type="hidden" name="id_area"
                       value="<?php echo htmlspecialchars($id_area_form); ?>">
                <input type="hidden" name="modo"
                       value="<?php echo htmlspecialchars($modo); ?>">

                <div class="botones">
                    <button type="submit" name="accion" value="cancelar"
                            class="btn btn-secundario">Cancelar</button>

                    <button type="submit" name="accion" value="agregar_guardar"
                            class="btn btn-primario">
                        <?php echo ($modo === 'editar') ? 'Guardar' : 'Agregar'; ?>
                    </button>
                </div>
            </form>
        </div>

    </div>
</div>

<!-- VALIDACIÓN PARA ESTANTE (SOLO NUMEROS + MÁXIMO 10) -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const inputEstante = document.getElementById('estante');
    if (!inputEstante) return;

    // Mensaje debajo del input
    const msgEstante = document.createElement('div');
    msgEstante.className = 'mensaje error';
    msgEstante.style.display = 'none';
    msgEstante.style.marginTop = '6px';
    inputEstante.parentNode.insertBefore(msgEstante, inputEstante.nextSibling);

    inputEstante.addEventListener('input', function () {

        let valor = inputEstante.value;

        // Si mete letras, se eliminan
        if (/[^0-9]/.test(valor)) {
            inputEstante.value = valor.replace(/[^0-9]/g, '');
            msgEstante.textContent = 'Solo se aceptan números.';
            msgEstante.style.display = 'block';
        } else {
            msgEstante.style.display = 'none';
        }

        //  LIMITE DE 10 DIGITOS
        if (inputEstante.value.length > 10) {
            inputEstante.value = inputEstante.value.slice(0, 10);
        }
    });
});
</script>

</body>
</html>
