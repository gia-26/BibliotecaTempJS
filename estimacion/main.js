const ecuacion = document.getElementById("ecuacion");
const funcion = document.getElementById("funcion");
const resultadoSemana = document.getElementById("resultadoSemana");
const resultadoTriplica = document.getElementById("resultadoTriplica");
const tabla = document.getElementById("tabla");
const boton = document.getElementById("calcular");

function k() {

    return Math.log(2) / 2

}

function C() {

    return 3 / Math.sqrt(2)

}

function P(t) {

    return C() * Math.pow(2, t / 2)

}


function calcular() {

    let semana = parseFloat(document.getElementById("semana").value)

    let multiplo = parseFloat(document.getElementById("multiplo").value)

    ecuacion.innerHTML = "dP/dt = kP"

    funcion.innerHTML = "P(t) = (3/√2) · 2^(t/2)"

    let valor = P(semana)

    resultadoSemana.innerHTML = "P(" + semana + ") = " + valor.toFixed(2)

    let objetivo = 3 * multiplo

    let t = 2 * Math.log2(objetivo / C())

    resultadoTriplica.innerHTML = "t = " + t.toFixed(2) + " semanas"

    cargarTabla()
    crearGrafica()
}



function cargarTabla() {

    tabla.innerHTML = ""

    for (let i = 0; i <= 10; i++) {

        tabla.innerHTML += `
            <tr>
            <td>${i}</td>
            <td>${P(i).toFixed(2)}</td>
            </tr>
            `

    }

}



let chart

function crearGrafica() {

    const labels = []
    const datos = []

    for (let i = 0; i <= 10; i++) {

        labels.push("Semana " + i)
        datos.push(P(i))

    }

    const ctx = document.getElementById("grafica").getContext("2d")

    if (chart) {

        chart.destroy()

    }

    chart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Préstamos estimados",

                data: datos,

                borderColor: "blue",
                backgroundColor: "rgba(0,0,255,0.2)",
                borderWidth: 2

            }]

        },

        options: {

            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }

        }

    })

}

boton.addEventListener("click", calcular)

calcular()