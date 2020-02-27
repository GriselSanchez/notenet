export const textContainer = document.getElementById("text-container");

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