// ──────────────────────────────────────────────
// Particle System
// ──────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
let particles = [];
let mouseX = 0;
let mouseY = 0;
let animationId;
let ctx;

if (canvas) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 255 : 200; // indigo or cyan-ish
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Subtle mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.005;
                this.y -= dy * force * 0.005;
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hue}, ${this.hue === 255 ? 180 : 210}, ${this.hue === 255 ? 231 : 255}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const isMobile = window.innerWidth < 768;
        const maxParticles = isMobile ? 30 : 60;
        const count = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const connectionThreshold = window.innerWidth < 768 ? 80 : 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionThreshold) {
                    const opacity = (1 - dist / connectionThreshold) * 0.06;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    let isVisible = true;

    const heroObserver = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    heroObserver.observe(document.querySelector('.hero'));

    function animateParticles() {
        if (isVisible) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
        }
        animationId = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// ──────────────────────────────────────────────
// Scroll Progress
// ──────────────────────────────────────────────
const scrollProgress = document.getElementById('scroll-progress');

// ──────────────────────────────────────────────
// Project Card Accent Colors
// ──────────────────────────────────────────────
document.querySelectorAll('.project-card[data-accent]').forEach(card => {
    const accent = card.getAttribute('data-accent');
    card.style.setProperty('--card-accent', accent);
});

// ──────────────────────────────────────────────
// Navbar Scroll Effect
// ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');

let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);

            // Update scroll progress bar
            if (scrollProgress) {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                scrollProgress.style.width = `${scrollPercent}%`;
            }

            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// ──────────────────────────────────────────────
// Mobile Menu (with keyboard accessibility)
// ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinksList = navLinks.querySelectorAll('a');
const firstLink = navLinksList[0];
const lastLink = navLinksList[navLinksList.length - 1];

function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    firstLink.focus();
}

function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu on link click
navLinksList.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
    }
});

// Trap focus within mobile menu
navLinks.addEventListener('keydown', (e) => {
    if (hamburger.getAttribute('aria-expanded') !== 'true') return;

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            // Shift + Tab: if on first link, wrap to hamburger
            if (document.activeElement === firstLink) {
                e.preventDefault();
                hamburger.focus();
            }
        } else {
            // Tab: if on last link, wrap to hamburger
            if (document.activeElement === lastLink) {
                e.preventDefault();
                hamburger.focus();
            }
        }
    }
});

// ──────────────────────────────────────────────
// Intersection Observer for Scroll Animations
// ──────────────────────────────────────────────
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ──────────────────────────────────────────────
// Typing Effect
// ──────────────────────────────────────────────
const phrases = [
    'products that build connections.',
    'tools that distill complexity into clarity.',
    'systems that protect what matters.',
    'games that bring people together.',
    'experiences that feel effortless.'
];

const typedElement = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 60;

function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
    } else {
        typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before next phrase
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing after a brief delay
setTimeout(typeText, 800);

// ──────────────────────────────────────────────
// Smooth scroll for anchor links
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ──────────────────────────────────────────────
// Back to Top Button
// ──────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
