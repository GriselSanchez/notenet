import {
    getJournalEntryButtons,
    createButton,
    buttonHandler
} from "./buttons.js";

import {
    toolbar
} from "./toolbar.js";

import {
    sidebar
} from "./sidebar.js";

import {
    textContainer
} from './textCont.js'

import {
    openModal,
    closeModal
} from './animations.js'

const journal = document.getElementById("journal");

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
previousButton.addEventListener("click", () => changePage(previousButton));
nextButton.addEventListener("click", () => changePage(nextButton));

//no funciona con input en heroku (duplica entradas) pero si localmente
const searchbar = document.getElementById("search-bar").querySelector("input");
searchbar.addEventListener("change", search);

let currentPage = 1;
let productCount = 0;
let resPerPage = 0;
let pageCompleted = false;

export function setJournalType() {
    if (!document.cookie) window.alert("Please sign in first.");
    //arreglar pora cuando expire el token
    else {
        let type = this.dataset.action;
        previousButton.setAttribute("data-type", type);
        nextButton.setAttribute("data-type", type);
        if (journal.classList.contains("active") && type === journal.getAttribute("data-type")) {
            closeJournal();
        } else {
            closeJournal();
            getJournal(type, false);
            this.classList.toggle("active");
        }
    }
}

function getJournal(type, pagination) {
    if (journal.style.display === "flex" && !pagination) closeJournal();
    else {
        if (!pageCompleted) {
            openModal();
            let request = new XMLHttpRequest();
            let url = "/entries/" + type + "/" + currentPage;
            journal.setAttribute("data-type", type);
            journal.classList.add("active");
            request.open("GET", url, true);

            request.onreadystatechange = () => {
                getJournalCallback(request, pagination);
            };
            request.send();
            pageCompleted = true;
        }
    }
}

function getJournalCallback(request, pagination) {
    if (request.readyState == 4 && request.status == 200) {
        let journalData = JSON.parse(request.responseText);
        productCount = journalData.numOfProducts;
        resPerPage = journalData.resPerPage;
        toggleJournal(pagination);
        journalData.foundProducts.forEach(getJournalEntry);
        closeModal();
    }
}

function getJournalEntry(j) {
    let journalItem = document.createElement("div");
    journalItem.classList.add("journal-item");
    journalItem.setAttribute("data-id", j._id);

    let buttons = getJournalEntryButtons(j);

    let htmlContainer = document.createElement("div");
    htmlContainer.innerHTML = j.html;
    let journalElements = [...htmlContainer.firstChild.children];

    let c = 0;
    for (let i of journalElements) {
        journalItem.insertAdjacentElement("beforeend", i);
        c++;
        if (c > 5) {
            enableShowMoreButton(journalElements, journalItem, buttons);
            break;
        }
    }

    journal.querySelector("#entries").appendChild(journalItem);
    journalItem.append(buttons);
}

function enableShowMoreButton(journalElements, div, buttons) {
    let showMoreButton = createButton("more");
    let showMore = document.createElement("div");
    showMore.setAttribute("id", "show-more");
    showMore.style.display = "none";

    for (let i = 5; i < journalElements.length; i++) {
        showMore.insertAdjacentElement("beforeend", journalElements[i]);
    }

    buttons.appendChild(showMoreButton);
    showMoreButton.addEventListener("click", () => {
        buttonHandler(showMoreButton, journalElements);
    });

    div.appendChild(showMore);
}

function toggleJournal(pagination = false) {
    let compStyles = window.getComputedStyle(journal);

    if (
        compStyles.getPropertyValue("display") === "none" ||
        (compStyles.getPropertyValue("display") === "flex" && pagination)
    ) {
        textContainer.style.display = "none";
        toolbar.style.display = "none";
        journal.style.display = "flex";
        getJournalMainButtons();
    }
}

export function closeJournal() {
    textContainer.style.display = "block";
    toolbar.style.display = "flex";
    journal.style.display = "none";
    journal.classList.remove("active");

    resetJournal();
}

function resetJournal() {
    document.getElementById("entries").innerHTML = "";
    sidebar.querySelector("#all").classList.remove("active");
    sidebar.querySelector("#favorites").classList.remove("active");
    pageCompleted = false;
    currentPage = 1;
    productCount = 0;
    resPerPage = 0;
}

export function getJournalMainButtons() {
    nextButton.style.display = "flex";
    previousButton.style.display = "flex";

    if (currentPage == 1) previousButton.style.display = "none";
    if (productCount <= resPerPage * currentPage) nextButton.style.display = "none";
}

function changePage(e) {
    if (e.id === "previous") {
        currentPage--;
        pageCompleted = false;
        journal.querySelector("#entries").innerHTML = "";
    }

    if (e.id === "next") {
        currentPage++;
        pageCompleted = false;
        journal.querySelector("#entries").innerHTML = "";
    }

    getJournal(e.dataset.type, true);
}

function search() {
    resetJournal();
    sidebar.querySelector("#all").classList.add("active");

    if (this.value === "") getJournal("all", true);
    else {
        let request = new XMLHttpRequest();
        let url = "/search/" + this.value;

        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                productCount = JSON.parse(request.responseText).numOfProducts;
                if (productCount === 0) {
                    journal.querySelector("#entries").innerHTML = "<p>No results found</p>";
                } else getJournalCallback(request);
            }
            getJournalMainButtons();
        }

        request.open("GET", url, true);
        request.send();
    }
}