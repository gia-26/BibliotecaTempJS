const cerrarSesion = () => {      
  localStorage.clear();
  window.location.href = "/BibliotecaTempJS/login/";
};

fetch("/BibliotecaTempJS/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
    const token = localStorage.getItem("token");
    const nav = document.getElementById("header-opc");
    if (token) {
      nav.innerHTML = `
        <a href="/BibliotecaTempJS/index.html" class="read-on-hover" data-text="Inicio"><i class="fas fa-home"></i> Inicio</a>
        <a href="/BibliotecaTempJS/catalogo_publico/" class="read-on-hover" data-text="Ver catálogo"><i class="fas fa-book-open"></i> Ver catálogo</a>
        <a href="/BibliotecaTempJS/dashboard/" class="read-on-hover" data-text="Panel de control"><i class="fas fa-tachometer-alt"></i> Panel de control</a>
        <a onclick='cerrarSesion()' style="cursor: pointer;" class="read-on-hover" data-text="Cerrar Sesión"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
      `;
    }
    else {
      nav.innerHTML = `
        <a href="/BibliotecaTempJS/index.html" class="read-on-hover" data-text="Inicio"><i class="fas fa-home"></i> Inicio</a>
        <a href="/BibliotecaTempJS/catalogo_publico/" class="read-on-hover" data-text="Ver catálogo"><i class="fas fa-book-open"></i> Ver catálogo</a>
        <a href="/BibliotecaTempJS/login/" class="read-on-hover" data-text="Ingresar"><i class="fas fa-sign-in-alt"></i> Ingresar</a>
      `;
    }
  });

fetch("/BibliotecaTempJS/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

fetch("/BibliotecaTempJS/header-dashboard.html")
  .then(res => res.text())
  .then(data => {
    const headerDashboard = document.getElementById("header-dashboard");
    if(headerDashboard) {
      headerDashboard.innerHTML = data;
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/BibliotecaTempJS/login/";
        return;
      }
      console.log("Token encontrado:", token);
      const rol = localStorage.getItem("rol");
      const nav = document.getElementById("opciones");
      const tituloCuenta = document.getElementById("tituloCuenta");

      tituloCuenta.textContent = (rol === 'Trabajador' || rol === 'Alumno')? 'Cuenta de miembro' : 'Cuenta de personal';

      switch(rol)
      {
        case "ROL003":
          nav.innerHTML = `
          <a id="prestamos" href="/BibliotecaTempJS/prestamos/" class="read-on-hover" data-text="Préstamos"><i class="fas fa-hand-holding"></i> Préstamos</a>
          <a id="devoluciones" href="/BibliotecaTempJS/devoluciones/" class="read-on-hover" data-text="Devoluciones"><i class="fas fa-undo-alt"></i> Devoluciones</a>
          <a id="reportes" href="/BibliotecaTempJS/reportes/" class="read-on-hover" data-text="Reportes"><i class="fas fa-chart-bar"></i> Reportes</a>
          <a id="libros" href="/BibliotecaTempJS/libros/" class="read-on-hover" data-text="Libros"><i class="fas fa-book"></i> Libros</a>
          <a id="personal" href="/BibliotecaTempJS/personal/" class="read-on-hover" data-text="Personal"><i class="fas fa-users"></i> Personal</a>
          <a id="info-biblioteca" href="/BibliotecaTempJS/Informacion_biblioteca/" class="read-on-hover" data-text="Biblioteca"><i class="fas fa-info-circle"></i> Biblioteca</a>
          <a id="estimacion" href="/BibliotecaTempJS/estimacion/" class="read-on-hover" data-text="Biblioteca"><i class="fas fa-calculator"></i> Estimación</a>
          `;
        break;

        case "ROL002":
          nav.innerHTML = `
          <a id="prestamos" href="/BibliotecaTempJS/prestamos/" class="read-on-hover" data-text="Préstamos"><i class="fas fa-hand-holding"></i> Préstamos</a>
          <a id="devoluciones" href="/BibliotecaTempJS/devoluciones/" class="read-on-hover" data-text="Devoluciones"><i class="fas fa-undo-alt"></i> Devoluciones</a>
          <a id="libros" href="/BibliotecaTempJS/libros/" class="read-on-hover" data-text="Libros"><i class="fas fa-book"></i> Libros</a>
          `;
        break;

        case "ROL001":
          nav.innerHTML = `
          <a id="prestamos" href="/BibliotecaTempJS/prestamos/" class="read-on-hover" data-text="Préstamos"><i class="fas fa-hand-holding"></i> Préstamos</a>
          <a id="devoluciones" href="/BibliotecaTempJS/devoluciones/" class="read-on-hover" data-text="Devoluciones"><i class="fas fa-undo-alt"></i> Devoluciones</a>
          `;
        break;

        case "Alumno":
        case "Trabajador":
          nav.innerHTML = `
          <a id="prestamos-publicos" href="/BibliotecaTempJS/historial_prestamos/" class="read-on-hover" data-text="Mis préstamos">
          <i class="fas fa-history"></i> Mis préstamos
          </a>
          <a id="multas-publicas" href="/BibliotecaTempJS/historial_multas/" class="read-on-hover" data-text="Mis multas">
          <i class="fas fa-exclamation-triangle"></i> Mis multas
          </a>
          `;
        break;
      }
    }
  });