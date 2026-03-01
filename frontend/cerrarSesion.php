<?php
    session_start();        // Asegura que haya una sesión activa
    $_SESSION = [];         // Vacía el arreglo de variables de sesión

    // Si hay una cookie de sesión, elimínala del navegador
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Finalmente, destruye la sesión en el servidor
    session_destroy();

    // Redirige al login
    header('Location: login.php');
    exit();
?>