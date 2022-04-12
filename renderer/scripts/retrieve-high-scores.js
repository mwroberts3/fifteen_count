const steamworksInfo = require('../steamworksFiles/steamworksInfo.json')

const scoreDisplay = document.querySelector(".score-display");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[3];
const personalHighscoreContainerTimeAttack = document.querySelector('.personal-highscore-container-time-attack');

let arcadeScoresDisplayed = true;
let taScoresDisplayed = false;

let personalHighscores = [];

let globalArcadeScores = [];
let globalArcadeScoresNames = [];
let globalTimeAttackScores = [];
let globalTimeAttackScoresNames = [];

if (localStorage.getItem('highscore')) {
  personalHighscores = JSON.parse(localStorage.getItem('highscore'));
}

fetchTimeAttackLeaderboardScores();
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

function displayPersonalTimeAttackScore() {
  document.querySelector('h3').textContent = 'Time Attack'

  personalHighscoreContainer.classList.add('hidden');
  personalHighscoreContainerTimeAttack.classList.remove('hidden');

  if (localStorage.getItem('highscore') && personalHighscores[0].timeAttack > 0) {
    personalHighscoreContainerTimeAttack.children[1].textContent = `${personalHighscores[0]['timeAttack']}`;
    personalHighscoreContainerTimeAttack.children[2].innerHTML = `<strong>Passes:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['taFullPassCount']}</span>`;
    personalHighscoreContainerTimeAttack.children[3].innerHTML = `<strong>Date:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['taDate']}</span>`;
    scoreDisplay.innerHTML = ``;
  } else {
    personalHighscoreContainerTimeAttack.children[1].textContent = `0`;
    personalHighscoreContainerTimeAttack.children[2].innerHTML = `<strong>Passes:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['taFullPassCount']}</span>`;
    personalHighscoreContainerTimeAttack.children[3].innerHTML = `<strong>Date:</strong>&nbsp;na`;
    scoreDisplay.innerHTML = ``;
  }
}

function displayPersonalArcadeScore() {
  document.querySelector('h3').textContent = 'Arcade';
  
  personalHighscoreContainerTimeAttack.classList.add('hidden');
  personalHighscoreContainer.classList.remove('hidden');

  // Check for existing personal highscore
  if (localStorage.getItem('highscore')) {
    personalHighscoreContainer.childNodes[3].textContent = `${personalHighscores[0]['totalPoints']}`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['totalCardsPlayed']}</span>`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['totalSeconds']}</span>`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Loops:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['indigoLoops']}</span>`;
    personalHighscoreContainer.childNodes[11].innerHTML = `<strong>Date:</strong>&nbsp;<span style="padding-top: 1px;">${personalHighscores[0]['date']}</span>`;
  } else {
    personalHighscoreContainer.childNodes[3].textContent = `0`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards Played:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[8].innerHTML = `<strong>Loops:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Date:</strong>&nbsp;na`;
  }
}

function displayGlobalArcadeScores() {
  document.querySelector('table').style.width = '1100px';

  scoreDisplay.innerHTML = `
  <tr>
    <th style="width: 100px">Rank</th>
    <th style="width: 250px; text-align: left">Name</th>
    <th style="width: 155px">Points</th>
    <th style="width: 115px">Cards</th>
    <th style="width: 115px">Time</th>
    <th style="width: 115px">Loops</th>
    <th style="width: 250px; text-align: left">Date</th>
  </tr>
  `;
  for (let i=0; i < globalArcadeScores.length; i++) {
    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
    <td class="center">${globalArcadeScores[i].rank}</td>
    <td>${globalArcadeScoresNames[i]}</td>
    <td class="center">${globalArcadeScores[i].score}</td>
    <td class="center">${hexToAsciiCardsPlayed(globalArcadeScores[i].detailData)}</td>
    <td class="center">${hexToAsciiSeconds(globalArcadeScores[i].detailData)}</td>
    <td class="center">${hexToAsciiIndigoLoops(globalArcadeScores[i].detailData)}</td>
    <td>${hexToAsciiDate(globalArcadeScores[i].detailData)}</td>
    `
    scoreDisplay.appendChild(newHighscoreData);
  }
}

function displayGlobalTimeAttackScores() {
  document.querySelector('table').style.width = '910px';

  scoreDisplay.innerHTML = `
  <tr>
    <th style="width: 100px">Rank</th>
    <th style="width: 250px; text-align: left">Name</th>
    <th style="width: 155px">Points</th>
    <th style="width: 155px">Passes</th>
    <th style="width: 250px; text-align: left">Date</th>
  </tr>
  `;

  for (let i=0; i < globalTimeAttackScores.length; i++) {
    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
    <td class="center">${globalTimeAttackScores[i].rank}</td>
    <td>${globalTimeAttackScoresNames[i]}</td>
    <td class="center">${globalTimeAttackScores[i].score}</td>
    <td class="center">0</td>
    <td>${hexToAsciiTADate(globalTimeAttackScores[i].detailData)}</td>
    `
    scoreDisplay.appendChild(newHighscoreData);
  }
}

 async function fetchArcadeLeaderboardScores() {
  globalArcadeScores = await fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardEntries/v1/?key=${steamworksInfo.key}&appid=${steamworksInfo.appID}&rangestart=1&rangeend=100&leaderboardid=7434161&datarequest=RequestGlobal`);

  globalArcadeScores = await globalArcadeScores.json();
  globalArcadeScores = globalArcadeScores.leaderboardEntryInformation.leaderboardEntries;

  await convertSteamIdsToNamesArcade(globalArcadeScores);
}

 async function fetchTimeAttackLeaderboardScores() {
  globalTimeAttackScores = await fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardEntries/v1/?key=${steamworksInfo.key}&appid=${steamworksInfo.appID}&rangestart=1&rangeend=100&leaderboardid=7487751&datarequest=RequestGlobal`);

  globalTimeAttackScores = await globalTimeAttackScores.json();

  globalTimeAttackScores = globalTimeAttackScores.leaderboardEntryInformation.leaderboardEntries;

  convertSteamIdsToNamesTimeAttack(globalTimeAttackScores);
}

function hexToAsciiTADate(str1) {
  let hex  = str1.toString();
	let str = '';

  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  return str;
}

async function convertSteamIdsToNamesArcade(globalArcadeScores) {
  let userRequestBuffer = []

  for (let i = 0; i < globalArcadeScores.length; i++) {
    for (let j = 0; j < 1; j++) {
      userRequestBuffer.push(getScoreData(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamworksInfo.key}&steamids=${globalArcadeScores[i].steamID}`))
    }

    await Promise.all(userRequestBuffer).then((userData) => {
      console.log(userData[0].response.players[0].personaname)
      globalArcadeScoresNames.push(userData[0].response.players[0].personaname)
    });

    console.log(globalArcadeScoresNames);

    userRequestBuffer.splice(0, userRequestBuffer.length);
  }

  displayGlobalArcadeScores();
}

async function convertSteamIdsToNamesTimeAttack(globalTimeAttackScores) {
  let userRequestBuffer = []

  for (let i = 0; i < globalTimeAttackScores.length; i++) {
    for (let j = 0; j < 1; j++) {
      userRequestBuffer.push(getScoreData(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamworksInfo.key}&steamids=${globalTimeAttackScores[i].steamID}`))
    }

    await Promise.all(userRequestBuffer).then((userData) => {
      console.log(userData[0].response.players[0].personaname)
      globalTimeAttackScoresNames.push(userData[0].response.players[0].personaname)
    });

    console.log(globalTimeAttackScoresNames);

    userRequestBuffer.splice(0, userRequestBuffer.length);
  }
}

async function getScoreData(url) {
  return new Promise ((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then(data => resolve(data))
  })
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

function hexToAsciiIndigoLoops(str1){
	let hex  = str1.toString();
	let str = '';
  let strParts = [];

	for (let n = 0; n < hex.length; n += 2) {
    if (String.fromCharCode(parseInt(hex.substr(n, 2), 16)) > -1) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
	}

  strParts = str.split(/(\s+)/);
	return strParts[4];
 }

 function hexToAsciiDate(str1){
  let hex  = str1.toString();
	let str = '';
  let strParts = [];

  for (let n = 0; n < hex.length; n += 2) {
  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  strParts = str.split(/(\s+)/);

	return `${strParts[6]} ${strParts[8]} ${strParts[10]}`;
 }
