<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acción Exitosa (Modal)</title>
    <link rel="stylesheet" href="estilo.css"> 
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #808080; 
        }

        .modal {
            display: flex;
            position: fixed; 
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%; 
            height: 100%; 
            background-color: rgba(0,0,0,0.4);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: #fefefe; 
            padding: 0; 
            width: 80%; 
            max-width: 350px; 
            border-radius: 8px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
            position: relative;
            overflow: hidden; 
        }

        .modal-header {
            padding: 10px 20px;
            background-color: #3b2626;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 18px;
        }

        .success-icon {
            margin-bottom: 10px; 
            line-height: 1; 
        }

        .success-icon::before { 
            content: "\2713"; 
            font-size: 50px; 
            color: #4CAF50;
            display: block;
        }

        .close-button {
            display: none; 
        }

        .modal-body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 120px;
            color: #333;
            line-height: 1.5;
            text-align: center;
        }

        .modal-body p {
            margin-top: 5px;
            margin-bottom: 0;
        }

        .modal-footer {
            padding: 10px 20px;
            background-color: #fefefe; 
            border-top: 1px solid #eee; 
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            text-align: right; 
        }

        .modal-button {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }

        .modal-button.primary {
            background-color: #3b2626;
            color: white;
        }

        .modal-button.primary:hover {
            background-color: #683d3d;
        }
    </style>
</head>
<body>
    <button id="openModal" style="display: none;">Realizar Acción</button>

    <div id="successModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div class="modal-header">
                <h2>Acción Exitosa</h2>
            </div>
            
            <div class="modal-body">
                <div class="success-icon"></div> 
                <?php htmlspecialchars ($_GET['mensaje'])?>
            </div>
            
            <div class="modal-footer">
                <button id="acceptButton" class="modal-button primary">Aceptar</button>
            </div>
        </div>
    </div>
    
    <script>
        // Obtener elementos del DOM
        const modal = document.getElementById('successModal');
        const acceptButton = document.getElementById('acceptButton');
        
        // Función para cerrar el modal
        function closeModal() {
            modal.style.display = 'none';
            // Aquí puedes agregar cualquier otra acción que necesites después de cerrar el modal
            console.log('Modal cerrado');
        }
        
        // Cerrar modal al hacer clic en el botón Aceptar
        acceptButton.addEventListener('click', closeModal);
        
        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // También puedes agregar funcionalidad para cerrar con la tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>