const logo = document.getElementById('logo');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = scrollHeight - windowHeight;

    const scrollFraction = scrollY / maxScroll; // 0 to 1
    const rotation = scrollFraction * 360; // one full rotation

    logo.style.transform = `rotate(${rotation}deg)`;
});
