const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8; // 80% of viewport width
// canvas.height = window.innerHeight * 0.5; // 50% of viewport height

// 🎛️ Tuning Parameters
let mouse = { x: null, y: null, radius: 40 };
let repulsionStrength = 2;

let particles = [];

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});


canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});


function drawTextToCanvas(text) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.fillStyle = '#fff';
    tempCtx.font = 'bold 10rem VT323';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);
    return tempCtx.getImageData(0, 0, canvas.width, canvas.height);
}

function createParticlesFromText(text) {
    particles = [];
    const imageData = drawTextToCanvas(text);
    for (let y = 0; y < imageData.height; y += 6) {
        for (let x = 0; x < imageData.width; x += 6) {
            const i = (y * imageData.width + x) * 4;
            if (imageData.data[i + 3] > 128) {
                const targetX = x;
                const targetY = y;
                const startX = Math.random() * canvas.width;
                const startY = y;
                particles.push({
                    x: startX,
                    y: startY,
                    targetX,
                    targetY,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        if (mouse.x !== null && mouse.y !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - dist) / mouse.radius;
                const repulse = force * repulsionStrength;

                p.vx += Math.cos(angle) * repulse;
                p.vy += Math.sin(angle) * repulse;
            }
        }

        // Attraction to target
        p.vx += (p.targetX - p.x) * 0.01;
        p.vy += (p.targetY - p.y) * 0.01;

        // Damping
        p.vx *= 0.9;
        p.vy *= 0.9;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx.fillStyle = '#fff';
        ctx.fillRect(p.x, p.y, 5, 5);
    }

    requestAnimationFrame(animateParticles);
}

function renderText(text) {
    createParticlesFromText(text);
    animateParticles();
}

document.fonts.ready.then(() => {
    renderText("1nf1n0t1v3r");
});
