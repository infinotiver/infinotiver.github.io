const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;

const mouse = { x: null, y: null, radius: 40 };
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
    tempCtx.textAlign = 'left';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, 40, canvas.height / 2);
    return tempCtx.getImageData(0, 0, canvas.width, canvas.height);
}

function createParticles(text) {
    particles = [];
    const imageData = drawTextToCanvas(text);
    for (let y = 0; y < imageData.height; y += 6) {
        for (let x = 0; x < imageData.width; x += 6) {
            if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
                particles.push({
                    x: x + Math.random() * 10 - 5,
                    y: y + Math.random() * 10 - 5,
                    targetX: x,
                    targetY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius * 2;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        }

        p.vx += (p.targetX - p.x) * 0.01;
        p.vy += (p.targetY - p.y) * 0.01;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = '#fff';
        ctx.fillRect(p.x, p.y, 5, 5);
    });

    requestAnimationFrame(animate);
}

document.fonts.ready.then(() => {
    createParticles("1nf1n0t1v3r");
    animate();
});
