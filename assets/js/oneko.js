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

    // Configurable spawn position (Supports script tag dataset attributes or defaults to bottom-right)
    // spawn bottom-left; the dock lives bottom-right
    let nekoPosX = scriptEl?.dataset.x ? parseInt(scriptEl.dataset.x, 10) : 32;
    let nekoPosY = scriptEl?.dataset.y ? parseInt(scriptEl.dataset.y, 10) : window.innerHeight - 32;

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
    let isHidden = false;

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
        nekoEl.style.display = "none";
    }

    function show() {
        isHidden = false;
        nekoEl.style.display = "block";
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

        document.addEventListener("mousemove", function (event) {
            // over the dock the target stays at its last spot, so it never parks on the controls
            if (event.target.closest?.("#dock, #dock-bar")) return;

            mousePosX = event.clientX;
            mousePosY = event.clientY;
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
        };

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
            if (!isHidden) {
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

    function frame() {
        frameCount += 1;
        const diffX = nekoPosX - mousePosX;
        const diffY = nekoPosY - mousePosY;
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

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();