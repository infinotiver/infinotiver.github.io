/* terminal glyph corruption on the hero name (interim; moves into a variant module later) */
(() => {
    const el = document.querySelector('.hero-name');
    if (!el) return;

    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const base = el.textContent;
    const symbols = '#%@&?';
    let timer = 0;
    let restore = 0;
    let glitched = '';

    const glitch = () => {
        // skip while the hover swap is running or showing another text
        if (el.classList.contains('is-swapping') || el.textContent !== base) return;

        const i = Math.random() * base.length | 0;
        glitched = base.slice(0, i) + symbols[Math.random() * symbols.length | 0] + base.slice(i + 1);
        el.textContent = glitched;

        restore = setTimeout(() => {
            if (el.textContent === glitched) el.textContent = base;
        }, 90);
    };

    // run only while the terminal variant is active and motion is allowed
    const sync = () => {
        const on = root.dataset.v === 'terminal' && !reduce.matches;

        if (on && !timer) {
            timer = setInterval(glitch, 1500);
        } else if (!on && timer) {
            clearInterval(timer);
            clearTimeout(restore);
            timer = 0;
            if (el.textContent === glitched) el.textContent = base;
        }
    };

    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-v'] });
    reduce.addEventListener('change', sync);
    sync();
})();
