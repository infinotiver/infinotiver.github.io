/* retromac: draggable windows (pointer events) */
const TITLE_H = 22; // px, matches the striped title bar drawn in retromac.css

let windows = [];
let drag = null;
function randomPosition(win, placed) {
    const rect = win.getBoundingClientRect();
    const margin = 24;

    const maxX = Math.max(0, window.innerWidth - rect.width - margin);
    const maxY = Math.max(24, window.innerHeight - rect.height - 24);

    // Try several positions to avoid overlapping windows too much
    for (let i = 0; i < 60; i++) {
        const x = margin + Math.random() * Math.max(0, maxX - margin);
        const y = margin + Math.random() * Math.max(0, maxY - margin);

        const overlaps = placed.some((p) =>
            x < p.x + p.width + 24 &&
            x + rect.width + 24 > p.x &&
            y < p.y + p.height + 24 &&
            y + rect.height + 24 > p.y
        );

        if (!overlaps) return { x, y };
    }

    // Fall back to a random position if the viewport is crowded
    return {
        x: margin + Math.random() * Math.max(0, maxX - margin),
        y: margin + Math.random() * Math.max(0, maxY - margin),
    };
}

/* drag: grab the title bar, move with a transform so layout never shifts */
function onDown(event) {
    const win = event.currentTarget;
    const top = win.getBoundingClientRect().top;

    if (event.button > 0 || event.clientY - top > TITLE_H) return;

    drag = {
        win,
        id: event.pointerId,
        x: event.clientX - (win._x || 0),
        y: event.clientY - (win._y || 0),
    };

    // keep the window on top while it moves
    windows.forEach((w) => { w.style.zIndex = w === win ? '2' : ''; });
    win.setPointerCapture(event.pointerId);
    win.style.cursor = 'grabbing';
    event.preventDefault();
}

function onMove(event) {
    if (!drag || event.pointerId !== drag.id) return;

    const { win } = drag;
    win._x = event.clientX - drag.x;
    win._y = event.clientY - drag.y;
    win.style.transform = `translate(${win._x}px, ${win._y}px)`;
}

function onUp(event) {
    if (!drag || event.pointerId !== drag.id) return;

    drag.win.style.cursor = '';
    drag = null;
}

export function init() {
    windows = [...document.querySelectorAll('.hero, .work')];

    const placed = [];

    for (const win of windows) {
        win._x = 0;
        win._y = 0;

        // Get dimensions before assigning the randomized position
        const rect = win.getBoundingClientRect();
        const pos = randomPosition(win, placed);

        win._x = pos.x;
        win._y = pos.y;
        win.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

        placed.push({
            x: pos.x,
            y: pos.y,
            width: rect.width,
            height: rect.height,
        });

        win.addEventListener('pointerdown', onDown);
        win.addEventListener('pointermove', onMove);
        win.addEventListener('pointerup', onUp);
        win.addEventListener('pointercancel', onUp);
    }
}
export function destroy() {
    for (const win of windows) {
        win.removeEventListener('pointerdown', onDown);
        win.removeEventListener('pointermove', onMove);
        win.removeEventListener('pointerup', onUp);
        win.removeEventListener('pointercancel', onUp);
        win.style.transform = '';
        win.style.zIndex = '';
        win.style.cursor = '';
        delete win._x;
        delete win._y;
    }

    windows = [];
    drag = null;
}
