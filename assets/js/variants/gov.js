// gov: parody cookie banner
const KEY = "gov-cookies";
let bar;

// storage can throw in private modes, so fail quietly
const seen = () => { try { return sessionStorage.getItem(KEY); } catch { return null; } };
const mark = () => { try { sessionStorage.setItem(KEY, "1"); } catch { } };

export function init() {
    if (bar || seen()) return; // once per visit
    bar = document.createElement("div");
    bar.id = "gov-cookie";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Cookie notice");
    bar.innerHTML =
        `<p><strong>Cookies.</strong> This site uses none, ` +
        `but we are required to ask anyway cuz they are yum!.</p>` +
        `<button type="button">Accept</button>`;
    bar.querySelector("button").addEventListener("click", accept);
    document.body.append(bar);
}

// accepting marks the visit as done, switching variants does not
function accept() {
    mark();
    destroy();
}

export function destroy() {
    bar?.remove();
    bar = null;
}