const tblPrestamos = document.getElementById("tblPrestamos");
const tblMultas = document.getElementById("tblMultas");
const searchInput = document.getElementById("searchInput");
const filtroSelect = document.getElementById("filtroSelect");

const mostrarDevolcuiones = () => {
  fetch("https://backend-biblioteca-two.vercel.app/api/prestamos")
    .then(response => response.json())
    .then(data => {
      tblPrestamos.innerHTML = "";
      if (data.length === 0) {
        tblPrestamos.innerHTML = "<tr><td colspan='10'>No hay préstamos registrados.</td></tr>";
        return;
      }
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
            <td><button class="btn btn-small btn-warning" onclick="renovar('${prestamo.Id_prestamo}', '${prestamo.Id_usuario}')">Renovar</button></td>
          </tr>
        `;
      });
    })
    .catch(error => {
      console.error("Error al obtener los préstamos:", error);
    });
}

searchInput.addEventListener("input", () => {
  buscarPrestamos();
});

const buscarPrestamos = () => {
  const tipo = filtroSelect.value;
  const id = searchInput.value.trim();

  if (!id) {
    mostrarDevolcuiones();
    return;
  }

  fetch(`https://backend-biblioteca-two.vercel.app/api/prestamos/buscar?tipo=${tipo}&id=${id}`)
    .then(response => response.json())
    .then(data => {
      tblPrestamos.innerHTML = "";
      if (data.length === 0) {
        tblPrestamos.innerHTML = "<tr><td colspan='10'>No se encontraron resultados.</td></tr>";
        return;
      }
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
            <td><button class="btn btn-small btn-warning" onclick="renovar('${prestamo.Id_prestamo}', '${prestamo.Id_usuario}')">Renovar</button></td>
          </tr>
        `;
      });
    })
    .catch(error => {
      console.error("Error al obtener los préstamos:", error);
    });
}

const cargarMultas = () => {
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
}

const devolver = (idPrestamo) => {
  confirmarAccion("¿Está seguro de que desea devolver este préstamo?", () => {
    fetch("https://backend-biblioteca-two.vercel.app/api/prestamos/devolver", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idPrestamo })
    })
      .then(response => response.json())
      .then(result => {
        console.log("RESULTADO DEVOLUCIÓN:", result);
        if (result.success) {
          if (searchInput.value.trim() !== "") buscarPrestamos();
          else mostrarDevolcuiones();
          mostrarAlerta({
            titulo: "Éxito",
            texto: result.mensaje,
            tipo: "success"
          });
        }
        else
          mostrarAlerta({
            titulo: "Error",
            texto: result.error || "Error desconocido",
            tipo: "error"
          });
      })
      .catch(error => {
        console.error("Error al devolver el préstamo:", error);
      });
  });
}

const renovar = (idPrestamo, idUsuario) => {
  confirmarAccion("¿Está seguro de que desea renovar este préstamo?", () => {
    fetch("https://backend-biblioteca-two.vercel.app/api/prestamos/renovar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPrestamo, idUsuario})
    })
      .then(response => response.json())
      .then(result => {
        console.log("RESULTADO RENOVACIÓN:", result);
        if (result.success) {
          mostrarDevolcuiones();
          mostrarAlerta({
            titulo: "Éxito",
            texto: result.mensaje,
            tipo: "success"
          });
        }
        else
          mostrarAlerta({
            titulo: "Error",
            texto: result.mensaje || "Error desconocido",
            tipo: "error"
          });
      })
      .catch(error => {
        mostrarAlerta({
          titulo: "Error",
          texto: "Error al renovar el préstamo.",
          tipo: "error"
        });
      });
  });
}

mostrarDevolcuiones();
cargarMultas();