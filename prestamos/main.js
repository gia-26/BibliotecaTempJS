const tblEjemplares = document.getElementById('tblEjemplares');
const slcTipoUsuario = document.getElementById('slcTipoUsuario');
const slcTipoPrestamos = document.getElementById('slcTipoPrestamos');
const inpIdUsuario = document.getElementById('inpIdUsuario');
const btnPrestar = document.getElementById('btnPrestar');
const nombreUsuario = document.getElementById('nombreUsuario');
const inpIdEjemplar = document.getElementById('idEjemplar');
let buscoUsuario = false;
let idUsuarioBuscado = '';

document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
document.getElementById('fechaDevolucion').value = fechaConDiasExtra(5);

const mostrarPrestamos = () => {
  fetch('https://backend-biblioteca-two.vercel.app/api/prestamos/ejemplares')
    .then(response => response.json())
    .then(ejemplares => {
      tblEjemplares.innerHTML = "";
  
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

const mostrarTiposUsuarios = () => {
  fetch('https://backend-biblioteca-two.vercel.app/api/usuarios/tipos')
    .then(response => response.json())
    .then(tipos => {
      tipos.forEach(tipo => {
        slcTipoUsuario.innerHTML += `<option value="${tipo.Id_tipo_usuario}">${tipo.Tipo_usuario}</option>`;
      });
    })
    .catch(error => {
      console.error('Error fetching tipos de usuario:', error);
    });
}

const mostrarTiposPrestamos = () => {
  fetch('https://backend-biblioteca-two.vercel.app/api/prestamos/tipos')
    .then(response => response.json())
    .then(tipos => {
      tipos.forEach(tipo => {
        slcTipoPrestamos.innerHTML += `<option value="${tipo.Id_tipo_prestamo}">${tipo.Tipo_prestamo}</option>`;
      });
    })
    .catch(error => {
      console.error('Error fetching tipos de préstamo:', error);
    });
}


const seleccionarEjemplar = (Id_libro, Titulo, Id_Ejemplar, Estado) => {
  if (Estado === 'Prestado') {
    alert('Este ejemplar ya está prestado. Por favor, selecciona otro.');
    return;
  }
  //Falta validar que el ejemplar no esté prestado y que no exista un solo ejemplar diponible
  //Debe mostrar un mensaje de error y el motivo del error
  location.href = '#formPrestamo';
  document.getElementById('idLibro').value = Id_libro;
  document.getElementById('titLibro').value = Titulo;
  inpIdEjemplar.value = Id_Ejemplar;
};

slcTipoUsuario.addEventListener('change', () => {
  const idTipoUsuario = slcTipoUsuario.value;
  let dias = 0;

  if (idTipoUsuario === 'TU001') dias = 5;
  else if (idTipoUsuario === 'TU002') dias = 21;
  
  document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
  document.getElementById('fechaDevolucion').value = fechaConDiasExtra(dias);
});

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
  fetch(`https://backend-biblioteca-two.vercel.app/api/usuarios/buscar?id=${inpIdUsuario.value}&tipo=${slcTipoUsuario.value}`)
    .then(response => response.json())
    .then(usuario => {
      if (usuario && usuario.Nombre) {
        nombreUsuario.value = usuario.Nombre;
        buscoUsuario = true;
        idUsuarioBuscado = usuario.id;
      } else {
        buscoUsuario = false;
        idUsuarioBuscado = '';
        nombreUsuario.value = '';
        alert('Usuario no encontrado');
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
        idBibliotecario: 'PER003', // Este valor debería ser dinámico
        idTipoPrestamo: slcTipoPrestamos.value,
        idTipoUsuario: slcTipoUsuario.value
    }

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
          alert(result.mensaje);
        } else {
          alert(`Error al registrar el préstamo: ${result.mensaje || 'Error desconocido'}`);
        }
    })
    .catch(error => {
        console.error('Error registrando el préstamo:', error);
    });
});

const validarBuscarUsuario = () => {
  if (!buscoUsuario) {
    alert('Falta buscar el usuario. Ingresa su ID y da enter');
    return false;
  }
  if (inpIdUsuario.value.trim() !== idUsuarioBuscado) {
    alert('El ID del usuario no coincide con el buscado.');
    return false;
  }
}

const validarPrestamo = (idUser, idEjemplar, idBibliotecario, idTipoPrestamo, idTipoUsuario) => {
  if (!idUser) {
    alert('Por favor, ingresa el ID del usuario.');
    return false;
  }
  if (!idEjemplar) {
    alert('Por favor, selecciona un ejemplar.');
    return false;
  }
  if (!idBibliotecario) {
    alert('Por favor, ingresa el ID del bibliotecario.');
    return false;
  }
  if (!idTipoPrestamo) {
    alert('Por favor, selecciona el tipo de préstamo.');
    return false;
  }
  if (!idTipoUsuario) {
    alert('Por favor, selecciona el tipo de usuario.');
    return false;
  }
  return true
}

mostrarPrestamos();
mostrarTiposUsuarios();
mostrarTiposPrestamos();