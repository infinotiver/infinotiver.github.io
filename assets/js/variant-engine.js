(() => {
    "use strict";

    // variant modules are resolved next to this script
    const SCRIPT_URL = document.currentScript?.src
        || new URL("assets/js/variant-engine.js", location.href).href;

    // variants that ship an init()/destroy() module in variants/<name>.js (append when one is added)
    const MODULES = new Set(["terminal", "netscape", "retromac", "gov"]);

    const VARIANTS = {
        default: {
            label: "Default",
            h: ["Fraunces", "Instrument Serif", "Young Serif"],
            b: ["Inter", "Geist", "Hanken Grotesk"],
            fallback: { h: "serif", b: "sans-serif" },
        },
        gov: {
            label: "Gov",
            h: ["Montserrat", "Poppins", "Oswald"],
            b: ["Figtree", "Lato", "Fira Sans"],
            fallback: { h: "sans-serif", b: "sans-serif" },
        },
        netscape: {
            label: "Netscape",
            h: ["Tinos", "Libre Baskerville", "Gelasio"],
            b: ["Arimo", "Open Sans", "Source Sans 3"],
            fallback: { h: "serif", b: "sans-serif" },
        },
        basic: {
            label: "Basic",
            h: ["Courier Prime", "Newsreader", "IBM Plex Serif"],
            b: ["Lora", "Literata", "IBM Plex Mono"],
            fallback: { h: "serif", b: "serif" },
        },
        terminal: {
            label: "Terminal",
            h: ["Pixelify Sans", "VT323", "IBM Plex Mono"],
            b: ["JetBrains Mono", "Fira Code", "Source Code Pro"],
            fallback: { h: "monospace", b: "monospace" },
        },
        web2: {
            label: "Web 2.0",
            h: ["Varela Round", "Nunito", "Rubik"],
            b: ["Open Sans", "Lato", "Nunito Sans"],
            fallback: { h: "sans-serif", b: "sans-serif" },
        },
        retromac: {
            label: "Retro Mac",
            h: ["Silkscreen", "Pixelify Sans", "Press Start 2P"],
            b: ["Public Sans", "Instrument Sans", "Cousine"],
            fallback: { h: "sans-serif", b: "sans-serif" },
        },
    };

    const NAMES = Object.keys(VARIANTS);
    const N = NAMES.length * 3 * 3 * 360;
    const MULTIPLIER = 8191;
    const INVERSE = 3151;

    const scramble = (code) => (code * MULTIPLIER) % N;

    const params = new URLSearchParams(location.search);
    const fromLink = params.has("c");
    const parsedCode = Number(params.get("c"));

    // pin: storage may be blocked, so every access is guarded
    const PIN_KEY = "pin";

    function readPin() {
        try {
            const raw = localStorage.getItem(PIN_KEY);
            const value = Number(raw);
            return raw !== null && Number.isInteger(value) && value >= 0 && value < N
                ? value
                : null;
        } catch {
            return null;
        }
    }

    function writePin(code) {
        try {
            if (code === null) localStorage.removeItem(PIN_KEY);
            else localStorage.setItem(PIN_KEY, String(code));
        } catch {
            // blocked storage: pin just won't persist
        }
    }

    // ?c= wins for this visit only, then the pinned code, then a random roll
    const pinnedCode = fromLink ? null : readPin();

    const initialCode = fromLink
        ? (
            Number.isSafeInteger(parsedCode)
                ? ((parsedCode % N) + N) % N
                : 0
        )
        : pinnedCode ?? Math.floor(Math.random() * N);

    const root = document.documentElement;
    const $ = (id) => document.getElementById(id);

    const state = {
        code: initialCode,
        variant: "default",
        head: 0,
        body: 0,
        hue: 0,
    };

    function fontStack(font, fallback) {
        return `${JSON.stringify(font)}, ${fallback}`;
    }

    function loadFont(fontName) {
        const family = fontName.replace(/ /g, "+");
        const id = `font-${family.toLowerCase()}`;

        if (document.getElementById(id)) return;

        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
        document.head.appendChild(link);
    }

    function decode(code) {
        let n = scramble(code);

        const hue = n % 360;
        n = Math.floor(n / 360);

        const body = n % 3;
        n = Math.floor(n / 3);

        const head = n % 3;
        n = Math.floor(n / 3);

        return {
            variant: NAMES[n],
            head,
            body,
            hue,
        };
    }

    function encode({ variant, head, body, hue }) {
        const variantIndex = NAMES.indexOf(variant);

        if (variantIndex < 0) {
            throw new Error(`Unknown variant: ${variant}`);
        }

        const packed =
            (((variantIndex * 3 + head) * 3 + body) * 360) + hue;

        return (packed * INVERSE) % N;
    }

    function getShareURL() {
        const url = new URL(location.href);
        url.searchParams.set("c", String(state.code));
        url.hash = "";
        return url.href;
    }

    function updateBadge() {
        const badge = $("seed-badge");

        if (badge) badge.textContent = "#" + String(state.code).padStart(5, "0");

        const share = $("ds");
        if (share) share.title = canShare() ? "Share this look" : "Copy a link to this look";

        updatePinButton();
    }

    // shows "pinned" only while the current look is the stored one
    function updatePinButton() {
        const button = $("dp");
        if (!button) return;

        const pinned = readPin() === state.code;
        const text = $("dp-text");
        if (text) text.textContent = pinned ? "pinned" : "pin";
        button.title = pinned
            ? "Pinned: this look returns on every visit. Click to unpin"
            : "Pin this look for return visits";
        button.setAttribute("aria-pressed", String(pinned));
    }

    const motionOff = matchMedia("(prefers-reduced-motion: reduce)");

    // View Transitions where supported, a plain swap otherwise or with reduced motion
    function swap(change) {
        if (document.startViewTransition && !motionOff.matches) {
            document.startViewTransition(change);
        } else {
            change();
        }
    }

    // variant modules: destroy the old one on every change, lazy-load only the active one
    let activeName = "";
    let activeModule = null;
    let moduleToken = 0;

    async function syncModule() {
        if (state.variant === activeName) return;

        const name = state.variant;
        const token = ++moduleToken;
        activeName = name;

        if (activeModule) {
            try {
                activeModule.destroy?.();
            } catch (error) {
                console.error(`destroy() failed for ${activeName}`, error);
            }
            activeModule = null;
        }

        if (!MODULES.has(name)) return;

        try {
            const module = await import(new URL(`variants/${name}.js`, SCRIPT_URL).href);
            // the look changed again while loading, so this module is stale
            if (token !== moduleToken) return;
            module.init?.();
            activeModule = module;
        } catch (error) {
            console.error(`init() failed for ${name}`, error);
        }
    }

    // a pending egg must not fire after the look has changed
    let eggTimer;

    function apply({ updateCode = true } = {}) {
        clearTimeout(eggTimer);
        const config = VARIANTS[state.variant];

        if (!config) {
            throw new Error(`Unknown variant: ${state.variant}`);
        }

        root.dataset.v = state.variant;

        root.style.setProperty(
            "--fh",
            fontStack(config.h[state.head], config.fallback.h)
        );

        root.style.setProperty(
            "--fb",
            fontStack(config.b[state.body], config.fallback.b)
        );

        root.style.setProperty("--h", String(state.hue));

        loadFont(config.h[state.head]);
        loadFont(config.b[state.body]);

        if (updateCode) {
            state.code = encode(state);
            updateBadge();
        }

        updateDock();
        syncModule();
    }

    function loadCode(code) {
        state.code = ((code % N) + N) % N;
        Object.assign(state, decode(state.code));
        apply({ updateCode: false });
        updateBadge();
    }

    function toast(message) {
        const element = document.createElement("div");

        element.textContent = message;
        element.style.cssText = [
            "position:fixed",
            "left:50%",
            "bottom:72px",
            "transform:translateX(-50%)",
            "z-index:10001",
            "max-width:calc(100vw - 32px)",
            "overflow-wrap:anywhere",
            "background:rgba(255,255,255,0.75)", /* fallback for older browsers */
            "background:color-mix(in srgb, Canvas, transparent 25%)", /* native light/dark adaption */
            "backdrop-filter:blur(20px)",
            "-webkit-backdrop-filter:blur(20px)", /* Safari support */
            "color:CanvasText", /* native light/dark text adaption */
            "padding:10px 16px",
            "border-radius:10px",
            "font:14px system-ui,sans-serif",
            "box-shadow:0 4px 30px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2)", /* creates contrast */
        ].join(";");


        document.body.appendChild(element);
        setTimeout(() => element.remove(), 3500);
    }

    function luckyEnabled() {
        try {
            return localStorage.getItem("lucky") !== "off";
        } catch {
            return true;
        }
    }

    function overlay(message, url) {
        const container = document.createElement("div");

        container.style.cssText = [
            "position:fixed",
            "inset:0",
            "z-index:10002",
            "background:#000d",
            "color:#fff",
            "display:grid",
            "place-items:center",
            "text-align:center",
            "font:24px system-ui,sans-serif",
            "padding:24px",
        ].join(";");

        const content = document.createElement("div");
        const title = document.createElement("div");
        const countdown = document.createElement("p");
        const number = document.createElement("b");
        const button = document.createElement("button");

        title.textContent = message;
        number.textContent = "3";
        countdown.append("Redirecting in ", number, "…");
        button.textContent = "No thanks";
        button.style.cssText = "padding:8px 14px;cursor:pointer";

        content.append(title, countdown, button);
        container.appendChild(content);
        document.body.appendChild(container);

        let remaining = 3;

        const interval = setInterval(() => {
            remaining--;
            number.textContent = String(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                location.href = url;
            }
        }, 1000);

        button.addEventListener("click", () => {
            clearInterval(interval);
            container.remove();
        });
    }

    const EGGS = {
        777: () => overlay(
            "777 — jackpot!",
            "https://www.youjustgot.com/"
        ),
        404: () => toast(
            "Code 404: look not found. Just kidding, it's right here."
        ),
    };

    const dock = $("dock");
    const toggle = $("dock-toggle");

    function setDockOpen(open) {
        if (!dock || !toggle) return;

        dock.classList.toggle("is-open", open);
        dock.setAttribute("aria-hidden", String(!open));
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Close design controls" : "Open design controls"
        );
    }

    function populateSelect(select, options) {
        if (!select) return;

        const currentValue = select.value;
        select.replaceChildren();

        for (const [value, label] of options) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            select.appendChild(option);
        }

        if (options.some(([value]) => value === currentValue)) {
            select.value = currentValue;
        }
    }

    function refreshFontOptions() {
        const config = VARIANTS[state.variant];

        populateSelect(
            $("dh"),
            config.h.map((font, index) => [String(index), font])
        );

        populateSelect(
            $("db"),
            config.b.map((font, index) => [String(index), font])
        );
    }

    function updateDock() {
        if (!dock) return;

        if ($("dv")) $("dv").value = state.variant;

        refreshFontOptions();

        if ($("dh")) $("dh").value = String(state.head);
        if ($("db")) $("db").value = String(state.body);
        if ($("dc")) $("dc").value = String(state.hue);
    }

    populateSelect(
        $("dv"),
        NAMES.map((name) => [name, VARIANTS[name].label])
    );

    if (toggle && dock) {
        toggle.addEventListener("click", () => {
            setDockOpen(!dock.classList.contains("is-open"));
        });

        document.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                const willOpen = !dock.classList.contains("is-open");
                setDockOpen(willOpen);
                if (!willOpen) toggle.focus();
                return;
            }

            if (event.key === "Escape" && dock.classList.contains("is-open")) {
                setDockOpen(false);
                toggle.focus();
            }
        });

        setDockOpen(false);
    }
    // touch devices get the share sheet, desktop keeps copy
    const canShare = () =>
        !!navigator.share && matchMedia("(pointer: coarse)").matches;

    if ($("ds")) {
        $("ds").addEventListener("click", async () => {
            const url = getShareURL();
            const tag = "#" + String(state.code).padStart(5, "0");

            try {
                if (canShare()) {
                    await navigator.share({
                        title: "Infinotiver's portfolio",
                        text: `My look ${tag}`,
                        url,
                    });
                } else {
                    await navigator.clipboard.writeText(url);
                    toast(`Copied link for ${tag}`);
                }
            } catch (error) {
                if (error.name === "AbortError") return; // user closed the sheet
                toast(url);
            }
        });
    }

    // the code label folds away while scrolling down and returns on scroll up or at the top;
    // capture catches inner scrollers too (terminal scrolls its own screen)
    const dockBar = $("dock-bar");

    if (dockBar) {
        let lastY = 0;

        document.addEventListener("scroll", (event) => {
            const target = event.target;
            if (target.closest?.("#dock")) return;

            const y = target === document ? window.scrollY : target.scrollTop;
            if (Math.abs(y - lastY) < 4) return;

            dockBar.classList.toggle("is-scrolled", y > 48 && y > lastY);
            lastY = y;
        }, { capture: true, passive: true });
    }

    if ($("dv")) {
        $("dv").addEventListener("change", (event) => {
            // fonts are index based, so the picked fonts carry over to the new style
            state.variant = event.target.value;
            swap(() => apply());
        });
    }

    if ($("dh")) {
        $("dh").addEventListener("change", (event) => {
            state.head = Number(event.target.value);
            swap(() => apply());
        });
    }

    if ($("db")) {
        $("db").addEventListener("change", (event) => {
            state.body = Number(event.target.value);
            swap(() => apply());
        });
    }

    if ($("dc")) {
        $("dc").addEventListener("input", (event) => {
            state.hue = Number(event.target.value);
            apply();
        });
    }

    if ($("dr")) {
        $("dr").addEventListener("click", () => {
            swap(() => loadCode(Math.floor(Math.random() * N)));
        });
    }

    if ($("dp")) {
        $("dp").addEventListener("click", () => {
            const pinned = readPin() === state.code;
            writePin(pinned ? null : state.code);
            updatePinButton();
            toast(pinned ? "Unpinned: new look on every visit" : "Pinned: this look stays on return visits");
        });
    }

    loadCode(initialCode);

    // eggs only on a random roll, never on a shared link or a pinned look
    if (!fromLink && pinnedCode === null && luckyEnabled() && EGGS[initialCode]) {
        eggTimer = setTimeout(() => EGGS[initialCode](), 800);
    }

    window.variantEngine = {
        get code() {
            return state.code;
        },
        get variant() {
            return state.variant;
        },
        get url() {
            return getShareURL();
        },
        loadCode,
        apply,
        shuffle() {
            loadCode(Math.floor(Math.random() * N));
        },
    };
})();
