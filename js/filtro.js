// js/filtro.js
document.addEventListener('DOMContentLoaded', function () {
    // Cache de elementos del DOM
    const DOM = {
        filtrosSection: document.querySelector('.filtros'),
        limpiarBtn: document.getElementById('limpiar-filtros'),
        selects: document.querySelectorAll('.filtros select'),
        cards: document.querySelectorAll('.card-container'),
        contador: document.createElement('div'),
        resultadosTitle: document.createElement('h3')
    };

    // Configurar contador de resultados
    DOM.contador.className = 'contador-resultados';

    // Crear título para la sección de resultados
    DOM.resultadosTitle.textContent = 'Resultados de tu búsqueda';
    DOM.resultadosTitle.className = 'resultados-title';

    // Insertar elementos en el DOM
    const filtrosContainer = document.querySelector('.filtros-container');
    filtrosContainer.parentNode.insertBefore(DOM.resultadosTitle, filtrosContainer.nextSibling);
    filtrosContainer.parentNode.insertBefore(DOM.contador, DOM.resultadosTitle.nextSibling);

    // Objeto con los valores actuales de los filtros
    const filtros = {
        tipo: 'todos',
        tamano: 'todos',
        edad: 'todos',
        sexo: 'todos',
        ninos: 'todos',
        'otros-animales': 'todos'
    };

    // Inicializar aplicación
    init();

    function init() {
        setupEventListeners();
        mostrarTotalInicial();
    }

    function setupEventListeners() {
        // Evento para cada selector
        DOM.selects.forEach(select => {
            select.addEventListener('change', function () {
                filtros[this.id] = this.value;
                aplicarFiltros();
            });
        });

        // Evento para botón limpiar
        DOM.limpiarBtn.addEventListener('click', limpiarFiltros);
    }

    function aplicarFiltros() {
        let mascotasVisibles = 0;
        let tiposFiltrados = new Set();
        let tamanosFiltrados = new Set();

        DOM.cards.forEach(card => {
            const cardData = card.dataset;
            const isVisible =
                (filtros.tipo === 'todos' || cardData.tipo === filtros.tipo) &&
                (filtros.tamano === 'todos' || cardData.tamano === filtros.tamano) &&
                (filtros.edad === 'todos' || cardData.edad === filtros.edad) &&
                (filtros.sexo === 'todos' || cardData.sexo === filtros.sexo) &&
                (filtros.ninos === 'todos' || cardData.ninos === filtros.ninos) &&
                (filtros['otros-animales'] === 'todos' || cardData.otrosAnimales === filtros['otros-animales']);

            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                mascotasVisibles++;
                tiposFiltrados.add(cardData.tipo);
                tamanosFiltrados.add(cardData.tamano);
            }
        });

        actualizarContador(mascotasVisibles, tiposFiltrados, tamanosFiltrados);
    }

    function limpiarFiltros() {
        // Resetear valores de filtros
        Object.keys(filtros).forEach(key => {
            filtros[key] = 'todos';
            const select = document.getElementById(key);
            if (select) select.value = 'todos';
        });

        // Mostrar todas las cards
        DOM.cards.forEach(card => {
            card.style.display = 'block';
        });

        mostrarTotalInicial();
    }

    function mostrarTotalInicial() {
        const total = DOM.cards.length;
        DOM.contador.innerHTML = `
            <div class="contador-header">
                <span class="contador-icon">🐾</span>
                <span class="contador-total">${total} mascotas esperando un hogar</span>
            </div>
            <div class="contador-subtext">
                Usa los filtros para encontrar a tu compañero ideal
            </div>
        `;
    }

    function actualizarContador(visibles, tiposFiltrados, tamanosFiltrados) {
        const total = DOM.cards.length;
        const tiposStr = [...tiposFiltrados].map(t => t === 'perro' ? 'perros' : 'gatos').join(' y ');
        const tamanosStr = [...tamanosFiltrados].map(t => {
            switch (t) {
                case 'pequeno': return 'pequeños';
                case 'mediano': return 'medianos';
                case 'grande': return 'grandes';
                default: return t;
            }
        }).join(' y ');

        DOM.contador.innerHTML = `
            <div class="contador-header">
                <span class="contador-icon">${visibles === 0 ? '😿' : '🐶'}</span>
                <span class="contador-total">${visibles} ${visibles === 1 ? 'mascota encontrada' : 'mascotas encontradas'}</span>
            </div>
            <div class="contador-details">
                ${visibles > 0 ? `
                    <p>Mostrando ${tiposStr} ${tamanosFiltrados.size > 0 ? `de tamaño ${tamanosStr}` : ''}</p>
                    <p class="contador-subtext">(de ${total} mascotas en total)</p>
                ` : ''}
            </div>
            ${visibles === 0 ? `
                <div class="contador-empty">
                    <p>No encontramos mascotas con estos criterios</p>
                    <p class="contador-suggestion">Prueba ajustando los filtros</p>
                </div>
            ` : ''}
        `;
    }
});