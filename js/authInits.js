// authInits.js - Manejo específico de inicialización de autenticación

/**
 * Inicializa el sistema de autenticación de Firebase
 * @returns {Promise<boolean>} True si la inicialización fue exitosa
 */
export async function initializeAuth() {
    try {
        // Verificar si Firebase está disponible
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK no está cargado');
            return false;
        }

        // Inicializar Firebase si no está inicializado
        if (!firebase.apps.length) {
            await import('./firebase-config.js');
            console.log('Firebase Auth inicializado correctamente');
        }

        return true;
    } catch (error) {
        console.error('Error al inicializar Firebase Auth:', error);
        return false;
    }
}

/**
 * Configura los listeners de autenticación
 * @param {function} callback Función a ejecutar cuando cambia el estado de autenticación
 */
export function setupAuthListeners(callback) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('Usuario autenticado:', user.email);
            if (callback) callback({ isAuthenticated: true, user });
        } else {
            console.log('Usuario no autenticado');
            if (callback) callback({ isAuthenticated: false, user: null });
        }
    });
}

/**
 * Verifica si el usuario está autenticado
 * @returns {Promise<{isAuthenticated: boolean, user: object|null}>}
 */
export async function checkAuthState() {
    return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe(); // Dejar de escuchar después de la primera verificación
            resolve({
                isAuthenticated: !!user,
                user
            });
        });
    });
}