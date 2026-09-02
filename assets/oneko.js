// oneko.js: https://github.com/adryd325/oneko.js
// breeds and sprite layouts from https://github.com/ABSanthosh/neko-ts

(function oneko() {
    const isReducedMotion =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReducedMotion) return;

    const scriptEl = document.currentScript;
    const basePath = scriptEl ? scriptEl.src.replace(/[^/]+$/, "") : "./";

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
    // This is a DIFFERENT grid arrangement from gifSpriteSets as taken from
    // https://github.com/ABSanthosh/neko-ts
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

    let nekoPosX = 32;
    let nekoPosY = 32;

    let mousePosX = 0;
    let mousePosY = 0;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    let currentBreed = breedNames[0];
    let currentGap = breeds[currentBreed].gap;
    let currentSpriteSets = breeds[currentBreed].spriteSets;

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
            mousePosX = event.clientX;
            mousePosY = event.clientY;
        });

        // Lets you build your own switcher UI (dropdown, buttons, etc.)
        window.oneko = {
            breeds: breedNames.slice(),
            get current() {
                return currentBreed;
            },
            setBreed: (name) => applyBreed(name),
            nextBreed,
        };

        window.requestAnimationFrame(onAnimationFrame);
    }

    let lastFrameTimestamp;

    function onAnimationFrame(timestamp) {
        // Stops execution if the neko element is removed from DOM
        if (!nekoEl.isConnected) {
            return;
        }
        if (!lastFrameTimestamp) {
            lastFrameTimestamp = timestamp;
        }
        if (timestamp - lastFrameTimestamp > 100) {
            lastFrameTimestamp = timestamp;
            frame();
        }
        window.requestAnimationFrame(onAnimationFrame);
    }

    function setSprite(name, frame) {
        const frames = currentSpriteSets[name];
        if (!frames) return;
        const sprite = frames[frame % frames.length];
        // cell pitch = sprite size (32px) + gap between cells for this breed
        const step = 32 + currentGap;
        nekoEl.style.backgroundPosition = `${sprite[0] * step}px ${sprite[1] * step}px`;
    }

    function resetIdleAnimation() {
        idleAnimation = null;
        idleAnimationFrame = 0;
    }

    function idle() {
        idleTime += 1;

        // every ~ 20 seconds
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
            // count down after being alerted before moving
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

    // Ensure document.body exists before we try to append to it,
    // in case this script runs from <head> without defer/async.
    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();