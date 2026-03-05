<?php 
  session_start(); 
  if (!isset($_SESSION['idTipoUsuario'])) 
  {
    header("Location: login.php");
    exit();
  }
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal - Biblioteca UTHH</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --modal-bg: #e6d7c8;
      --texto-marron: #3b2423;
      --boton-marron: #3b2423;
      --sombra: rgba(59, 38, 35, 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background-color: var(--modal-bg);
      color: var(--texto-marron);
      line-height: 1.6;
    }

    header {
      background-color: var(--boton-marron);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    header h1 {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 300;
      letter-spacing: 1px;
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      position: relative;
      padding: 0.5rem 0;
    }

    nav a:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #fff;
      transition: width 0.3s;
    }

    nav a:hover:after,
    nav a.active:after {
      width: 100%;
    }

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

    .user-info i {
      font-size: 1.2rem;
    }

    .logout-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 150px;
      background: linear-gradient(rgba(59, 38, 35, 0.7), rgba(59, 38, 35, 0.7)), 
                  url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80');
      background-size: cover;
      background-position: center;
      text-align: center;
      color: white;
      padding: 0 2rem;
    }

    .hero h2 {
      font-size: 2rem;
      font-weight: 300;
      margin-bottom: 1rem;
    }

    main {
      padding: 2rem;
      max-width: 1400px;
      margin: auto;
    }

    .search-section {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .search-box {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .search-input {
      flex-grow: 1;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

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

    .btn:hover {
      background-color: #2d1d1d;
      transform: translateY(-2px);
    }

    .table-container {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 5px 15px var(--sombra);
      margin-bottom: 2rem;
      overflow-x: auto;
    }

    .catalog-table {
      width: 100%;
      border-collapse: collapse;
    }

    .catalog-table th {
      background-color: var(--boton-marron);
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 500;
    }

    .catalog-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .catalog-table tr:hover {
      background-color: #f9f5f0;
    }

    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--texto-marron);
      font-weight: 300;
    }

    .form-section {
      background-color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 5px 15px var(--sombra);
    }

    .personal-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--texto-marron);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .config-btn {
      background: none;
      border: none;
      color: var(--boton-marron);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      padding: 0.2rem;
      border-radius: 4px;
    }

    .config-btn:hover {
      background-color: var(--modal-bg);
      transform: scale(1.1);
    }

    .form-input, .form-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: var(--texto-marron);
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #e0e0e0;
    }

    /* Estilos para los modales */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      overflow-y: auto;
    }

    .modal-content {
      position: relative;
      background-color: white;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px var(--sombra);
      max-width: 800px;
      width: 90%;
      animation: modalFadeIn 0.3s;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      font-size: 1.8rem;
      font-weight: 300;
      color: var(--texto-marron);
    }

    .close {
      color: #aaa;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.3s;
    }

    .close:hover {
      color: var(--texto-marron);
    }

    .modal-form-container {
      margin-bottom: 2rem;
    }

    .modal-form-group {
      margin-bottom: 1.5rem;
    }

    .modal-form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--texto-marron);
    }

    .modal-form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .modal-form-control:focus {
      outline: none;
      border-color: var(--boton-marron);
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .checkbox-group input {
      margin-right: 0.5rem;
    }

    .btn-edit {
      background-color: #4a7c59;
    }

    .btn-edit:hover {
      background-color: #3a6548;
    }

    .btn-delete {
      background-color: #c94c4c;
    }

    .btn-delete:hover {
      background-color: #b03a3a;
    }

    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    .modal-table-container {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px var(--sombra);
      overflow-x: auto;
    }

    .modal-table {
      width: 100%;
      border-collapse: collapse;
    }

    .modal-table th, .modal-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .modal-table th {
      background-color: #f8f8f8;
      font-weight: 600;
      color: var(--texto-marron);
    }

    .modal-table tr:hover {
      background-color: #f9f9f9;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    /* Estilos para los enlaces de acción en la tabla */
    .action-link {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
      text-decoration: none;
      color: white;
      font-weight: 500;
      transition: all 0.3s;
    }

    .action-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .action-edit {
      background-color: #4a7c59;
    }

    .action-edit:hover {
      background-color: #3a6548;
    }

    .action-delete {
      background-color: #c94c4c;
    }

    .action-delete:hover {
      background-color: #b03a3a;
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
    
    footer {
      background-color: var(--boton-marron);
      color: #fff;
      text-align: center;
      padding: 2rem 1rem;
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

    .footer-section h3 {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .footer-section p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.8rem;
      display: block;
    }

    .copyright {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
      }
      
      nav {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .user-info {
        flex-direction: column;
        gap: 1rem;
      }
      
      .hero h2 {
        font-size: 1.5rem;
      }
      
      .search-box {
        flex-direction: column;
        align-items: stretch;
      }
      
      .personal-form {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }
      
      .actions {
        flex-direction: column;
      }
    }

  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Gestión de Personal</h2>
  </section>

  <?php include 'header-dashboard.php'; ?>

  <main>
    <div class="search-section">
      <div class="search-box">
        <span class="search-label">Buscar personal ID:</span>
        <input type="text" class="search-input" placeholder="Ingresa ID del personal...">
        <button class="btn"><i class="fas fa-search"></i> Buscar</button>
      </div>
    </div>
    
    <div class="table-container">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Id personal</th>
            <th>Nombre</th>
            <th>Apellido paterno</th>
            <th>Apellido materno</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PEB002</td>
            <td>María</td>
            <td>Gómez</td>
            <td>Sánchez</td>
            <td>Jefe de Departamento</td>
            <td class="actions">
              <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
              <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
            </td>
          </tr>
          <tr>
            <td>PEB003</td>
            <td>Carlos</td>
            <td>Martínez</td>
            <td>García</td>
            <td>Jefe de Departamento</td>
            <td class="actions">
              <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
              <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
            </td>
          </tr>
          <tr>
            <td>PEB004</td>
            <td>Ana</td>
            <td>Rodríguez</td>
            <td>Fernández</td>
            <td>Bibliotecario</td>
            <td class="actions">
              <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
              <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
            </td>
          </tr>
          <tr>
            <td>PEB006</td>
            <td>Juan</td>
            <td>Pérez</td>
            <td>López</td>
            <td>Jefe de Departamento</td>
            <td class="actions">
              <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
              <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="form-section">
      <h3 class="section-title">Personal bibliotecario</h3>
      <form class="personal-form">
        <div class="form-group">
          <label class="form-label">No. Trabajador</label>
          <input type="text" class="form-input" readonly>
        </div>
        
        <div class="form-group">
          <label class="form-label">ID personal</label>
          <input type="text" class="form-input" readonly>
        </div>
        
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-input" readonly>
        </div>
        
        <div class="form-group">
          <label class="form-label">Apellido paterno</label>
          <input type="text" class="form-input" readonly>
        </div>
        
        <div class="form-group">
          <label class="form-label">Apellido materno</label>
          <input type="text" class="form-input" readonly>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            Tipo de rol:
            <button type="button" class="config-btn" onclick="openModal('modal-tipos-rol')" title="Configurar tipos de rol">
              <i class="fas fa-cog"></i>
            </button>
          </label>
          <select class="form-select">
            <option>Jefe de Departamento</option>
            <option>Bibliotecario</option>
            <option>Coordinador/a bibliotecario</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input type="password" class="form-input" placeholder="Ingresa contraseña">
        </div>
        
        <div class="form-group">
          <label class="form-label">Confirmar contraseña</label>
          <input type="password" class="form-input" placeholder="Confirma contraseña">
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-secondary">Eliminar</button>
          <button type="button" class="btn btn-secondary">Editar</button>
          <button type="submit" class="btn">Guardar</button>
        </div>
      </form>
    </div>
  </main>

  <!-- Modal Tipos de Rol -->
  <div id="modal-tipos-rol" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Gestión de Tipos de Rol</h2>
        <span class="close" onclick="closeModal('modal-tipos-rol')">&times;</span>
      </div>
      
      <div class="modal-form-container">
        <form id="role-type-form">
          <div class="modal-form-group">
            <label for="id-role-type">ID Tipo de Rol</label>
            <input type="text" id="id-role-type" class="modal-form-control" placeholder="TR001">
          </div>
          
          <div class="modal-form-group">
            <label for="role-type-name">Tipo de Rol</label>
            <input type="text" id="role-type-name" class="modal-form-control" placeholder="Jefe de Departamento">
          </div>
          
          <div class="checkbox-group">
            <input type="checkbox" id="edit-mode-role-type" checked>
            <label for="edit-mode-role-type">Habilitar edición</label>
          </div>
          
          <div class="checkbox-group">
            <input type="checkbox" id="delete-mode-role-type">
            <label for="delete-mode-role-type">Habilitar eliminación</label>
          </div>
          
          <button type="submit" class="btn">
            <i class="fas fa-save"></i> Guardar
          </button>
        </form>
      </div>
      
      <div class="modal-table-container">
        <table class="modal-table">
          <thead>
            <tr>
              <th>ID Tipo de Rol</th>
              <th>Tipo de Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TR001</td>
              <td>Jefe de Departamento</td>
              <td class="actions">
                <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
              </td>
            </tr>
            <tr>
              <td>TR002</td>
              <td>Bibliotecario</td>
              <td class="actions">
                <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
              </td>
            </tr>
            <tr>
              <td>TR003</td>
              <td>Coordinador/a bibliotecario</td>
              <td class="actions">
                <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
              </td>
            </tr>
            <tr>
              <td>TR004</td>
              <td>Téc. Bibliotecario</td>
              <td class="actions">
                <a href="#" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                <a href="#" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <?php include 'footer.html'; ?>

  <script>
    // Funciones para abrir y cerrar modales
    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = function(event) {
      const modals = document.getElementsByClassName('modal');
      for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
          modals[i].style.display = 'none';
        }
      }
    }

    // Manejo de envío de formularios
    document.getElementById('role-type-form').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Tipo de rol guardado correctamente.');
      closeModal('modal-tipos-rol');
    });
  </script>
</body>
</html>