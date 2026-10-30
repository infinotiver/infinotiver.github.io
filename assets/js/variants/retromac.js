/* retromac: draggable windows (pointer events) */
const TITLE_H = 22; 
const EDGE = 12;     
const TOP = 32;     
const JITTER_X = 28;  
const JITTER_Y = 14; 

let windows = [];
let drag = null;

const jitter = (n) => (Math.random() * 2 - 1) * n;

/* move */
// Sets the translate, clamped so the window stays inside the sides and below the menu bar
function moveTo(win, x, y) {
    const rect = win.getBoundingClientRect();
    const left = rect.left - win._x; // layout position without the transform
    const top = rect.top - win._y;
    const maxX = Math.max(EDGE, window.innerWidth - rect.width - EDGE - 2);

    win._x = Math.min(Math.max(x, EDGE - left), maxX - left);
    win._y = Math.max(y, TOP - top);
    win.style.transform = `translate(${win._x}px, ${win._y}px)`;
}

/* drag */
// Only the title bar starts a drag
function onDown(event) {
    const win = event.currentTarget;

    if (event.button > 0 || event.clientY - win.getBoundingClientRect().top > TITLE_H) return;

    drag = {
        win,
        id: event.pointerId,
        x: event.clientX - win._x,
        y: event.clientY - win._y,
    };

    // keep the dragged window on top
    windows.forEach((w) => { w.style.zIndex = w === win ? '2' : ''; });
    win.setPointerCapture(event.pointerId);
    win.style.cursor = 'grabbing';
    event.preventDefault();
}

function onMove(event) {
    if (!drag || event.pointerId !== drag.id) return;

    moveTo(drag.win, event.clientX - drag.x, event.clientY - drag.y);
}

function onUp(event) {
    if (!drag || event.pointerId !== drag.id) return;

    drag.win.style.cursor = '';
    drag = null;
}

/* lifecycle */
export function init() {
    windows = [...document.querySelectorAll('.hero, .work')];

    // small screens: windows stay stacked in normal flow, no offset or dragging
    if (window.matchMedia('(max-width: 40rem)').matches) return;

    for (const win of windows) {
        win._x = 0;
        win._y = 0;
        moveTo(win, jitter(JITTER_X), jitter(JITTER_Y));

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