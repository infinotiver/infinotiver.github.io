/* terminal: glyph corruption and a small command prompt (injected, no HTML edits) */
const SYMBOLS = '#%@&?';

let el = null;
let base = '';
let glitched = '';
let timer = 0;
let restore = 0;
let prompt = null;
let screen = null;
let parts = [];
let history = [];
let cursor = 0;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* glitch */
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

/* commands */
const projects = () => [...document.querySelectorAll('.work-item')].map((item) => ({
    name: item.querySelector('h3')?.textContent.trim() || '',
    link: item.querySelector('.work-item-link, .work-code')?.href || '',
}));

const COMMANDS = {
    help: () => 'commands: help, ls, open <project>, theme <code>, clear',
    ls: () => projects().map((p, i) => `${i + 1}. ${p.name}`).join('\n'),
    open: (arg) => {
        if (!arg) return 'usage: open <project name or number>';
        const list = projects();
        const found = list[Number(arg) - 1]
            || list.find((p) => p.name.toLowerCase().includes(arg.toLowerCase()));
        if (!found) return `open: no such project: ${arg}`;
        if (!found.link) return `open: ${found.name} has no link`;
        window.open(found.link, '_blank', 'noopener');
        return `opening ${found.name}...`;
    },
    theme: (arg) => {
        const code = Number(arg);
        if (!arg || !Number.isInteger(code) || code < 0) return 'usage: theme <code>  (the number in the badge)';
        window.variantEngine?.loadCode(code);
        return `theme #${String(window.variantEngine?.code ?? code).padStart(5, '0')} loaded`;
    },
};

function run(input, log) {
    const [name, ...rest] = input.trim().split(/\s+/);
    if (!name) return;
    
    log.append(Object.assign(document.createElement('div'), {
        className: 'term-cmd',
        textContent: `root@Infinotiver:~$ ${input}`,
    }));

    if (name === 'clear') {
        log.replaceChildren();
        return;
    }

    const handler = COMMANDS[name];
    log.append(Object.assign(document.createElement('div'), {
        textContent: handler ? handler(rest.join(' ')) : `${name}: command not found (try help)`,
    }));
}

function buildPrompt() {
    // inside main, so the prompt shares main's skew and flicker
    const main = document.querySelector('main');
    if (!main) return;

    prompt = document.createElement('section');
    prompt.className = 'term-prompt';
    prompt.setAttribute('aria-label', 'Terminal');

    const log = document.createElement('div');
    log.className = 'term-log';
    log.setAttribute('aria-live', 'polite');

    const line = document.createElement('div');
    line.className = 'term-line';

    // same handle as the navbar
    const label = document.createElement('label');
    label.htmlFor = 'term-input';
    label.textContent = 'root@Infinotiver:~$';

    const input = document.createElement('input');
    input.id = 'term-input';
    input.className = 'term-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'type help';

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const value = input.value;
            if (value.trim()) {
                history.push(value);
                cursor = history.length;
            }
            input.value = '';
            run(value, log);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            cursor = Math.max(0, cursor - 1);
            input.value = history[cursor] ?? '';
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            cursor = Math.min(history.length, cursor + 1);
            input.value = history[cursor] ?? '';
        }
    });

    line.append(label, input);
    prompt.append(log, line);
    main.append(prompt);
}

export function init() {
    el = document.querySelector('.hero-name');
    if (el) {
        base = el.textContent;
        // reduced motion: no glitch at all
        if (!reduced()) timer = setInterval(glitch, 1500);
    }

    // wrap nav, main and footer in one scrolling box (moved, not copied; destroy puts them back)
    parts = [...document.body.children].filter((node) => node.matches('.site-nav, main, .site-footer'));
    if (parts.length) {
        screen = document.createElement('div');
        screen.className = 'term-screen';
        parts[0].before(screen);
        screen.append(...parts);
        document.body.classList.add('term-on');
    }

    history = [];
    cursor = 0;
    buildPrompt();
}

export function destroy() {
    clearInterval(timer);
    clearTimeout(restore);
    timer = 0;

    // put the name back only if our glitch frame is still showing
    if (el && el.textContent === glitched) el.textContent = base;

    prompt?.remove();
    prompt = null;

    // restore the original order, then drop the wrapper
    if (screen) {
        for (const node of parts) screen.before(node);
        screen.remove();
    }
    document.body.classList.remove('term-on');
    screen = null;
    parts = [];
    el = null;
    glitched = '';
}
