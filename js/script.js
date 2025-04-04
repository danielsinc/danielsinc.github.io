document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('main-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mainContent = document.querySelector('main'); // Para cerrar menú al hacer click fuera

    // --- Funcionalidad Menú Hamburguesa ---
    if (hamburgerBtn && mobileNav && header) {
        hamburgerBtn.addEventListener('click', () => {
            header.classList.toggle('nav-active'); // Activa/desactiva estilos del header y muestra/oculta mobile-nav
            // Bloquear/desbloquear scroll del body cuando el menú está abierto
            document.body.style.overflow = header.classList.contains('nav-active') ? 'hidden' : '';
        });

         // Opcional: Cerrar menú al hacer clic en un enlace del menú móvil
         mobileNav.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 if (header.classList.contains('nav-active')) {
                    header.classList.remove('nav-active');
                    document.body.style.overflow = ''; // Restaurar scroll
                 }
             });
         });

          // Opcional: Cerrar menú al hacer clic fuera de él (en el main content)
        // mainContent.addEventListener('click', () => {
        //      if (header.classList.contains('nav-active')) {
        //          header.classList.remove('nav-active');
        //          document.body.style.overflow = '';
        //      }
        // });
    }

    // --- Funcionalidad del Header (Ocultar/Mostrar al hacer scroll) ---
    let lastScrollTop = 0;
    const delta = 5;
    // Recalcular headerHeight dinámicamente por si cambia en móvil
    let headerHeight = header ? header.offsetHeight : 70;

    window.addEventListener('scroll', function() {
        // Solo ejecutar si el menú móvil NO está activo
        if (header && !header.classList.contains('nav-active')) {
            headerHeight = header.offsetHeight; // Actualiza por si acaso
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (Math.abs(lastScrollTop - currentScroll) <= delta) {
                return;
            }

            if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
                header.classList.add('hidden'); // Scroll Abajo
            } else {
                if (currentScroll + window.innerHeight < document.documentElement.scrollHeight) {
                     header.classList.remove('hidden'); // Scroll Arriba
                }
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
    }, false);


    // --- Funcionalidad de Animaciones al Hacer Scroll (Intersection Observer) ---
    // (Sin cambios respecto a la versión anterior, se aplica a todos los .animate-on-scroll)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
             entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // observer.unobserve(entry.target); // Descomenta si quieres que la animación ocurra solo una vez
                } else {
                    // entry.target.classList.remove('is-visible'); // Descomenta si quieres que se revierta al salir
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    } else {
        animatedElements.forEach(element => element.classList.add('is-visible'));
    }


    // --- Manejo del Formulario de Contacto con Formspree (Usando Fetch API para AJAX) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');

    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenimos el envío normal para manejarlo con JS

            const formData = new FormData(contactForm);
            const formAction = contactForm.action; // Obtenemos la URL de Formspree del HTML

            // Verificar que la URL de Formspree no sea la de ejemplo
            if (formAction.includes("TU_ENDPOINT_FORMSPREE_AQUI") || formAction === '#') {
                 formStatus.textContent = "Error: Configura la URL de Formspree en el HTML.";
                 formStatus.style.color = 'red';
                 return; // Detener si no está configurado
            }

            // Mostrar estado de envío y deshabilitar botón
            formStatus.textContent = 'Enviando tu mensaje... ¡Un momento de emoción!';
            formStatus.style.color = '#555'; // Color neutro
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'wait';


            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Le decimos a Formspree que queremos una respuesta JSON
                }
            })
            .then(response => {
                if (response.ok) {
                    // ¡Éxito! Mensaje divertido
                    formStatus.innerHTML = `
                        <span style="color: green; font-size: 1.1em;">
                        🚀 ¡Woohoo! Mensaje enviado con éxito. <br>
                        Revisaré mi bandeja de entrada más rápido que un diseñador con cafeína. ¡Gracias!
                        </span>`;
                    contactForm.reset(); // Limpiar el formulario
                } else {
                    // Intenta obtener más detalles del error si es posible
                    response.json().then(data => {
                         // Mensaje de error un poco más divertido
                        formStatus.innerHTML = `
                            <span style="color: red;">
                             Bummer! Algo salió mal. ${data.errors ? data.errors.map(error => error.message).join(", ") : "El servidor de correo está de siesta."} <br>
                             Intenta de nuevo o contáctame por otra vía si persiste. 😅
                             </span>`;
                    }).catch(error => {
                         // Error genérico si falla el parseo JSON
                         formStatus.innerHTML = `
                            <span style="color: red;">
                             ¡Houston, tenemos un problema! No se pudo enviar. Verifica tu conexión o inténtalo más tarde. 🛸
                            </span>`;
                    });
                }
            })
            .catch(error => {
                 // Error de red o similar
                 formStatus.innerHTML = `
                    <span style="color: red;">
                     ¡Ups! Parece que la conexión falló. ¿Estás online? 🤔 Inténtalo de nuevo.
                     </span>`;
                 console.error('Error al enviar el formulario:', error);
            })
            .finally(() => {
                 // Habilitar el botón nuevamente después de un momento
                 setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                 }, 2000); // Espera 2 segundos antes de reactivar
            });
        });
    }
});