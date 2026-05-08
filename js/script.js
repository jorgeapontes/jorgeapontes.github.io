// Esperar o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // ========================
    // Elementos
    // ========================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const header = document.getElementById('header');
    const navLinksElements = document.querySelectorAll('.nav-link');

    // ========================
    // Menu mobile toggle (CORRIGIDO)
    // ========================
    function openMenu() {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        mobileOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // evita scroll atrás do menu
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fechar menu ao clicar no overlay
    mobileOverlay.addEventListener('click', closeMenu);

    // Fechar menu ao clicar em um link
    navLinksElements.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar menu com a tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // ========================
    // Header scroll effect
    // ========================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========================
    // Scroll suave para links internos
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================
    // Animações ao scroll (fade-in)
    // ========================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < window.innerHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    // Adicionar classe fade-in para elementos
    document.querySelectorAll('.project-card, .skill-category, .feature, .contact-btn').forEach(element => {
        element.classList.add('fade-in');
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez na carga

    // ========================
    // Link ativo baseado na seção visível
    // ========================
    const sections = document.querySelectorAll('section[id]');

    const activateNavLink = () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const headerHeight = header.offsetHeight;

            if (window.scrollY >= sectionTop - headerHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinksElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink();

    // ========================
    // Preloader (CORRIGIDO — fora do DOMContentLoaded aninhado)
    // ========================
    const preloader = document.createElement('div');
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--darker);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid rgba(46, 139, 87, 0.3);
        border-top-color: #2e8b57;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    const spinStyle = document.createElement('style');
    spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(spinStyle);

    preloader.appendChild(spinner);
    document.body.appendChild(preloader);

    // Esconder o preloader assim que tudo estiver carregado
    // Usa tanto 'load' quanto um timeout de segurança
    const hidePreloader = () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            if (preloader.parentNode) {
                document.body.removeChild(preloader);
            }
        }, 500);
    };

    if (document.readyState === 'complete') {
        // Página já carregou antes do script executar
        setTimeout(hidePreloader, 300);
    } else {
        window.addEventListener('load', hidePreloader);
        // Timeout de segurança: remove o preloader após 3s no máximo
        setTimeout(hidePreloader, 3000);
    }
});
