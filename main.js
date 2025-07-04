// ==================== CONFIGURACIÓN INICIAL ====================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// ==================== FUNCIONES PRINCIPALES ====================
function initializeApp() {
  // Componentes generales
  setupMenuHamburguesa();
  setupSubmenus();
  setupHeaderPadding();
  setupCarrusel();

  // Páginas específicas
  setupAcordeonPreguntas();
  setupContactoForm();
  setupDonacion();
  setupContactoMotivo();
  setupModalAdopcion();
  setupLightbox();
  setupMapa();
  setupDonaAhora();

  // Autenticación
  setupAuth();
}

// ==================== COMPONENTES GENERALES ====================

/**
 * Configura el menú hamburguesa para móviles
 */
function setupMenuHamburguesa() {
  const hamburguesa = document.querySelector('.menu-hamburguesa');
  const menu = document.querySelector('.menu');

  if (!hamburguesa || !menu) return;

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    hamburguesa.classList.toggle('activo');
    menu.classList.toggle('activo');
    document.body.style.overflow = menu.classList.contains('activo') ? 'hidden' : '';
  };

  const cerrarMenu = () => {
    hamburguesa.classList.remove('activo');
    menu.classList.remove('activo');
    document.body.style.overflow = '';
  };

  hamburguesa.addEventListener('click', toggleMenu);

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && menu.classList.contains('activo') &&
      !e.target.closest('.menu') && !e.target.closest('.menu-hamburguesa')) {
      cerrarMenu();
    }
  });

  menu.querySelectorAll('a:not(.submenu-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) cerrarMenu();
    });
  });
}

/**
 * Configura los submenús desplegables
 */
function setupSubmenus() {
  const submenuTriggers = document.querySelectorAll('.submenu-trigger');
  const submenus = document.querySelectorAll('.submenu');

  // Comportamiento para móviles
  submenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        this.parentElement.classList.toggle('activo');
      }
    });
  });

  // Comportamiento para desktop
  submenus.forEach(submenu => {
    const trigger = submenu.querySelector('.submenu-trigger');
    const options = submenu.querySelector('.submenu-opciones');

    if (trigger && options && window.innerWidth > 768) {
      trigger.addEventListener('mouseenter', () => {
        options.style.display = 'block';
      });

      submenu.addEventListener('mouseleave', () => {
        setTimeout(() => {
          if (!submenu.matches(':hover') && !options.matches(':hover')) {
            options.style.display = 'none';
          }
        }, 200);
      });
    }
  });
}

/**
 * Ajusta el padding del body según la altura del header
 */
function setupHeaderPadding() {
  const header = document.querySelector('header');
  if (header) {
    document.body.style.paddingTop = `${header.offsetHeight}px`;
  }
}

/**
 * Configura el carrusel automático
 */
function setupCarrusel() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length <= 1) return;

  let index = 0;
  const contenedor = document.querySelector('.slide-track');

  function showSlide(i) {
    const slideWidth = slides[0]?.offsetWidth || 0;
    if (contenedor) {
      contenedor.style.transform = `translateX(-${i * slideWidth}px)`;
    }
  }

  const intervalId = setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 3000);

  // Limpiar intervalo al salir de la página
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });
}

// ==================== PÁGINAS ESPECÍFICAS ====================

/**
 * Configura el acordeón de preguntas frecuentes
 */
function setupAcordeonPreguntas() {
  if (!document.querySelector('.acordeon-preguntas')) return;

  const preguntas = document.querySelectorAll('.pregunta');
  preguntas.forEach(pregunta => {
    pregunta.addEventListener('click', () => {
      const item = pregunta.parentElement;
      const estaAbierta = item.classList.contains('abierta');

      preguntas.forEach(p => p.parentElement.classList.remove('abierta'));
      if (!estaAbierta) item.classList.add('abierta');
    });
  });
}

/**
 * Configura el formulario de contacto
 */
function setupContactoForm() {
  if (!document.querySelector('.contacto-form') || !document.getElementById('notificacion')) return;

  const form = document.querySelector('.contacto-form');
  const notificacion = document.getElementById('notificacion');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 3000);
    form.reset();
  });
}

/**
 * Configura la sección de donación con QR y BCP
 */
function setupDonacion() {
  if (!document.querySelector('.contenedor-donacion')) return;

  const enlaceQR = document.getElementById('verQR');
  const enlaceBCP = document.getElementById('verBCP');
  const contenedorQR = document.getElementById('contenedorQR');
  const contenedorBCP = document.getElementById('contenedorBCP');

  function toggleContenedor(contenedorMostrar, contenedorOcultar, enlace, textoMostrar, textoOcultar) {
    const activo = contenedorMostrar.classList.contains('activo');

    contenedorMostrar.classList.toggle('activo');
    enlace.textContent = activo ? textoMostrar : textoOcultar;

    if (contenedorOcultar.classList.contains('activo')) {
      contenedorOcultar.classList.remove('activo');
      if (enlace === enlaceQR) enlaceBCP.textContent = 'Ver detalles';
      if (enlace === enlaceBCP) enlaceQR.textContent = 'Ver código QR';
    }
  }

  if (enlaceQR && contenedorQR) {
    enlaceQR.addEventListener('click', function (e) {
      e.preventDefault();
      toggleContenedor(contenedorQR, contenedorBCP, enlaceQR, 'Ver código QR', 'Ocultar código QR');
    });
  }

  if (enlaceBCP && contenedorBCP) {
    enlaceBCP.addEventListener('click', function (e) {
      e.preventDefault();
      toggleContenedor(contenedorBCP, contenedorQR, enlaceBCP, 'Ver detalles', 'Ocultar detalles');
    });
  }
}

/**
 * Configura el selector de motivo en contacto
 */
function setupContactoMotivo() {
  const selectMotivo = document.getElementById('motivo');
  const campoOtro = document.getElementById('campo-otro-motivo');
  const otroInput = document.getElementById('otroMotivo');

  if (selectMotivo && campoOtro && otroInput) {
    selectMotivo.addEventListener('change', function () {
      const mostrarCampoOtro = this.value === 'otros';
      campoOtro.classList.toggle('campo-extra', !mostrarCampoOtro);
      otroInput.required = mostrarCampoOtro;
      if (!mostrarCampoOtro) otroInput.value = '';
    });
  }
}


/**
 * Configura el lightbox para imágenes
 */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const closeBtn = document.querySelector('.close-btn');

  document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      lightbox.style.display = 'block';
      lightboxImg.src = this.getAttribute('href');
      lightboxCaption.textContent = this.querySelector('img').alt;
    });
  });

  closeBtn.addEventListener('click', function () {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target !== lightboxImg && e.target !== lightboxCaption) {
      lightbox.style.display = 'none';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
      lightbox.style.display = 'none';
    }
  });
}

/**
 * Configura el mapa interactivo con fallback
 */
function setupMapa() {
  const mapaIframe = document.querySelector('.mapa-interactivo');
  const mapaFallback = document.querySelector('.mapa-fallback');

  if (mapaIframe) {
    mapaIframe.addEventListener('error', function () {
      mapaIframe.style.display = 'none';
      if (mapaFallback) mapaFallback.style.display = 'flex';
    });

    if (!navigator.onLine && mapaFallback) {
      mapaIframe.style.display = 'none';
      mapaFallback.style.display = 'flex';
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupMapa();
});

/**
 * Configura la página de donación con tarjeta
 */


// Formato automático para fecha MM/AA
document.getElementById("expira").addEventListener("input", function (e) {
  let val = e.target.value.replace(/\D/g, "").slice(0, 4); // Solo números, máx 4 dígitos

  // Validar que los dos primeros dígitos (mes) estén entre 01 y 12
  if (val.length >= 2) {
    const mes = parseInt(val.slice(0, 2), 10);
    if (mes < 1 || mes > 12) {
      val = "12" + val.slice(2); // Reemplaza por 12 si es inválido
    }
  }

  // Formatear como MM/AA
  if (val.length > 2) {
    val = val.slice(0, 2) + "/" + val.slice(2);
  }

  e.target.value = val;
});

// Formato automático para tarjeta XXXX XXXX XXXX XXXX
document.getElementById("numero-tarjeta").addEventListener("input", function (e) {
  let val = e.target.value.replace(/\D/g, "").substring(0, 16);
  let formatted = val.match(/.{1,4}/g);
  e.target.value = formatted ? formatted.join(" ") : "";
});

// Solo números en CVC
document.getElementById("cvc").addEventListener("input", function (e) {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
});

// Mostrar alerta y redirigir al cerrar
function realizarPago() {
  alert("Pago Realizado");
  window.location.href = "dona.html";
}

//Otros:
document.addEventListener('DOMContentLoaded', function () {
  const selectMotivo = document.getElementById('motivo');
  const campoOtro = document.getElementById('campo-otro-motivo');
  const otroInput = document.getElementById('otroMotivo');

  if (selectMotivo && campoOtro && otroInput) {
    selectMotivo.addEventListener('change', function () {
      if (this.value === 'otros') {
        campoOtro.classList.remove('campo-extra');
        otroInput.required = true;
      } else {
        campoOtro.classList.add('campo-extra');
        otroInput.value = '';
        otroInput.required = false;
      }
    });
  }
});
// ==================== AUTENTICACIÓN ====================

/**
 * Configura el sistema de autenticación con Firebase
 */
function setupAuth() {
  // Solo inicializar si hay formularios de autenticación
  if (!document.getElementById('loginForm') && !document.getElementById('registroForm')) return;

  const firebaseConfig = {
    apiKey: "AIzaSyAsgoZu9bYmPEhr9sZ0yUv1adZTFG_sYPo",
    authDomain: "colitasfelices-fe78e.firebaseapp.com",
    projectId: "colitasfelices-fe78e",
    storageBucket: "colitasfelices-fe78e.appspot.com",
    messagingSenderId: "471064507176",
    appId: "1:471064507176:web:ab12cd34ef56gh78"
  };

  // Inicializa Firebase solo si no está ya inicializado
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();

  // Configura formulario de login
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin(auth);
  });

  // Configura formulario de registro
  document.getElementById('registroForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleRegister(auth);
  });

  // Verifica estado de autenticación
  auth.onAuthStateChanged((user) => {
    updateAuthUI(user);
  });
}

/**
 * Maneja el inicio de sesión
 */
async function handleLogin(auth) {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // Validaciones básicas
  if (!email.includes('@')) {
    errorMessage.textContent = "Por favor ingresa un correo válido";
    return;
  }
  if (password.length < 6) {
    errorMessage.textContent = "La contraseña debe tener al menos 6 caracteres";
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "bienvenidos.html";
  } catch (error) {
    console.error("Error de autenticación:", error);
    showAuthError(error, errorMessage);
  }
}

/**
 * Maneja el registro de usuario
 */
async function handleRegister(auth) {
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value;
  const repetirContrasena = document.getElementById('repetirContrasena').value;
  const errorElement = document.getElementById('registro-error');

  // Validaciones
  if (!nombre) {
    errorElement.textContent = "El nombre es requerido";
    return;
  }
  if (!/^\d{9}$/.test(telefono)) {
    errorElement.textContent = "El teléfono debe tener 9 dígitos";
    return;
  }
  if (!correo.includes('@')) {
    errorElement.textContent = "Ingrese un correo electrónico válido";
    return;
  }
  if (contrasena.length < 6) {
    errorElement.textContent = "La contraseña debe tener al menos 6 caracteres";
    return;
  }
  if (contrasena !== repetirContrasena) {
    errorElement.textContent = "Las contraseñas no coinciden";
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(correo, contrasena);
    await firebase.database().ref(`usuarios/${userCredential.user.uid}`).set({
      nombre,
      telefono,
      correo,
      fechaRegistro: firebase.database.ServerValue.TIMESTAMP
    });
    window.location.href = "../html/bienvenidosPrimer.html";
  } catch (error) {
    console.error("Error de registro:", error);
    showAuthError(error, errorElement);
  }
}

/**
 * Muestra errores de autenticación
 */
function showAuthError(error, errorElement) {
  if (!errorElement) return;

  switch (error.code) {
    case 'auth/user-not-found':
      errorElement.textContent = "Usuario no registrado";
      break;
    case 'auth/wrong-password':
      errorElement.textContent = "Contraseña incorrecta";
      break;
    case 'auth/email-already-in-use':
      errorElement.textContent = "El correo ya está registrado";
      break;
    case 'auth/invalid-email':
      errorElement.textContent = "Correo electrónico inválido";
      break;
    default:
      errorElement.textContent = "Error al procesar la solicitud. Intenta nuevamente";
  }
}

/**
 * Actualiza la UI según el estado de autenticación
 */
function updateAuthUI(user) {
  const userMenu = document.querySelector('.submenu-trigger');
  if (!userMenu) return;

  if (user) {
    userMenu.innerHTML = `${user.email} <span class="submenu-icon">▾</span>`;

    const submenu = document.querySelector('.submenu-opciones');
    if (submenu) {
      submenu.innerHTML = `
        <a href="perfil.html">Mi Perfil</a>
        <a href="#" id="logoutBtn">Cerrar Sesión</a>
      `;

      document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
          window.location.href = "./index.html";
        });
      });
    }
  }
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Realiza el proceso de pago simulado
 */
function realizarPago() {
  if (window.pagoEnProceso) return;
  window.pagoEnProceso = true;

  const botonDonar = document.querySelector(".formulario-tarjeta button[type='submit']");
  if (botonDonar) {
    botonDonar.disabled = true;
    botonDonar.innerHTML = '<span class="spinner"></span> Procesando...';
  }

  const formulario = document.querySelector(".formulario-tarjeta form");
  const monto = document.getElementById("monto");

  // Validar monto
  if (monto) {
    const valorMonto = parseFloat(monto.value);
    if (isNaN(valorMonto) || valorMonto <= 0) {
      monto.setCustomValidity("Por favor ingrese un monto válido mayor a 0");
      monto.reportValidity();
      window.pagoEnProceso = false;
      if (botonDonar) {
        botonDonar.disabled = false;
        botonDonar.textContent = "Donar";
      }
      return;
    }
    monto.setCustomValidity("");
  }

  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    window.pagoEnProceso = false;
    if (botonDonar) {
      botonDonar.disabled = false;
      botonDonar.textContent = "Donar";
    }
    return;
  }

  // Simular procesamiento
  setTimeout(() => {
    const montoDonacion = monto ? ` de $${parseFloat(monto.value).toFixed(2)}` : "";
    alert(`¡Pago realizado con éxito${montoDonacion}! Gracias por tu donación.`);

    // Redirigir
    setTimeout(() => {
      window.location.href = "../html/dona.html";
    }, 500);
  }, 1500);
}