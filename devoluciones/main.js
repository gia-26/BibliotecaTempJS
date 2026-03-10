const tblPrestamos = document.getElementById("tblPrestamos");
const tblMultas = document.getElementById("tblMultas");

const mostrarDevolcuiones = () => {
  fetch("https://backend-biblioteca-two.vercel.app/api/prestamos")
    .then(response => response.json())
    .then(data => {
      tblPrestamos.innerHTML = "";
      data.forEach(prestamo => {
        tblPrestamos.innerHTML += `
          <tr>
            <td>${prestamo.Id_usuario}</td>
            <td>${prestamo.Nombre}</td>
            <td>${prestamo.Id_libro}</td>
            <td>${prestamo.Titulo}</td>
            <td>${new Date(prestamo.Fecha_prestamo).toLocaleDateString()}</td>
            <td>${new Date(prestamo.Fecha_devolucion).toLocaleDateString()}</td>
            <td>${prestamo.Estado}</td>
            <td><button class="btn btn-small btn-danger" onclick="devolver('${prestamo.Id_prestamo}')">Devolver</button></td>
            <td><button class="btn btn-small btn-warning">Renovar</button></td>
          </tr>
        `;
      });
    })
    .catch(error => {
      console.error("Error al obtener los préstamos:", error);
    });
}

fetch("https://backend-biblioteca-two.vercel.app/api/multas")
  .then(response => response.json())
  .then(data => {
    tblMultas.innerHTML = "";
    data.forEach(multa => {
      tblMultas.innerHTML += `
        <tr>
          <td>${multa.Nombre}</td>
          <td>${multa.Apellido_P}</td>
          <td>${multa.Apellido_M}</td>
          <td>${multa.Titulo}</td>
          <td>${new Date(multa.Fecha_devolucion).toLocaleDateString()}</td>
          <td>${multa.Fecha_devolucion_real != null ? new Date(multa.Fecha_devolucion_real).toLocaleDateString() : "No devuelto"}</td>
          <td>${multa.Dias_excedidos}</td>
          <td>$${multa.Monto}</td>
        </tr>
      `;
    });
  })
  .catch(error => {
    console.error("Error al obtener las multas:", error);
  });

const devolver = (idPrestamo) => {
  if (!confirm("¿Está seguro de que desea devolver este préstamo?"))
      return;
  fetch("https://backend-biblioteca-two.vercel.app/api/prestamos/devolver", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idPrestamo })
    })
    .then(response => response.json())
    .then(result => {
      console.log("RESULTADO DEVOLUCIÓN:", result);
      if (result.success){
        mostrarDevolcuiones();
        alert(result.mensaje);
      }
      else
        alert("Error al devolver el préstamo: " + result.mensaje);
    })
    .catch(error => {
      console.error("Error al devolver el préstamo:", error);
    });
}

mostrarDevolcuiones();