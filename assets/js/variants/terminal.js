const SYMBOLS = '#%@&?';

let el = null;
let base = '';
let glitched = '';
let timer = 0;
let restore = 0;

function glitch() {
    // skip while the hover swap runs or shows another text
    if (el.classList.contains('is-swapping') || el.textContent !== base) return;

    const i = Math.random() * base.length | 0;
    glitched = base.slice(0, i) + SYMBOLS[Math.random() * SYMBOLS.length | 0] + base.slice(i + 1);
    el.textContent = glitched;

    restore = setTimeout(() => {
        if (el.textContent === glitched) el.textContent = base;
    }, 90);
}

export function init() {
    el = document.querySelector('.hero-name');
    if (!el) return;

    base = el.textContent;

    // reduced motion: no glitch at all
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    timer = setInterval(glitch, 1500);
}

export function destroy() {
    clearInterval(timer);
    clearTimeout(restore);
    timer = 0;

    // put the name back only if our glitch frame is still showing
    if (el && el.textContent === glitched) el.textContent = base;

    el = null;
    glitched = '';
}
