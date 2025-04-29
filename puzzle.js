var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

window.onload = function () {
  adjustViewportHeight();

  window.addEventListener('resize', adjustViewportHeight);
  window.addEventListener('orientationchange', adjustViewportHeight);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.src = "./images/blank.jpg";
      addTileEventListeners(tile);
      document.getElementById("board").append(tile);
    }
  }

  let pieces = [];
  for (let i = 1; i <= rows * columns; i++) {
    pieces.push(i.toString());
  }
  pieces.reverse();

  for (let i = 0; i < pieces.length; i++) {
    let j = Math.floor(Math.random() * pieces.length);
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  for (let i = 0; i < pieces.length; i++) {
    let tile = document.createElement("img");
    tile.src = "./images/" + pieces[i] + ".jpg";
    addTileEventListeners(tile);
    document.getElementById("pieces").append(tile);
  }

  // Previene el zoom con doble toque en iOS
  document.body.addEventListener("touchstart", function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
};

function adjustViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

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

// PC
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
  if (currTile?.src.includes("blank") || !otherTile) {
    currTile = null;
    otherTile = null;
    return;
  }

  swapImages();
  checkCompletion();
  currTile = null;
  otherTile = null;
}

// Touch
function handleTouchStart(e) {
  currTile = e.target;
}
function handleTouchMove(e) {
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (
    target &&
    target.tagName === "IMG" &&
    target.parentElement?.id === "board"
  ) {
    otherTile = target;
  }
}
function handleTouchEnd(e) {
  if (
    !currTile ||
    !otherTile ||
    currTile === otherTile ||
    currTile.src.includes("blank")
  ) {
    currTile = null;
    otherTile = null;
    return;
  }

  swapImages();
  checkCompletion();
  currTile = null;
  otherTile = null;
}

// Swap
function swapImages() {
  const tempSrc = currTile.src;
  currTile.src = otherTile.src;
  otherTile.src = tempSrc;

  turns += 1;
  document.getElementById("turns").innerText = turns;
}

// Completado
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
