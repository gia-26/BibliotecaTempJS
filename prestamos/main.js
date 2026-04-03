const tblEjemplares = document.getElementById('tblEjemplares');
const slcTipoUsuario = document.getElementById('slcTipoUsuario');
const slcTipoPrestamos = document.getElementById('slcTipoPrestamos');
const inpIdUsuario = document.getElementById('inpIdUsuario');
const btnPrestar = document.getElementById('btnPrestar');
const nombreUsuario = document.getElementById('nombreUsuario');
const inpIdEjemplar = document.getElementById('idEjemplar');
const inpBuscar = document.getElementById('searchInput');
const titLibro = document.getElementById('titLibro');
const btnLimpiar = document.getElementById('btnLimpiar');
const inpIdLibro = document.getElementById('idLibro');
let buscoUsuario = false;
let idUsuarioBuscado = '';
let valorTipoUsuario;

document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
document.getElementById('fechaDevolucion').value = fechaConDiasExtra(5);

const mostrarPrestamos = () => {
  fetch('https://backend-biblioteca-two.vercel.app/api/prestamos/ejemplares')
    .then(response => response.json())
    .then(ejemplares => {
      tblEjemplares.innerHTML = "";
      if (ejemplares.length === 0) {
        tblEjemplares.innerHTML = "<tr><td colspan='6'>No se encontraron ejemplares</td></tr>";
        return;
      }
      ejemplares.forEach(ejemplar => {
          tblEjemplares.innerHTML += `
              <tr onclick="seleccionarEjemplar('${ejemplar.Id_libro}', '${ejemplar.Titulo}', '${ejemplar.Id_Ejemplar}', '${ejemplar.Estado}')" style="cursor: pointer;" title="Selecciona un ejemplar para prestarlo">
                  <td>${ejemplar.Id_libro}</td>
                  <td>${ejemplar.Titulo}</td>
                  <td>${ejemplar.Autor}</td>
                  <td>${ejemplar.Id_Ejemplar}</td>
                  <td>${ejemplar.Numero_de_ejemplar}</td>
                  <td><span class="status-badge status-${ejemplar.Estado}">${ejemplar.Estado}</span></td>
              </tr>
          `;
      });
    })
    .catch(error => {
      console.error('Error fetching ejemplares:', error);
    });
}

function mostrarTiposUsuarios() {
    fetch('https://backend-biblioteca-two.vercel.app/api/tipo_usuarios')
        .then(response => response.json())
        .then(tipos => {
            const slcTipoUsuario = document.getElementById('slcTipoUsuario');
            if (slcTipoUsuario) {
                slcTipoUsuario.innerHTML = '';
                tipos.forEach(tipo => {
                    slcTipoUsuario.innerHTML += `<option value="${tipo.Id_tipo_usuario}">${tipo.Tipo_usuario}</option>`;
                });
            }
        });
}

function mostrarTiposPrestamos() {
    fetch('https://backend-biblioteca-two.vercel.app/api/prestamos/tipos')
    .then(response => response.json())
    .then(tipos => {
        slcTipoPrestamos.innerHTML = '';
        tipos.forEach(tipo => {
            slcTipoPrestamos.innerHTML += `<option value="${tipo.Id_tipo_prestamo}">${tipo.Tipo_prestamo}</option>`;
        });
    });
}

const seleccionarEjemplar = (Id_libro, Titulo, Id_Ejemplar, Estado) => {
  if (Estado === 'Prestado') {
    mostrarAlerta({
      titulo: "Error",
      texto: "Este ejemplar ya está prestado. Por favor, selecciona otro.",
      tipo: "error"
    });
    return;
  }
  location.href = '#formPrestamo';
  inpIdLibro.value = Id_libro;
  titLibro.value = Titulo;
  inpIdEjemplar.value = Id_Ejemplar;
};

slcTipoUsuario.addEventListener('focus', () => {
  valorTipoUsuario = this.selectedIndex;
});

slcTipoUsuario.addEventListener('change', () => {
  if (buscoUsuario){
    if (!confirm('Cambiar el tipo de usuario reiniciará la búsqueda. ¿Deseas continuar?')) {
      slcTipoUsuario.selectedIndex = valorTipoUsuario;
      return; 
    }
    buscoUsuario = false;
    idUsuarioBuscado = '';
    inpIdUsuario.value = '';
    nombreUsuario.value = '';
  }
  fechaTipoPrestamo();
});

slcTipoPrestamos.addEventListener('change', () => {
  fechaTipoPrestamo();
});

const fechaTipoUsuario = () => {
  const idTipoUsuario = slcTipoUsuario.value;
  let dias = 0;

  if (idTipoUsuario === 'TU001') dias = 5;
  else if (idTipoUsuario === 'TU002') dias = 21;
  
  document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
  document.getElementById('fechaDevolucion').value = fechaConDiasExtra(dias);
}

const fechaTipoPrestamo = () => {
   const idTipoPrestamo = slcTipoPrestamos.value;

  if (idTipoPrestamo === 'TP002') {
    document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
    document.getElementById('fechaDevolucion').value = fechaConDiasExtra();
  }
  else if (idTipoPrestamo === 'TP001'){
    fechaTipoUsuario();
  }
}

function formatearFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}/${mes}/${dia}`;
}

function fechaConDiasExtra(dias = 0) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return formatearFecha(fecha);
}

inpIdUsuario.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') buscarUsuario();
});

const buscarUsuario = () => {
  console.log(`Buscando usuario con ID: ${inpIdUsuario.value} y tipo: ${slcTipoUsuario.value}`);
  fetch(`https://backend-biblioteca-two.vercel.app/api/usuarios/buscar?id=${inpIdUsuario.value}&tipo=${slcTipoUsuario.value}`)
    .then(response => response.json())
    .then(usuario => {
      if (usuario.NombreCompleto && usuario.Id_usuario) {
        nombreUsuario.value = usuario.NombreCompleto;
        buscoUsuario = true;
        idUsuarioBuscado = usuario.Id_usuario;
      } else {
        buscoUsuario = false;
        idUsuarioBuscado = '';
        nombreUsuario.value = '';
        mostrarAlerta({
          titulo: "Error",
          texto: "Usuario no encontrado",
          tipo: "error"
        });
      }
    })
    .catch(error => {
      console.error('Error fetching usuario:', error);
    });
}

btnPrestar.addEventListener('click', () => {
    const prestamoData = {
        idUsuario: inpIdUsuario.value,
        idEjemplar: inpIdEjemplar.value,
        idBibliotecario: localStorage.getItem('id'), // Este valor debería ser dinámico
        idTipoPrestamo: slcTipoPrestamos.value,
        idTipoUsuario: slcTipoUsuario.value
    }

    console.log(prestamoData);
    console.log(prestamoData.idEjemplar);
    if (!validarBuscarUsuario()) return;
    if (!validarPrestamo(prestamoData.idUsuario, prestamoData.idEjemplar, prestamoData.idBibliotecario, prestamoData.idTipoPrestamo, prestamoData.idTipoUsuario)) return;
    
    fetch('https://backend-biblioteca-two.vercel.app/api/prestamos/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(prestamoData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
          mostrarPrestamos();
          mostrarAlerta({
            titulo: "Éxito",
            texto: result.mensaje,
            tipo: "success"
          });
          limpiar();
        } else {
          mostrarAlerta({
            titulo: "Error",
            texto: `${result.error || 'Error desconocido'}`,
            tipo: "error"
          });
        }
    })
    .catch(error => {
        console.error('Error registrando el préstamo:', error);
    });
});

const validarBuscarUsuario = () => {
  if (!buscoUsuario) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Falta buscar el usuario. Ingresa su ID y da enter",
      tipo: "error"
    });
    return false;
  }

  if (inpIdUsuario.value.trim() !== idUsuarioBuscado) {
    mostrarAlerta({
      titulo: "Error",
      texto: "El ID del usuario no coincide con el buscado.",
      tipo: "error"
    });
    return false;
  }
  return true;
}

const validarPrestamo = (idUser, idEjemplar, idBibliotecario, idTipoPrestamo, idTipoUsuario) => {
  if (!idUser) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Por favor, ingresa el ID del usuario.",
      tipo: "error"
    });
    return false;
  }
  if (!idEjemplar) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Por favor, selecciona un ejemplar.",
      tipo: "error"
    });
    return false;
  }
  if (!idBibliotecario) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Por favor, ingresa el ID del bibliotecario.",
      tipo: "error"
    });
    return false;
  }
  if (!idTipoPrestamo) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Por favor, selecciona el tipo de préstamo.",
      tipo: "error"
    } );
    return false;
  }
  if (!idTipoUsuario) {
    mostrarAlerta({
      titulo: "Error",
      texto: "Por favor, selecciona el tipo de usuario.",
      tipo: "error"
    });
    return false;
  }
  return true
}

inpBuscar.addEventListener('input', () => {
  fetch(`https://backend-biblioteca-two.vercel.app/api/prestamos/ejemplares/buscar?q=${inpBuscar.value}`)
    .then(response => response.json())
    .then(ejemplares => {
      tblEjemplares.innerHTML = "";
      if (ejemplares.length === 0) {
        tblEjemplares.innerHTML = "<tr><td colspan='6'>No se encontraron ejemplares</td></tr>";
        return;
      }
      ejemplares.forEach(ejemplar => {
        tblEjemplares.innerHTML += `
            <tr onclick="seleccionarEjemplar('${ejemplar.Id_libro}', '${ejemplar.Titulo}', '${ejemplar.Id_Ejemplar}', '${ejemplar.Estado}')" style="cursor: pointer;" title="Selecciona un ejemplar para prestarlo">
                <td>${ejemplar.Id_libro}</td>
                <td>${ejemplar.Titulo}</td>
                <td>${ejemplar.Autor}</td>
                <td>${ejemplar.Id_Ejemplar}</td>
                <td>${ejemplar.Numero_de_ejemplar}</td>
                <td><span class="status-badge status-${ejemplar.Estado}">${ejemplar.Estado}</span></td>
            </tr>
        `;
      });
    })
});

btnLimpiar.addEventListener('click', () => {limpiar()});

const limpiar = () => {
  inpIdUsuario.value = '';
  nombreUsuario.value = '';
  inpIdEjemplar.value = '';
  slcTipoPrestamos.selectedIndex = 0;
  slcTipoUsuario.selectedIndex = 0;
  buscoUsuario = false;
  idUsuarioBuscado = '';
  titLibro.value = '';
  inpIdLibro.value = '';
  document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
  document.getElementById('fechaDevolucion').value = fechaConDiasExtra(5);
}

document.addEventListener('click', async (e) => {
  if (e.target.closest('.btn-delete') && 
      e.target.closest('#modal-tipos-prestamo')) {
    const fila = e.target.closest('tr');
    const idTipo = fila.querySelector('td:nth-child(2)').textContent.trim();
    
    const response = await fetch(
      `https://backend-biblioteca-two.vercel.app/api/prestamos/tipos/${idTipo}`, // ✅ corregido
      { method: 'DELETE' }
    );
    const result = await response.json();
    
    if (!result.success) {
      mostrarAlerta({
        titulo: "Error",
        texto: result.mensaje,
        tipo: "error"
      });
    } else {
      mostrarAlerta({
        titulo: "Éxito",
        texto: result.mensaje,
        tipo: "success"
      });
      slcTipoPrestamos.innerHTML = ''; // ✅ limpiar select
      mostrarTiposPrestamos();         // ✅ recargar select
    }
  }
});
mostrarPrestamos();
mostrarTiposUsuarios();
mostrarTiposPrestamos();