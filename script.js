document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    // ==========================================
    // 1. CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById("custom-cursor");
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        let distX = mouseX - cursorX;
        let distY = mouseY - cursorY;
        cursorX += distX * 0.15;
        cursorY += distY * 0.15;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll("a, .window-reality, .lang-card, .salsa-btn");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(2.5)`;
            cursor.style.background = "transparent";
            cursor.style.border = "2px solid var(--cyan)";
        });
        el.addEventListener("mouseleave", () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
            cursor.style.background = "var(--cyan)";
            cursor.style.border = "none";
        });
    });

    // ==========================================
    // 2. INTERACTIVE CANVAS BACKGROUND
    // ==========================================
    const canvas = document.getElementById("background-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ΣΗΜΑΝΤΙΚΟ ΓΙΑ RESPONSIVENESS: Κάνει Refresh τα animations στο Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        ScrollTrigger.refresh(); // Υπολογίζει ξανά τις αποστάσεις
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.01;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            for (let j = i; j < particlesArray.length; j++) {
                let dx = particlesArray[i].x - particlesArray[j].x;
                let dy = particlesArray[i].y - particlesArray[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(188, 0, 255, ${1 - distance/120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // ==========================================
    // 3. GSAP SCROLL ANIMATIONS 
    // ==========================================

    gsap.fromTo(".glitch-text", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2 });
    gsap.fromTo(".subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 });
    gsap.fromTo(".mouse", { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5, yoyo: true, repeat: -1 });

    gsap.utils.toArray('.reveal-section').forEach(section => {
        gsap.fromTo(section, 
            { y: 80, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            }
        );
    });

    gsap.fromTo(".lang-card", 
        { y: 50, scale: 0.9, opacity: 0 }, 
        {
            scrollTrigger: {
                trigger: "#languages",
                start: "top 75%",
            },
            y: 0,
            scale: 1,
            opacity: 1, 
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }
    );

    gsap.fromTo(".pillar", 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: "#definition",
                start: "top 75%"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }
    );

    gsap.fromTo(".cards-grid .window-reality", 
        { y: 100, opacity: 0, rotationX: -15 },
        {
            scrollTrigger: {
                trigger: ".cards-grid",
                start: "top 80%"
            },
            y: 0,
            opacity: 1,
            rotationX: 0,
            transformPerspective: 1000,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out"
        }
    );

    gsap.fromTo(".timeline-line", 
        { scaleY: 0 },
        {
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top 70%",
                end: "bottom 50%",
                scrub: 1
            },
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none"
        }
    );

    gsap.utils.toArray('.timeline-item').forEach((item) => {
        // Στα κινητά, η κίνηση έρχεται πάντα από δεξιά (+100)
        let isMobile = window.innerWidth <= 768;
        let isLeft = item.classList.contains('left');
        let startX = isMobile ? 100 : (isLeft ? -100 : 100);

        gsap.fromTo(item.querySelector('.timeline-content'), 
            { x: startX, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%"
                },
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }
        );
    });

    window.addEventListener("scroll", () => {
        const nav = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            nav.style.background = "rgba(5, 5, 5, 0.9)";
            nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
            nav.style.padding = window.innerWidth <= 768 ? "0.5rem 1rem" : "1rem 3rem";
        } else {
            nav.style.background = "transparent";
            nav.style.boxShadow = "none";
            nav.style.padding = window.innerWidth <= 768 ? "1rem" : "1.5rem 3rem";
        }
    });
});