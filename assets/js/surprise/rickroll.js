import frameSeq from "./frame.js";

const LINES_PER_FRAME = 36;
const FRAME_RATE = 15;

const lines = frameSeq.split('\n').map(line => line.trim());
const frames = [];

for (let i = 0; i < lines.length; i += LINES_PER_FRAME) {
    frames.push(lines.slice(i, i + LINES_PER_FRAME).join('\n'));
}

export function startRickroll(target) {
    let currentFrame = 0;

    const renderFrame = () => {
        target.textContent = frames[currentFrame];
        currentFrame = (currentFrame + 1) % frames.length;
    };

    renderFrame();
    return setInterval(renderFrame, 1000 / FRAME_RATE);
}
