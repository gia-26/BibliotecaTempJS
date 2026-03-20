document.addEventListener("DOMContentLoaded", () => {

  const rolUsuario = localStorage.getItem("rol");

  if (!rolUsuario) window.location.href = "/BibliotecaTempJS/login/";

  const dashboard = document.getElementById("dashboard");

  function crearCard(icono, titulo, descripcion, enlace, textoBoton) {
    return `
      <div class="dashboard-card">
        <i class="fas ${icono}"></i>
        <h3>${titulo}</h3>
        <p>${descripcion}</p>
        <a href="${enlace}" class="btn">${textoBoton}</a>
      </div>
    `;
  }

  switch (rolUsuario) {

    case "ROL003":
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "/BibliotecaTempJS/prestamos", "Ver préstamos");
      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "/BibliotecaTempJS/devoluciones", "Gestionar devoluciones");
      dashboard.innerHTML += crearCard("fa-chart-bar", "Reportes", "Genera reportes trimestrales", "/BibliotecaTempJS/reportes", "Ver reportes");

      dashboard.innerHTML += crearCard("fa-book", "Libros", "Administra el inventario de libros", "/BibliotecaTempJS/libros", "Gestionar Libros");

      dashboard.innerHTML += crearCard("fa-users", "Personal", "Gestiona el personal de la biblioteca", "/BibliotecaTempJS/personal", "Administrar Personal");

      dashboard.innerHTML += crearCard("fa-info-circle", "Información de la biblioteca", "Gestiona la información de la biblioteca (Misión, visión, objetivo y ¿quiénes somos?)", "/BibliotecaTempJS/Informacion_biblioteca", "Administrar Información");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "/BibliotecaTempJS/perfil", "Ver perfil");

      dashboard.innerHTML += crearCard( "fa-calculator", "Estimación", "Calcular estimación", "/BibliotecaTempJS/estimacion", "Ver estimación");
      break;


    case "ROL002":
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "/BibliotecaTempJS/prestamos", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "/BibliotecaTempJS/devoluciones", "Gestionar devoluciones");

      dashboard.innerHTML += crearCard("fa-book", "Libros", "Administra el inventario de libros", "/BibliotecaTempJS/libros", "Gestionar Libros");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "/BibliotecaTempJS/perfil", "Ver perfil");
      break;


    case "ROL001":
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "/BibliotecaTempJS/prestamos", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "/BibliotecaTempJS/devoluciones", "Gestionar devoluciones");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "/BibliotecaTempJS/perfil", "Ver perfil");
      break;


    case "Trabajador":
    case "Alumno":
      dashboard.innerHTML += crearCard("fa-history", "Historial de préstamos", "Visualiza el historial de préstamos de libros", "/BibliotecaTempJS/historial_prestamos", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-exclamation-triangle", "Historial de multas", "Visualiza el historial de multas de libros", "/BibliotecaTempJS/historial_multas", "Ver multas");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "/BibliotecaTempJS/perfil", "Ver perfil");
      break;
  }
});