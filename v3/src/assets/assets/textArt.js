const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = 200;

let particles = [];

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
                particles.push({
                    x: x,
                    y: y
                });
            }
        }
    }
}

function renderPixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(p.x, p.y, 5, 5);
    }
}

document.fonts.ready.then(() => {
    createParticlesFromText("1nf1n0t1v3r");
    renderPixels();
});
