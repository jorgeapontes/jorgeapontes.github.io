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
    const intro = document.getElementById('intro');
    const progressBar = document.getElementById('progressBar');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dotsNav = document.getElementById('slideDots');
    const slideCurrent = document.getElementById('slideCurrent');
    const slideTotal = document.getElementById('slideTotal');
    const slideLabel = document.getElementById('slideLabel');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pad = (n) => String(n).padStart(2, '0');

    // Prepara o subtítulo: o texto "fantasma" reserva o espaço e o digitado fica por cima
    const typewriter = document.getElementById('typewriter');
    const twFull = typewriter ? typewriter.textContent.trim() : '';
    let twText = null;
    if (typewriter) {
        typewriter.setAttribute('aria-label', twFull);
        typewriter.textContent = '';
        const ghost = document.createElement('span');
        ghost.className = 'tw-ghost';
        ghost.setAttribute('aria-hidden', 'true');
        ghost.textContent = twFull;
        twText = document.createElement('span');
        twText.className = 'tw-text';
        twText.setAttribute('aria-hidden', 'true');
        typewriter.append(ghost, twText);
    }

    // ========================
    // Menu mobile toggle
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

    mobileOverlay.addEventListener('click', closeMenu);
    navLinksElements.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // ========================
    // Scroll suave para links internos
    // ========================
    const scrollToElement = (el) => {
        window.scrollTo({ top: el.offsetTop, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                scrollToElement(targetElement);
            }
        });
    });

    // ========================
    // Títulos divididos em palavras (animação linha a linha)
    // ========================
    document.querySelectorAll('[data-split]').forEach(el => {
        const words = el.textContent.trim().split(/\s+/);
        el.setAttribute('aria-label', el.textContent.trim());
        el.textContent = '';
        words.forEach((word, i) => {
            const outer = document.createElement('span');
            outer.className = 'word';
            outer.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.style.setProperty('--w', i);
            inner.textContent = word;
            outer.appendChild(inner);
            el.appendChild(outer);
            if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
    });

    // Índice para animação em sequência
    document.querySelectorAll('[data-stagger]').forEach(group => {
        Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
    });

    // ========================
    // Animações ao entrar na tela
    // ========================
    const parseDelay = (el) => parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;

    // Depois de animado, remove o atributo para o elemento voltar às transições/hover originais
    const cleanup = (el) => {
        let wait = parseDelay(el) * 1000 + 1300;
        if (el.hasAttribute('data-stagger')) wait += el.children.length * 90;
        setTimeout(() => {
            el.removeAttribute('data-reveal');
            el.removeAttribute('data-stagger');
            el.classList.remove('is-visible');
        }, wait);
    };

    const revealTargets = document.querySelectorAll('[data-reveal], [data-stagger], [data-split]');

    const startReveal = () => {
        if (!('IntersectionObserver' in window)) {
            revealTargets.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                observer.unobserve(el);
                if (!el.hasAttribute('data-split')) cleanup(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealTargets.forEach(el => observer.observe(el));
    };

    // ========================
    // Intro (abertura da apresentação)
    // ========================
    let introClosed = false;
    const introStart = performance.now();

    const closeIntro = () => {
        if (introClosed) return;
        introClosed = true;
        intro.classList.add('done');
        setTimeout(startReveal, reduceMotion ? 0 : 350);
        setTimeout(startTypewriter, 900);
        setTimeout(() => intro.remove(), 1000);
    };

    const scheduleIntroClose = () => {
        const minTime = reduceMotion ? 0 : 1300;
        const elapsed = performance.now() - introStart;
        setTimeout(closeIntro, Math.max(0, minTime - elapsed));
    };

    // Espera só as fontes (não as imagens), para a abertura não travar em conexões lentas
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleIntroClose);
    } else {
        scheduleIntroClose();
    }
    // Timeout de segurança caso as fontes demorem demais
    setTimeout(closeIntro, 2500);

    // ========================
    // Navegação por slides (dots + contador)
    // ========================
    slideTotal.textContent = pad(slides.length);

    const dots = slides.map((slide, i) => {
        const dot = document.createElement('button');
        dot.className = 'slide-dot';
        dot.type = 'button';
        dot.dataset.label = slide.dataset.title || '';
        dot.setAttribute('aria-label', `Ir para ${slide.dataset.title || 'slide ' + (i + 1)}`);
        dot.addEventListener('click', () => scrollToElement(slide));
        dotsNav.appendChild(dot);
        return dot;
    });

    // Cada slide aponta para o item do menu correspondente (os cases ficam em "Projetos")
    const navIds = Array.from(navLinksElements).map(link => link.getAttribute('href').slice(1));
    let lastNav = navIds[0];
    const slideNav = slides.map(slide => {
        if (navIds.includes(slide.id)) lastNav = slide.id;
        return lastNav;
    });

    let currentIndex = -1;

    const getCurrentIndex = () => {
        const middle = window.innerHeight * 0.45;
        let index = 0;
        slides.forEach((slide, i) => {
            if (slide.getBoundingClientRect().top <= middle) index = i;
        });
        return index;
    };

    const setActiveSlide = (index) => {
        if (index === currentIndex) return;
        currentIndex = index;

        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

        slideCurrent.textContent = pad(index + 1);
        slideCurrent.classList.remove('tick');
        void slideCurrent.offsetWidth; // reinicia a animação
        slideCurrent.classList.add('tick');
        slideLabel.textContent = slides[index].dataset.title || '';

        navLinksElements.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${slideNav[index]}`);
        });
    };

    // ========================
    // Parallax
    // ========================
    const parallaxEls = reduceMotion ? [] : Array.from(document.querySelectorAll('[data-parallax]'));

    const updateParallax = () => {
        const vh = window.innerHeight;
        parallaxEls.forEach(el => {
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.bottom < -200 || rect.top > vh + 200) return;
            const offset = (rect.top + rect.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
            el.style.setProperty('--py', `${offset.toFixed(1)}px`);
        });
    };

    // ========================
    // Loop de scroll (progresso, header, slide ativo, parallax)
    // ========================
    let ticking = false;

    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        header.classList.toggle('scrolled', window.scrollY > 60);
        setActiveSlide(getCurrentIndex());
        updateParallax();
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    window.addEventListener('resize', onScroll);
    onScroll();

    // ========================
    // Teclado: setas avançam/voltam slides, como numa apresentação
    // ========================
    document.addEventListener('keydown', (e) => {
        const forward = ['ArrowDown', 'PageDown'].includes(e.key);
        const backward = ['ArrowUp', 'PageUp'].includes(e.key);
        if (!forward && !backward) return;
        if (e.target.closest('input, textarea, select, [contenteditable]')) return;
        if (navLinks.classList.contains('active')) return;

        const index = getCurrentIndex();
        const rect = slides[index].getBoundingClientRect();

        // Slide maior que a tela: deixa rolar normalmente até o fim dele
        if (forward && rect.bottom > window.innerHeight + 4) return;
        if (backward && rect.top < -4) return;

        const target = slides[forward ? index + 1 : index - 1];
        if (!target) return;

        e.preventDefault();
        scrollToElement(target);
    });

    // ========================
    // Subtítulo digitado letra por letra
    // ========================
    function startTypewriter() {
        if (!twText || twText.dataset.started) return;
        twText.dataset.started = 'true';

        let i = 0;
        twText.classList.add('typing');
        const step = () => {
            i++;
            twText.textContent = twFull.slice(0, i);
            if (i < twFull.length) {
                // Pausa um pouco mais na pontuação, como alguém digitando
                const delay = /[.,]/.test(twFull[i - 1]) ? 260 : 22 + Math.random() * 30;
                setTimeout(step, delay);
            } else {
                twText.classList.remove('typing');
            }
        };
        step();
    }
});
