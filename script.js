/* THE DIGITAL MONAD | JAVASCRIPT LOGIC */

document.addEventListener('DOMContentLoaded', () => {
    // 1. CUSTOM CURSOR
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.1
        });
    });

    // 2. BACKGROUND CANVAS ANIMATION (Data Stream)
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2
            });
        }
    }

    function animateCanvas() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00f3ff';
        
        particles.forEach(p => {
            p.y += p.vy;
            if (p.y > height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();

    // 3. GSAP SCROLL ANIMATIONS
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade In
    gsap.from('.glitch-text', {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('.subtitle', {
        opacity: 0,
        y: 20,
        duration: 1.5,
        delay: 0.5,
        ease: 'power4.out'
    });

    // Section Reveals
    const revealSections = document.querySelectorAll('.reveal-section');
    revealSections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-title, .body-text, .info-card, .code-card, .lang-card, .pillar, .timeline-item'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // 4. CTA Hover Pulse
    const cta = document.querySelector('.cta-button');
    if (cta) {
        cta.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 3, backgroundColor: '#bc00ff' });
        });
        cta.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: '#00f3ff' });
        });
    }
});
