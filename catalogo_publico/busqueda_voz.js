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
const analizarConWitAI = async (texto) => {
  try {
    console.log('Analizando con Wit.ai:', texto);
    searchInput.value = texto;

    const respuesta = await fetch(`https://api.wit.ai/message?v=20240306&q=${encodeURIComponent(texto)}`, {
      headers: { 'Authorization': `Bearer ${TOKEN_IA}` }
    });

    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();
    console.log('Respuesta de Wit.ai:', datos);
    
    // PROCESAR LAS ENTIDADES
    const entities = datos.entities;
    let mensaje = '';
    
    // Verificar género (con el formato que me mostraste)
    if (entities['genero_libro:genero_libro']) {
      const genero = entities['genero_libro:genero_libro'][0].value;
      criterioSelect.value = 'genero';
      mensaje += `Género: ${genero}. `;
    }
    
    // Verificar título (con el formato que me mostraste)
    if (entities['titulo_libro:titulo_libro']) {
      const titulo = entities['titulo_libro:titulo_libro'][0].value;
      criterioSelect.value = 'titulo';
      mensaje += `Título: ${titulo}. `;
    }
    
    // Verificar autor (si existe en tu JSON)
    if (entities['autor_libro:autor_libro']) {
      const autor = entities['autor_libro:autor_libro'][0].value;
      criterioSelect.value = 'autor';
      mensaje += `Autor: ${autor}. `;
    }
    
    // Mostrar resultado
    if (mensaje) {
      alert('Buscando: con IA' + mensaje);
    } else {
      alert('Buscando sin IA: ' + texto);
    }
    
    // Aquí puedes llamar a tu función de búsqueda
    
  } catch (error) {
    console.error('Error:', error);
    alert('Buscando sin IA: ' + texto);
    searchInput.value = texto;
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