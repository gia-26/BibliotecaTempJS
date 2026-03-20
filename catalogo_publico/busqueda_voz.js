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

// PASO 6: Función para enviar texto a Wit.ai (CORREGIDA)
const analizarConWitAI = async (texto) => {
  try {
    // Mostrar que está procesando
    console.log('Analizando con Wit.ai:', texto);
    
    // Poner el texto en el input para que el usuario vea qué dijo
    searchInput.value = texto;

    // Llamar a la API de Wit.ai
    const respuesta = await fetch(`https://api.wit.ai/message?v=20240306&q=${encodeURIComponent(texto)}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN_IA}`
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log('Respuesta de Wit.ai:', datos);
    
    // PASO 7: Procesar la respuesta de Wit.ai
    if (datos.entities) {
      // Buscar qué tipo de entidad detectó Wit.ai
      if (datos.entities.genero_libro && datos.entities.genero_libro.length > 0) {
        const valor = datos.entities.genero_libro[0].value;
        criterioSelect.value = 'genero';
        alert(`Buscando libros del género: ${valor}`);
        
      } else if (datos.entities.autor_libro && datos.entities.autor_libro.length > 0) {
        const valor = datos.entities.autor_libro[0].value;
        criterioSelect.value = 'autor';
        alert(`Buscando libros del autor: ${valor}`);
        
      } else if (datos.entities.titulo_libro && datos.entities.titulo_libro.length > 0) {
        const valor = datos.entities.titulo_libro[0].value;
        criterioSelect.value = 'titulo';
        alert(`Buscando libros con título: ${valor}`);
        
      } else {
        // Si no detecta entidades específicas, usa el texto completo
        alert(`Buscando: "${texto}"`);
      }
    } else {
      // Si no hay entidades, busca con el texto completo
      alert(`Buscando: "${texto}"`);
    }
    
  } catch (error) {
    console.error('Error con Wit.ai:', error);
    alert(`Error al procesar: ${error.message}. Buscando: "${texto}"`);
    // Si falla Wit.ai, al menos ponemos el texto en el input
    searchInput.value = texto;
    if (typeof buscarLibros === 'function') buscarLibros();
  }
};

// PASO 10: Evento cuando se reconoce voz
recognition.onresult = function(event) {
  // Obtener el texto que dijo el usuario
  const textoDicho = event.results[0][0].transcript;
  console.log('Texto reconocido:', textoDicho);
  
  // Mostrar en el input lo que dijo
  searchInput.value = textoDicho;
  
  // Quitar el estado de escuchando ANTES de procesar
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  // Enviar a Wit.ai para análisis
  analizarConWitAI(textoDicho);
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