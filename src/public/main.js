import './toolbar.js'
import './sidebar.js'
import './buttons.js'
import './forms.js'
import './journal.js'

export const textContainer = document.getElementById("text-container");

export function setMode() {
    let darkMode = document.getElementById("myCheck");

    if (darkMode.checked) {
        document.documentElement.style.setProperty("--bg-color", "#000000f2");
        document.documentElement.style.setProperty("--font-color", "white");
    } else {
        document.documentElement.style.setProperty("--bg-color", "white");
        document.documentElement.style.setProperty("--font-color", "black");
    }
}

export function cleanContainer() {
    const textContainerCopy = document.createElement("div");

    for (let i of textContainer.children) {
        let childClone = i.cloneNode(true);
        textContainerCopy.insertAdjacentElement("beforeend", childClone);
    }

    const mainDiv = textContainerCopy.querySelector("h1").parentElement;
    if (mainDiv.parentElement) mainDiv.outerHTML = mainDiv.innerHTML;

    if (textContainerCopy.querySelector("textarea")) textContainerCopy.querySelector("textarea").remove();

    for (const i of textContainerCopy.children) {
        if (i.matches(".has-placeholder")) {
            i.removeAttribute("placeholder");
            i.classList.remove("has-placeholder");
            i.removeAttribute("contenteditable");
        }
    }

    return textContainerCopy;
}

export function savedAnimation() {
    document.getElementById("saved").style.display = "block";
    document.getElementById("saved").style.animationPlayState = "running";

    setTimeout(function () {
        document.getElementById("saved").style.animationPlayState = "paused";
        document.getElementById("saved").style.display = "none";
    }, 3000);
}