import { textContainer } from './textCont.js';

export const toolbar = document.getElementById('toolbar');

document
  .getElementById('getImageFromFiles')
  .addEventListener('change', getImageFromFiles);

document.getElementById('print').addEventListener('click', print);
document.getElementById('draw').addEventListener('click', draw);

const buttonWrappers = document.getElementsByClassName('button-wrapper');
for (let wrapper of buttonWrappers) {
  let buttons = wrapper.children;
  for (let b of buttons) {
    b.addEventListener('click', () => format(b));
  }
}

const colorPicker = document.getElementsByClassName('color-picker');
for (let c of colorPicker) {
  c.querySelector('input').addEventListener('change', (e) =>
    format(e.target, e.target.value)
  );
  c.querySelector('input').addEventListener('keyup', (e) =>
    format(e.target, e.target.value)
  );
}

const newInput = document.getElementsByClassName('new-input');

for (let i of newInput) {
  const toggleButton = i.querySelector('button');
  toggleButton.addEventListener('click', () => toggle(toggleButton, true));

  const addButton = i.querySelector('div').querySelector('button');
  addButton.addEventListener('click', () => add(addButton));
}

const selectMenus = document.getElementsByClassName('select-wrapper');

for (let i of selectMenus) {
  const menu = i.querySelector('select');
  menu.addEventListener('change', () =>
    format(menu, menu[menu.selectedIndex].value)
  );
}

function format(e, value = 'null') {
  const action = e.dataset.action;
  if (action === 'fontSize') textContainer.style.fontSize = value;
  if (action == 'toDo') addToDo();
  else document.execCommand(action, false, value);
}

function addToDo() {
  const container = document.createElement('div');
  container.classList.add('todo-container');
  const newLine = document.createElement('br');
  const checkbox = makeCheckbox();
  const input = makeInputbox();

  textContainer.insertAdjacentElement('beforeend', container);

  container.appendChild(checkbox);
  container.appendChild(input);
  container.appendChild(newLine);

  input.focus();
}

function removeToDo(input) {
  input.parentElement.remove();
}

function makeInputbox() {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.classList.add('to-do');
  input.addEventListener('keydown', (event) => enterHandler(event));
  input.addEventListener('keydown', (event) => backspaceHandler(event));
  return input;
}

function enterHandler(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    addToDo();
  }
}

function backspaceHandler(event) {
  const inputText = event.target.value;
  if (inputText == '' && event.keyCode == 8) {
    removeToDo(event.target);
  }
}

function makeCheckbox() {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('todo-box');
  checkbox.addEventListener('change', () => toDoStateHandler(checkbox));
  return checkbox;
}

function toggle(e, on) {
  on
    ? (e.nextElementSibling.style.display = 'flex')
    : (e.style.display = 'none');
}

function add(e) {
  const container = e.parentElement;
  let url = container.children[0].value;
  let text = container.children[1].value;

  if (container.className === 'add-url') getLink(url, text);

  if (container.className === 'add-image') getImage(url, text);

  if (container.className === 'add-video') getYoutubeFrame(url);

  toggle(container, false);

  container.children[0].value = '';
  container.children[1].value = '';
}

function getYoutubeFrame(url) {
  const frame = document.createElement('iframe');

  //link acortado
  if (url.includes('youtu.be'))
    url = url.replace('youtu.be/', 'www.youtube.com/watch?v=');

  //link normal
  url = url.split('watch?v=');
  url = url[0] + 'embed/' + url[1];

  console.log(url);

  frame.setAttribute('src', url);
  frame.setAttribute('frameborder', '0');
  frame.setAttribute(
    'allow',
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
  );
  frame.setAttribute('allowfullscreen', true);
  textContainer.insertAdjacentElement('beforeend', frame);
}

function getImage(url, text) {
  const captionElement = document.createElement('figcaption');
  const imgElement = document.createElement('img');

  imgElement.setAttribute('src', url);
  captionElement.innerText = text;

  textContainer.insertAdjacentElement('beforeend', imgElement);
  imgElement.insertAdjacentElement('afterend', captionElement);
}

function getImageFromFiles() {
  let file = this.files[0];
  let reader = new FileReader();
  let dataURI;

  reader.addEventListener('load', function () {
    dataURI = reader.result;
    const img = document.createElement('img');
    img.src = dataURI;
    textContainer.appendChild(img);
  });

  if (file) reader.readAsDataURL(file);
}

function getLink(url, text) {
  const linkElement = document.createElement('a');

  linkElement.setAttribute('href', url);
  linkElement.setAttribute('contentEditable', 'false');
  linkElement.innerText = text;

  textContainer.insertAdjacentElement('beforeend', linkElement);
}

function print() {
  /*    no funciona el page break
     for (let i of textContainer.children) i.classList.add("page-break"); */
  window.print();
}

function toDoStateHandler(cb) {
  const cbLabel = cb.nextElementSibling;
  if (cb.checked) cbLabel.classList.add('checked');
  else cbLabel.classList.remove('checked');
}

function draw() {
  document.getElementById('sheet-container').style.display = 'block';

  if (document.getElementsByClassName('canvas').length === 1)
    var canvas = new fabric.Canvas('sheet');
  else canvas = document.getElementsByClassName('canvas-container')[0];
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 2;
  canvas.freeDrawingBrush.color = '#ff0000';

  document.getElementById('save-drawing').onclick = function () {
    getImage(
      document.getElementsByClassName('canvas')[0].toDataURL({ format: 'png' }),
      ''
    );
    exitCanva(canvas);
  };

  document.getElementById('clear-drawing').onclick = function () {
    canvas.clear();
  };

  document.getElementById('brush-color').addEventListener('change', (e) => {
    canvas.freeDrawingBrush.color = e.target.value;
  });

  document.getElementById('brush-width').addEventListener('change', (e) => {
    canvas.freeDrawingBrush.width = e.target.value;
  });

  document.getElementById('close-drawing').onclick = function () {
    exitCanva(canvas);
  };
}
function exitCanva(canvas) {
  document.getElementById('sheet-container').style.display = 'none';
  canvas.clear();
}
