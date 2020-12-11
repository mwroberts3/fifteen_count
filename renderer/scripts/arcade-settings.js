// Check for custom control settings
let controls = [];
let actionBtn,
lowValBtn,
uncheckcardsBtn,
swapBtn,
pauseBtn;

let highScoresStats = [];
let highscoreToBeat;

if (!localStorage.getItem('controls')) {
  controls = [
    {buttonName: "actionBtn", button: "ShiftLeft"},
    {buttonName: "lowValBtn", button: "ControlLeft"},
    {buttonName: "uncheckcardsBtn", button: "KeyZ"},
    {buttonName: "swapBtn", button: "AltLeft"},
    {buttonName: "pauseBtn", button: "Space"},
  ];
  localStorage.setItem('controls', JSON.stringify(controls));
} 
if (localStorage.getItem('controls')) {
  controls = JSON.parse(localStorage.getItem('controls'))

  for (let i = 0; i < controls.length; i++){
    if (controls[i]['buttonName'] === 'actionBtn') {
      actionBtn = controls[i]['button']
    }
    if (controls[i]['buttonName'] === 'lowValBtn') {
      lowValBtn = controls[i]['button']
    }
    if (controls[i]['buttonName'] === 'uncheckcardsBtn') {
      uncheckcardsBtn = controls[i]['button']
    }
    if (controls[i]['buttonName'] === 'swapBtn') {
      swapBtn = controls[i]['button']
    }
    if (controls[i]['buttonName'] === 'pauseBtn') {
      pauseBtn = controls[i]['button']
    }
  }

  console.log(actionBtn, lowValBtn, uncheckcardsBtn, swapBtn, pauseBtn);
}

// Check for highscore
const personalHighscoreDisplay = document.querySelector('#personal-highscore-display');

if (localStorage.getItem('highscore')) {
  highScoresStats = JSON.parse(localStorage.getItem('highscore'));
  highscoreToBeat = highScoresStats[0]['totalPoints']
  personalHighscoreDisplay.childNodes[1].textContent = highscoreToBeat;
} else {
  highscoreToBeat = 0;
  personalHighscoreDisplay.childNodes[1].textContent = highscoreToBeat;
}

// Check for theme
let themeSelection = [];
const themeDisplay = document.querySelector('#theme-display');

if (!localStorage.getItem('theme-selection')) {
  themeSelection = { index: 0, themeName: "Classic", bgImgPlayersHand: ["classic-bg.png"], bgImgCombo: "classic-bg-combo-round.png", bgCol: "#b3edff", cardSprites: "style/classicsprites.css", bgm: "bgm/Theme-Classic.mp3" };
  localStorage.setItem('theme-selection', JSON.stringify(themeSelection));
} else {
  themeSelection = JSON.parse(localStorage.getItem('theme-selection'))
}

// Apply selected theme settings
themeDisplay.textContent = themeSelection['themeName'];
const allContentsContainer = document.querySelector('.all-contents-container');

allContentsContainer.classList.add(themeSelection['themeName']);
document.getElementById('bgm-selection').src = themeSelection['bgm'];

// document.querySelector('body').style.background = themeSelection['bgCol'];

if (themeSelection['index'] === 1 || themeSelection['index'] === 2) {
  console.log('theme is 1 or 2');
  personalHighscoreDisplay.style.color = '#fff';
  personalHighscoreDisplay.childNodes[1].textContent = highscoreToBeat;
}

document.getElementById('theme-spritesheet').href = themeSelection['cardSprites'];


const bgTimerIntervals = [];
setPlayersHandBg();
document.querySelector('.players-hand').style.removeProperty('background-image');


function setPlayersHandBg() {
  document.querySelector('.players-hand').style.removeProperty('background-image');
  let playersHandBgAbr = document.querySelector('.players-hand').style;
  if (themeSelection['bgImgPlayersHand'].length === 1) {
    playersHandBgAbr.setProperty('--players-bg-img', `url("../img/${themeSelection['bgImgPlayersHand'][0]}")`)
  } else {
    let iOpa = 1;
    let jOpa = 0;
    let opaChange = 0.008;
    let bgImgSwitch = false;

    setInterval(() => {
      playersHandBgAbr.setProperty('--players-bg-opacity', `${iOpa}`);
      iOpa += -opaChange;
    },34);

    setInterval(() => {
      playersHandBgAbr.setProperty('--players-bg-opacity-2', `${jOpa}`);
      jOpa += opaChange;
    },34);
    
    setInterval(() => {
      opaChange = -opaChange;
      if (!bgImgSwitch) {
        playersHandBgAbr.setProperty('--players-bg-img', `url("../img/${themeSelection['bgImgPlayersHand'][Math.floor(Math.random() * 8)]}")`);
        bgImgSwitch = true;
      } else if (bgImgSwitch) {
        playersHandBgAbr.setProperty('--players-bg-img-2', `url("../img/${themeSelection['bgImgPlayersHand'][Math.floor(Math.random() * 8)]}")`);
        bgImgSwitch = false;
      }
    },4000);
  }
}

// function clearBgImgIntervals() {
//   clearInterval(bgTimer1);
//   clearInterval(bgTimer2);
//   clearInterval(bgTimer3);
// }