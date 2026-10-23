/* retromac: draggable windows (pointer events) */
const TITLE_H = 22; // px, matches the striped title bar drawn in retromac.css

let windows = [];
let drag = null;

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

    for (const win of windows) {
        win._x = 0;
        win._y = 0;
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
