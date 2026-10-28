// hero name swaps to the hovered/focused link's handle
document.addEventListener('DOMContentLoaded', () => {
    const name = document.querySelector('.hero-name');
    const socialLinks = document.querySelectorAll('.social-links a');

    if (name && socialLinks.length) {
        const original = name.textContent;
        const canHover = matchMedia('(hover: hover)').matches; // skip stuck hover on touch
        let swapTimeout;

        const swapTo = (text) => {
            clearTimeout(swapTimeout);
            name.classList.add('is-swapping');
            swapTimeout = setTimeout(() => {
                name.textContent = text;
                name.classList.remove('is-swapping');
            }, 180);
        };

        socialLinks.forEach(link => {
            const on = () => swapTo(link.dataset.name || original);
            const off = () => swapTo(original);
            if (canHover) {
                link.addEventListener('mouseenter', on);
                link.addEventListener('mouseleave', off);
            }
            link.addEventListener('focus', on); // keyboard users
            link.addEventListener('blur', off);
        });
    }

    showBuildInfo();
});

// pov you are smart /jk
// no fetch to api just read from /build.json thats written by gh actions on deployment.
async function showBuildInfo() {
    const commitEl = document.getElementById('last-commit');
    const updateEl = document.getElementById('last-update');
    let sha, date;

    try {
        const res = await fetch('build.json');
        if (res.ok) ({ sha, date } = await res.json());
    } catch {
        // missing locally, show N/A
    }

    if (commitEl) {
        if (sha) {
            const link = document.createElement('a');
            link.href = `https://github.com/infinotiver/infinotiver.github.io/commit/${sha}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = sha;
            commitEl.replaceChildren(link);
        } else {
            commitEl.textContent = 'N/A';
        }
    }
    if (updateEl) updateEl.textContent = date || 'N/A';
}