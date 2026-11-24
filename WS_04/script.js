const canvas = document.querySelector("#signal-canvas");
const context = canvas.getContext("2d");
let lines = [];

function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lines = Array.from({ length: 16 }, (_, index) => ({
        x: (index + 1) * (canvas.width / 17),
        offset: Math.random() * 200
    }));
}

function drawSignal(time) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#151515";
    context.lineWidth = 0.6;

    lines.forEach((line, index) => {
        context.beginPath();
        for (let y = 0; y < canvas.height; y += 12) {
            const wave = Math.sin(y * 0.018 + time * 0.00025 + line.offset) * (12 + index * 0.5);
            const x = line.x + wave;
            if (y === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }
        context.stroke();
    });

    requestAnimationFrame(drawSignal);
}

window.addEventListener("resize", sizeCanvas);
sizeCanvas();
requestAnimationFrame(drawSignal);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const tracks = [...document.querySelectorAll("audio")];
const playerBar = document.querySelector(".player-bar");
const playerToggle = document.querySelector(".player-toggle");
const playerName = document.querySelector(".player-name strong");
const playerTime = document.querySelector(".player-time");
const playerProgress = document.querySelector(".player-progress span");
let activeTrack = null;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function setRecordState(trackId, playing) {
    const record = document.querySelector(`#${trackId}`);
    if (record) record.classList.toggle("playing", playing);
    document.querySelectorAll(`[data-track="${trackId}"]`).forEach((control) => {
        control.classList.toggle("is-playing", playing);
    });
}

function pauseOthers(current) {
    tracks.forEach((track) => {
        if (track !== current) {
            track.pause();
            setRecordState(track.closest(".record").id, false);
        }
    });
}

function toggleTrack(trackId) {
    const record = document.querySelector(`#${trackId}`);
    if (!record) return;
    const audio = record.querySelector("audio");
    const title = record.querySelector("h3").textContent;

    if (audio.paused) {
        pauseOthers(audio);
        activeTrack = audio;
        audio.play().catch(() => {});
        setRecordState(trackId, true);
        playerName.textContent = title;
        playerBar.classList.add("active");
        playerToggle.classList.add("is-playing");
    } else {
        audio.pause();
        setRecordState(trackId, false);
        playerToggle.classList.remove("is-playing");
    }
}

document.querySelectorAll("[data-track]").forEach((control) => {
    control.addEventListener("click", () => toggleTrack(control.dataset.track));
});

playerToggle.addEventListener("click", () => {
    if (!activeTrack) return;
    if (activeTrack.paused) {
        activeTrack.play().catch(() => {});
        playerToggle.classList.add("is-playing");
        setRecordState(activeTrack.closest(".record").id, true);
    } else {
        activeTrack.pause();
        playerToggle.classList.remove("is-playing");
        setRecordState(activeTrack.closest(".record").id, false);
    }
});

tracks.forEach((audio) => {
    audio.addEventListener("timeupdate", () => {
        if (audio !== activeTrack) return;
        const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        playerProgress.style.width = `${progress}%`;
        playerTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
        setRecordState(audio.closest(".record").id, false);
        playerToggle.classList.remove("is-playing");
        playerProgress.style.width = "0%";
    });
});

const menuToggle = document.querySelector(".menu-toggle");

menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    document.body.classList.toggle("menu-open", !open);
});
