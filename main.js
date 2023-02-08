import {
  getRandomRgbStr,
  hexToRgbStr,
  rgbStrToFullHex,
  setElementsBgColor,
  shadeRgbStrByFactor,
} from "./utilities.js";

const bodyBackgroundColor = "rgb(230, 230, 230)";
const maxGridSize = 64;
const minGridSize = 2;

let currentGridBackgroundColor = bodyBackgroundColor;
let currentGridSize = 16;
let currentPaintColor = "rgb(75, 75, 75)";
let gridLinesVisible = true;
let leftMouseBtnDown = false;
let rainbowModeEnabled = false;
let shadeModeEnabled = false;

const body = document.body;
const currentYear = document.querySelector("#current-year");
const eraseBtn = document.querySelector("#erase");
const eraseGridBtn = document.querySelector("#erase-grid");
const grid = document.querySelector("#grid");
const gridColorPicker = document.querySelector("#grid-color-picker");
const gridSizePicker = document.querySelector("#grid-sizer");
const gridSizeValue = document.querySelector("#current-grid-size");
const paintColorPicker = document.querySelector("#paint-color-picker");
const toggleGridlinesBtn = document.querySelector("#toggle-gridlines");
const toggleRainbowModeBtn = document.querySelector("#toggle-rainbow-mode");
const toggleShadeModeBtn = document.querySelector("#toggle-shade-mode");

eraseBtn.onclick = () => setPaintColorToErase();
eraseGridBtn.onclick = () => eraseFullGrid();
gridColorPicker.oninput = (event) => setFullGridColor(event);
gridSizePicker.oninput = (event) => setGridSize(event);
paintColorPicker.oninput = (event) => setPaintColorFromPicker(event);
toggleGridlinesBtn.onclick = () => toggleGridLines();
toggleRainbowModeBtn.onclick = () => toggleRainbowMode("toggle");
toggleShadeModeBtn.onclick = () => toggleShadeMode("toggle");
window.onmousedown = () => (leftMouseBtnDown = true);
window.onmouseup = () => (leftMouseBtnDown = false);
window.onload = () => initializeAppState();

function disableElements(elementsArr) {
  elementsArr.forEach((element) => (element.disabled = true));
}

function enableElements(elementsArr) {
  elementsArr.forEach((element) => (element.disabled = false));
}
function eraseFullGrid() {
  setElementsBgColor(getAllGridSquares(), hexToRgbStr(gridColorPicker.value));
}

function getAllGridSquares() {
  const gridSquares = document.querySelectorAll(".grid-item");
  return [...gridSquares];
}

function generateGrid(size) {
  for (let row = 0; row < size; row++) {
    // generate rows based on the current grid size
    let newRow = document.createElement("div");
    newRow.classList.add("grid-row");
    grid.appendChild(newRow);
    for (let col = 0; col < size; col++) {
      let newGridSquare = document.createElement("div");
      newGridSquare.classList.add("grid-item");
      newGridSquare.style.backgroundColor = hexToRgbStr(gridColorPicker.value);
      newGridSquare.addEventListener("mousedown", paintSquare);
      newGridSquare.addEventListener("mouseover", paintSquare);
      newRow.appendChild(newGridSquare);
    }
  }
}

function initializeAppState() {
  body.style.backgroundColor = bodyBackgroundColor;
  gridColorPicker.value = rgbStrToFullHex(currentGridBackgroundColor);
  paintColorPicker.value = rgbStrToFullHex(currentPaintColor);
  gridSizePicker.max = maxGridSize;
  gridSizePicker.min = minGridSize;
  gridSizePicker.value = currentGridSize;
  currentYear.innerText = " " + new Date().getFullYear();
  generateGrid(currentGridSize);
  setGridSizeDisplay(currentGridSize);
}

function paintSquare(event) {
  if (event.type === "mousedown" || leftMouseBtnDown) {
    if (shadeModeEnabled) {
      const currentSquareBgColor = this.style.backgroundColor;
      currentPaintColor = shadeRgbStrByFactor(currentSquareBgColor, 0.9);
    } else if (rainbowModeEnabled) {
      currentPaintColor = getRandomRgbStr();
    } else {
      currentPaintColor = hexToRgbStr(paintColorPicker.value);
    }

    this.style.backgroundColor = currentPaintColor;
  }
}

function setFullGridColor(event) {
  currentGridBackgroundColor = event.target.value;
  setElementsBgColor(
    getAllGridSquares(),
    hexToRgbStr(currentGridBackgroundColor)
  );
}

function setGridSize(event) {
  currentGridSize = event.target.value;
  grid.replaceChildren();
  generateGrid(currentGridSize);
  setGridSizeDisplay(currentGridSize);
}

function setGridSizeDisplay(size) {
  const display = `${size} x ${size}`;
  gridSizeValue.innerText = display;
}

function setPaintColorFromPicker(event) {
  currentPaintColor = hexToRgbStr(event.target.value);
  toggleRainbowMode("off");
}

function setPaintColorToErase() {
  currentPaintColor = hexToRgbStr(gridColorPicker.value);
  paintColorPicker.value = rgbStrToFullHex(currentPaintColor);
  toggleRainbowMode("off");
}

function toggleGridLines() {
  const gridSquares = getAllGridSquares(); //
  if (gridLinesVisible) {
    gridSquares.forEach((square) => square.classList.add("borderless"));
    gridLinesVisible = false;
  } else {
    gridSquares.forEach((square) => {
      square.classList.remove("borderless");
      gridLinesVisible = true;
    });
  }
}

function toggleRainbowMode(stateStr) {
  switch (stateStr) {
    case "on": {
      rainbowModeEnabled = true;
      toggleRainbowModeBtn.classList.add("rainbow-mode-active");
      return;
    }
    case "off": {
      rainbowModeEnabled = false;
      toggleRainbowModeBtn.classList.remove("rainbow-mode-active");
      return;
    }
    case "toggle": {
      toggleRainbowMode(rainbowModeEnabled ? "off" : "on");
      return;
    }
  }
}

function toggleShadeMode(stateStr) {
  const affectedElements = [
    paintColorPicker,
    gridColorPicker,
    eraseBtn,
    toggleRainbowModeBtn,
  ];

  switch (stateStr) {
    case "on": {
      shadeModeEnabled = true;
      toggleShadeModeBtn.classList.add("shade-mode-active");
      disableElements(affectedElements);
      return;
    }
    case "off": {
      shadeModeEnabled = false;
      toggleShadeModeBtn.classList.remove("shade-mode-active");
      enableElements(affectedElements);
      return;
    }
    case "toggle": {
      toggleShadeMode(shadeModeEnabled ? "off" : "on");
      return;
    }
  }
}
