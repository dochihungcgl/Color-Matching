import { getPlayAgainButton, getTimerElement, getBackgroundColor } from './selectors.js'
//shuffle: xáo trộn
function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return arr

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // radom "count" color
  for (let i = 0; i < count; i++) {
    // random color function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }

  // double current color list
  const fullColorList = [...colorList, ...colorList]

  // shuffle
  shuffle(fullColorList)

  return fullColorList
}

// show btn chơi lại
export function showPlayAgainButton(){
  const playAgainButton = getPlayAgainButton();
  if(playAgainButton) playAgainButton.classList.add('show');
}
// hide btn chơi lại
export function hidePlayAgainButton(){
  const playAgainButton = getPlayAgainButton();
  if(playAgainButton) playAgainButton.classList.remove('show');
}

export function setTimeText(text){
  const timerElement = getTimerElement();
  if(timerElement) timerElement.textContent = text;
}

export function createTimer({ second, onChange, onFinish }){
  let intervalId = null;

  function start(){
    clear();

    let currentSecond = second;
    intervalId = setInterval(() => {
      // if(onChange) onChange(currentSecond);
      onChange?.(currentSecond);

      currentSecond--;

      if(currentSecond < 0) {
        clear();

        onFinish?.();
      }
    }, 1000);
  }

  function clear(){
    clearInterval(intervalId);
  }

  return {
    start,
    clear
  }
}

export function setBackgroundColor(color){
  getBackgroundColor().style.backgroundColor = color;
}