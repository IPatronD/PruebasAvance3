// auth-system.js - Versión actualizada para Firebase

// Función para registrar un nuevo usuario con Firebase
async function registrarUsuario(nombre, telefono, correo, contrasena) {
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(correo, contrasena);

        // Guardar datos adicionales en Realtime Database
        await firebase.database().ref('usuarios/' + userCredential.user.uid).set({
            nombre: nombre,
            telefono: telefono,
            correo: correo,
            fechaRegistro: firebase.database.ServerValue.TIMESTAMP
        });

        return { success: true };
    } catch (error) {
        let errorMessage = "Error al registrar usuario";

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "El correo ya está registrado";
                break;
            case 'auth/invalid-email':
                errorMessage = "Correo electrónico no válido";
                break;
            case 'auth/weak-password':
                errorMessage = "La contraseña es demasiado débil";
                break;
            default:
                console.error("Error de registro:", error);
        }

        return { success: false, error: errorMessage };
    }
}

// Función para iniciar sesión con Firebase
async function iniciarSesion(correo, contrasena) {
    try {
        await firebase.auth().signInWithEmailAndPassword(correo, contrasena);
        return { success: true };
    } catch (error) {
        let errorMessage = "Error al iniciar sesión";

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = "Correo o contraseña incorrectos";
                break;
            case 'auth/user-disabled':
                errorMessage = "Cuenta deshabilitada";
                break;
            default:
                console.error("Error de inicio de sesión:", error);
        }

        return { success: false, error: errorMessage };
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    return firebase.auth().signOut();
}

// Función para verificar sesión activa
function verificarSesion() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

// Función para cargar datos del usuario
async function cargarDatosUsuario() {
    const user = firebase.auth().currentUser;
    if (user) {
        const snapshot = await firebase.database().ref('usuarios/' + user.uid).once('value');
        return snapshot.val();
    }
    return null;
}

// Inicialización de event listeners
document.addEventListener('DOMContentLoaded', async function () {
    const user = await verificarSesion();

    if (user) {
        // Usuario autenticado - redirigir o actualizar UI
        console.log("Usuario autenticado:", user.email);
    }

    // Asignar manejadores de formularios
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            const resultado = await iniciarSesion(correo, contrasena);
            if (resultado.success) {
                window.location.href = './bienvenidos.html';  // Redirigir a bienvenidos después de login
            } else {
                document.getElementById('error-message').textContent = resultado.error;
            }
        });
    }

    if (document.getElementById('registroForm')) {
        document.getElementById('registroForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;
            const repetirContrasena = document.getElementById('repetirContrasena').value;

            if (contrasena !== repetirContrasena) {
                document.getElementById('registro-error').textContent = "Las contraseñas no coinciden";
                return;
            }

            const resultado = await registrarUsuario(nombre, telefono, correo, contrasena);
            if (resultado.success) {
                window.location.href = 'bienvenidosPrimer.html'; // Redirigir a "bienvenidosPrimer" si es un nuevo usuario
            } else {
                document.getElementById('registro-error').textContent = resultado.error;
            }
        });
    }
});