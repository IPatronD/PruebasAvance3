document.addEventListener('DOMContentLoaded', function () {
    const userEmail = localStorage.getItem('userEmail');
    const userLogged = document.getElementById('user-logged');
    const userNotLogged = document.getElementById('user-not-logged');

    if (userEmail) {
        // Usuario logueado
        document.getElementById('user-email').textContent = userEmail;
        userLogged.style.display = 'inline-block';
        userNotLogged.style.display = 'none';

        // Manejar cerrar sesión
        document.getElementById('logout-btn').addEventListener('click', function (e) {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = 'index.html';
            });
        });
    } else {
        // Usuario no logueado
        userLogged.style.display = 'none';
        userNotLogged.style.display = 'inline-block';
    }
});