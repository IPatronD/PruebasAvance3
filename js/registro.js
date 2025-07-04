document.addEventListener('DOMContentLoaded', async function () {
    const registroForm = document.getElementById('registroForm');
    const errorElement = document.getElementById('registro-error');
    const submitBtn = registroForm.querySelector('button[type="submit"]');

    function mostrarError(mensaje) {
        errorElement.textContent = mensaje;
        submitBtn.disabled = false;  // Habilitar el botón después del error
        return false; // Detener el flujo aquí si hay un error
    }

    // Deshabilitar el botón de envío para evitar clics repetidos
    submitBtn.disabled = false;

    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Evitar el envío del formulario hasta validación
        submitBtn.disabled = true; // Deshabilitar el botón mientras se valida

        // Datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            correo: document.getElementById('correo').value.trim().toLowerCase(),
            contrasena: document.getElementById('contrasena').value,
            repetirContrasena: document.getElementById('repetirContrasena').value
        };

        // Validaciones
        if (!datos.nombre) {
            return mostrarError("Nombre es requerido");
        }

        if (!/^\d{9}$/.test(datos.telefono)) {
            return mostrarError("Teléfono debe tener 9 dígitos");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
            return mostrarError("Correo no válido");
        }

        if (datos.contrasena.length < 6) {
            return mostrarError("Contraseña muy corta (mínimo 6 caracteres)");
        }

        // Verificar si la contraseña contiene al menos una mayúscula
        if (!/[A-Z]/.test(datos.contrasena)) {
            return mostrarError("La contraseña debe contener al menos una mayúscula");
        }

        if (!/[A-Z]/.test(datos.repetirContrasena)) {
            return mostrarError("La contraseña repetida debe contener al menos una mayúscula");
        }

        if (datos.contrasena !== datos.repetirContrasena) {
            return mostrarError("Las contraseñas no coinciden");
        }

        // Si todo es correcto, intentamos el registro
        submitBtn.innerHTML = '<span class="spinner"></span> Registrando...'; // Indicador de carga
        submitBtn.disabled = true; // Deshabilitar mientras se está registrando

        // Simular un retraso de 1 minuto (60000 ms) antes de enviar la solicitud de registro
        setTimeout(async () => {
            try {
                // 1. Registrar usuario
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(datos.correo, datos.contrasena);

                // 2. Guardar nombre en perfil
                await userCredential.user.updateProfile({ displayName: datos.nombre });

                // 3. Guardar en Realtime Database
                await firebase.database().ref('usuarios/' + userCredential.user.uid).set({
                    nombre: datos.nombre,
                    telefono: datos.telefono,
                    correo: datos.correo,
                    fechaRegistro: firebase.database.ServerValue.TIMESTAMP,
                    esNuevo: true
                });

                // 4. Guardar en localStorage
                localStorage.setItem('userEmail', datos.correo);
                localStorage.setItem('userName', datos.nombre);
                localStorage.setItem('esUsuarioNuevo', 'true');

                // 5. Redirigir después de registro exitoso
                const inHtmlFolder = window.location.pathname.includes('/html/');
                const rutaBienvenida = inHtmlFolder ? './bienvenidosPrimer.html?registro=exitoso' : './html/bienvenidosPrimer.html?registro=exitoso';
                window.location.href = rutaBienvenida;

            } catch (error) {
                console.error("Error en registro:", error);

                let errorMessage = "";
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "El correo ya está registrado";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Correo electrónico no válido";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
                        break;
                    default:
                        errorMessage = "Ocurrió un error inesperado. Intente nuevamente";
                }

                mostrarError(errorMessage);
            } finally {
                // Asegurarse de que el botón se habilite al finalizar el proceso
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Registrarse'; // Restaurar el texto del botón
            }
        }, 600000000); // 1 minuto de retraso en milisegundos
    });
});