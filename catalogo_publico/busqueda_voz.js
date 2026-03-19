// PASO 1: Configuración básica
const TOKEN_IA = 'UJK4FAQ4M4CI6BNKRRYDMRYXCLFLD5FY';

// PASO 2: Obtener los elementos del HTML
const micButton = document.getElementById('btnMic');
const searchInput = document.getElementById('input-busqueda');
const criterioSelect = document.getElementById('criterio-busqueda');

// PASO 3: Verificar si el navegador soporta reconocimiento de voz
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  micButton.style.display = 'none'; // Ocultar el botón si no hay soporte
  console.log('Tu navegador no soporta reconocimiento de voz');
}

// PASO 4: Configurar el reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Configuración simple
recognition.lang = 'es-ES'; // Español
recognition.interimResults = false; // Solo resultados finales
recognition.maxAlternatives = 1; // Una sola alternativa

// PASO 5: Variable para saber si está escuchando
let estaEscuchando = false;

// PASO 6: Función para enviar texto a Wit.ai
async function analizarConWitAI(texto) {
  try {
    // Mostrar que está procesando
    console.log('Analizando con Wit.ai:', texto);

    fetch(`https://api.wit.ai/message?v=20240306&q=${encodeURIComponent(texto)}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN_IA}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(datos => {
        console.log('Respuesta de Wit.ai:', datos);
        // PASO 7: Procesar la respuesta de Wit.ai
        if (datos.entities) {
          // Buscar qué tipo de entidad detectó Wit.ai
          if (datos.entities.genero_libro) {
            alert(`Buscando libros del género: ${datos.entities.genero_libro[0].value}`);
          } else if (datos.entities.autor_libro) {
            alert(`Buscando libros del autor: ${datos.entities.autor_libro[0].value}`);
          } else if (datos.entities.titulo_libro) {
            alert(`Buscando libros con título: ${datos.entities.titulo_libro[0].value}`);
          }
        }
    })
    .catch(error => {
      console.error('Error al llamar a Wit.ai:', error);
    });
  } catch (error) {
    console.error('Error con Wit.ai:', error);
    // Si falla Wit.ai, al menos ponemos el texto en el input
    searchInput.value = texto;
  }
}

// PASO 10: Evento cuando se reconoce voz
recognition.onresult = function(event) {
  // Obtener el texto que dijo el usuario
  const textoDicho = event.results[0][0].transcript;
  console.log('Texto reconocido:', textoDicho);
  alert(`Texto reconocido: "${textoDicho}". Procesando búsqueda...`);
  
  // Enviar a Wit.ai para análisis
  analizarConWitAI(textoDicho);
  
  // Quitar el estado de escuchando
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
};

// PASO 11: Evento cuando termina de escuchar
recognition.onend = function() {
  console.log('Dejó de escuchar');
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
};

// PASO 12: Evento si hay error
recognition.onerror = function(event) {
  console.error('Error de voz:', event.error);
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  // Mensajes amigables según el error
  if (event.error === 'not-allowed') {
    alert('Por favor, permite el acceso al micrófono para usar búsqueda por voz');
  }
};

// PASO 13: Función para empezar a escuchar
function empezarAEscuchar() {
  if (estaEscuchando) {
    recognition.stop(); // Dejar de escuchar
    return;
  }
  
  try {
    recognition.start();
    micButton.classList.add('escuchando');
    estaEscuchando = true;
    console.log('Escuchando... di algo');
  } catch (error) {
    console.error('Error al iniciar:', error);
  }
}

// PASO 14: Conectar el botón con la función
micButton.addEventListener('click', empezarAEscuchar);