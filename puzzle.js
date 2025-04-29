var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;

// Detectar si es pantalla táctil
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

window.onload = function () {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.src = "./images/blank.jpg";

      // Funcionalidad de arrastrar
      addTileEventListeners(tile);

      document.getElementById("board").append(tile);
    }
  }

  // Piezas
  let pieces = [];
  for (let i = 1; i <= rows * columns; i++) {
    pieces.push(i.toString());
  }
  pieces.reverse();

  // Mezclar piezas
  for (let i = 0; i < pieces.length; i++) {
    let j = Math.floor(Math.random() * pieces.length);
    let tmp = pieces[i];
    pieces[i] = pieces[j];
    pieces[j] = tmp;
  }

  for (let i = 0; i < pieces.length; i++) {
    let tile = document.createElement("img");
    tile.src = "./images/" + pieces[i] + ".jpg";

    // Funcionalidad de arrastrar
    addTileEventListeners(tile);

    document.getElementById("pieces").append(tile);
  }
};

function addTileEventListeners(tile) {
  if (isTouchDevice) {
    tile.addEventListener("touchstart", handleTouchStart, { passive: true });
    tile.addEventListener("touchmove", handleTouchMove, { passive: true });
    tile.addEventListener("touchend", handleTouchEnd);
  } else {
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("dragenter", dragEnter);
    tile.addEventListener("dragleave", dragLeave);
    tile.addEventListener("drop", dragDrop);
    tile.addEventListener("dragend", dragEnd);
  }
}

// Funciones drag para PC
function dragStart() {
  currTile = this;
}
function dragOver(e) {
  e.preventDefault();
}
function dragEnter(e) {
  e.preventDefault();
}
function dragLeave() {}
function dragDrop() {
  otherTile = this;
}
function dragEnd() {
  if (currTile.src.includes("blank") || !otherTile) {
    currTile = null;
    otherTile = null;
    return;
  }

  let currImg = currTile.src;
  let otherImg = otherTile.src;
  currTile.src = otherImg;
  otherTile.src = currImg;

  turns += 1;
  document.getElementById("turns").innerText = turns;

  checkCompletion();

  currTile = null;
  otherTile = null;
}

// Funciones touch
function handleTouchStart(e) {
  currTile = e.target;
}

function handleTouchMove(e) {
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target && target.tagName === "IMG" && target.parentElement.id === "board") {
    otherTile = target;
  }
}

function handleTouchEnd(e) {
  if (!currTile || !otherTile || currTile === otherTile || currTile.src.includes("blank")) {
    currTile = null;
    otherTile = null;
    return;
  }

  let currImg = currTile.src;
  let otherImg = otherTile.src;
  currTile.src = otherImg;
  otherTile.src = currImg;

  turns += 1;
  document.getElementById("turns").innerText = turns;

  checkCompletion();

  currTile = null;
  otherTile = null;
}

function checkCompletion() {
  const tiles = document.querySelectorAll("#board img");
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].src.includes(i + 1 + ".jpg")) {
      return;
    }
  }

  showFinalImage();
}

function showFinalImage() {
  document.querySelector(".container").classList.add("blur");

  const winScreen = document.createElement("div");
  winScreen.id = "win-screen";

  const finalImage = document.createElement("img");
  finalImage.src = "./images/26.jpg";

  const retryButton = document.createElement("button");
  retryButton.innerText = "Reintentar";
  retryButton.addEventListener("click", function () {
    location.reload();
  });

  const movesText = document.createElement("span");
  movesText.classList.add("moves-text");
  movesText.innerText = "Movimientos: " + turns;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  buttonContainer.appendChild(movesText);
  buttonContainer.appendChild(retryButton);

  winScreen.appendChild(finalImage);
  winScreen.appendChild(buttonContainer);

  document.body.appendChild(winScreen);

  setTimeout(() => {
    finalImage.style.width = "70%";
  }, 50);

  const audio = new Audio("./sounds/success.m4a");
  audio.volume = 0.3;
  audio.play();
}
