document.addEventListener('DOMContentLoaded', () => {
    // --- Confetti Setup ---
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    let confettiActive = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    let burstParticles = [];

    class BurstParticle {
        constructor() {
            this.x = canvas.width / 2;
            // Center the burst for sections, but maybe adjust based on click later
            this.y = canvas.height / 2;
            if (window.innerWidth < 600) {
                this.y = canvas.height / 2;
            }
            this.size = randomRange(4, 10);
            this.color = `hsl(${randomRange(0, 360)}, 80%, 60%)`;

            const angle = randomRange(0, Math.PI * 2);
            const velocity = randomRange(5, 15);

            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.life = 100;
            this.gravity = 0.2;
            this.drag = 0.96;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.life--;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life / 100;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }
    }

    function fireConfettiBurst() {
        for (let i = 0; i < 50; i++) {
            burstParticles.push(new BurstParticle());
        }
        if (!confettiActive) {
            animate();
        }
    }

    function animate() {
        confettiActive = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = burstParticles.length - 1; i >= 0; i--) {
            burstParticles[i].update();
            burstParticles[i].draw();
            if (burstParticles[i].life <= 0) {
                burstParticles.splice(i, 1);
            }
        }

        if (burstParticles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            confettiActive = false;
        }
    }

    // --- Navigation Logic ---
    const sections = ['entrance', 'memes', 'wishes', 'celebration'];
    let currentSectionIndex = 0;

    function navigateTo(targetId) {
        const targetSection = document.getElementById(targetId);
        const targetIndex = sections.indexOf(targetId);

        if (targetSection && targetIndex !== -1) {
            // Update classes for sections
            sections.forEach((id, index) => {
                const el = document.getElementById(id);
                el.classList.remove('active', 'previous');
                if (index < targetIndex) {
                    el.classList.add('previous');
                } else if (index === targetIndex) {
                    el.classList.add('active');
                }
            });

            // Update dots
            document.querySelectorAll('.dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.target === targetId);
            });

            currentSectionIndex = targetIndex;
        }
    }

    // Button Listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const next = e.target.dataset.next;
            if (next) navigateTo(next);
        });
    });

    // Dot Listeners
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            const target = e.target.dataset.target;
            if (target) navigateTo(target);
        });
    });

    // --- Interaction Logic ---

    // Card Flip
    const card = document.getElementById('birthdayCard');
    const navBtn = document.querySelector('#entrance .nav-btn');

    // Auto-reveal button after delay if card is open? No, let's keep it in the back

    card.addEventListener('click', function (e) {
        if (e.target !== navBtn && !e.target.classList.contains('nav-btn')) {
            this.classList.toggle('open');
            if (this.classList.contains('open')) {
                fireConfettiBurst();
            }
        }
    });

    // Flame Interaction
    const flame = document.getElementById('flame');
    const instruction = document.querySelector('.instruction-text');

    flame.addEventListener('click', () => {
        flame.classList.add('out');
        instruction.innerText = "Yay! Wish granted! 💖";

        // Massive Celebration
        let count = 0;
        const interval = setInterval(() => {
            fireConfettiBurst();
            count++;
            if (count > 10) clearInterval(interval);
        }, 300);

        // Show Mosaic Button
        setTimeout(() => {
            const mosaicBtn = document.getElementById('mosaicBtn');
            mosaicBtn.classList.remove('hidden');
            mosaicBtn.classList.add('visible');
        }, 2000);
    });

    // --- Mosaic Logic ---
    const mosaicGrid = document.getElementById('mosaicGrid');
    let mosaicInitialized = false;

    // List of photos from your folder
    const mosaicImages = [
        'R/20250711_132937.jpg',
        'R/20250711_133025.jpg',
        'R/20250711_133912.jpg',
        'R/20250711_134541.jpg',
        'R/IMG-20250808-WA0027.jpg',
        'R/IMG-20250808-WA0028.jpg',
        'R/IMG-20250808-WA0030.jpg',
        'R/IMG-20250808-WA0031.jpg',
        'R/IMG-20250808-WA0033.jpg',
        'R/IMG-20250927-WA0012.jpg',
        'R/IMG-20251221-WA0003.jpg',
        'R/IMG-20260117-WA0000.jpg',
        'R/IMG-20260117-WA0004.jpg',
        'R/IMG-20260117-WA0006.jpg',
        'R/Screenshot_20250712_003951_WhatsApp.jpg',
        'R/Screenshot_20250712_003959_WhatsApp.jpg',
        'R/Screenshot_20250823_001026_Snapchat(1).jpg',
        'R/Snapchat-1290911713.jpg',
        'R/Snapchat-1435410054.jpg',
        'R/Snapchat-1456720887.jpg',
        'R/Snapchat-1503483113.jpg',
        'R/Snapchat-1603478456.jpg',
        'R/Snapchat-1716656863.jpg',
        'R/Snapchat-1745475855.jpg',
        'R/Snapchat-1821296514.jpg',
        'R/Snapchat-435074527.jpg',
        'R/Snapchat-447621573.jpg',
        'R/Snapchat-503745359.jpg',
        'R/Snapchat-712871336.jpg',
        'R/VideoCapture_20250502-002944.jpg'
    ];

    // --- Photo Pile Logic ---
    const pileContainer = document.querySelector('.mosaic-container'); // Reusing container class
    let pileInitialized = false;

    function initPhotoPile() {
        if (pileInitialized) return;
        pileInitialized = true;

        // Shuffle images for variety
        const shuffled = mosaicImages.sort(() => 0.5 - Math.random());

        // Take up to 20 photos for the pile so it's not too crazy, or use all if user wants "all"
        // User said "all the pictures", let's try to use all 30 but maybe speed it up

        let delay = 0;
        shuffled.forEach((imgSrc, index) => {
            const img = document.createElement('div');
            img.classList.add('pile-item');
            img.style.backgroundImage = `url('${imgSrc}')`;

            // Random rotation between -15 and 15 degrees
            const rotation = Math.floor(Math.random() * 30) - 15;
            // Random small offset
            const xOff = Math.floor(Math.random() * 40) - 20;
            const yOff = Math.floor(Math.random() * 40) - 20;

            pileContainer.appendChild(img);

            // Animate in (Stage 1: Pile)
            setTimeout(() => {
                img.classList.add('landed');
                // Initial small random pile
                img.style.transform = `translate(${xOff}px, ${yOff}px) rotate(${rotation}deg)`;
            }, delay);

            delay += 200;
        });

        // Stage 2: Spread out after all have landed
        // Wait for total delay + 1 second pause
        setTimeout(() => {
            const items = document.querySelectorAll('.pile-item');
            const isMobile = window.innerWidth < 480;

            // Adjust spread based on screen size
            // Mobile: Spread less to keep within restricted view
            const range = isMobile ? 80 : 300;
            const offset = range / 2;

            items.forEach((item) => {
                // Spread out 
                const spreadX = Math.floor(Math.random() * range) - offset;
                const spreadY = Math.floor(Math.random() * range) - offset;
                const spreadRot = Math.floor(Math.random() * 60) - 30; // More rotation

                const scale = isMobile ? 'scale(1.0)' : 'scale(0.8)';

                // Add a class for specific spread styling if needed, or just set transform
                item.style.transform = `translate(${spreadX}px, ${spreadY}px) rotate(${spreadRot}deg) ${scale}`;
                // Scale down slightly (0.8) so we can fit more spreading in the view
            });
        }, delay + 1000);
    }

    // Nav Button Listener for Mosaic/Pile
    const mosaicBtn = document.getElementById('mosaicBtn');
    if (mosaicBtn) {
        mosaicBtn.addEventListener('click', () => {
            navigateTo('mosaic');
            initPhotoPile();
            // No need for the old timeout visibility logic as initPhotoPile handles it
        });
    }

    // Update sections array
    sections.push('mosaic');

    // Add dot for mosaic
    const navDots = document.querySelector('.nav-dots');
    const newDot = document.createElement('div');
    newDot.classList.add('dot');
    newDot.dataset.target = 'mosaic';
    newDot.addEventListener('click', (e) => {
        const target = e.target.dataset.target;
        if (target) navigateTo(target);
    });
    navDots.appendChild(newDot);

});
