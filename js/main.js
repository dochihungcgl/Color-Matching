import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { createTimer, getRandomColorPairs, hidePlayAgainButton, setTimeText, showPlayAgainButton, setBackgroundColor } from './utils.js'
import {getColorElementList, getColorListElement, getInActiveColorList, getPlayAgainButton} from './selectors.js'

// Global variables
let selections = [];
let gameStatus = GAME_STATUS.PLAYING;
// let isWin = 0;
let timer = createTimer({
    second: GAME_TIME, 
    onChange: handleTimerChange ,
    onFinish: handleTimerFinish
})

// xử lí thời gian mỗi khi --
function handleTimerChange(second){
    // show timer text
    const fullSecond = `0${second}`.slice(-2);
    setTimeText(fullSecond);
}
// xử lí khi hết thời gian
function handleTimerFinish(){
    // end game
    gameStatus = GAME_STATUS.FINISHED;
    setTimeText('Game Over');
    showPlayAgainButton();
    

}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement){
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
    const isClicked = liElement.classList.contains('active');
    if(!liElement || isClicked || shouldBlockClick) return;

    liElement.classList.add('active');

    // save clicked cell to selections: lưu ô đã click
    selections.push(liElement);
    if(selections.length < 2) return;
    
    // check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;

    if(isMatch){
        // check win
        setBackgroundColor(firstColor);

        const isWin = getInActiveColorList().length === 0;
        if(isWin){
            // show replay
            showPlayAgainButton();
            // show You Win
            setTimeText('YOU WIN!');

            timer.clear();

            gameStatus = GAME_STATUS.FINISHED;
        }

        selections = [];
        return;
    }

    // incase of not match
    // remove active class for 2 li element
    gameStatus = GAME_STATUS.BLOCKING;
    setTimeout(() => {

        selections[0].classList.remove('active');
        selections[1].classList.remove('active');

        // reset selections = [] for the next turn
        selections = [];


        if(gameStatus !== GAME_STATUS.FINISHED){
            gameStatus = GAME_STATUS.PLAYING;
        }
   

    }, 500)


}

function initColors(){
    // random pairs of colors
    const colorList = getRandomColorPairs(PAIRS_COUNT);
    // bind to li > div.overlay
    const liList = getColorElementList();
    liList.forEach((liElement, index) => {
        liElement.dataset.color = colorList[index];

        const overlayElement = liElement.querySelector('.overlay');
        if(overlayElement) overlayElement.style.backgroundColor = colorList[index];
    });
}
function attachEventForColorList(){
    // gắn sự kiện cho thẻ ul
    const ulElement =  getColorListElement();
    if(!ulElement) return;
    ulElement.addEventListener('click', e => {
        if(e.target.tagName !== 'LI') return;
        handleColorClick(e.target);
    })

}

function resetGame(){
    // reset global vars
    selections = [];
    gameStatus = GAME_STATUS.PLAYING;

    // reset DOM elements
    // - remove active class from li: xóa class active của li
    // - hide replay button
    // - clear you win text
    const colorElementList = getColorElementList();
    for(const colorElement of colorElementList){
        colorElement.classList.remove('active');
    }

    hidePlayAgainButton();
    setTimeText('');

    // re-generate new colors : random bộ màu mới
    initColors();

    startTimer();
}

function attachEventForPlayAgainButton(){
    const playAgainButton = getPlayAgainButton();
    if(!playAgainButton) return;

    playAgainButton.addEventListener('click', resetGame);
}

function startTimer(){
    timer.start();
}

(() => {

    initColors();
    // đính kèm sự kiện cho danh sách màu
    attachEventForColorList();
    // attach: gắn
    attachEventForPlayAgainButton();
    // start timer
    startTimer();
})();
