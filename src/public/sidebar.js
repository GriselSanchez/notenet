import {
    cleanContainer,
    savedAnimation,
    textContainer,
    setMode
} from './main.js';

import {
    setJournalType
} from './journal.js'

import {
    toggleSignClass
} from "./forms.js"

export const sidebar = document.getElementById("sidebar");

const actions = {
    newEntry,
    saveEntry,
    all: setJournalType,
    favorites: setJournalType,
    setMode,
    signIn: toggleSignClass,
    signOut
}

for (let i of sidebar.children) {
    if (i.matches("#sign") || i.matches("#tools")) {
        for (let j of i.children) addListenerFromAction(j);
    }

    if (i.matches("#dark-mode")) {
        i = i.querySelector("label").querySelector("input");
        addListenerFromAction(i);
    }
}

function addListenerFromAction(e) {
    e.addEventListener("click", () => {
        let action = e.dataset.action;
        if (action in actions)
            actions[action].apply(e);
    });
}

function newEntry() {
    if (window.confirm("Unsaved progress will be lost. Are you sure?"))
        location.reload();
}

function saveEntry() {
    if (!document.cookie) window.alert("Please sign in first.");

    else if (textContainer.querySelector("h1").innerHTML === "")
        window.alert("Entry must have a title.");

    else {
        const textContainerCopy = cleanContainer();
        let data = {
            title: textContainerCopy.querySelector("h1").innerHTML,
            html: textContainerCopy.outerHTML
        };
        let type = "save";

        if (textContainer.classList.contains("edit-mode")) {
            type = "edit";
            data = editMode(data);
        }

        const json = JSON.stringify(data);
        const url = "/journal" + "/" + type;
        const request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(json);

        savedAnimation();
    }
}

function editMode(data) {
    const id = textContainer.dataset.id;
    data.id = id;

    textContainer.classList.remove("edit-mode");
    textContainer.dataset.id = "";

    return data;
}

function signOut() {
    window.location = "/user/loggout";
}