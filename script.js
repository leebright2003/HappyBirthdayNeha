// Configuration
// TODO: Set this to the actual birthday!
// Format: "Month Day, Year Time" or just Date object logic
const BIRTHDAY_MONTH = 1; // 0-indexed (0 = Jan, 1 = Feb, etc.)
const BIRTHDAY_DAY = 14;  // Change this!



function isBirthday() {
    return true;
}

function updateTimer() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);

    if (now > nextBirthday) {
        nextBirthday = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    }

    const diff = nextBirthday - now;

    // If it's today (simple check, refining logic might be needed for exact hours)
    if (isBirthday()) {
        unlockSite();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function unlockSite() {
    // Show enter button to handle autoplay policy
    const btn = document.getElementById('enter-btn');
    const msg = document.querySelector('.message');
    const countdown = document.getElementById('countdown');

    if (btn) {
        countdown.style.display = 'none';
        msg.innerText = "It's time!";
        btn.style.display = 'block';

        btn.onclick = () => {
            const bgMusic = document.getElementById('bg-music');
            if (bgMusic) bgMusic.play();
            switchScene('card-view');
        };
    } else {
        // Fallback if button missing
        switchScene('card-view');
    }
}

function switchScene(sceneId) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none'; // Ensure it's hidden from flow
    });

    // Show target scene
    const target = document.getElementById(sceneId);
    target.style.display = 'flex';
    // Slight delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
        target.classList.add('active');
    }, 50);
}

// Scene 2: Envelope & Card Interaction
const envelope = document.getElementById('envelope');
const card = document.querySelector('.card');

envelope.addEventListener('click', () => {
    // 1. Open Envelope
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        // Hint text update
        document.querySelector('.click-hint').innerText = "Click the card to read it!";
    }
});

card.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger envelope click again
    // 2. Flip Card (only if envelope is open)
    if (envelope.classList.contains('open')) {
        card.classList.toggle('flipped');
    }
});

const getGiftBtn = document.getElementById('get-gift-btn');
getGiftBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startDelivery();
});

// Scene 3: Delivery Logic
function startDelivery() {
    switchScene('delivery-view');

    const car = document.querySelector('.car-container');
    const text = document.getElementById('delivery-text');

    // Start animation
    car.style.animation = 'drive 5s linear forwards';

    // Dynamic Text Update
    setTimeout(() => { if (text) text.innerText = "Almost there..."; }, 2000);
    setTimeout(() => { if (text) text.innerText = "Arriving at Neha's Home!"; }, 4000);

    // Wait 5 seconds then show gift
    setTimeout(() => {
        switchScene('gift-box-view');
    }, 5000);
}

// Scene 4: Gift Box Logic
const giftBox = document.getElementById('gift-box');
giftBox.addEventListener('click', () => {
    revealGift();
});

// Scene 5: Reveal Logic
function revealGift() {
    switchScene('final-reveal-view');

    // Stop Background Music
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }

    // Play baby crying
    const cryAudio = document.getElementById('cry-audio');
    if (cryAudio) {
        cryAudio.play().catch(e => {
            console.log("Audio autoplay failed.", e);
        });
    }

    // Start Fireworks
    startFireworks();
}

// Simple Fireworks Logic
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    function createParticle(x, y, color) {
        const p = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: 1,
            color: color
        };
        particles.push(p);
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        for (let i = 0; i < 50; i++) {
            createParticle(x, y, color);
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;

            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();

            if (p.alpha <= 0) particles.splice(index, 1);
        });

        requestAnimationFrame(animate);
    }

    animate();
    setInterval(createFirework, 800);
}

// Init
setInterval(updateTimer, 1000);
updateTimer(); // Run immediately

// Developer Override for testing:
// Uncomment to skip timer
// isBirthday = () => true;
