const tblEjemplares = document.getElementById('tblEjemplares');
const slcTipoUsuario = document.getElementById('slcTipoUsuario');
const slcTipoPrestamos = document.getElementById('slcTipoPrestamos');
const inpIdUsuario = document.getElementById('inpIdUsuario');
const btnPrestar = document.getElementById('btnPrestar');

document.getElementById('fechaPrestamo').value = fechaConDiasExtra();
document.getElementById('fechaDevolucion').value = fechaConDiasExtra(5);

fetch('http://localhost:3000/api/prestamos/ejemplares')
  .then(response => response.json())
  .then(ejemplares => {
    tblEjemplares.innerHTML = "";

    ejemplares.forEach(ejemplar => {
        tblEjemplares.innerHTML += `
            <tr onclick="seleccionarEjemplar('${ejemplar.Id_libro}', '${ejemplar.Titulo}', '${ejemplar.Id_Ejemplar}')" style="cursor: pointer;">
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

fetch('http://localhost:3000/api/usuarios/tipos')
  .then(response => response.json())
  .then(tipos => {
    tipos.forEach(tipo => {
      slcTipoUsuario.innerHTML += `<option value="${tipo.Id_tipo_usuario}">${tipo.Tipo_usuario}</option>`;
    });
  })
  .catch(error => {
    console.error('Error fetching tipos de usuario:', error);
  });

fetch('http://localhost:3000/api/prestamos/tipos')
  .then(response => response.json())
  .then(tipos => {
    tipos.forEach(tipo => {
      slcTipoPrestamos.innerHTML += `<option value="${tipo.Id_tipo_prestamo}">${tipo.Tipo_prestamo}</option>`;
    });
  })
  .catch(error => {
    console.error('Error fetching tipos de préstamo:', error);
  });

const seleccionarEjemplar = (Id_libro, Titulo, Id_Ejemplar) => {
    document.getElementById('idLibro').value = Id_libro;
    document.getElementById('titLibro').value = Titulo;
    document.getElementById('idEjemplar').value = Id_Ejemplar;
};

slcTipoUsuario.addEventListener('change', () => {
    const idTipoUsuario = slcTipoUsuario.value;
    let dias = 0;

    if (idTipoUsuario === 'TU001') {
        dias = 5;
    } 
    else if (idTipoUsuario === 'TU002') {
        dias = 21;
    }
    
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
  if (event.key === 'Enter') {
    fetch(`http://localhost:3000/api/usuarios/buscar?id=${inpIdUsuario.value}&tipo=${slcTipoUsuario.value}`)
      .then(response => response.json())
      .then(usuario => {
        if (usuario && usuario.Nombre) {
          document.getElementById('nombreUsuario').value = usuario.Nombre;
        } else {
          alert('Usuario no encontrado');
          document.getElementById('nombreUsuario').value = '';
        }
      })
      .catch(error => {
        console.error('Error fetching usuario:', error);
      });
  }
});

btnPrestar.addEventListener('click', () => {
    const prestamoData = {
        idUsuario: document.getElementById('inpIdUsuario').value,
        idEjemplar: document.getElementById('idEjemplar').value,
        idBibliotecario: 'PER003', // Este valor debería ser dinámico
        idTipoPrestamo: slcTipoPrestamos.value,
        idTipoUsuario: slcTipoUsuario.value
    }

    console.log('Datos del préstamo:', prestamoData);
    
    fetch('http://localhost:3000/api/prestamos/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(prestamoData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert(`Préstamo registrado exitosamente: ${result.mensaje}`);
        } else {
            alert(`Error al registrar el préstamo: ${result.mensaje || 'Error desconocido'}`);
        }
    })
    .catch(error => {
        console.error('Error registrando el préstamo:', error);
    });
});