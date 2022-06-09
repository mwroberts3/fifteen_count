const allTimeTaScore = document.querySelector('.ta-alltime-score-display');

// check to see if first time playing
const timeAttackHowTo = document.getElementById('time-attack-how-to-play');
let firsttimeCheck = {};
if (!localStorage.getItem('firsttime-check')) {
  timeAttackHowTo.classList.remove('hidden');
  firsttimeCheck.timeAttack = true;
  localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
  nextHowTo();
} else {
  firsttimeCheck = JSON.parse(localStorage.getItem('firsttime-check'));
  if (!firsttimeCheck.timeAttack) {
    timeAttackHowTo.classList.remove('hidden');
    firsttimeCheck.timeAttack = true;
    localStorage.setItem('firsttime-check', JSON.stringify(firsttimeCheck));
    nextHowTo();
  }
}

function nextHowTo() {
  document.querySelector('.next-how-to').addEventListener('click', (e) => {
    e.target.parentNode.parentNode.classList.add('hidden');

    document.querySelector('.time-attack-howtoplay-slide-two').classList.remove('hidden');

    document.getElementById('ta-uncheck-btn').textContent = controls.uncheckcardsBtn;

    document.getElementById('ta-pause-btn').textContent = controls.pauseBtn;

    closeHowTo();
  })
}

function closeHowTo() {
  document.querySelector('.skip-how-to').addEventListener('click', () => {
    window.location.reload();
  })
}

// get controls
if (!localStorage.getItem('controls')) {
  controls = {
    actionBtn: "KeyS",
    lowValBtn: "KeyZ",
    uncheckcardsBtn: "KeyC",
    swapBtn: "KeyV",
    pauseBtn: "Space"
  }

  localStorage.setItem('controls', JSON.stringify(controls));
} 

if (localStorage.getItem('controls')) {
  controls = JSON.parse(localStorage.getItem('controls'))
  uncheckcardsBtn = controls.uncheckcardsBtn;
  pauseBtn = controls.pauseBtn;
  }

// initialize achievements if first time playing or reset
if (!localStorage.getItem('achievements')) {
  localStorage.setItem('achievements', JSON.stringify([]));
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
    highscoreStats.push({totalPoints: 0, totalCardsPlayed: 0, totalSeconds: 0, indigoLoops: 0, date: 'na', timeAttack: 0, taFullPassCount: 0, taDate: ''})
    localStorage.setItem('highscore', JSON.stringify(highscoreStats));
    highscoreToBeat = 0;
}

allTimeTaScore.textContent = highscoreToBeat;