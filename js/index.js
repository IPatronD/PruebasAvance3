/**
 * Carrusel con Lightbox - Versión mejorada y corregida
 * Controla el carrusel automático y el lightbox para imágenes
 */

document.addEventListener('DOMContentLoaded', function () {
    // ------------------------- CONFIGURACIÓN INICIAL -------------------------
    const carrusel = {
        track: document.querySelector('.slide-track'),
        slides: document.querySelectorAll('.slide'),
        currentIndex: 0,
        slideWidth: 0,
        autoPlayInterval: null,
        autoPlaySpeed: 4000, // 4 segundos
        isPaused: false,

        // Elementos del Lightbox
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxCaption: document.querySelector('.lightbox-caption'),
        images: Array.from(document.querySelectorAll('.lightbox-trigger')),
        currentImageIndex: 0
    };

    // Verificar elementos esenciales
    if (!carrusel.track || !carrusel.lightbox) {
        console.error('Elementos principales del carrusel no encontrados');
        return;
    }

    // ------------------------- FUNCIONES DEL CARRUSEL -------------------------

    function initCarrusel() {
        calculateSlideWidth();
        cloneSlidesForInfiniteEffect();
        setupCarruselEvents();
        startAutoPlay();
        setupLightbox();
    }

    function calculateSlideWidth() {
        if (carrusel.slides.length > 0) {
            const slideStyle = window.getComputedStyle(carrusel.slides[0]);
            carrusel.slideWidth = carrusel.slides[0].offsetWidth +
                parseInt(slideStyle.marginRight) +
                parseInt(slideStyle.marginLeft);
        }
    }

    function cloneSlidesForInfiniteEffect() {
        // Clonar suficientes slides para efecto infinito
        const slidesToClone = Array.from(carrusel.slides).slice(0, Math.ceil(carrusel.slides.length / 2));
        slidesToClone.forEach(slide => {
            const clone = slide.cloneNode(true);
            carrusel.track.appendChild(clone);
        });
    }

    function setupCarruselEvents() {
        // Eventos de interacción
        carrusel.track.addEventListener('mouseenter', pauseAutoPlay);
        carrusel.track.addEventListener('mouseleave', resumeAutoPlay);
        carrusel.track.addEventListener('touchstart', pauseAutoPlay, { passive: true });
        carrusel.track.addEventListener('touchend', resumeAutoPlay, { passive: true });

        // Redimensionamiento
        window.addEventListener('resize', debounce(handleResize, 200));
    }

    function handleResize() {
        calculateSlideWidth();
        updateCarruselPosition();
    }

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function startAutoPlay() {
        if (carrusel.isPaused) return;

        clearInterval(carrusel.autoPlayInterval);
        carrusel.autoPlayInterval = setInterval(() => {
            nextSlide();
        }, carrusel.autoPlaySpeed);
    }

    function pauseAutoPlay() {
        carrusel.isPaused = true;
        clearInterval(carrusel.autoPlayInterval);
    }

    function resumeAutoPlay() {
        carrusel.isPaused = false;
        startAutoPlay();
    }

    function nextSlide() {
        carrusel.currentIndex++;
        updateCarruselPosition();

        // Efecto infinito
        if (carrusel.currentIndex >= carrusel.slides.length) {
            setTimeout(() => {
                carrusel.track.style.transition = 'none';
                carrusel.currentIndex = 0;
                updateCarruselPosition();
                setTimeout(() => carrusel.track.style.transition = 'transform 0.5s ease', 20);
            }, 500);
        }
    }

    function updateCarruselPosition() {
        carrusel.track.style.transform = `translateX(-${carrusel.currentIndex * carrusel.slideWidth}px)`;
    }

    // ------------------------- FUNCIONES DEL LIGHTBOX -------------------------

    function setupLightbox() {
        // Verificar botones
        const closeBtn = carrusel.lightbox.querySelector('.close-btn');
        const prevBtn = carrusel.lightbox.querySelector('.prev-btn');
        const nextBtn = carrusel.lightbox.querySelector('.next-btn');

        if (!closeBtn || !prevBtn || !nextBtn) {
            console.error('Botones del lightbox no encontrados');
            return;
        }

        // Configurar eventos de imágenes
        carrusel.images.forEach((img, index) => {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // Configurar eventos de botones
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });

        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(-1);
        });

        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            navigateLightbox(1);
        });

        // Eventos de teclado
        document.addEventListener('keydown', handleKeyboardEvents);

        // Clic fuera para cerrar
        carrusel.lightbox.addEventListener('click', function (e) {
            if (e.target === carrusel.lightbox) {
                closeLightbox();
            }
        });
    }

    function openLightbox(index) {
        carrusel.currentImageIndex = index;
        updateLightboxContent();
        carrusel.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        pauseAutoPlay();
    }

    function closeLightbox() {
        carrusel.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resumeAutoPlay();
    }

    function navigateLightbox(direction) {
        carrusel.currentImageIndex =
            (carrusel.currentImageIndex + direction + carrusel.images.length) % carrusel.images.length;

        // Transición suave
        carrusel.lightboxImg.style.opacity = '0';
        setTimeout(() => {
            updateLightboxContent();
            carrusel.lightboxImg.style.opacity = '1';
        }, 150);
    }

    function updateLightboxContent() {
        const currentImg = carrusel.images[carrusel.currentImageIndex];
        carrusel.lightboxImg.src = currentImg.getAttribute('href');
        carrusel.lightboxImg.alt = currentImg.querySelector('img').alt;
        carrusel.lightboxCaption.textContent = currentImg.dataset.caption || carrusel.lightboxImg.alt;

        centerLightboxImage();
    }

    function centerLightboxImage() {
        const img = new Image();
        img.onload = function () {
            const container = carrusel.lightbox.querySelector('.lightbox-content-container');
            const containerRatio = container.offsetWidth / container.offsetHeight;
            const imgRatio = img.width / img.height;

            carrusel.lightboxImg.style.width = imgRatio > containerRatio ? '100%' : 'auto';
            carrusel.lightboxImg.style.height = imgRatio > containerRatio ? 'auto' : '100%';
        };
        img.src = carrusel.lightboxImg.src;
    }

    function handleKeyboardEvents(e) {
        if (!carrusel.lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': navigateLightbox(-1); break;
            case 'ArrowRight': navigateLightbox(1); break;
        }
    }

    // ------------------------- INICIALIZACIÓN -------------------------
    initCarrusel();
});

