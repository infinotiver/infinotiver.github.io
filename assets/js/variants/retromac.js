/* retromac: draggable windows (pointer events) */
const TITLE_H = 22; // px, matches the striped title bar drawn in retromac.css

let windows = [];
let drag = null;
const EDGE = 12;     // px kept free at the left/right edges (room for the shadow)
const TOP = 32;      // px, clears the fixed menu bar
const BOTTOM = 64;   // px, clears the fixed dock bar

/* viewport-space [min, max] range a window's top-left may take */
function bounds(rect) {
    const minX = EDGE;
    const minY = TOP;
    return {
        minX,
        minY,
        maxX: Math.max(minX, window.innerWidth - rect.width - EDGE - 2),
        maxY: Math.max(minY, window.innerHeight - rect.height - BOTTOM),
    };
}

/* picks a viewport position fully inside the screen, so no scrolling is needed to reach a window */
function randomPosition(rect, placed) {
    const b = bounds(rect);
    const pick = () => ({
        x: b.minX + Math.random() * (b.maxX - b.minX),
        y: b.minY + Math.random() * (b.maxY - b.minY),
    });

    // Try several positions to avoid overlapping windows too much
    for (let i = 0; i < 60; i++) {
        const { x, y } = pick();

        const overlaps = placed.some((p) =>
            x < p.x + p.width + 24 &&
            x + rect.width + 24 > p.x &&
            y < p.y + p.height + 24 &&
            y + rect.height + 24 > p.y
        );

        if (!overlaps) return { x, y };
    }

    // Fall back to a random position if the viewport is crowded
    return pick();
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
    // keep the window inside the viewport horizontally and below the menu bar
    const rect = win.getBoundingClientRect();
    const b = bounds(rect);
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    const left = rect.left - (win._x || 0); // layout position without the transform
    const top = rect.top - (win._y || 0);

    win._x = Math.min(Math.max(x, b.minX - left), b.maxX - left);
    win._y = Math.max(y, b.minY - top);
    win.style.transform = `translate(${win._x}px, ${win._y}px)`;
}

function onUp(event) {
    if (!drag || event.pointerId !== drag.id) return;

    drag.win.style.cursor = '';
    drag = null;
}

export function init() {
    windows = [...document.querySelectorAll('.hero, .work')];

    // small screens: windows stay stacked in normal flow, no random placement or dragging
    if (window.matchMedia('(max-width: 40rem)').matches) return;

    const placed = [];

    for (const win of windows) {
        win._x = 0;
        win._y = 0;

        // layout rect (no transform yet); the translate is relative to it
        const rect = win.getBoundingClientRect();
        const pos = randomPosition(rect, placed);

        win._x = pos.x - rect.left;
        win._y = pos.y - rect.top;
        win.style.transform = `translate(${win._x}px, ${win._y}px)`;

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
