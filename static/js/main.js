
/* ========================================
   ESCUELA DE PAQUITA
   JAVASCRIPT PRINCIPAL
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const carrusel = document.querySelector(".carrusel");

    // No ejecutar si estamos en otra página
    if (!carrusel) {
        return;
    }

    const imagenes = carrusel.querySelectorAll(
        ".imagen-carrusel"
    );

    const indicadores = carrusel.querySelectorAll(
        ".indicador"
    );

    const botonAnterior = carrusel.querySelector(
        ".carrusel-anterior"
    );

    const botonSiguiente = carrusel.querySelector(
        ".carrusel-siguiente"
    );

    if (imagenes.length === 0) {
        return;
    }

    let indiceActual = 0;
    let intervalo = null;

    const movimientoReducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // Mostrar una fotografía
    function mostrarImagen(indice) {

        indiceActual = (
            indice + imagenes.length
        ) % imagenes.length;

        imagenes.forEach((imagen, posicion) => {

            const activa = posicion === indiceActual;

            imagen.classList.toggle("activa", activa);

            imagen.setAttribute(
                "aria-hidden",
                String(!activa)
            );

        });

        indicadores.forEach((indicador, posicion) => {

            const activo = posicion === indiceActual;

            indicador.classList.toggle("activo", activo);

            if (activo) {
                indicador.setAttribute(
                    "aria-current", "true"
                );
            } else {
                indicador.removeAttribute("aria-current");
            }

        });
    }

    function siguienteImagen() {
        mostrarImagen(indiceActual + 1);
    }

    function anteriorImagen() {
        mostrarImagen(indiceActual - 1);
    }

    // Reproducción automática
    function iniciarCarrusel() {

        detenerCarrusel();

        if (
            movimientoReducido.matches ||
            imagenes.length < 2 ||
            document.hidden
        ) {
            return;
        }

        intervalo = setInterval(
            siguienteImagen,
            5000
        );
    }

    function detenerCarrusel() {

        if (intervalo !== null) {
            clearInterval(intervalo);
            intervalo = null;
        }
    }

    // Botones
    botonSiguiente?.addEventListener("click", () => {
        siguienteImagen();
        iniciarCarrusel();
    });

    botonAnterior?.addEventListener("click", () => {
        anteriorImagen();
        iniciarCarrusel();
    });

    // Indicadores
    indicadores.forEach((indicador, indice) => {

        indicador.addEventListener("click", () => {
            mostrarImagen(indice);
            iniciarCarrusel();
        });

    });

    // Pausar cuando el cursor está encima
    carrusel.addEventListener(
        "mouseenter",
        detenerCarrusel
    );

    carrusel.addEventListener(
        "mouseleave",
        iniciarCarrusel
    );

    // Pausar mientras el usuario navega
    // con el teclado dentro del carrusel
    carrusel.addEventListener(
        "focusin",
        detenerCarrusel
    );

    carrusel.addEventListener("focusout", (evento) => {
        if (!carrusel.contains(evento.relatedTarget)) {
            iniciarCarrusel();
        }
    });

    // Pausar cuando la pestaña no está visible
    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                detenerCarrusel();
            } else {
                iniciarCarrusel();
            }
        }
    );

    movimientoReducido.addEventListener(
        "change",
        iniciarCarrusel
    );

    // Inicialización
    mostrarImagen(0);
    iniciarCarrusel();

});

/* ==========================================
   FORMULARIO DE MATRÍCULA POR ETAPAS
   ESCUELA DE PAQUITA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById(
        "formulario-inscripcion"
    );

    // Evitar ejecutar este código en otras páginas
    if (!formulario) {
        return;
    }

    const etapas = Array.from(
        formulario.querySelectorAll(".etapa-formulario")
    );

    const botonAnterior = document.getElementById(
        "boton-anterior"
    );

    const botonSiguiente = document.getElementById(
        "boton-siguiente"
    );

    const botonEnviar = document.getElementById(
        "boton-enviar"
    );

    const textoProgreso = document.getElementById(
        "texto-progreso"
    );

    const barraProgreso = document.getElementById(
        "progreso-actual"
    );

    if (
        etapas.length === 0 ||
        !botonAnterior ||
        !botonSiguiente ||
        !botonEnviar ||
        !textoProgreso ||
        !barraProgreso
    ) {
        return;
    }

    let etapaActual = 0;

    // ======================================
    // MOSTRAR ETAPA
    // ======================================

    function mostrarEtapa(indice) {

        if (indice < 0 || indice >= etapas.length) {
            return;
        }

        etapaActual = indice;

        etapas.forEach((etapa, posicion) => {

            const activa = posicion === etapaActual;

            etapa.classList.toggle("activa", activa);

            // Impedir que los campos ocultos
            // reciban el foco del teclado
            etapa.inert = !activa;
        });

        // Botón anterior
        botonAnterior.hidden = etapaActual === 0;

        // Botón siguiente
        botonSiguiente.hidden =
            etapaActual === etapas.length - 1;

        // Botón enviar
        botonEnviar.hidden =
            etapaActual !== etapas.length - 1;

        // El envío continúa deshabilitado
        botonEnviar.disabled = true;

        // Actualizar progreso
        const porcentaje = Math.round(
            ((etapaActual + 1) / etapas.length) * 100
        );

        textoProgreso.textContent =
            `Etapa ${etapaActual + 1} de ${etapas.length}`;

        barraProgreso.style.width = `${porcentaje}%`;

        barraProgreso.setAttribute(
            "role",
            "progressbar"
        );

        barraProgreso.setAttribute(
            "aria-valuemin",
            "0"
        );

        barraProgreso.setAttribute(
            "aria-valuemax",
            "100"
        );

        barraProgreso.setAttribute(
            "aria-valuenow",
            String(porcentaje)
        );
    }

    // ======================================
    // VALIDAR ETAPA ACTUAL
    // ======================================

    function validarEtapa() {

        const etapa = etapas[etapaActual];

        const campos = etapa.querySelectorAll(
            "input, select, textarea"
        );

        for (const campo of campos) {

            if (
                campo.disabled ||
                campo.closest("[hidden]")
            ) {
                continue;
            }

            if (!campo.checkValidity()) {

                campo.reportValidity();

                campo.focus();

                return false;
            }
        }

        return true;
    }

    // ======================================
    // BOTÓN SIGUIENTE
    // ======================================

    botonSiguiente.addEventListener("click", () => {

        if (!validarEtapa()) {
            return;
        }

        mostrarEtapa(etapaActual + 1);
    });

    // ======================================
    // BOTÓN ANTERIOR
    // ======================================

    botonAnterior.addEventListener("click", () => {

        mostrarEtapa(etapaActual - 1);

    });

    // ======================================
    // CAMPOS CONDICIONALES
    // ======================================

    function configurarCampoCondicional(
        idPregunta,
        idDetalle
    ) {

        const pregunta = document.getElementById(
            idPregunta
        );

        const detalle = document.getElementById(
            idDetalle
        );

        if (!pregunta || !detalle) {
            return;
        }

        const etiqueta = formulario.querySelector(
            `label[for="${idDetalle}"]`
        );

        // Agrupar etiqueta y campo
        const contenedor = document.createElement("div");

        contenedor.className = "campo-condicional";

        if (etiqueta) {
            etiqueta.before(contenedor);
            contenedor.appendChild(etiqueta);
        } else {
            detalle.before(contenedor);
        }

        contenedor.appendChild(detalle);

        function actualizarVisibilidad() {

            const mostrar = pregunta.value === "SI";

            contenedor.hidden = !mostrar;

            detalle.disabled = !mostrar;

            if (!mostrar) {
                // Conservar la respuesta mientras
                // el usuario navega entre etapas
                detalle.required = false;
            }
        }

        pregunta.addEventListener(
            "change",
            actualizarVisibilidad
        );

        actualizarVisibilidad();
    }

    // Salud
    configurarCampoCondicional(
        "tiene_enfermedad",
        "detalle_enfermedad"
    );

    configurarCampoCondicional(
        "toma_medicamentos",
        "detalle_medicamentos"
    );

    configurarCampoCondicional(
        "tiene_adecuacion_curricular",
        "detalle_adecuacion"
    );

    // Información familiar
    configurarCampoCondicional(
        "tiene_hermanos_centro",
        "cantidad_hermanos"
    );

    configurarCampoCondicional(
        "tiene_hermanos_centro",
        "detalle_hermanos"
    );

    configurarCampoCondicional(
        "tiene_beca",
        "detalle_beca"
    );

    // ======================================
    // IMPEDIR ENVÍOS PREMATUROS
    // ======================================

    formulario.addEventListener("submit", (evento) => {

        evento.preventDefault();

    });

    // ======================================
    // INICIALIZAR
    // ======================================

    mostrarEtapa(0);

});
