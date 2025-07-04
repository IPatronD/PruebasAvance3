document.addEventListener('DOMContentLoaded', function () {
    // Selección de elementos del DOM
    const abrirFormularioBtn = document.getElementById('abrirFormulario');
    const modal = document.getElementById('modalFormulario');
    const cerrarBtn = document.querySelector('.cerrar');
    const formulario = document.getElementById('formularioAdopcion');

    // Elementos del formulario
    const nombreInput = formulario?.elements['nombre'];
    const emailInput = formulario?.elements['email'];
    const telefonoInput = formulario?.elements['telefono'];
    const mensajeTextarea = formulario?.elements['mensaje'];

    // Verificación de elementos en consola para depuración
    console.log('Elementos del modal:', {
        botonAbrir: abrirFormularioBtn,
        modal: modal,
        botonCerrar: cerrarBtn,
        formulario: formulario
    });

    // Estado inicial del modal
    if (modal) {
        modal.style.display = 'none';
    }

    function mostrarNotificacion(mensaje, tipo = 'exito') {
        // Eliminar notificaciones previas
        const notificacionesPrevias = document.querySelectorAll('.notificacion-flotante');
        notificacionesPrevias.forEach(notif => notif.remove());

        // Crear nueva notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-flotante notificacion-${tipo}`;
        notificacion.innerHTML = `<p>${mensaje}</p>`;

        // Añadir al cuerpo del documento
        document.body.appendChild(notificacion);

        // Mostrar animación
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);

        // Ocultar después de 5 segundos
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 300);
        }, 5000);
    }

    // Función para abrir el modal
    function abrirModal() {
        if (!modal) return;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Establecer atributos ARIA para accesibilidad
        if (abrirFormularioBtn) {
            abrirFormularioBtn.setAttribute('aria-expanded', 'true');
        }

        // Enfocar el primer campo del formulario al abrir
        setTimeout(() => {
            if (nombreInput) nombreInput.focus();
        }, 100);
    }

    // Función para cerrar el modal
    function cerrarModal() {
        if (!modal) return;

        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Restablecer atributos ARIA
        if (abrirFormularioBtn) {
            abrirFormularioBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // Configuración de event listeners
    function configurarEventListeners() {
        // Abrir modal
        if (abrirFormularioBtn) {
            abrirFormularioBtn.addEventListener('click', abrirModal);
        }

        // Cerrar modal con botón
        if (cerrarBtn) {
            cerrarBtn.addEventListener('click', cerrarModal);
        }

        // Cerrar modal haciendo clic fuera del contenido
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    cerrarModal();
                }
            });
        }

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                cerrarModal();
            }
        });

        // Manejo del formulario
        if (formulario) {
            // Limpiar listeners previos para evitar duplicados
            formulario.removeEventListener('submit', manejarEnvioFormulario);
            formulario.addEventListener('submit', manejarEnvioFormulario);

            // Opcional: Validación en tiempo real
            if (emailInput) {
                emailInput.addEventListener('blur', validarEmail);
            }

            if (telefonoInput) {
                telefonoInput.addEventListener('blur', validarTelefono);
            }
        }
    }

    // Función para manejar el envío del formulario
    function mostrarNotificacion(mensaje, tipo = 'exito') {
        // Eliminar notificaciones previas
        const notificacionesPrevias = document.querySelectorAll('.notificacion-flotante');
        notificacionesPrevias.forEach(notif => notif.remove());

        // Crear nueva notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-flotante notificacion-${tipo}`;
        notificacion.innerHTML = `<p>${mensaje}</p>`;

        // Añadir al cuerpo del documento
        document.body.appendChild(notificacion);

        // Mostrar animación
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);

        // Ocultar después de 5 segundos
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 300);
        }, 5000);
    }

    // Función para abrir modal
    function abrirModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        abrirFormularioBtn.setAttribute('aria-expanded', 'true');
    }

    // Función para cerrar modal
    function cerrarModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        abrirFormularioBtn.setAttribute('aria-expanded', 'false');
    }

    // Configurar event listeners
    abrirFormularioBtn.addEventListener('click', abrirModal);
    cerrarBtn.addEventListener('click', cerrarModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            cerrarModal();
        }
    });

    // Manejar envío del formulario
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar campos
        const nombre = formulario.elements['nombre'].value.trim();
        const email = formulario.elements['email'].value.trim();
        const telefono = formulario.elements['telefono'].value.trim();
        const mensaje = formulario.elements['mensaje'].value.trim();

        // Validación básica
        if (!nombre || !email || !telefono || !mensaje) {
            mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        // Validación de email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarNotificacion('Por favor ingresa un correo electrónico válido', 'error');
            return;
        }

        // Validación de teléfono
        if (!/^\d{8,}$/.test(telefono)) {
            mostrarNotificacion('El teléfono debe tener al menos 8 dígitos', 'error');
            return;
        }

        // Mostrar confirmación
        mostrarNotificacion('🐶¡Gracias por tu solicitud de adopción! Nos pondremos en contacto contigo pronto. 😼');

        // Cerrar modal y resetear después de 1 segundo
        setTimeout(() => {
            cerrarModal();
            formulario.reset();
        }, 100);
    });
});