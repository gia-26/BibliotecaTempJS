if (!localStorage.getItem('token')) {
  location.href = '../index.html';
}
else if (localStorage.getItem('rol') !== 'ROL003') {
  location.href = '../index.html';
}

const tblLibros = document.getElementById("tblLibros");
const modal = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalBookTitle");
const modalID = document.getElementById("modalBookId");
const modalImageLibro = document.getElementById("bookCoverImage");
const contenedorGrafica = document.getElementById('chartContainer');
const contenedorTabla = document.getElementById('dataTableView');
const URL_BASE = 'https://backend-biblioteca-two.vercel.app/';

let D1, D2;  // Préstamos del día 1 y día 4
let t1 = 1, t4 = 4; // Días conocidos
let miGrafica = null;

function cargarLibros() {
    fetch(URL_BASE + 'api/estimaciones')
        .then(respuesta => respuesta.json())
        .then(libros => {
            tblLibros.innerHTML = '';
            libros.forEach(libro => {
                tblLibros.innerHTML += `
                    <tr>
                        <td>${libro.Id_libro}</td>
                        <td>${libro.Titulo}</td>
                        <td>${libro.prestamos_totales}</td>
                        <td>
                            <button class="btn-predict" onclick="abrirModal('${libro.Id_libro}', '${libro.Titulo}', '${libro.Imagen}')">
                                Predecir préstamos
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Calcular la constante k (puede ser negativa si hay decrecimiento)
// k = ln(D2/D1) / (t4 - t1)
function calcularK() {
    if (D2 == 0) D2 = 1; //0.000000000001
    return Math.log(D2 / D1) / (t4 - t1);
}

// Calcular la constante C (siempre positiva si D1 > 0)
// C = D1 * e^(-kt1)
function calcularC() {
    const k = calcularK();
    return D1 * Math.exp(-k * t1);
}

// Calcular préstamos
// P = e^(kt) * C
function calcularPrestamos(t) {
    const k = calcularK();
    const c = calcularC();
    let resultado = c * Math.exp(k * t);
    
    // Solo por seguridad, si es negativo o muy pequeño, devolver 0
    return resultado < 0 ? 0 : Math.max(0, resultado);
}

function generarDatosGrafica() {
    const dias = [];
    const valores = [];
    
    // Calcular para 10 días
    for (let t = 1; t <= 10; t++) {
        dias.push(`Día ${t}`);
        let prestamos = calcularPrestamos(t);
        valores.push(Math.round(prestamos));
    }
    
    return { etiquetas: dias, datos: valores };
}

function crearGrafica() {
    const datos = generarDatosGrafica();
    const canvas = document.getElementById('loansChart');
    const ctx = canvas.getContext('2d');
    const k = calcularK();
    
    // Determinar si hay crecimiento o decrecimiento
    const esCrecimiento = k > 0;
    const esDecrecimiento = k < 0;
    
    // Colores según la tendencia
    let colorBarra, colorBorde, mensajeTendencia;
    
    if (esCrecimiento) {
        colorBarra = 'rgba(46, 204, 113, 0.7)';   // Verde para crecimiento
        colorBorde = 'rgba(46, 204, 113, 1)';
        mensajeTendencia = 'Creciendo';
    } else if (esDecrecimiento) {
        colorBarra = 'rgba(231, 76, 60, 0.7)';    // Rojo para decrecimiento
        colorBorde = 'rgba(231, 76, 60, 1)';
        mensajeTendencia = 'Decreciendo';
    } else {
        colorBarra = 'rgba(52, 152, 219, 0.7)';   // Azul para estable
        colorBorde = 'rgba(52, 152, 219, 1)';
        mensajeTendencia = 'Estable';
    }
    
    if (miGrafica !== null) {
        miGrafica.destroy();
    }
    
    miGrafica = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.etiquetas,
            datasets: [{
                label: `Préstamos (${mensajeTendencia})`,
                data: datos.datos,
                backgroundColor: colorBarra,
                borderColor: colorBorde,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true, 
                        text: 'Número de préstamos',
                        font: { weight: 'bold' }
                    },
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return Math.round(value);
                        }
                    }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Días',
                        font: { weight: 'bold' }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Préstamos: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}


function crearTabla() {
    const datos = generarDatosGrafica();
    const cuerpoTabla = document.getElementById('tableBody');
    const k = calcularK();
    const esDecrecimiento = k < 0;
    const esCrecimiento = k > 0;
    
    cuerpoTabla.innerHTML = '';
    
    for (let i = 0; i < datos.etiquetas.length; i++) {
        const diaNumero = i + 1;
        const esDiaConocido = (diaNumero === 1 || diaNumero === 4);
        const valor = datos.datos[i];
        
        // Destacar visualmente los valores que son 0
        const esCero = valor === 0;
        
        cuerpoTabla.innerHTML += `
            <tr style="${esCero ? 'background: #fff3e0;' : ''}">
                <td style="${esDiaConocido ? 'font-weight: bold;' : ''}">${datos.etiquetas[i]}</td>
                <td style="${esCero ? 'color: #e67e22; font-weight: bold;' : ''}">${valor}</td>
                ${esDiaConocido ? 
                    '<td style="color: #6A1B0B; font-weight: bold;">Dato real</td>' : 
                    (esCero ? '<td style="color: #e67e22;">Sin préstamos</td>' : '<td>Estimado</td>')}
            </tr>
        `;
    }
    
    // Agregar fila de resumen si hay decrecimiento
    if (esDecrecimiento) {
        const ultimoValor = datos.datos[datos.datos.length - 1];
        cuerpoTabla.innerHTML += `
            <tr style="background: #ffe6e6;">
                <td colspan="3" style="text-align: center; padding: 8px; font-size: 0.8rem;">
                    Tendencia decreciente: Los préstamos se reducen exponencialmente
                    ${ultimoValor === 0 ? ' (se estima que se dejará de solicitar pronto)' : ''}
                </td>
            </tr>
        `;
    }
    else if (esCrecimiento) {
        cuerpoTabla.innerHTML += `
            <tr style="background: #e6ffe6;">
                <td colspan="3" style="text-align: center; padding: 8px; font-size: 0.8rem;">
                    Tendencia creciente: Los préstamos se incrementan exponencialmente, lo que podría indicar una alta demanda futura
                </td>
            </tr>
        `;
    }
    else {
        cuerpoTabla.innerHTML += `
            <tr style="background: #e6f0ff;">
                <td colspan="3" style="text-align: center; padding: 8px; font-size: 0.8rem;">
                    Tendencia estable: Los préstamos no muestran un patrón claro de crecimiento o decrecimiento
                </td>
            </tr>
        `;
    }
}

function cambiarVista(vista, boton) {
    const botones = document.querySelectorAll('.view-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    
    if (vista === 'grafica') {
        contenedorGrafica.style.display = 'block';
        contenedorTabla.style.display = 'none';
    } else {
        contenedorGrafica.style.display = 'none';
        contenedorTabla.style.display = 'block';
    }
}

function abrirModal(id, titulo, imagen) {
    modalTitle.textContent = titulo;
    modalID.textContent = `ID: ${id}`;
    modalImageLibro.src = imagen;
    
    fetch(`${URL_BASE}api/estimaciones/libro/datos?idLibro=${id}&fecha=2026-01-01`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (!datos.prestamosDia1) {
                mostrarAlerta({
                    titulo: "Error",
                    texto: "No hay suficientes datos para este libro",
                    tipo: "error"
                });
            }
            else {
                modal.style.display = "flex";
                D1 = datos.prestamosDia1;
                D2 = datos.prestamosDia4;
                
                crearGrafica();
                crearTabla();
                
                document.getElementById('chartContainer').style.display = 'block';
                document.getElementById('dataTableView').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlerta({
                titulo: "Error",
                texto: "Error al cargar los datos",
                tipo: "error"
            });
        });
}

function cerrarModal() {
    document.getElementById('btnGrafica').classList.add('active');
    document.getElementById('btnTabla').classList.remove('active');
    modal.style.display = "none";
    if (miGrafica !== null) {
        miGrafica.destroy();
        miGrafica = null;
    }
}

cargarLibros();