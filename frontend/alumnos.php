<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumnos - Biblioteca UTHH</title>
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

    .student-form {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
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

    .actions {
      display: flex;
      gap: 0.5rem;
    }

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

    @media (max-width: 1024px) {
      .student-form {
        grid-template-columns: repeat(2, 1fr);
      }
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
      
      .student-form {
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

  <header>
    <h1>Administración UTHH</h1>
    <nav>
      <a href="./dashboard.html"><i class="fas fa-tachometer-alt"></i> Inicio</a>
      <a href="./prestamos.html"><i class="fas fa-exchange-alt"></i> Préstamos</a>
      <a href="./devoluciones.html"><i class="fas fa-undo-alt"></i> Devoluciones</a>
      <a href="./reportes.html"><i class="fas fa-chart-bar"></i> Reportes</a>
      <a href="./libros.html"><i class="fas fa-book"></i> Libros</a>
      <a href="./catalogo.html"><i class="fas fa-th-list"></i> Catálogo</a>
      <a href="./alumnos.html" class="active"><i class="fas fa-user-graduate"></i> Alumnos</a>
    </nav>
    <div class="user-info">
      <div class="user-details">
        <i class="fas fa-user-circle"></i>
        <span>Administrador</span>
      </div>
    </div>
  </header>

  <section class="hero">
    <h2>Gestión de Alumnos</h2>
  </section>

  <main>
    <div class="table-container">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Teléfono</th>
            <th>Código Postal</th>
            <th>Correo</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <?php
            //Incluir la conexión
            require_once 'conexion.php';

            $sql = "SELECT 
                      alum.Id_alumno AS id,
                      alum.Nombre,
                      alum.Apellido_P,
                      alum.Apellido_M,
                      alum.Telefono,
                      alum.Codigo_P,
                      alum.Calle,
                      alum.Colonia,
                      alum.N_exterior,
                      alum.N_interior,
                      alum.Correo,
                      carr.Nombre_carrera
                    FROM tbl_alumnos alum
                    INNER JOIN tbl_carreras carr ON alum.Id_carrera = carr.Id_carrera
                    WHERE alum.estado != 0;";

            //Ejecutar la consulta
            $resultado = $conexion->query($sql);
            if($resultado && $resultado->num_rows > 0)
            {

              while($alumno = $resultado->fetch_assoc())
              {
          ?>
                <tr>
                  <td><?php echo $alumno['Nombre']; ?></td>
                  <td><?php echo $alumno['Apellido_P']; ?></td>
                  <td><?php echo $alumno['Apellido_M']; ?></td>
                  <td><?php echo $alumno['Telefono']; ?></td>
                  <td><?php echo $alumno['Codigo_P']; ?></td>
                  <td><?php echo $alumno['Correo']; ?></td>
                  <td><?php echo $alumno['Nombre_carrera']; ?></td>
                  <td class="actions">
                    <a href="alumnoEditar.php?id=<?php echo $alumno['id']; ?>" class="action-link action-edit"><i class="fas fa-edit"></i> Editar</a>
                    <a href="borrarAlumno.php?id=<?php echo $alumno['id']; ?>" class="action-link action-delete"><i class="fas fa-trash"></i> Eliminar</a>
                  </td>
                </tr>
          <?php
              }
            }
          ?>
        </tbody>
      </table>
    </div>
    
    <div class="form-section">
      <h3 class="section-title">Registro de Alumnos</h3>
      <form method="POST" action="guardarAlumno.php" class="student-form">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-input" name="nombre" placeholder="Nombre del alumno">
        </div>
        
        <div class="form-group">
          <label class="form-label">Apellido Paterno</label>
          <input type="text" class="form-input" name="apellido_p" placeholder="Apellido paterno">
        </div>
        
        <div class="form-group">
          <label class="form-label">Apellido Materno</label>
          <input type="text" class="form-input" name="apellido_m" placeholder="Apellido materno">
        </div>
        
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input type="tel" class="form-input" name="telefono" placeholder="10 dígitos">
        </div>
        
        <div class="form-group">
          <label class="form-label">Código Postal</label>
          <input type="number" class="form-input" name="codigo_postal" placeholder="Código postal">
        </div>
        
        <div class="form-group">
          <label class="form-label">Calle</label>
          <input type="text" class="form-input" name="calle" placeholder="Nombre de la calle">
        </div>
        
        <div class="form-group">
          <label class="form-label">Colonia</label>
          <input type="text" class="form-input" name="colonia" placeholder="Nombre de la colonia">
        </div>
        
        <div class="form-group">
          <label class="form-label">Número Exterior</label>
          <input type="number" class="form-input" name="numero_exterior" placeholder="Número exterior">
        </div>
        
        <div class="form-group">
          <label class="form-label">Número Interior</label>
          <input type="number" class="form-input" name="numero_interior" placeholder="Número interior (opcional)">
        </div>
        
        <div class="form-group">
          <label class="form-label">Correo Electrónico</label>
          <input type="email" class="form-input" name="correo" placeholder="correo@uthh.edu.mx">
        </div>
        
        <div class="form-group">
          <label class="form-label">Carrera</label>
          <select class="form-select" name="carrera">
            <option value="">Selecciona una carrera</option>
            <?php
              $carreraSql = "SELECT Id_carrera AS idCarrera, Nombre_carrera AS carrera FROM tbl_carreras";
              $carreraResultado = $conexion->query($carreraSql);
              if($carreraResultado && $carreraResultado->num_rows > 0)
              {

                while($carrera = $carreraResultado->fetch_assoc())
                {
            ?>
            <option value="<?php echo $carrera['idCarrera']; ?>"><?php echo $carrera['carrera']; ?></option>
            <?php
                }
              }
            ?>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn">Guardar</button>
          <button type="button" class="btn btn-secondary">Limpiar</button>
        </div>
      </form>
    </div>
  </main>

  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h3>Administración UTHH</h3>
        <p>Sistema de Gestión de Biblioteca</p>
        <p>Universidad Tecnológica de la Huasteca Hidalguense</p>
      </div>
      <div class="footer-section">
        <h3>Soporte</h3>
        <p><i class="fas fa-phone"></i> 789 8962088 Ext. 152</p>
        <p><i class="fas fa-envelope"></i> biblioteca@uthh.edu.mx</p>
      </div>
    </div>
    <div class="copyright">
      Universidad Tecnológica de la Huasteca Hidalguense © 1996 - 2017<br>
      &copy; 2025 Sistema de Administración - Todos los derechos reservados
    </div>
  </footer>
</body>
</html>
