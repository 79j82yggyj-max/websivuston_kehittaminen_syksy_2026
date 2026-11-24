const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-list");

menuToggle.addEventListener("click", function () {
    const isOpen = navList.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

const backgroundSong = document.querySelector("#background-song");
const musicButton = document.querySelector(".music-button");
const volumeSlider = document.querySelector("#volume");
const volumeValue = document.querySelector(".volume-value");

backgroundSong.volume = 0.25;

backgroundSong.play().then(function () {
    musicButton.textContent = "❚❚ Pause music";
    musicButton.setAttribute("aria-label", "Pause background music");
}).catch(function () {
    musicButton.textContent = "▶ Play music";
    musicButton.setAttribute("aria-label", "Play background music");
});

musicButton.addEventListener("click", function () {
    if (backgroundSong.paused) {
        backgroundSong.play().then(function () {
            musicButton.textContent = "❚❚ Pause music";
            musicButton.setAttribute("aria-label", "Pause background music");
        }).catch(function () {
            musicButton.textContent = "▶ Play music";
        });
    } else {
        backgroundSong.pause();
        musicButton.textContent = "▶ Play music";
        musicButton.setAttribute("aria-label", "Play background music");
    }
});

volumeSlider.addEventListener("input", function () {
    backgroundSong.volume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + "%";
});
