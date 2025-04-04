document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del Header (Ocultar/Mostrar al hacer scroll) ---
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    const delta = 5; // Pequeño margen antes de detectar cambio de dirección
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Asegurarse de que el scroll es mayor que el delta
        if (Math.abs(lastScrollTop - currentScroll) <= delta) {
            return;
        }

        // Si se scrollea hacia abajo y se pasa la altura del header
        if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
            // Scroll Abajo
            header.classList.add('hidden');
        } else {
            // Scroll Arriba o está cerca del top
            if (currentScroll + window.innerHeight < document.documentElement.scrollHeight) {
                 header.classList.remove('hidden');
            }
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para manejo en iOS
    }, false);


    // --- Funcionalidad de Animaciones al Hacer Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: dejar de observar el elemento una vez que es visible
                    // observer.unobserve(entry.target);
                } else {
                    // Opcional: Si quieres que la animación se revierta al salir de la vista
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.1 // Trigger cuando al menos el 10% del elemento es visible
            // rootMargin: "0px 0px -50px 0px" // Opcional: Ajusta el 'viewport' de detección
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

    } else {
        // Fallback muy simple si IntersectionObserver no está soportado
        // (No animará, pero al menos los elementos serán visibles)
        animatedElements.forEach(element => {
            element.classList.add('is-visible'); // Muestra todos si no hay IO
        });
        console.warn("Intersection Observer no soportado, las animaciones de scroll no funcionarán como esperado.");
    }


    // --- Manejo Básico del Formulario de Contacto (Solo Interfaz) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previene el envío real del formulario

            // Aquí es donde normalmente enviarías los datos a un backend
            // o usarías un servicio como Formspree/Netlify Forms.

            // Simulación de envío (solo muestra mensaje en la interfaz)
            formStatus.textContent = 'Enviando mensaje...'; // Mensaje temporal

            // Simula una respuesta después de un breve tiempo
            setTimeout(() => {
                 // Puedes cambiar este mensaje según el resultado (real o simulado)
                 formStatus.textContent = '¡Mensaje enviado! (Simulación - Configurar backend)';
                 formStatus.style.color = 'green';
                 // contactForm.reset(); // Opcional: Limpiar el formulario
            }, 1500);

            // ¡IMPORTANTE! Para que funcione de verdad, necesitas configurar
            // el 'action' del form a tu endpoint de backend o a un servicio
            // como Formspree (https://formspree.io/).
            // Ejemplo con Formspree:
            // 1. Cambia la etiqueta <form> en HTML:
            //    <form id="contact-form" action="https://formspree.io/f/TU_ID_DE_FORMULARIO" method="POST">
            // 2. Elimina o comenta el event.preventDefault() y la simulación de arriba
            //    para que el navegador maneje el envío.
            // 3. Asegúrate de que los 'name' en los inputs coincidan con lo que espera Formspree.
        });
    }

});