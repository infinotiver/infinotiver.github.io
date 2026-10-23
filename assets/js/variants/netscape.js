/* netscape: in-page toolbar, location row and status bar (injected, no HTML edits) */
const KEY = 'ns-boot';
const LOAD_MS = 1800;

// [label, glyph, action]; the action runs on click
const TOOLS = [
    ['Back', '\u25C0', () => history.back()],
    ['Forward', '\u25B6', () => history.forward()],
    ['Home', '\u2302', () => scrollTo({ top: 0 })],
    ['Reload', '\u21BB', () => location.reload()],
    ['Images', '\u25A8', () => flash('Images are already loaded')],
    ['Open', '\u25A4', () => flash('Open: not in this version')],
    ['Print', '\u2399', () => print()],
    ['Find', '\u2315', () => flash('Find: try Ctrl+F')],
    ['Stop', '\u25A0', () => stop()],
];

let chrome = null;
let statusBar = null;
let text = null;
let fill = null;
let field = null;
let stopBtn = null;
let idle = 'Document: Done';
let loadTimer = 0;
let flashTimer = 0;
let urlWatch = null;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function make(tag, cls, content) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (content) node.textContent = content;
    return node;
}

function say(message) {
    if (text) text.textContent = message;
}

// short message that falls back to the idle text
function flash(message) {
    say(message);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => say(idle), 1500);
}

function showUrl() {
    if (field) field.value = window.variantEngine?.url || location.href;
}

function setLoading(on) {
    chrome?.classList.toggle('is-loading', on);
    if (stopBtn) stopBtn.disabled = !on;
}

function finish() {
    clearInterval(loadTimer);
    loadTimer = 0;
    idle = 'Document: Done';
    setLoading(false);
    if (fill) fill.style.width = '0';
    say(idle);
}

function stop() {
    if (!loadTimer) return;
    finish();
}

// fake load: once per visit, about 2 seconds, skippable with Stop or Esc
function boot() {
    let seen = false;
    try {
        seen = sessionStorage.getItem(KEY) === '1';
        sessionStorage.setItem(KEY, '1');
    } catch {
        // blocked storage: play it each time
    }

    if (seen || reduced()) return finish();

    const steps = [
        [0, 'Looking up host infinotiver.com...'],
        [25, 'Connecting to infinotiver.com...'],
        [50, 'Host contacted. Waiting for reply...'],
        [75, 'Receiving data...'],
    ];
    const start = performance.now();
    let last = -1;

    setLoading(true);

    loadTimer = setInterval(() => {
        const pct = Math.min(100, ((performance.now() - start) / LOAD_MS) * 100);
        if (fill) fill.style.width = `${pct}%`;

        const step = steps.filter(([from]) => pct >= from).length - 1;
        if (step !== last && step >= 0) {
            last = step;
            idle = steps[step][1];
            say(idle);
        }

        if (pct >= 100) finish();
    }, 80);
}

// link hover shows the target like the old status bar did
const over = (event) => {
    const link = event.target.closest?.('a[href]');
    if (link) say(link.href);
};
const out = (event) => {
    if (event.target.closest?.('a[href]')) say(idle);
};
const key = (event) => {
    if (event.key === 'Escape') stop();
};

export function init() {
    chrome = make('div', 'ns-chrome');
    chrome.setAttribute('role', 'presentation');

    // toolbar
    const bar = make('div', 'ns-toolbar');
    for (const [label, glyph, action] of TOOLS) {
        const button = make('button', 'ns-tool');
        button.type = 'button';
        button.append(make('span', 'ns-glyph', glyph), make('span', 'ns-label', label));
        button.addEventListener('click', action);
        if (label === 'Stop') stopBtn = button;
        bar.append(button);
    }

    // location row
    const row = make('div', 'ns-location');
    field = make('input', 'ns-field');
    field.readOnly = true;
    field.setAttribute('aria-label', 'Location');
    row.append(make('span', 'ns-loc-label', 'Location:'), field);

    chrome.append(bar, row);
    document.body.prepend(chrome);

    // status bar sits below the dock (z-index) so the dock is untouched
    statusBar = make('div', 'ns-status');
    text = make('span', 'ns-status-text');
    const progress = make('span', 'ns-progress');
    fill = make('i');
    progress.append(fill);
    statusBar.append(text, progress);
    document.body.append(statusBar);

    showUrl();
    // the code changes the shareable url, so follow the badge text
    const badge = document.getElementById('seed-badge');
    if (badge) {
        urlWatch = new MutationObserver(showUrl);
        urlWatch.observe(badge, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    document.addEventListener('focusin', over);
    document.addEventListener('focusout', out);
    document.addEventListener('keydown', key);

    boot();
}

export function destroy() {
    clearInterval(loadTimer);
    clearTimeout(flashTimer);
    loadTimer = 0;

    urlWatch?.disconnect();
    urlWatch = null;

    document.removeEventListener('mouseover', over);
    document.removeEventListener('mouseout', out);
    document.removeEventListener('focusin', over);
    document.removeEventListener('focusout', out);
    document.removeEventListener('keydown', key);

    chrome?.remove();
    statusBar?.remove();
    chrome = statusBar = text = fill = field = stopBtn = null;
    idle = 'Document: Done';
}
