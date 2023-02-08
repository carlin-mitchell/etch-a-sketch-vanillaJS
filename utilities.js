//######################### EXPORTED UTILS ###########################
export function hexToRgbStr(hex) {
  if (hex.length === 4) {
    hex = shortHexToFullHex(hex);
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return getRgbStrFromValues(r, g, b);
}

export function getRgbStrFromValues(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomRgbStr() {
  const [randRed, randGreen, randBlue] = Array(3)
    .fill()
    .map((elem) => getRandInt(0, 256));
  return getRgbStrFromValues(randRed, randGreen, randBlue);
}

export function getValuesFromRgbStr(rgbStr) {
  const [r, g, b] = rgbStr.match(/\d{1,3}/g);
  return { r: +r, g: +g, b: +b };
}

export function rgbStrToFullHex(rgbStr) {
  const { r, g, b } = getValuesFromRgbStr(rgbStr);
  return `#${valueToPaddedHex(r)}${valueToPaddedHex(g)}${valueToPaddedHex(b)}`;
}

/**
 *Takes a single dom element or array of elements
 *and applies the specified background color to them
 *
 * @param {object} elementsArr a single element or array of elements
 * @param {string} rgbColorStr an rgb string formatted as: 'rgb(99, 255, 1)'
 * */
export function setElementsBgColor(elementsArr, rgbColorStr) {
  if (typeof elementsArr !== "object") return;
  if (!Array.isArray(elementsArr)) {
    // if a single element is given, put it in an array
    elementsArr = [elementsArr];
  }
  elementsArr.forEach(
    (element) => (element.style.backgroundColor = rgbColorStr)
  );
}

export function shadeRgbStrByFactor(rgbStr, factor) {
  const { r, g, b } = getValuesFromRgbStr(rgbStr);
  const [newR, newG, newB] = [r, g, b].map((val) => applyFactor(val));

  function applyFactor(value) {
    let newVal = value * factor;
    newVal = newVal < 0 ? 0 : newVal;
    newVal = newVal > 255 ? 255 : newVal;
    return parseInt(newVal);
  }

  return `rgb(${newR}, ${newG}, ${newB})`;
}

//####################### NON EXPORTED UTILS #########################
/**
 *
 * @param {Number} min
 * @param {Number} max
 * @returns Number
 *
 * returns an integer between min (inclusive) and max (exclusive)
 */
function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shortHexToFullHex(shortHex) {
  const chunk1 = shortHex.slice(1, 2).repeat(2);
  const chunk2 = shortHex.slice(2, 3).repeat(2);
  const chunk3 = shortHex.slice(3, 4).repeat(2);

  return "#" + chunk1 + chunk2 + chunk3;
}

function valueToPaddedHex(value) {
  return value.toString(16).padStart(2, "0");
}
