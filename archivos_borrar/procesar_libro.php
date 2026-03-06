<?php
require_once 'conexion.php';

// Configuración para subir imágenes
$upload_dir = __DIR__ . "/libros_img/";
$allowed_types = ['jpg', 'jpeg', 'png'];
$max_size = 2 * 1024 * 1024; // 2MB

// Crear directorio si no existe
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Procesar el formulario cuando se envía
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    $accion = $_POST['accion'];
    $id_libro = $_POST['id_libro'] ?? '';

    $campos_requeridos = [
        'titulo', 
        'sinopsis', 
        'edicion', 
        'id_editorial', 
        'id_autor', 
        'id_genero', 
        'id_anio_edicion', 
        'isbn', 
        'id_area_conocimiento',
        'no_ejemplares'
    ];

    if ($accion === 'editar' || $accion === 'eliminar') {
        if (empty($id_libro)) {
            echo "<script>alert('ID de libro no proporcionado.');</script>";
            exit;
        }
    }
    if ($accion === 'eliminar') {
        // Eliminar imagen si existe
        if (!empty($nombre_imagen)) {
            $imagen_path = $upload_dir . $nombre_imagen;
            if (file_exists($imagen_path)) {
                unlink($imagen_path);
            }
        }
        // Luego eliminar el libro de la base de datos
        eliminarLibro($id_libro, $conexion);
        exit;
    }
    
    // VALIDAR CAMPOS
    $campos_vacios = [];
    foreach ($campos_requeridos as $campo) {
        if (empty($_POST[$campo])) {
            $campos_vacios[] = $campo;
        }
    }

    // Si hay campos vacíos
    if (!empty($campos_vacios)) {
        $campos_texto = implode(', ', $campos_vacios);
        echo "<script>alert('Los siguientes campos son requeridos: $campos_texto');</script>";
        echo "<script>window.history.back();</script>";
        exit;
    }
    // Procesar imagen si se subió una nueva
    $nombre_imagen = $_POST['imagen_nombre'] ?? '';
    
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['imagen'];
        $nombre_original = $file['name'];
        $file_extension = strtolower(pathinfo($nombre_original, PATHINFO_EXTENSION));
        $file_size = $file['size'];
        
        // Validaciones
        if (!in_array($file_extension, $allowed_types)) {
            $error = "Tipo de archivo no permitido. Use JPG, JPEG o PNG.";
        } elseif ($file_size > $max_size) {
            $error = "El archivo es demasiado grande. Máximo 2MB.";
        } else {
            // Limpiar el nombre del archivo (remover caracteres especiales)
            $nombre_limpio = preg_replace('/[^a-zA-Z0-9._-]/', '_', $nombre_original);
            $nombre_limpio = str_replace(' ', '_', $nombre_limpio);
            
            // Si el nombre ya existe, agregar timestamp
            $upload_path = $upload_dir . $nombre_limpio;
            if (file_exists($upload_path)) {
                $nombre_sin_extension = pathinfo($nombre_limpio, PATHINFO_FILENAME);
                $nombre_limpio = $nombre_sin_extension . '_' . time() . '.' . $file_extension;
                $upload_path = $upload_dir . $nombre_limpio;
            }
            
            // Mover archivo al servidor
            if (move_uploaded_file($file['tmp_name'], $upload_path)) {
                // Guardar el nombre original en la base de datos
                $nombre_imagen = $nombre_limpio;
                
                // Si había una imagen anterior, eliminarla
                if (!empty($_POST['imagen_anterior']) && $_POST['imagen_anterior'] != $nombre_imagen) {
                    $imagen_anterior = $upload_dir . $_POST['imagen_anterior'];
                    if (file_exists($imagen_anterior)) {
                        unlink($imagen_anterior);
                    }
                }
                $mensaje = "Imagen '$nombre_original' subida correctamente.";
            } else {
                $error = "Error al subir la imagen.";
            }
        }
    }

    // Obtener todos los datos
    $datos = [
        'titulo' => trim($_POST['titulo']),
        'sinopsis' => trim($_POST['sinopsis']),
        'edicion' => trim($_POST['edicion']),
        'id_editorial' => $_POST['id_editorial'],
        'id_autor' => $_POST['id_autor'],
        'id_genero' => $_POST['id_genero'],
        'id_anio_edicion' => $_POST['id_anio_edicion'],
        'isbn' => trim($_POST['isbn']),
        'id_area_conocimiento' => $_POST['id_area_conocimiento'],
        'imagen' => $nombre_imagen,
        'no_ejemplares' => $_POST['no_ejemplares'],
        'subgeneros' => $_POST['subgeneros'] ?? '',                
        'coautores' => $_POST['coautores'] ?? '',
        'editoriales' => $_POST['editoriales'] ?? ''
    ];
    // Procesar según la acción
    switch ($accion) {
        case 'guardar':  
            guardarLibro($id_libro, $datos, $conexion);
            break;
            
        case 'editar':
            editarLibro($id_libro, $datos, $conexion);
            break;
    }
}

function eliminarLibro($id_libro, $conexion){
    if (empty($id_libro)) {
        echo "<script>alert('ID de libro no proporcionado para su eliminación.');</script>";
        return;
    }

    $sql = "UPDATE tbl_libros SET Estado = 0 WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    
    if ($stmt->execute()) {
        echo "<script>alert('Libro eliminado correctamente.');</script>";
        echo "<script>window.parent.location.href = 'libros.php';</script>";
    } else {
        echo "<script>alert('Error al eliminar el libro: " . $stmt->error . "');</script>";
    }

}

function editarLibro($id_libro, $datos, $conexion) {
    if (empty($id_libro)) {
        echo "<script>alert('ID de libro no proporcionado para edición.');</script>";
        return;
    }

    $titulo = $datos['titulo'];
    $isbn = $datos['isbn'];
    $edicion = $datos['edicion'];
    $sinopsis = $datos['sinopsis'];
    $imagen = $datos['imagen'];
    $id_anio_edicion = $datos['id_anio_edicion'];
    $id_area_conocimiento = $datos['id_area_conocimiento'];
    $id_genero = $datos['id_genero'];
    $id_autor = $datos['id_autor'];
    $id_editorial = $datos['id_editorial'];
    
    // UPDATE libro existente
    $sql = "UPDATE tbl_libros SET Titulo = ?, Sinopsis = ?, Edicion = ?, Id_editorial = ?, Id_autor = ?, Id_genero = ?, Id_anio_edicion = ?, ISBN = ?, Id_area_conocimiento = ?, Imagen = ? WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssssssssss", $titulo, $sinopsis, $edicion, $id_editorial, $id_autor, $id_genero, $id_anio_edicion, $isbn, $id_area_conocimiento, $imagen, $id_libro);
    
    if ($stmt->execute()) {
        guardarEjemplares($id_libro, $datos['no_ejemplares'], $conexion);
        guardarComplementos($id_libro, $datos, $conexion);
        echo "<script>window.alert('Libro actualizado correctamente.');</script>";
        // Redirigir o recargar la página
        echo "<script>window.parent.closeModal('modalLibros')</script>";
        echo "<script>window.parent.location.reload();</script>";
    } else {
        echo "<script>alert('Error al actualizar el libro: " . $stmt->error . "');</script>";
    }
}

function guardarLibro($id_libro, $datos, $conexion) {
    if (!empty($id_libro)) {
        echo "<script>alert('El ID de libro ya existe. Use la opción de editar.');</script>";
        echo "<script>window.location.href = 'libros.php';</script>";
        return;
    }

    $titulo = $datos['titulo'] ?? '';
    $isbn = $datos['isbn'] ?? '';
    $edicion = $datos['edicion'] ?? '';
    $sinopsis = $datos['sinopsis'] ?? '';
    $imagen = $datos['imagen'] ?? '';
    $id_anio_edicion = $datos['id_anio_edicion'] ?? '';
    $id_area_conocimiento = $datos['id_area_conocimiento'] ?? '';
    $id_genero = $datos['id_genero'] ?? '';
    $id_autor = $datos['id_autor'] ?? '';
    $id_editorial = $datos['id_editorial'] ?? '';
    $estado = 1; // Activo
    
    if (empty($id_libro)) {
        // GENERAR NUEVO ID PARA LIBRO
        $id_libro = generarNuevoIdLibro($conexion);
        // INSERT nuevo libro
        $sql = "INSERT INTO tbl_libros (Id_libro, Titulo, Sinopsis, Edicion, Id_editorial, Id_autor, Id_genero, Id_anio_edicion, ISBN, Id_area_conocimiento, Estado, Imagen) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ssssssssssis", $id_libro, $titulo, $sinopsis, $edicion, $id_editorial, $id_autor, $id_genero, $id_anio_edicion, $isbn, $id_area_conocimiento, $estado, $imagen);
    }
    if ($stmt->execute()) {
        guardarEjemplares($id_libro, $datos['no_ejemplares'], $conexion);
        guardarComplementos($id_libro, $datos, $conexion);
        echo "<script>alert('Libro guardado correctamente.');</script>";
        // Redirigir o recargar la página
        echo "<script>window.parent.closeModal('modalLibros')</script>";
        echo "<script>window.parent.location.reload();</script>";
    } else {
        echo "<script>alert('Error al guardar el libro: " . $stmt->error . "');</script>";
    }
}

function generarNuevoIdLibro($conexion) {
    $sql = "SELECT MAX(Id_libroAI) AS max_id FROM tbl_libros";
    $result = $conexion->query($sql);
    $row = $result->fetch_assoc();
    return "LIB00" . ($row['max_id'] + 1);
}

function guardarComplementos($id_libro, $datos, $conexion) {
    // Primero eliminar relaciones existentes
    eliminarRelacionesAnteriores($id_libro, $conexion);
    
    // Guardar subgéneros
    if (!empty($datos['subgeneros'])) {
        $subgeneros_array = json_decode($datos['subgeneros'], true);
        if (is_array($subgeneros_array)) {
            $sql = "INSERT INTO tbl_libros_generos (Id_genero, Id_libro) VALUES (?, ?)";
            $stmt = $conexion->prepare($sql);
            foreach ($subgeneros_array as $genero) {
                $stmt->bind_param("ss", $genero['idGenero'], $id_libro);
                $stmt->execute();
            }
        }
    }
    
    // Guardar coautores
    if (!empty($datos['coautores'])) {
        $coautores_array = json_decode($datos['coautores'], true);
        if (is_array($coautores_array)) {
            $sql = "INSERT INTO tbl_coautores (Id_autor, Id_libro) VALUES (?, ?)";
            $stmt = $conexion->prepare($sql);
            foreach ($coautores_array as $autor) {
                $stmt->bind_param("ss", $autor['idAutor'], $id_libro);
                $stmt->execute();
            }
        }
    }
    
    // Guardar editoriales adicionales
    if (!empty($datos['editoriales'])) {
        $editoriales_array = json_decode($datos['editoriales'], true);
        if (is_array($editoriales_array)) {
            $sql = "INSERT INTO tbl_libros_editoriales (Id_editorial, Id_libro) VALUES (?, ?)";
            $stmt = $conexion->prepare($sql);
            foreach ($editoriales_array as $editorial) {
                $stmt->bind_param("ss", $editorial['idEditorial'], $id_libro);
                $stmt->execute();
            }
        }
    }
}

function eliminarRelacionesAnteriores($id_libro, $conexion) {
    // Eliminar subgéneros anteriores
    $sql = "DELETE FROM tbl_libros_generos WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    $stmt->execute();
    
    // Eliminar coautores anteriores
    $sql = "DELETE FROM tbl_coautores WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    $stmt->execute();
    
    // Eliminar editoriales adicionales anteriores
    $sql = "DELETE FROM tbl_libros_editoriales WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    $stmt->execute();
}

function eliminarEjemplares($id_libro, $conexion) {
    // Eliminar ejemplares anteriores
    $sql = "DELETE FROM tbl_ejemplares WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    $stmt->execute();
}

function guardarEjemplares($id_libro, $no_ejemplares, $conexion) {
    eliminarEjemplares($id_libro, $conexion);
    $ultimoIdEjemplar = generarIdEjemplar($conexion);
    $sql = "INSERT INTO tbl_ejemplares (Id_ejemplar, Id_libro, Num_ejemplar, Id_estado_ejemplar) VALUES (?, ?, ?, ?)"; //EE01 Disponible
    $stmt = $conexion->prepare($sql);
    $estado = "EE001"; // Disponible

    if (generarNumEjemplar($id_libro, $conexion) < $no_ejemplares) { // 4 3 | 4 4 | 4 5 | 2 4
        for ($i = generarNumEjemplar($id_libro, $conexion); $i <= $no_ejemplares; $i++, $ultimoIdEjemplar++) {
            $id_ejemplar = "EJE00" . $ultimoIdEjemplar;
            $stmt->bind_param("ssis", $id_ejemplar, $id_libro, $i, $estado);
            $stmt->execute();
        }
    }
}

function generarIdEjemplar($conexion) {
    $sql = "SELECT MAX(Id_ejemplarAI) AS max_id FROM tbl_ejemplares";
    $result = $conexion->query($sql);
    $row = $result->fetch_assoc();
    return $row['max_id'] + 1;
}

function generarNumEjemplar($id_libro, $conexion) {
    $sql = "SELECT MAX(Num_ejemplar) AS max_num FROM tbl_ejemplares WHERE Id_libro = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $id_libro);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row['max_num'] + 1;
}
?>