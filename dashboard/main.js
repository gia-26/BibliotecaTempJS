document.addEventListener("DOMContentLoaded", () => {

  const rolUsuario = localStorage.getItem("rol") || "ROL003";
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
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "./prestamos.html", "Ver préstamos");
      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "./devoluciones.html", "Gestionar devoluciones");
      dashboard.innerHTML += crearCard("fa-chart-bar", "Reportes", "Genera reportes trimestrales", "./reportes.html", "Ver reportes");

      dashboard.innerHTML += crearCard("fa-book", "Libros", "Administra el inventario de libros", "./libros.html", "Gestionar Libros");

      dashboard.innerHTML += crearCard("fa-users", "Personal", "Gestiona el personal de la biblioteca", "./personal.html", "Administrar Personal");

      dashboard.innerHTML += crearCard("fa-info-circle", "Información de la biblioteca", "Gestiona la información de la biblioteca (Misión, visión, objetivo y ¿quiénes somos?)", "./Informacion_biblioteca.html", "Administrar Información");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "./perfil.html", "Ver perfil");
      break;


    case "ROL002":
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "./prestamos.html", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "./devoluciones.html", "Gestionar devoluciones");

      dashboard.innerHTML += crearCard("fa-book", "Libros", "Administra el inventario de libros", "./libros.html", "Gestionar Libros");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "./perfil.html", "Ver perfil");
      break;


    case "ROL001":
      dashboard.innerHTML += crearCard("fa-exchange-alt", "Préstamos", "Gestionar los préstamos de libros", "./prestamos.html", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-undo-alt", "Devoluciones", "Gestión de las devoluciones y multas", "./devoluciones.html", "Gestionar devoluciones");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "./perfil.html", "Ver perfil");
      break;


    case "Miembro":
      dashboard.innerHTML += crearCard("fa-history", "Historial de préstamos", "Visualiza el historial de préstamos de libros", "./historial_prestamos.html", "Ver préstamos");

      dashboard.innerHTML += crearCard("fa-exclamation-triangle", "Historial de multas", "Visualiza el historial de multas de libros", "./historial_multas.html", "Ver multas");

      dashboard.innerHTML += crearCard("fa-user-circle", "Perfil", "Visualiza y edita tu perfil", "./perfil.html", "Ver perfil");
      break;


    default:
      dashboard.innerHTML = "<p>No tienes permisos asignados.</p>";
      break;
  }

});