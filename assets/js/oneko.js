// oneko.js: https://github.com/adryd325/oneko.js
// breeds and sprite layouts from https://github.com/ABSanthosh/neko-ts
(function oneko() {

    // cat can't follow a finger, so skip it on touch
    if (matchMedia("(pointer: coarse)").matches) return;
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    const scriptEl = document.currentScript;
    const basePath = scriptEl
        ? new URL("../", scriptEl.src).href
        : "./assets/";

    // Sprite layout for the original oneko.gif (8 cols x 4 rows, no gap)
    const gifSpriteSets = {
        idle: [[-3, -3]],
        alert: [[-7, -3]],
        scratchSelf: [
            [-5, 0],
            [-6, 0],
            [-7, 0],
        ],
        scratchWallN: [
            [0, 0],
            [0, -1],
        ],
        scratchWallS: [
            [-7, -1],
            [-6, -2],
        ],
        scratchWallE: [
            [-2, -2],
            [-2, -3],
        ],
        scratchWallW: [
            [-4, 0],
            [-4, -1],
        ],
        tired: [[-3, -2]],
        sleeping: [
            [-2, 0],
            [-2, -1],
        ],
        N: [
            [-1, -2],
            [-1, -3],
        ],
        NE: [
            [0, -2],
            [0, -3],
        ],
        E: [
            [-3, 0],
            [-3, -1],
        ],
        SE: [
            [-5, -1],
            [-5, -2],
        ],
        S: [
            [-6, -3],
            [-7, -2],
        ],
        SW: [
            [-5, -3],
            [-6, -1],
        ],
        W: [
            [-4, -2],
            [-4, -3],
        ],
        NW: [
            [-1, 0],
            [-1, -1],
        ],
    };

    // Sprite layout for other breed PNGs (8 cols x 4 rows, 1px gap).
    const breedSpriteSets = {
        idle: [[0, 0]],
        alert: [[-7, 0]],
        scratchSelf: [
            [-2, 0],
            [-3, 0],
        ],
        scratchWallN: [
            [-4, -3],
            [-5, -3],
        ],
        scratchWallS: [
            [0, -3],
            [-1, -3],
        ],
        scratchWallE: [
            [-2, -3],
            [-3, -3],
        ],
        scratchWallW: [
            [-6, -3],
            [-7, -3],
        ],
        tired: [[-4, 0]],
        sleeping: [
            [-5, 0],
            [-6, 0],
        ],
        N: [
            [0, -2],
            [-1, -2],
        ],
        NE: [
            [-6, -1],
            [-7, -1],
        ],
        E: [
            [-4, -1],
            [-5, -1],
        ],
        SE: [
            [-2, -1],
            [-3, -1],
        ],
        S: [
            [0, -1],
            [-1, -1],
        ],
        SW: [
            [-6, -2],
            [-7, -2],
        ],
        W: [
            [-4, -2],
            [-5, -2],
        ],
        NW: [
            [-2, -2],
            [-3, -2],
        ],
    };
    // gap = pixel gap between cells in the sheet.
    const breeds = {
        cat: { src: basePath + "breeds/oneko.gif", gap: 0, spriteSets: gifSpriteSets },
        ace: { src: basePath + "breeds/ace.png", gap: 1, spriteSets: breedSpriteSets },
        black: { src: basePath + "breeds/black.png", gap: 1, spriteSets: breedSpriteSets },
        calico: { src: basePath + "breeds/calico.png", gap: 1, spriteSets: breedSpriteSets },
        ghost: { src: basePath + "breeds/ghost.png", gap: 1, spriteSets: breedSpriteSets },
        rainbow: { src: basePath + "breeds/rainbow.png", gap: 1, spriteSets: breedSpriteSets },
    };
    const breedNames = Object.keys(breeds);

    const nekoEl = document.createElement("div");

    // Configurable spawn position (Supports script tag dataset attributes or defaults to top-left)
    // spawn top-left
    let nekoPosX = scriptEl?.dataset.x ? parseInt(scriptEl.dataset.x, 10) : 56;
    let nekoPosY = scriptEl?.dataset.y ? parseInt(scriptEl.dataset.y, 10) : 56;

    // Prevent cat from instantly sprinting to (0,0) on load
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    let currentBreed = breedNames[0];
    let currentGap = breeds[currentBreed].gap;
    let currentSpriteSets = breeds[currentBreed].spriteSets;
    let isHidden = false; // manual hide/show API state
    let isAutoHidden = false;

    let windowFocused = document.hasFocus();
    let pointerInside = true;

    function updateVisibility() {
        isAutoHidden =
            document.visibilityState !== "visible" ||
            !windowFocused ||
            !pointerInside;

        nekoEl.style.display =
            isHidden || isAutoHidden ? "none" : "block";
    }

    const nekoSpeed = 10;

    function applyBreed(name) {
        if (!breeds[name]) return;
        currentBreed = name;
        currentGap = breeds[name].gap;
        currentSpriteSets = breeds[name].spriteSets;
        nekoEl.style.backgroundImage = `url(${breeds[name].src})`;
    }

    function nextBreed() {
        const i = breedNames.indexOf(currentBreed);
        applyBreed(breedNames[(i + 1) % breedNames.length]);
    }

    // Hide, Show, Toggle, and SetPosition API functions
    function hide() {
        isHidden = true;
        updateVisibility();
    }

    function show() {
        isHidden = false;
        updateVisibility();
    }

    function toggle() {
        if (isHidden) {
            show();
        } else {
            hide();
        }
        return !isHidden;
    }

    function setPosition(x, y) {
        nekoPosX = x;
        nekoPosY = y;
        mousePosX = x;
        mousePosY = y;
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    function init() {
        applyBreed(currentBreed);

        nekoEl.id = "oneko";
        nekoEl.ariaHidden = true;
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.pointerEvents = "auto";
        nekoEl.style.cursor = "pointer";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
        nekoEl.style.zIndex = 2147483647;

        nekoEl.addEventListener("click", nextBreed);

        document.body.appendChild(nekoEl);
        // Hide when the tab or browser window loses focus.
        document.addEventListener("visibilitychange", updateVisibility);

        window.addEventListener("blur", () => {
            windowFocused = false;
            updateVisibility();
        });

        window.addEventListener("focus", () => {
            windowFocused = true;
            updateVisibility();
        });

        // Hide when the cursor leaves the webpage.
        document.documentElement.addEventListener("mouseleave", () => {
            pointerInside = false;
            updateVisibility();
        });

        document.documentElement.addEventListener("mouseenter", () => {
            pointerInside = true;
            updateVisibility();
        });

        updateVisibility();
        document.addEventListener("mousemove", function (event) {

            mousePosX = event.clientX;
            mousePosY = event.clientY;
            idleTime = 0;
        });

        // Global switcher and state UI controls
        window.oneko = {
            breeds: breedNames.slice(),
            get current() {
                return currentBreed;
            },
            get hidden() {
                return isHidden;
            },
            setBreed: (name) => applyBreed(name),
            nextBreed,
            hide,
            show,
            toggle,
            setPosition,
            zones
        };
        // keep the cat on screen after a resize
        window.addEventListener("resize", () => {
            nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
            nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
            nekoEl.style.left = `${nekoPosX - 16}px`;
            nekoEl.style.top = `${nekoPosY - 16}px`;
        });
        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    function onAnimationFrame(timestamp) {

        if (!nekoEl.isConnected) {
            return;
        }
        if (!lastFrameTimestamp) {
            lastFrameTimestamp = timestamp;
        }
        if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp;
            if (!isHidden && !isAutoHidden) {
                frame();
            }
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    function setSprite(name, frame) {
        const frames = currentSpriteSets[name];
        if (!frames) return;
        const sprite = frames[frame % frames.length];
        const step = 32 + currentGap;
        nekoEl.style.backgroundPosition = `${sprite[0] * step}px ${sprite[1] * step}px`;
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    function idle() {
        idleTime += 1;

        if (
            idleTime > 10 &&
            Math.floor(Math.random() * 200) == 0 &&
            idleAnimation == null
        ) {
            let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
            if (nekoPosX < 32) {
                avalibleIdleAnimations.push("scratchWallW");
            }
            if (nekoPosY < 32) {
                avalibleIdleAnimations.push("scratchWallN");
            }
            if (nekoPosX > window.innerWidth - 32) {
                avalibleIdleAnimations.push("scratchWallE");
            }
            if (nekoPosY > window.innerHeight - 32) {
                avalibleIdleAnimations.push("scratchWallS");
            }
            idleAnimation =
                avalibleIdleAnimations[
                Math.floor(Math.random() * avalibleIdleAnimations.length)
                ];
        }

        switch (idleAnimation) {
            case "sleeping":
                if (idleAnimationFrame < 8) {
                    setSprite("tired", 0);
                    break;
                }
                setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) {
                    resetIdleAnimation();
                }
                break;
            case "scratchWallN":
            case "scratchWallS":
            case "scratchWallE":
            case "scratchWallW":
            case "scratchSelf":
                setSprite(idleAnimation, idleAnimationFrame);
                if (idleAnimationFrame > 9) {
                    resetIdleAnimation();
                }
                break;
            default:
                setSprite("idle", 0);
                return;
        }
        idleAnimationFrame += 1;
    }
    // adding an axis-aligned bounding box to keep cat out of certain elements
    // basically clamp the cat so once cursor goes out of bounds the cat stays inside the frame's max dimensions

    const KEEP_OUT = "#dock-bar, #dock.is-open, .ns-status, #gov-cookie";
    const MARGIN = 32; // a little breathing space
    // current rects, padded; hidden elements have 0 size and are skipped
    const onScreen = (v, max) => Math.min(Math.max(16, v), max - 16);
    // overlapping boxes become one, so pushing out of one never lands inside another
    function merge(list) {
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const p = list[i];
                const q = list[j];
                if (p.l < q.r && q.l < p.r && p.t < q.b && q.t < p.b) {
                    list[i] = { l: Math.min(p.l, q.l), t: Math.min(p.t, q.t), r: Math.max(p.r, q.r), b: Math.max(p.b, q.b) };
                    list.splice(j, 1);
                    i = -1; // rescan: the new box may overlap others
                    break;
                }
            }
        }
        return list;
    }
    function zones() {
        return merge(
            [...document.querySelectorAll(KEEP_OUT)]
                .map((el) => el.getBoundingClientRect())
                .filter((r) => r.width > 0 && r.height > 0)
                .map((r) => ({ l: r.left - MARGIN, t: r.top - MARGIN, r: r.right + MARGIN, b: r.bottom + MARGIN }))
        );
    }
    // this is to move a point out of one zone through its nearest edge that is ON SCREEN
    // z is zone, x and y are co-ordinates
    function pushOut(x, y, z) {
        // check if x is left of l (left) or right of r (right), or y is above t (top) or below b (bottom)
        if (x <= z.l || x >= z.r || y <= z.t || y >= z.b) return [x, y]; // already outside

        const maxX = innerWidth - 16;
        const maxY = innerHeight - 16;
        // measure distances and drop exits that land off-screen.
        // [distance, newX, newY]
        const options = [
            [x - z.l, z.l, y],
            [z.r - x, z.r, y],
            [y - z.t, x, z.t],
            [z.b - y, x, z.b],
        ].filter(([, px, py]) => px >= 16 && px <= maxX && py >= 16 && py <= maxY);

        if (!options.length) return [x, y];
        options.sort((a, b) => a[0] - b[0]); // give the smallest distance
        return [options[0][1], options[0][2]];


    }
    // run pushOut() for each zone
    // zs is a list from zones()

    function clampOut(x, y, zs) {
        // loop over zones and run pushOut for each
        for (const z of zs) [x, y] = pushOut(x, y, z);
        return [x, y];
    }

    // temporary: draw the boxes the cat avoids (delete when done)
    const dbg = [];
    function drawDebug(rects) {
        while (dbg.length < rects.length) {
            const d = document.createElement("div");
            d.style.cssText = "position:fixed;pointer-events:none;z-index:2147483646;background:#f003;border:1px solid red";
            document.body.appendChild(d);
            dbg.push(d);
        }
        dbg.forEach((d, i) => {
            const z = rects[i];
            d.style.display = z ? "block" : "none";
            if (z) Object.assign(d.style, { left: z.l + "px", top: z.t + "px", width: z.r - z.l + "px", height: z.b - z.t + "px" });
        });
    }
    function frame() {
        frameCount += 1;
        const zs = zones();
        // drawDebug(zs)
        // dock may be open under an idle cat so nudge it out first
        // Smoothly escape an obstacle that appeared under the cat.
        const inside = zs.find(
            z =>
                nekoPosX > z.l &&
                nekoPosX < z.r &&
                nekoPosY > z.t &&
                nekoPosY < z.b
        );

        if (inside) {
            const targetY = inside.t;
            nekoPosY = Math.max(targetY, nekoPosY - nekoSpeed);

            setSprite("N", frameCount);
            nekoEl.style.top = `${nekoPosY - 16}px`;
            return;
        }
        // chase the nearest allowed point, not the mouse itself

        const [tx, ty] = clampOut(mousePosX, mousePosY, zs);
        const diffX = nekoPosX - tx;
        const diffY = nekoPosY - ty;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < nekoSpeed || distance < 48) {
            idle();
            return;
        }

        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite("alert", 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let direction;
        direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        setSprite(direction, frameCount);

        // step toward the target
        const prevX = nekoPosX;
        const prevY = nekoPosY;
        let x = onScreen(prevX - (diffX / distance) * nekoSpeed, innerWidth);
        let y = onScreen(prevY - (diffY / distance) * nekoSpeed, innerHeight);

        // blocked by a zone: run along its wall at full speed, not at the leftover speed
        const [cx, cy] = clampOut(x, y, zs);
        if (cx !== x && cy === y) {
            // vertical wall: run up or down it (if the target is level, pick the roomier way)
            const dir = Math.sign(ty - prevY) || (prevY > innerHeight / 2 ? -1 : 1);
            x = cx;
            y = onScreen(prevY + dir * nekoSpeed, innerHeight);
        } else if (cy !== y && cx === x) {
            // horizontal wall: run left or right along it
            const dir = Math.sign(tx - prevX) || (prevX > innerWidth / 2 ? -1 : 1);
            x = onScreen(prevX + dir * nekoSpeed, innerWidth);
            y = cy;
        }

        // final guard: never end a step inside a zone
        [nekoPosX, nekoPosY] = clampOut(x, y, zs);

        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();