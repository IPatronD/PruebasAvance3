// Configuración de Firebase (versión compatible)
const firebaseConfig = {
    apiKey: "AIzaSyAsgoZu9bYmPEhr9sZ0yUv1adZTFG_sYPo",
    authDomain: "colitasfelices-fe78e.firebaseapp.com",
    databaseURL: "https://colitasfelices-fe78e-default-rtdb.firebaseio.com",
    projectId: "colitasfelices-fe78e",
    storageBucket: "colitasfelices-fe78e.appspot.com",
    messagingSenderId: "471064507176",
    appId: "1:471064507176:web:ab12cd34ef56gh78"
};

// Inicialización mejorada
if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase inicializado correctamente");
        } else {
            console.log("Firebase ya estaba inicializado");
        }
    } catch (error) {
        console.error("Error al inicializar Firebase:", error);
    }
} else {
    console.error("Firebase SDK no está cargado");
}

// Funciones de acceso
function getAuthInstance() {
    return firebase.auth();
}

function getDatabaseInstance() {
    return firebase.database();
}