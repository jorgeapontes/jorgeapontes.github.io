// Esperar o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');
    const navLinksElements = document.querySelectorAll('.nav-link');

    // Menu mobile toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    navLinksElements.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll suave para links internos
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

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de envio
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Animações ao scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
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

    // Ativar link ativo baseado na seção visível
    const sections = document.querySelectorAll('section[id]');
    
    const activateNavLink = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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

    // Preloader
    window.addEventListener('load', () => {
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
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `);
        
        preloader.appendChild(spinner);
        document.body.appendChild(preloader);
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(preloader);
            }, 500);
        }, 1000);
    });
});