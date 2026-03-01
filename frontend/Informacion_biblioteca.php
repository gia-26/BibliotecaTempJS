<?php
session_start(); 
if (!isset($_SESSION['idTipoUsuario'])) 
{
    header("Location: login.php");
    exit();
}
require_once 'conexion.php';

// Función para obtener información actual de la biblioteca
function obtenerInformacionBiblioteca($conexion) {
    $sql = "SELECT * FROM tbl_informacion_biblioteca WHERE Id = ?";
    $stmt = $conexion->prepare($sql);
    $id = 1; // ✅ Definir la variable ANTES de usarla
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $info = $result->fetch_assoc();
        $stmt->close();
        return $info;
    } else {
        $stmt->close();
        // Si no existe, lo creamos con campos vacíos
        $sqlInsert = "INSERT INTO tbl_informacion_biblioteca (Id, QuienesSomos, NuestraHistoria, Mision, Vision, Objetivo) 
                      VALUES (?, '', '', '', '', '')";
        $stmtInsert = $conexion->prepare($sqlInsert);
        $id = 1; // ✅ Definir la variable ANTES de usarla
        $stmtInsert->bind_param("i", $id);
        if ($stmtInsert->execute()) {
            $stmtInsert->close();
            // Volver a consultar
            $stmt = $conexion->prepare($sql);
            $id = 1; // ✅ Definir la variable ANTES de usarla
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $info = $result->fetch_assoc();
            $stmt->close();
            return $info;
        }
        $stmtInsert->close();
    }
    return null;
}

// Obtener información actual
$infoBiblioteca = obtenerInformacionBiblioteca($conexion);

// =========================================================================
// Actualizar Presentación
// =========================================================================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_presentacion'])) {
    
    $quienesSomos = trim($_POST['presentacion_contenido']); // 👈 Aplicar trim
    
    // 🔒 Validación PHP: Campo no vacío
    if (empty($quienesSomos)) {
        echo "<script>alert('Error: El contenido de \"¿Quiénes Somos?\" no puede estar vacío.');</script>";
    } else {
        // Uso de consultas preparadas para mayor seguridad
        $stmt = $conexion->prepare("UPDATE tbl_informacion_biblioteca SET QuienesSomos = ? WHERE Id = ?");
        $id = 1; // ✅ Definir la variable ANTES de usarla
        $stmt->bind_param("si", $quienesSomos, $id);
        
        if ($stmt->execute()) {
            echo "<script>alert('Presentación actualizada correctamente.');</script>";
            $infoBiblioteca = obtenerInformacionBiblioteca($conexion);
        } else {
            echo "<script>alert('Error al actualizar la presentación: " . $stmt->error . "');</script>";
        }
        $stmt->close();
    }
}

// =========================================================================
// Actualizar Historia
// =========================================================================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_historia'])) {
    
    $historia = trim($_POST['historia_contenido']); // 👈 Aplicar trim
    
    // 🔒 Validación PHP: Campo no vacío
    if (empty($historia)) {
        echo "<script>alert('Error: El contenido de la Historia no puede estar vacío.');</script>";
    } else {
        $stmt = $conexion->prepare("UPDATE tbl_informacion_biblioteca SET NuestraHistoria = ? WHERE Id = ?");
        $id = 1; // ✅ Definir la variable ANTES de usarla
        $stmt->bind_param("si", $historia, $id);
        
        if ($stmt->execute()) {
            echo "<script>alert('Historia actualizada correctamente.');</script>";
            $infoBiblioteca = obtenerInformacionBiblioteca($conexion);
        } else {
            echo "<script>alert('Error al actualizar la historia: " . $stmt->error . "');</script>";
        }
        $stmt->close();
    }
}

// =========================================================================
// Actualizar Misión, Visión u Objetivo
// =========================================================================
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update_mision_vision'])) {
    
    $seleccion = $_POST['seleccion_mvo'];
    $contenido = trim($_POST['mvo_contenido']); // 👈 Aplicar trim
    
    // 🔒 Validación PHP: Campo no vacío
    if (empty($contenido)) {
        echo "<script>alert('Error: El contenido seleccionado no puede estar vacío.');</script>";
    } else {
        $campo = "";
        switch($seleccion) {
            case 'mision': $campo = "Mision"; break;
            case 'vision': $campo = "Vision"; break;
            case 'objetivo': $campo = "Objetivo"; break;
        }
        
        if (!empty($campo)) {
            // Se usa la consulta preparada y se inyecta el nombre del campo de forma segura
            $sql = "UPDATE tbl_informacion_biblioteca SET $campo = ? WHERE Id = ?";
            $stmt = $conexion->prepare($sql);
            $id = 1; // ✅ Definir la variable ANTES de usarla
            $stmt->bind_param("si", $contenido, $id);
            
            if ($stmt->execute()) {
                echo "<script>alert('" . ucfirst($seleccion) . " actualizada correctamente.');</script>";
                $infoBiblioteca = obtenerInformacionBiblioteca($conexion);
            } else {
                echo "<script>alert('Error al actualizar: " . $stmt->error . "');</script>";
            }
            $stmt->close();
        } else {
            echo "<script>alert('Error: Selección de campo no válida.');</script>";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quiénes Somos - Biblioteca UTHH</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
:root {
  --modal-bg: #e6d7c8;
  --texto-marron: #3b2423;
  --boton-marron: #3b2626;
  --sombra: rgba(59, 38, 35, 0.1);
  --dorado: #b8860b;
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
body { background-color: var(--modal-bg); color: var(--texto-marron); line-height: 1.6; }

/*header {
  background-color: var(--boton-marron);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky; top: 0; z-index: 100;
}
header h1 { color: #fff; font-size: 1.8rem; font-weight: 300; letter-spacing: 1px; }
nav a { color: #fff; margin-left: 2rem; text-decoration: none; font-weight: 500; transition: all 0.3s; position: relative; }
nav a:after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 0; background-color: #fff; transition: width 0.3s; }
nav a:hover:after { width: 100%; }*/

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.account-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info i {
  font-size: 1.2rem;
}

.hero {
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  height: 300px;
  background: linear-gradient(rgba(59, 38, 35, 0.7), rgba(59, 38, 35, 0.7)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80');
  background-size: cover; background-position: center; text-align: center; color: white; padding: 0 2rem;
}
.hero h2 { font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem; }
.hero p { font-size: 1.2rem; max-width: 600px; }

main { padding: 3rem 2rem; max-width: 1200px; margin: auto; }

.section-header { text-align: center; margin-bottom: 3rem; }
.section-header h2 { font-size: 2rem; font-weight: 300; margin-bottom: 0.5rem; position: relative; display: inline-block; }
.section-header h2:after { content: ''; position: absolute; width: 50%; height: 2px; background-color: var(--boton-marron); bottom: -10px; left: 25%; }

.content-card {
  background-color: white;
  border-radius: 8px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px var(--sombra);
}
.content-card h3 { font-size: 1.8rem; font-weight: 400; margin-bottom: 1.5rem; color: var(--boton-marron); display: flex; align-items: center; gap: 0.8rem; }
.content-card h3 i { color: var(--dorado); }
.content-card p { margin-bottom: 1.5rem; text-align: justify; }

.admin-panel {
  background-color: rgba(59, 38, 35, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  border-left: 4px solid var(--dorado);
}
.admin-panel h4 { font-size: 1.2rem; margin-bottom: 1rem; color: var(--boton-marron); display: flex; align-items: center; gap: 0.5rem; }
.admin-panel h4 i { color: var(--dorado); }

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }

/* Textareas grandes */
textarea.form-control {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border 0.3s;
  min-height: 150px;
  resize: vertical;
  line-height: 1.5;
}
textarea.form-control:focus { border-color: var(--boton-marron); outline: none; }

/* Selects / combo boxes normales */
select.form-control {
  width: 100%;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  line-height: 1.4;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}
select.form-control:focus { border-color: var(--boton-marron); outline: none; }

.btn {
  display: inline-block;
  background-color: var(--boton-marron);
  color: #fff;
  padding: 0.7rem 1.5rem;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}
.btn:hover { background-color: #2d1d1d; transform: translateY(-2px); }

footer {
  background-color: var(--boton-marron);
  color: #fff;
  text-align: center;
  padding: 2.5rem 1rem;
  margin-top: 4rem;
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: left;
}
.footer-section h3 { font-size: 1.2rem; margin-bottom: 1.5rem; font-weight: 500; }
.footer-section p { color: rgba(255, 255, 255, 0.8); margin-bottom: 0.8rem; display: block; }
.copyright { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; }

.mision-vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.mv-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 15px var(--sombra);
  text-align: center;
  border-top: 4px solid var(--dorado);
}
.mv-card h4 { font-size: 1.5rem; font-weight: 400; margin-bottom: 1rem; color: var(--boton-marron); }
.mv-card p { text-align: justify; }

@media (max-width: 768px) {
  header { flex-direction: column; padding: 1rem; }
  nav { margin-top: 1rem; }
  nav a { margin: 0 0.5rem; }
  .hero h2 { font-size: 2rem; }
}
</style>
</head>
<body>

<?php include 'header.php'; ?>

<section class="hero">
  <h2>¿Quiénes Somos?</h2>
  <p>Conoce la historia y misión de la Biblioteca "Mtro. Sergio Saúl Figueroa Balderas"</p>
</section>

<?php include 'header-dashboard.php'; ?>

<main>
<div class="section-header">
  <h2>Nuestra Biblioteca</h2>
  <p>Un espacio dedicado al conocimiento y desarrollo académico</p>
</div>

<div class="content-card">
  <h3><i class="fas fa-info-circle"></i> ¿Quiénes Somos?</h3>
  <p id="presentacion-texto">
    <?php echo !empty($infoBiblioteca['QuienesSomos']) ? nl2br(htmlspecialchars($infoBiblioteca['QuienesSomos'])) : 'La Biblioteca "Mtro. Sergio Saúl Figueroa Balderas" de la Universidad Tecnológica de la Huasteca Hidalguense, es un área de apoyo en el desarrollo de las actividades académicas...'; ?>
  </p>
  <div class="admin-panel">
    <h4><i class="fas fa-edit"></i> Modificar Presentación</h4>
    <form method="POST" id="update-presentacion-form" onsubmit="return validarPresentacion()">
      <div class="form-group">
        <label for="presentacion-contenido">Contenido de "¿Quiénes Somos?"</label>
        <textarea id="presentacion-contenido" name="presentacion_contenido" class="form-control"><?php echo htmlspecialchars($infoBiblioteca['QuienesSomos'] ?? ''); ?></textarea>
      </div>
      <button type="submit" name="update_presentacion" class="btn">Guardar Cambios</button>
    </form>
  </div>
</div>

<div class="content-card">
  <h3><i class="fas fa-history"></i> Nuestra Historia</h3>
  <p id="historia-texto">
    <?php echo !empty($infoBiblioteca['NuestraHistoria']) ? nl2br(htmlspecialchars($infoBiblioteca['NuestraHistoria'])) : 'La historia de la Biblioteca inicia en 1997, apoyando las actividades académicas de la universidad...'; ?>
  </p>
  <div class="admin-panel">
    <h4><i class="fas fa-edit"></i> Modificar Nuestra Historia</h4>
    <form method="POST" id="update-historia-form" onsubmit="return validarHistoria()">
      <div class="form-group">
        <label for="historia-contenido">Contenido de Nuestra Historia</label>
        <textarea id="historia-contenido" name="historia_contenido" class="form-control"><?php echo htmlspecialchars($infoBiblioteca['NuestraHistoria'] ?? ''); ?></textarea>
      </div>
      <button type="submit" name="update_historia" class="btn">Guardar Cambios</button>
    </form>
  </div>
</div>

<div class="content-card">
  <h3><i class="fas fa-bullseye"></i> Misión, Visión y Objetivo</h3>
  <div class="mision-vision-grid">
    <div class="mv-card"><h4>Misión</h4><p id="mision-texto"><?php echo nl2br(htmlspecialchars($infoBiblioteca['Mision'] ?? '')); ?></p></div>
    <div class="mv-card"><h4>Visión</h4><p id="vision-texto"><?php echo nl2br(htmlspecialchars($infoBiblioteca['Vision'] ?? '')); ?></p></div>
    <div class="mv-card"><h4>Objetivo</h4><p id="objetivo-texto"><?php echo nl2br(htmlspecialchars($infoBiblioteca['Objetivo'] ?? '')); ?></p></div>
  </div>
  <div class="admin-panel">
    <h4><i class="fas fa-edit"></i> Modificar Misión, Visión u Objetivo</h4>
    <form method="POST" id="update-mision-vision-form" onsubmit="return validarMVO()">
      <div class="form-group">
        <label for="seleccion-mvo">Seleccionar qué modificar</label>
        <select id="seleccion-mvo" name="seleccion_mvo" class="form-control">
          <option value="mision">Misión</option>
          <option value="vision">Visión</option>
          <option value="objetivo">Objetivo</option>
        </select>
      </div>
      <div class="form-group">
        <label for="mvo-contenido">Contenido</label>
        <textarea id="mvo-contenido" name="mvo_contenido" class="form-control"><?php echo htmlspecialchars($infoBiblioteca['Mision'] ?? ''); ?></textarea>
      </div>
      <button type="submit" name="update_mision_vision" class="btn">Guardar Cambios</button>
    </form>
  </div>
</div>

</main>

<?php // include 'footer.html'; ?>

<script>
// ----------------------------------------------------
// 🟢 LÓGICA DE VALIDACIÓN (LADO DEL CLIENTE)
// ----------------------------------------------------

// Función genérica para validar si un campo de texto está vacío
function validarCampoVacio(idCampo, nombreCampo) {
    const campo = document.getElementById(idCampo);
    // Usamos .trim() para quitar espacios en blanco al inicio y al final
    if (campo.value.trim() === "") {
        alert(`⚠ El campo de "${nombreCampo}" no puede estar vacío.`);
        campo.focus();
        return false;
    }
    return true;
}

// 1. Validación para Presentación
function validarPresentacion() {
    if (!validarCampoVacio('presentacion-contenido', '¿Quiénes Somos?')) {
        return false;
    }
    return confirm('¿Estás seguro de que deseas guardar los cambios en la Presentación?');
}

// 2. Validación para Historia
function validarHistoria() {
    if (!validarCampoVacio('historia-contenido', 'Nuestra Historia')) {
        return false;
    }
    return confirm('¿Estás seguro de que deseas guardar los cambios en la Historia?');
}

// 3. Validación para Misión, Visión u Objetivo
function validarMVO() {
    const seleccion = document.getElementById('seleccion-mvo').value;
    
    if (!validarCampoVacio('mvo-contenido', seleccion.charAt(0).toUpperCase() + seleccion.slice(1))) {
        return false;
    }
    return confirm(`¿Estás seguro de que deseas guardar los cambios en la ${seleccion.charAt(0).toUpperCase() + seleccion.slice(1)}?`);
}


// ----------------------------------------------------
// Lógica para cambiar contenido del textarea según selección de Misión/Visión/Objetivo
// ----------------------------------------------------
document.getElementById('seleccion-mvo').addEventListener('change', function() {
    const valor = this.value;
    let contenido = '';
    // Los datos PHP se pasan al JS. Se usa addslashes para manejar comillas correctamente.
    <?php
    $mision_js = addslashes($infoBiblioteca['Mision'] ?? '');
    $vision_js = addslashes($infoBiblioteca['Vision'] ?? '');
    $objetivo_js = addslashes($infoBiblioteca['Objetivo'] ?? '');
    ?>
    
    if(valor === 'mision') contenido = "<?php echo $mision_js; ?>";
    else if(valor === 'vision') contenido = "<?php echo $vision_js; ?>";
    else if(valor === 'objetivo') contenido = "<?php echo $objetivo_js; ?>";
    
    document.getElementById('mvo-contenido').value = contenido;
});

// Inicializar el contenido del textarea de MVO al cargar la página (se usa Misión por defecto)
document.addEventListener('DOMContentLoaded', function() {
    const defaultContent = "<?php echo $mision_js; ?>";
    document.getElementById('mvo-contenido').value = defaultContent;
});
</script>
<?php include 'footer.html'; ?>
</body>
</html>