(() => {
    "use strict";

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

    const initialCode = fromLink
        ? (
            Number.isSafeInteger(parsedCode)
                ? ((parsedCode % N) + N) % N
                : 0
        )
        : Math.floor(Math.random() * N);

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

        if (badge) {
            badge.textContent = "#" + String(state.code).padStart(5, "0");
            badge.title = "Click to copy design link";
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
            "bottom:24px",
            "transform:translateX(-50%)",
            "z-index:10001",
            "max-width:calc(100vw - 32px)",
            "overflow-wrap:anywhere",
            "background:#111",
            "color:#fff",
            "padding:10px 16px",
            "border-radius:10px",
            "font:14px system-ui,sans-serif",
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
    const badge = $("seed-badge");

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

    if (badge) {
        badge.style.cursor = "pointer";
        badge.addEventListener("click", async (event) => {
            event.stopPropagation();
            const url = getShareURL();

            try {
                await navigator.clipboard.writeText(url);
                toast(`Copied link for #${String(state.code).padStart(5, "0")}`);
            } catch {
                toast(url);
            }
        });
    }

    if ($("dv")) {
        $("dv").addEventListener("change", (event) => {
            state.variant = event.target.value;
            state.head = 0;
            state.body = 0;
            apply();
        });
    }

    if ($("dh")) {
        $("dh").addEventListener("change", (event) => {
            state.head = Number(event.target.value);
            apply();
        });
    }

    if ($("db")) {
        $("db").addEventListener("change", (event) => {
            state.body = Number(event.target.value);
            apply();
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
            loadCode(Math.floor(Math.random() * N));
        });
    }

    loadCode(initialCode);

    if (!fromLink && luckyEnabled() && EGGS[initialCode]) {
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
