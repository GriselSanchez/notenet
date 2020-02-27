import {
    textContainer
} from './textCont.js'

export const toolbar = document.getElementById("toolbar");

document.getElementById("getImageFromFiles").addEventListener("change", getImageFromFiles);
document.getElementById("print").addEventListener("click", print);

for (let i of toolbar.children) {
    if (i.matches("select")) i.addEventListener("change", () => format(i, i[i.selectedIndex].value));

    if (i.matches("button")) i.addEventListener("click", () => format(i));

    if (i.matches(".color-picker")) {
        const input = i.querySelector("input");
        input.addEventListener("change", () => format(input, input.value));
    }

    if (i.matches(".new-input")) {
        const toggleButton = i.querySelector("button");
        toggleButton.addEventListener("click", () => toggle(toggleButton, true));

        const addButton = i.querySelector("div").querySelector("button");
        addButton.addEventListener("click", () => add(addButton));
    }
}

function format(e, value = "null") {
    const action = e.dataset.action;
    if (action === "fontSize") textContainer.style.fontSize = value;
    else document.execCommand(action, false, value);
}

function toggle(e, on) {
    on
        ?
        (e.nextElementSibling.style.display = "flex") :
        (e.style.display = "none");
}

function add(e) {
    const container = e.parentElement;
    let url = container.children[0].value;
    let text = container.children[1].value;

    if (container.className === "add-url") getLink(url, text);

    if (container.className === "add-image") getImage(url, text);

    toggle(container, false);

    url = "";
    text = "";
}

function getImage(url, text) {
    const captionElement = document.createElement("figcaption");
    const imgElement = document.createElement("img");

    imgElement.setAttribute("src", url);
    captionElement.innerText = text;

    textContainer.insertAdjacentElement("beforeend", imgElement);
    imgElement.insertAdjacentElement("afterend", captionElement);
}

function getImageFromFiles() {
    let file = this.files[0];
    let reader = new FileReader();
    let dataURI;

    reader.addEventListener("load", function () {
        dataURI = reader.result;
        const img = document.createElement("img");
        img.src = dataURI;
        textContainer.appendChild(img);
    });

    if (file) reader.readAsDataURL(file);
}

function getLink(url, text) {
    const linkElement = document.createElement("a");

    linkElement.setAttribute("href", url);
    linkElement.setAttribute("contentEditable", "false");
    linkElement.innerText = text;

    textContainer.insertAdjacentElement("beforeend", linkElement);
}

function print() {
    /*    no funciona el page break
     for (let i of textContainer.children) i.classList.add("page-break"); */
    window.print();
}