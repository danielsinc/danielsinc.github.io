document.addEventListener('DOMContentLoaded', function() {

    const header = document.getElementById('main-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const desktopNav = document.querySelector('.desktop-nav'); // Selecciona la nav de escritorio

    // --- Funcionalidad Menú Hamburguesa ---
    if (hamburgerBtn && mobileNav && header) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            header.classList.toggle('nav-active');
            document.body.style.overflow = header.classList.contains('nav-active') ? 'hidden' : '';
        });

         // Cerrar menú al hacer clic en un enlace del menú móvil
         mobileNav.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 if (header.classList.contains('nav-active')) {
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    header.classList.remove('nav-active');
                    document.body.style.overflow = '';
                 }
             });
         });
    }

    // --- Funcionalidad del Header (Ocultar/Mostrar al hacer scroll) ---
    let lastScrollTop = 0;
    const delta = 5;
    let headerHeight = header ? header.offsetHeight : 70;

    window.addEventListener('scroll', function() {
        if (header && !header.classList.contains('nav-active')) { // Solo si el menú móvil no está activo
            headerHeight = header.offsetHeight;
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (Math.abs(lastScrollTop - currentScroll) <= delta) return;

            if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
                header.classList.add('hidden'); // Scroll Abajo
            } else {
                 // Scroll Arriba o muy cerca del top
                 // Asegúrate de no remover 'hidden' si está exactamente en el top y no se ha movido
                if (currentScroll < lastScrollTop || currentScroll <= 0) {
                     header.classList.remove('hidden');
                }
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
    }, false);


    // --- Funcionalidad de Animaciones al Hacer Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
             entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // observer.unobserve(entry.target); // Descomenta para animar solo una vez
                } else {
                    // entry.target.classList.remove('is-visible'); // Descomenta para revertir al salir
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    } else {
        // Fallback si no hay IntersectionObserver
        animatedElements.forEach(element => element.classList.add('is-visible'));
    }


    // --- Manejo del Formulario de Contacto con Formspree (AJAX) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    const planInteresInput = document.getElementById('plan_interes'); // Input oculto

    // --- Rellenar campo oculto de Plan si viene en la URL (ej: contact.html?plan=video-pro) ---
    if (planInteresInput) {
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        if (plan) {
            planInteresInput.value = plan.replace('-', ' '); // Pone "video pro" en el campo
            // Opcional: podrías pre-rellenar el asunto también
            const subjectInput = document.getElementById('subject');
            if (subjectInput && !subjectInput.value) { // Solo si no está ya lleno
                subjectInput.value = `Consulta sobre plan: ${plan.replace('-', ' ')}`;
            }
        }
    }

    // --- Listener para el envío del formulario ---
    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const formAction = contactForm.action;

            if (formAction.includes("TU_ENDPOINT_FORMSPREE_AQUI") || formAction === '#') {
                 formStatus.textContent = "Error: Configura la URL de Formspree en el HTML.";
                 formStatus.className = 'form-status-message error'; // Añade clase error
                 return;
            }

            formStatus.textContent = 'Enviando tu mensaje... ¡Un momento de emoción!';
            formStatus.className = 'form-status-message sending'; // Clase sending
            submitButton.disabled = true;

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.innerHTML = `🚀 ¡Woohoo! Mensaje enviado. <br>Revisaré mi bandeja de entrada ¡Gracias!`;
                    formStatus.className = 'form-status-message success'; // Clase success
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                         formStatus.innerHTML = `😅 Bummer! ${data.errors ? data.errors.map(e => e.message).join(", ") : "Algo salió mal."} <br>Intenta de nuevo.`;
                         formStatus.className = 'form-status-message error'; // Clase error
                    }).catch(() => {
                         formStatus.innerHTML = `🛸 ¡Houston, tenemos un problema! No se pudo enviar.`;
                         formStatus.className = 'form-status-message error'; // Clase error
                    });
                }
            })
            .catch(() => {
                 formStatus.innerHTML = `🤔 ¡Ups! Falló la conexión. ¿Estás online?`;
                 formStatus.className = 'form-status-message error'; // Clase error
            })
            .finally(() => {
                 // Reactivar botón después de un tiempo, independientemente del resultado
                  setTimeout(() => {
                     submitButton.disabled = false;
                  }, 2000);
            });
        });
    }

    // --- Actualizar año en el footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // Fin del DOMContentLoaded