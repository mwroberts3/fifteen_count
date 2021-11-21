let steamInfo = require('../steamworksFiles/steamworksInfo.json')

const scoreDisplay = document.querySelector(".score-display");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[3];

let arcadeScoresDisplayed = true;
let taScoresDisplayed = false;

let personalHighscores = [];

if (localStorage.getItem('highscore')) {
  personalHighscores = JSON.parse(localStorage.getItem('highscore'));
}

fetchAndDisplayArcadeLeaderboardScores();

// Game mode select
// depending on game mode selected, need to call fetchArcadeLeaderboardScores or fetchTimeAttackLeaderboardScores


const highscoreSelect = document.querySelector('.high-score-mode-select');

highscoreSelect.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.classList.remove('option-selected');
    } else {
      e.target.previousElementSibling.classList.remove('option-selected');
    }
    e.target.classList.add('option-selected');
  }

  if (highscoreSelect.childNodes[1].children[1].classList.contains('option-selected')) {
    // don't retrieve scores again on click if they're already displayed
    if (!taScoresDisplayed) {
      displayTimeAttackScores();
      taScoresDisplayed = true;
      arcadeScoresDisplayed = false;
    }
  } else {
    if (!arcadeScoresDisplayed) {
      displayArcadeScores();
      arcadeScoresDisplayed = true;
      taScoresDisplayed = false;
    }
  }
}) 

// display arcade score by default
displayArcadeScores();

function displayTimeAttackScores() {
  document.querySelector('h3').textContent = 'Time Attack'

  if (localStorage.getItem('highscore') && personalHighscores[0].timeAttack > 0) {
    personalHighscoreContainer.children[1].textContent = `${personalHighscores[0]['timeAttack']}`;
    personalHighscoreContainer.children[2].innerHTML = `<strong>Date:</strong>&nbsp;${personalHighscores[0]['taDate']}`;
    personalHighscoreContainer.children[3].innerHTML = ` `;
    personalHighscoreContainer.children[4].innerHTML = ` `;
    scoreDisplay.innerHTML = ``;
  } else {
    personalHighscoreContainer.children[1].textContent = `0`;
    personalHighscoreContainer.children[2].innerHTML = `<strong>Date:</strong>&nbsp;na`;
    personalHighscoreContainer.children[3].innerHTML = ` `;
    personalHighscoreContainer.children[4].innerHTML = ` `;
    scoreDisplay.innerHTML = ``;
  }
}

function displayArcadeScores() {
  document.querySelector('h3').textContent = 'Arcade';
  
  // Check for existing personal highscore
  if (localStorage.getItem('highscore')) {
    personalHighscoreContainer.childNodes[3].textContent = `${personalHighscores[0]['totalPoints']}`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards Played:</strong>&nbsp;${personalHighscores[0]['totalCardsPlayed']}`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;${personalHighscores[0]['totalSeconds']}`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Date:</strong>&nbsp;${personalHighscores[0]['date']}`;
  } else {
    personalHighscoreContainer.childNodes[3].textContent = `0`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards Played:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Date:</strong>&nbsp;na`;
  }
}

async function fetchAndDisplayArcadeLeaderboardScores() {
  let arcadeHighscores = await fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardEntries/v1/?key=${steamInfo.key}&appid=${steamInfo.appID}&rangestart=1&rangeend=100&leaderboardid=7434161&datarequest=RequestGlobal`);

  arcadeHighscores = await arcadeHighscores.json();
  arcadeHighscores = arcadeHighscores.leaderboardEntryInformation.leaderboardEntries;

  console.log(arcadeHighscores);

  let arcadeHighscoresDisplayTable = document.querySelector('.score-display');

  for (let i=0; i < arcadeHighscores.length; i++) {
    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
    <td>${arcadeHighscores[i].rank}</td>
    <td>${arcadeHighscores[i].score}</td>
    <td>${arcadeHighscores[i].steamID}</td>
    <td>${hexToAsciiCardsPlayed(arcadeHighscores[i].detailData)}</td>
    <td>${hexToAsciiSeconds(arcadeHighscores[i].detailData)}</td>
    <td>Date</td>
    `
    
    arcadeHighscoresDisplayTable.appendChild(newHighscoreData);
  }

function hexToAsciiCardsPlayed(str1){
	let hex  = str1.toString();
	let str = '';
  let strParts = [];

	for (let n = 0; n < hex.length; n += 2) {
    if (String.fromCharCode(parseInt(hex.substr(n, 2), 16)) > -1) {
      console.log(String.fromCharCode(parseInt(hex.substr(n, 2), 16)))
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
	}

  strParts = str.split(/(\s+)/);
	return strParts[0];
 }

function hexToAsciiSeconds(str1){
	let hex  = str1.toString();
	let str = '';
  let strParts = [];

	for (let n = 0; n < hex.length; n += 2) {
    if (String.fromCharCode(parseInt(hex.substr(n, 2), 16)) > -1) {
      console.log(String.fromCharCode(parseInt(hex.substr(n, 2), 16)))
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
	}

  strParts = str.split(/(\s+)/);
	return strParts[2];
 }
}
