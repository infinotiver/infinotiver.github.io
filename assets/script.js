// script.js


async function updateBuildInfo() {
    try {
        const response = await fetch('https://api.github.com/repos/infinotiver/infinotiver.github.io/commits');
        const commits = await response.json();

        const lastCommit = commits[0]?.sha.substring(0, 7);
        const lastUpdate = commits[0]?.commit.author.date

        document.getElementById('last-commit').textContent = lastCommit || 'N/A';
        document.getElementById('last-update').textContent = lastUpdate || 'N/A';
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

updateBuildInfo();

const text = "1nf1n0t1v3r";
const container = document.getElementById('typewriter');
let index = 0;

function type() {
    if (index < text.length) {
        container.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);  // typing speed in ms
    } else {
        container.style.borderRight = "none"; // hide cursor after done
    }
}

type();
