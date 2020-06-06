import { closeJournal } from './journal.js';

import { textContainer } from './textCont.js';

import { openModal, closeModal } from './animations.js';

export function createButton(type) {
  let button = document.createElement('button');
  button.setAttribute('data-type', type);
  addIcon(button);
  return button;
}

export function buttonHandler(button, journal) {
  openModal();
  const type = button.dataset.type;
  const data = {
    html: journal.html,
    id: button.parentElement.parentElement.dataset.id,
  };
  const json = JSON.stringify(data);
  const request = new XMLHttpRequest();
  const url = '/journal/' + type;

  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
      if (type === 'favorite') favoriteButtonHandler(button);
      if (type === 'edit') editButtonHandler(request);
      if (type === 'more' || button.dataset.type === 'less')
        showMoreButtonHandler(button);
    }
  };

  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(json);
}

export function getJournalEntryButtons(j, color) {
  let buttons = document.createElement('div');
  buttons.classList.add('interface-buttons');

  let deleteButton = createButton('delete');
  deleteButton.addEventListener('click', () => {
    buttonHandler(deleteButton, j);
    window.location = '/';
  });

  deleteButton.style.backgroundColor = color;

  let favoriteButton = createButton('favorite');
  if (j.isFavorite) favoriteButton.style.color = 'var(--accent-color)';
  favoriteButton.addEventListener('click', () => {
    buttonHandler(favoriteButton, j);
  });

  favoriteButton.style.backgroundColor = color;

  let editButton = createButton('edit');
  editButton.addEventListener('click', () => {
    buttonHandler(editButton, j);
  });

  editButton.style.backgroundColor = color;

  buttons.appendChild(editButton);
  buttons.appendChild(favoriteButton);
  buttons.appendChild(deleteButton);

  return buttons;
}

function addIcon(elem) {
  let type = elem.dataset.type;
  let icon = document.createElement('span');
  icon.classList.add('glyphicon');

  if (type == 'delete') icon.classList.add('glyphicon-trash');
  if (type == 'favorite') icon.classList.add('glyphicon-heart');
  if (type == 'edit') icon.classList.add('glyphicon-pencil');
  if (type == 'more') icon.classList.add('glyphicon-plus');
  if (type == 'less') icon.classList.add('glyphicon-minus');

  elem.appendChild(icon);
}

function favoriteButtonHandler(favoriteButton) {
  if (favoriteButton.style.color === 'var(--accent-color)')
    favoriteButton.style.color = 'black';
  else favoriteButton.style.color = 'var(--accent-color)';
  closeModal();
}

function showMoreButtonHandler(button) {
  let showMoreDiv = button.parentElement.parentElement.querySelector(
    '#show-more'
  );

  if (showMoreDiv.style.display == 'none') {
    showMoreDiv.style.display = 'block';
    button.innerHTML = '';
    button.setAttribute('data-type', 'less');
  } else {
    showMoreDiv.style.display = 'none';
    button.innerHTML = '';
    button.setAttribute('data-type', 'more');
  }

  addIcon(button);
  closeModal();
}

function editButtonHandler(request) {
  let journalData = JSON.parse(request.responseText);
  textContainer.innerHTML = '';

  let newTextContainer = document.createElement('div');
  newTextContainer.innerHTML = journalData.html;

  for (let i of newTextContainer.children)
    textContainer.insertAdjacentElement('beforeend', i);

  textContainer.setAttribute('data-id', journalData._id);
  textContainer.classList.add('edit-mode');

  closeJournal();
  closeModal();
}
