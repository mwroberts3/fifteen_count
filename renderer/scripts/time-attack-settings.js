// set outer background
document.querySelector('body').style.backgroundImage = "url('./img/time-attack-outer-bg.png')";

// check to see if first time playing
const timeAttackHowTo = document.getElementById('time-attack-how-to-play');
let firsttimeCheck = {};
if (!localStorage.getItem('firsttime-check')) {
  timeAttackHowTo.classList.remove('hidden');
  firsttimeCheck.timeAttack = true;
  localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
  howToSlideShow();
} else {
  firsttimeCheck = JSON.parse(localStorage.getItem('firsttime-check'));
  if (!firsttimeCheck.timeAttack) {
    timeAttackHowTo.classList.remove('hidden');
    firsttimeCheck.timeAttack = true;
    localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
    howToSlideShow();
  }
}

function howToSlideShow() {
  let slideIndex = 0;
  let slideCollection = [];
  document.querySelector('.skip-how-to').addEventListener('click', () => {
    timeAttackHowTo.classList.add('hidden');
    timerDisplay.textContent = '180';
    secondsLeft = 179;
  })

  document.querySelector('.next-how-to').addEventListener('click', (e) => {
    console.log(e.target.parentNode.parentNode.children);
    slideIndex++;

    slideCollection = Array.from(e.target.parentNode.parentNode.children);

    console.log(slideCollection);

    slideCollection.forEach((slide, index) => {
      console.log(slide);
      if (slide.tagName === 'DIV') {
        if(slideIndex === index) {
          slide.classList.remove('hidden');
        } else {
          slide.classList.add('hidden');
        }
        if (slideIndex === 2) {
          document.querySelector('.next-how-to').classList.add('hidden');
          document.querySelector('.skip-how-to').textContent = 'Close';
        }
      }
    })
  })
}

// get controls
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
  uncheckcardsBtn = controls.uncheckcardsBtn;
  pauseBtn = controls.pauseBtn;
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
  document.getElementById('bgm-selection').src = './bgm/covered-face.mp3';
}

// Load gameplay sound fx
let checkCardSFX = new Audio('./soundfx/check-card.wav');
let uncheckAllCardsSFX = new Audio('./soundfx/uncheck-all-cards.wav');
let bombCardSFX = new Audio('./soundfx/swap-card.wav');
let bonusCardSFX = new Audio('./soundfx/full-clear.wav');
let newHighscoreSFX = new Audio('./soundfx/new-highscore.wav');

// Get and display highscore
let highscoreStats = [];
let highscoreToBeat;

if(localStorage.getItem('highscore')) {
    highscoreStats = JSON.parse(localStorage.getItem('highscore'));

    highscoreToBeat = highscoreStats[0]['timeAttack']
} else {
    highscoreStats.push({totalPoints: 0, totalCardsPlayed: 0, totalSeconds: 0, date: 'na', timeAttack: 0, taDate: ''})
    localStorage.setItem('highscore', JSON.stringify(highscoreStats));
    highscoreToBeat = 0;
}

document.querySelector('.ta-highscore-itself').style.fontWeight = 'normal';
document.querySelector('.ta-highscore-itself').textContent = highscoreToBeat;