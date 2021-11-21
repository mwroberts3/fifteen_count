const steamworksInfo = require('../steamworksFiles/steamworksInfo.json')

const scoreDisplay = document.querySelector(".score-display");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[3];

let arcadeScoresDisplayed = true;
let taScoresDisplayed = false;

let personalHighscores = [];

let globalArcadeScores = [];

if (localStorage.getItem('highscore')) {
  personalHighscores = JSON.parse(localStorage.getItem('highscore'));
}

fetchArcadeLeaderboardScores();

// Game mode select
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
      displayPersonalTimeAttackScore();
      displayGlobalTimeAttackScores();
      taScoresDisplayed = true;
      arcadeScoresDisplayed = false;
    }
  } else {
    if (!arcadeScoresDisplayed) {
      displayPersonalArcadeScore();
      displayGlobalArcadeScores();
      arcadeScoresDisplayed = true;
      taScoresDisplayed = false;
    }
  }
}) 

// display arcade score by default
displayPersonalArcadeScore();
scoreDisplay.innerHTML = `
  <p>loading...</p>
`;
setTimeout(() => {
  displayGlobalArcadeScores();
},1000)

function displayPersonalTimeAttackScore() {
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

function displayPersonalArcadeScore() {
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

function displayGlobalArcadeScores() {
  for (let i=0; i < globalArcadeScores.length; i++) {
    scoreDisplay.innerHTML = `
    <tr>
      <th style="width: 115px">Rank</th>
      <th style="width: 115px">Points</th>
      <th style="width: 250px">Name</th>
      <th style="width: 200px">Card Count</th>
      <th style="width: 115px">Seconds</th>
      <th style="width: 250px">Date</th>
    </tr>
    `;

    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
    <td>${globalArcadeScores[i].rank}</td>
    <td>${globalArcadeScores[i].score}</td>
    <td>${globalArcadeScores[i].steamID}</td>
    <td>${hexToAsciiCardsPlayed(globalArcadeScores[i].detailData)}</td>
    <td>${hexToAsciiSeconds(globalArcadeScores[i].detailData)}</td>
    <td>${hexToAsciiDate(globalArcadeScores[i].detailData)}</td>
    `
    scoreDisplay.appendChild(newHighscoreData);
  }
}

function displayGlobalTimeAttackScores() {

}

async function fetchArcadeLeaderboardScores() {
  globalArcadeScores = await fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardEntries/v1/?key=${steamworksInfo.key}&appid=${steamworksInfo.appID}&rangestart=1&rangeend=100&leaderboardid=7434161&datarequest=RequestGlobal`);

  globalArcadeScores = await globalArcadeScores.json();
  globalArcadeScores = globalArcadeScores.leaderboardEntryInformation.leaderboardEntries;
}

function hexToAsciiCardsPlayed(str1){
	let hex  = str1.toString();
	let str = '';
  let strParts = [];

	for (let n = 0; n < hex.length; n += 2) {
    if (String.fromCharCode(parseInt(hex.substr(n, 2), 16)) > -1) {
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
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
	}

  strParts = str.split(/(\s+)/);
	return strParts[2];
 }

 function hexToAsciiDate(str1){
  let hex  = str1.toString();
	let str = '';
  let strParts = [];

  for (let n = 0; n < hex.length; n += 2) {
  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  strParts = str.split(/(\s+)/);

	return `${strParts[4]} ${strParts[6]} ${strParts[8]}`;
 }
