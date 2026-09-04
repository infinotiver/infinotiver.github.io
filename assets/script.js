document.addEventListener('DOMContentLoaded', () => {
    const name = document.querySelector('.hero-name');
    const socialLinks = document.querySelectorAll('.social-links a');

    if (name && socialLinks.length) {
        const original = name.textContent;
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
            link.addEventListener('mouseenter', () => swapTo(link.dataset.name || original));
            link.addEventListener('mouseleave', () => swapTo(original));
        });
    }

    updateBuildInfo();
});

async function updateBuildInfo() {
    try {
        const res = await fetch('https://api.github.com/repos/infinotiver/infinotiver.github.io/commits?per_page=1');
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const [commit] = await res.json();
        const sha = commit?.sha.substring(0, 7);
        const date = commit?.commit.author.date;
        const localDate = date ? new Date(date).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        }) : null;

        const commitEl = document.getElementById('last-commit');
        const updateEl = document.getElementById('last-update');
        if (commitEl) commitEl.textContent = sha || 'N/A';
        if (updateEl) updateEl.textContent = localDate || 'N/A';
    } catch (err) {
        console.error('Error fetching GitHub data:', err);
    }
}

(() => {
    const hue = Math.floor(Math.random() * 360);
    document.documentElement.style.setProperty('--bg', `hsl(${hue}, 8%, 6%)`);
})();