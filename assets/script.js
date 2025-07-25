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
