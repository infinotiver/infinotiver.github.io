
const n = document.querySelector('.hero-name');

if (n) {
    const t = n.textContent;

    setInterval(() => {
        if (
            document.documentElement.dataset.v !== 'terminal' ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
        ) return;

        const i = Math.random() * t.length | 0;
        const symbols = '#%@&?';

        n.textContent =
            t.slice(0, i) +
            symbols[Math.random() * symbols.length | 0] +
            t.slice(i + 1);

        setTimeout(() => {
            n.textContent = t;
        }, 90);

    }, 1500);
}
