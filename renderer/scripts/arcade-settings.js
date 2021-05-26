let secondsLeft = 99;
document.querySelector(".timer").textContent = "100";

// Check to see if first time playing
const arcadeHowTo = document.getElementById('arcade-how-to-play');
let firsttimeCheck = {};
if (!localStorage.getItem('firsttime-check')) {
  arcadeHowTo.classList.remove('hidden');
  firsttimeCheck.arcade = true;
  document.getElementById('personal-highscore-display').style.visibility = 'hidden';
  localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
  document.querySelector('.gui-container').style.opacity = 0;
  howToSlideShow();
} else {
  firsttimeCheck = JSON.parse(localStorage.getItem('firsttime-check'));
  if (!firsttimeCheck.arcade) {
    arcadeHowTo.classList.remove('hidden');
    firsttimeCheck.arcade = true;
    document.getElementById('personal-highscore-display').style.visibility = 'hidden';
    localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
    document.querySelector('.gui-container').style.opacity = 0;
    howToSlideShow();
  }
}

function howToSlideShow() {
  arcadeHowTo.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      if (e.target.textContent === "Close") {
        let firsttimeCheck = {};
        firsttimeCheck.arcade = true;
        localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
        // come up with more elegant solution here
        document.querySelector('.gui-container').style.opacity = 1;
        arcadeHowTo.classList.add('hidden');
        secondsLeft = 99;
        document.querySelector(".timer").textContent = "100";
      } else if (e.target.textContent === "Next") {
        e.target.textContent = "Back";
        arcadeHowTo.classList.add('arcade-howto-page-two');

        document.getElementById('arcade-howto-slide-one').classList.add('hidden');
        document.getElementById('arcade-howto-slide-two').classList.remove('hidden');
      } else if (e.target.textContent === "Back") {
        e.target.textContent = "Next";

        document.getElementById('arcade-howto-slide-two').classList.add('hidden');
        document.getElementById('arcade-howto-slide-one').classList.remove('hidden');
      }
    }
  })
}

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
  controls = {
    actionBtn: "ShiftLeft",
    lowValBtn: "ControlLeft",
    uncheckcardsBtn: "KeyZ",
    swapBtn: "KeyX",
    pauseBtn: "Space"
  }

  localStorage.setItem('controls', JSON.stringify(controls));
} 
if (localStorage.getItem('controls')) {
  controls = JSON.parse(localStorage.getItem('controls'))
  actionBtn = controls.actionBtn;
  lowValBtn = controls.lowValBtn;
  uncheckcardsBtn = controls.uncheckcardsBtn;
  swapBtn = controls.swapBtn;
  pauseBtn = controls.pauseBtn;
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
  themeSelection = { index: 0, themeName: "Classic", bgImgPlayersHand: ["classic-bg.png"], bgImgCombo: "classic-bg-combo-round.png", bgCol: "#b3edff", brdCol: "#000", fullClearBrdGrd: [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet"
  ], cardSprites: "style/classicsprites.css", bgm: "bgm/Theme-Classic.mp3", fifteenCountGradient: ['#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#000'] };
  localStorage.setItem('theme-selection', JSON.stringify(themeSelection));
} else {
  themeSelection = JSON.parse(localStorage.getItem('theme-selection'))
}

// Apply selected theme settings
themeDisplay.textContent = themeSelection['themeName'];
const allContentsContainer = document.querySelector('.all-contents-container');

allContentsContainer.classList.add(themeSelection['themeName']);

let fifteenCountColRange = themeSelection['fifteenCountGradient'];

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

// Set sound option settings
let userSelectedSoundSettings = {};
if (!localStorage.getItem('sound-settings')) {
  let tempSoundSettings = {
    BGM: true, SFX: true
  }
  localStorage.setItem('sound-settings', JSON.stringify(tempSoundSettings));
  userSelectedSoundSettings = tempSoundSettings;
} else {
  userSelectedSoundSettings = JSON.parse(localStorage.getItem('sound-settings'));
}

// Set BGM
if (userSelectedSoundSettings.BGM) {
  document.getElementById('bgm-selection').src = themeSelection['bgm'];
}

// Set HUD banner background and options color
if (themeSelection["themeName"] === 'Universe') {
  document.querySelector(".scoreboard").style.background = "transparent";
  document.querySelector(".players-hand").style.borderTop = "4px solid #000";
} else if (themeSelection["themeName"] === 'Jungle') {
  document.querySelector(".scoreboard").style.background = "linear-gradient(#111, #175217)";
}

// Load gameplay sound fx
let checkCardSFX = new Audio('./soundfx/check-card.wav');
let sacrificeCardSFX = new Audio('./soundfx/sacrifice-card.wav');
let uncheckAllCardsSFX = new Audio('./soundfx/uncheck-all-cards.wav');
let swapCardSFX = new Audio('./soundfx/swap-card.wav');
let firstSubmitSFX = new Audio('./soundfx/first-submit.wav');
let comboSubmitSFX = new Audio('./soundfx/combo-submit.wav');
let fullClearSFX = new Audio('./soundfx/full-clear.wav');
let newHighscoreSFX = new Audio('./soundfx/new-highscore.wav');




