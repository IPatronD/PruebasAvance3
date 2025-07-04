// auth-state.js
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    // Evitar ejecución en páginas de login o registro
    if (currentPage.includes('iniciarSesion.html') || currentPage.includes('registrate.html')) {
        return; // No ejecutar menú ni logout en estas páginas
    }

    // Verificar estado de autenticación
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    // Actualizar menú de cuenta en todas las páginas
    updateAccountMenu(userEmail, userName);

    // Configurar logout
    setupLogout();
});

function updateAccountMenu(userEmail, userName) {
    const accountMenu = document.querySelector('.submenu');
    if (!accountMenu) return;

    const trigger = accountMenu.querySelector('.submenu-trigger');
    const options = accountMenu.querySelector('.submenu-opciones');

    const inHtmlFolder = window.location.pathname.includes('/html/');

    const rutaIniciar = inHtmlFolder ? './iniciarSesion.html' : './html/iniciarSesion.html';
    const rutaRegistro = inHtmlFolder ? './registrate.html' : './html/registrate.html';

    // Detectar si el usuario recién se registró
    const esNuevo = localStorage.getItem('esUsuarioNuevo') === 'true';

    // Determinar a qué página de perfil dirigir según el estado
    const rutaPerfil = inHtmlFolder
        ? (esNuevo ? './bienvenidosPrimer.html' : './bienvenidos.html')
        : (esNuevo ? './html/bienvenidosPrimer.html' : './html/bienvenidos.html');

    const rutaLogout = inHtmlFolder ? '../index.html' : './index.html'; // Asegura redirección correcta

    if (userEmail) {
        trigger.innerHTML = `${userName || 'Mi Cuenta'} <span class="submenu-icon">▾</span>`;

        options.innerHTML = `
            <a href="${rutaPerfil}">Mi perfil</a>
            <a href="${rutaLogout}" class="logout-btn">Cerrar sesión</a>
        `;
    } else {
        trigger.innerHTML = `Mi Cuenta <span class="submenu-icon">▾</span>`;

        options.innerHTML = `
            <a href="${rutaIniciar}">Iniciar Sesión</a>
            <a href="${rutaRegistro}">Registrate</a>
        `;
    }
}

function setupLogout() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();

            // Limpiar datos del usuario
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('estadoRegistro');
            localStorage.removeItem('esUsuarioNuevo');

            // Detectar si estamos dentro de /html/ para calcular bien la ruta
            const inHtmlFolder = window.location.pathname.includes('/html/');
            const rutaIndex = inHtmlFolder ? '../index.html' : './index.html';

            // Redirigir a la página principal
            window.location.href = rutaIndex;
        }
    });
}

// Protege redirecciones automáticas mientras se está registrando
firebase.auth().onAuthStateChanged((user) => {
    const estaRegistrando = localStorage.getItem('estadoRegistro');

    // Si no hay usuario y no estamos registrando, redirigir a iniciar sesión
    if (!user && estaRegistrando !== 'en_progreso') {
        const inHtmlFolder = window.location.pathname.includes('/html/');
        const rutaIniciarSesion = inHtmlFolder ? './iniciarSesion.html' : './html/iniciarSesion.html';
        window.location.href = rutaIniciarSesion;
    }
});