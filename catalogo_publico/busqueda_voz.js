const TOKEN_IA = 'UJK4FAQ4M4CI6BNKRRYDMRYXCLFLD5FY';
const micButton = document.getElementById('btnMic');
const searchInput = document.getElementById('input-busqueda');

//Verificar si el navegador soporta reconocimiento de voz
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  micButton.style.display = 'none';
  console.log('Tu navegador no soporta reconocimiento de voz');
}

// Configurar el reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Configuración simple
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Variable para saber si está escuchando
let estaEscuchando = false;

//Función para enviar texto a Wit.ai
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
    
    // Verificar género
    if (entities['genero_libro:genero_libro']) {
      const genero = entities['genero_libro:genero_libro'][0].value;
      mensaje += `Género: ${genero}. `;
    }
    
    // Verificar título
    if (entities['titulo_libro:titulo_libro']) {
      const titulo = entities['titulo_libro:titulo_libro'][0].value;
      mensaje += `Título: ${titulo}. `;
    }
    
    // Verificar autor
    if (entities['autor_libro:autor_libro']) {
      const autor = entities['autor_libro:autor_libro'][0].value;
      mensaje += `Autor: ${autor}. `;
    }
    
    // Mostrar resultado
    if (mensaje) {
      alert(mensaje);
    } else {
      alert(texto);
    }
    
    // Aquí puedes llamar a tu función de búsqueda
    
  } catch (error) {
    console.error('Error:', error);
    alert(texto);
    searchInput.value = texto;
  }
};

//Evento cuando se reconoce voz
recognition.onresult = function(event) {
  const textoDicho = event.results[0][0].transcript;
  console.log('Texto reconocido:', textoDicho);

  searchInput.value = textoDicho;
  
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  analizarConWitAI(textoDicho);
};

//Evento cuando termina de escuchar
recognition.onend = function() {
  console.log('Dejó de escuchar');
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
};

//Evento si hay error
recognition.onerror = function(event) {
  console.error('Error de voz:', event.error);
  micButton.classList.remove('escuchando');
  estaEscuchando = false;
  
  if (event.error === 'not-allowed') {
    alert('Por favor, permite el acceso al micrófono para usar búsqueda por voz');
  }
};

//Función para empezar a escuchar
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

micButton.addEventListener('click', empezarAEscuchar);