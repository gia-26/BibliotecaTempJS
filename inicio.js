const catalogoLibs = document.getElementById('catalogoLibs');
const quienesSomos = document.getElementById('quienesSomos');
const nuestraHistoria = document.getElementById('nuestraHistoria');
const mision = document.getElementById('mision');
const vision = document.getElementById('vision');
const objetivo = document.getElementById('objetivo');
const personalContainer = document.getElementById('personalContainer');

fetch('https://backend-biblioteca-two.vercel.app/api/inicio/libros')
  .then(response => response.json())
  .then(libros => {
    
    // 1. Inyectamos los libros en el HTML
    catalogoLibs.innerHTML = '';
    libros.forEach(libro => {
        catalogoLibs.innerHTML += `
        <div class="swiper-slide" >
            <div class="libro">
                <img loading="lazy" src="${libro.Imagen}" alt="${libro.Titulo}" class="libro-img">
                <div class="libro-content">
                <h3 class="read-on-hover" data-text='Título: ${libro.Titulo}'>${libro.Titulo}</h3>
                <div class="read-on-hover autor" data-text='Autor: ${libro.Autor}'>${libro.Autor}</div>
                <p class="read-on-hover" data-text='Sinopsis: ${libro.Sinopsis}'>${libro.Sinopsis}</p>
                <a href="./catalogo_publico" class="btn">Ver más</a>
                </div>
            </div>
        </div>
        `;
    });

    // 2.  inicializamos Swiper (porque los libros ya existen en el HTML)
    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            320:  { slidesPerView: 1, spaceBetween: 12 },
            640:  { slidesPerView: 2, spaceBetween: 16 },
            900:  { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 24 }
        }
    });

    // 3. Asignamos los eventos del texto a voz a los libros que acabamos de crear
    document.querySelectorAll('#catalogoLibs .read-on-hover').forEach(el => {
        el.addEventListener('mouseover', () => {
            const txt = el.getAttribute('data-text') || el.innerText;
            speakText(txt);
        });
        el.addEventListener('mouseout', () => {
            window.speechSynthesis.cancel();
        });
    });

  })
  .catch(error => {
    console.error('Error al obtener los libros:', error);
  });

fetch('https://backend-biblioteca-two.vercel.app/api/inicio/info-biblioteca')
  .then(response => response.json())
  .then(info => {
    if (info.length > 0) {
        const data = info[0];
        quienesSomos.innerText = data.QuienesSomos;
        quienesSomos.setAttribute('data-text', data.QuienesSomos);
        nuestraHistoria.innerText = data.NuestraHistoria;
        nuestraHistoria.setAttribute('data-text', data.NuestraHistoria);
        mision.innerText = data.Mision;
        mision.setAttribute('data-text', data.Mision);
        vision.innerText = data.Vision;
        vision.setAttribute('data-text', data.Vision);
        objetivo.innerText = data.Objetivo;
        objetivo.setAttribute('data-text', data.Objetivo);
    }
  })

fetch('https://backend-biblioteca-two.vercel.app/api/inicio/personal')
  .then(response => response.json())
  .then(personales => {
    personalContainer.innerHTML = '';
    personales.forEach(personal => {
        personalContainer.innerHTML += `
          <div class="directorio-card">
            <img src="./fotoBibliotecario.png" alt="Directora">
            <div class="directorio-card-content">
              <h3 class="read-on-hover" data-text='Nombre: ${personal.Nombre} ${personal.Apellido_P} ${personal.Apellido_M}'>${personal.Nombre} ${personal.Apellido_P} ${personal.Apellido_M}</h3>
              <div class="cargo read-on-hover" data-text='Cargo: ${personal.Tipo_rol}'>${personal.Tipo_rol}</div>
            </div>
          </div>
        `;
    });
  })