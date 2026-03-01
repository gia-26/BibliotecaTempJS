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
  <title>Devoluciones - Biblioteca UTHH</title>
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

    .filter-select {
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      background-color: white;
      min-width: 150px;
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

    .btn-small {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }

    .btn-danger {
      background-color: #d9534f;
    }

    .btn-danger:hover {
      background-color: #c9302c;
    }

    .btn-warning {
      background-color: #f0ad4e;
    }

    .btn-warning:hover {
      background-color: #ec971f;
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
    }

  </style>
</head>
<body>

  <?php include 'header.php'; ?>

  <section class="hero">
    <h2>Gestión de Devoluciones</h2>
  </section>

  <?php include 'header-dashboard.php'; ?>

  <main>
    <div class="search-section">
      <div class="search-box">
        <span class="search-label">Elegir un filtro:</span>
        <select class="filter-select">
          <option value="id_usuario">ID de usuario</option>
          <option value="id_libro">ID del libro</option>
        </select>
        <input type="text" class="search-input" placeholder="Buscar...">
        <button class="btn"><i class="fas fa-search"></i> Buscar</button>
      </div>
    </div>
    
    <div class="table-container">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Id del usuario</th>
            <th>Nombre</th>
            <th>Id del libro</th>
            <th>Título</th>
            <th>Fecha de préstamo</th>
            <th>Fecha de devolución</th>
            <th>Estado</th>
            <th>Devolver</th>
            <th>Renovar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ALU001</td>
            <td>Pedro</td>
            <td>LIB003</td>
            <td>El laberinto de la...</td>
            <td>22/07/2025</td>
            <td>27/07/2025</td>
            <td>Expirado</td>
            <td><button class="btn btn-small btn-danger">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
          <tr>
            <td>ALU001</td>
            <td>Pedro</td>
            <td>LIB001</td>
            <td>Cien años de sola...</td>
            <td>24/07/2025</td>
            <td>24/07/2025</td>
            <td>Expirado</td>
            <td><button class="btn btn-small btn-danger">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
          <tr>
            <td>ALU002</td>
            <td>Laura</td>
            <td>LIB006</td>
            <td>La florena</td>
            <td>15/07/2025</td>
            <td>20/07/2025</td>
            <td>Expirado</td>
            <td><button class="btn btn-small btn-danger">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
          <tr>
            <td>ALU003</td>
            <td>Jorge</td>
            <td>LIB005</td>
            <td>La ciudad y los p...</td>
            <td>22/07/2025</td>
            <td>01/08/2025</td>
            <td>Expirado</td>
            <td><button class="btn btn-small btn-danger">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
          <tr>
            <td>ALU005</td>
            <td>Miguel</td>
            <td>LIB004</td>
            <td>Ficciones</td>
            <td>21/07/2025</td>
            <td>31/07/2025</td>
            <td>Expirado</td>
            <td><button class="btn btn-small btn-danger">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <h3 class="section-title">Multas</h3>
    
    <div class="table-container">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Apellido paterno</th>
            <th>Apellido materno</th>
            <th>Título del libro</th>
            <th>Fecha de devolución</th>
            <th>Fecha de entrega</th>
            <th>Días excedidos</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Laura</td>
            <td>Díaz</td>
            <td>Martínez</td>
            <td>La región más trans...</td>
            <td>17/01/2025</td>
            <td>20/07/2025</td>
            <td>183</td>
            <td>4348.08</td>
          </tr>
          <tr>
            <td>Jorge</td>
            <td>López</td>
            <td>Hernández</td>
            <td>La ciudad y los perros</td>
            <td>16/07/2025</td>
            <td>20/07/2025</td>
            <td>4</td>
            <td>95.04</td>
          </tr>
          <tr>
            <td>Sofía</td>
            <td>García</td>
            <td>Rodríguez</td>
            <td>El laberinto de la sola...</td>
            <td>18/07/2025</td>
            <td>21/07/2025</td>
            <td>3</td>
            <td>71.28</td>
          </tr>
          <tr>
            <td>Laura</td>
            <td>Díaz</td>
            <td>Martínez</td>
            <td>La florena</td>
            <td>20/07/2025</td>
            <td>24/07/2025</td>
            <td>94</td>
            <td>2233.44</td>
          </tr>
          <tr>
            <td>Miguel</td>
            <td>Fernández</td>
            <td>Pérez</td>
            <td>La florena</td>
            <td>20/07/2025</td>
            <td>23/07/2025</td>
            <td>3</td>
            <td>71.28</td>
          </tr>
          <tr>
            <td>Pedro</td>
            <td>Sánchez</td>
            <td>Gómez</td>
            <td>El laberinto de la sola...</td>
            <td>27/07/2025</td>
            <td>27/07/2025</td>
            <td>87</td>
            <td>2067.12</td>
          </tr>
          <tr>
            <td>Pedro</td>
            <td>Sánchez</td>
            <td>Gómez</td>
            <td>Cien años de soledad</td>
            <td>24/07/2025</td>
            <td></td>
            <td>30</td>
            <td>2138.4</td>
          </tr>
          <tr>
            <td>López</td>
            <td>López</td>
            <td>Hernández</td>
            <td>La ciudad y los perros</td>
            <td>01/08/2025</td>
            <td></td>
            <td>32</td>
            <td>1948.32</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <?php include 'footer.html'; ?>
</body>
</html>