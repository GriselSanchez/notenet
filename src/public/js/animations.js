const loader = document.getElementsByClassName("loader")[0];
const saved = document.getElementById("saved");
const darkMode = document.getElementById("myCheck");

export function setMode() {
    if (darkMode.checked) {
        document.documentElement.style.setProperty("--bg-color", "#000000f2");
        document.documentElement.style.setProperty("--font-color", "white");
    } else {
        document.documentElement.style.setProperty("--bg-color", "white");
        document.documentElement.style.setProperty("--font-color", "black");
    }
}

export function savedAnimation() {
    saved.style.display = "block";
    saved.style.animationPlayState = "running";

    setTimeout(function () {
        saved.style.animationPlayState = "paused";
        saved.style.display = "none";
    }, 3000);
}

export function openModal() {
    loader.style.display = "inline-block";
}

export function closeModal() {
    loader.style.display = "none";
}