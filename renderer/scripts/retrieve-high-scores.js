const steamworksInfo = require('../steamworksFiles/steamworksInfo.json')

const scoreDisplay = document.querySelector(".score-display");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[3];
const personalHighscoreContainerTimeAttack = document.querySelector('.personal-highscore-container-time-attack');
const inGameAchievementsList =  document.querySelector('.in-game-achievements');
let achievementsShown = false;

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

      if (e.target.nextElementSibling.nextElementSibling) {
        e.target.nextElementSibling.nextElementSibling.classList.remove('option-selected');
      }
    }

    if (e.target.previousElementSibling) {
      e.target.previousElementSibling.classList.remove('option-selected');

      if (e.target.previousElementSibling.previousElementSibling) {
        e.target.previousElementSibling.previousElementSibling.classList.remove('option-selected');
      }
    } 

    e.target.classList.add('option-selected');
  }
 
  if (e.target.textContent === "Arcade") {
    inGameAchievementsList.classList.add('hidden');

    displayPersonalArcadeScore();
    displayGlobalArcadeScores();
    arcadeScoresDisplayed = true;
    taScoresDisplayed = false;
  }

  if (e.target.textContent === "Time Attack") {
    inGameAchievementsList.classList.add('hidden');

    displayPersonalTimeAttackScore();
    displayGlobalTimeAttackScores();
    taScoresDisplayed = true;
    arcadeScoresDisplayed = false;
  }

  if (e.target.textContent === "Achievements") {
    displayAchievements();
  }
}) 

function displayAchievements() {
  document.querySelector('h3').textContent = 'Achievements'

  personalHighscoreContainerTimeAttack.classList.add('hidden');
  personalHighscoreContainer.classList.add('hidden');
  
  scoreDisplay.innerHTML = ``;
  
  inGameAchievementsList.classList.remove('hidden');

  checkForCompletedAchievements();
}

function checkForCompletedAchievements() {
  let LSAchievementsContainer = JSON.parse(localStorage.getItem('achievements'));

  const achievementsList = Array.from(document.querySelector('.achievements-container').querySelectorAll('LI'));

  for(let i=0; i<achievementsList.length; i++) {
    for(let k=0; k<LSAchievementsContainer.length; k++) {
      if (achievementsList[i].id === LSAchievementsContainer[k] && !achievementsShown) {
        achievementsList[i].innerHTML += `&nbsp;<img
        src="./img/achievement-checkmark.png"
        style="width: 16px; height: 18px"/>`;
        
        achievementsList[i].style.color = "#777";
        achievementsList[i].style.marginLeft = "17px";
      }
    }
  }

  achievementsShown = true;
}

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
    personalHighscoreContainerTimeAttack.children[2].innerHTML = `<strong>Passes:</strong>&nbsp;<span style="padding-top: 2px;">${personalHighscores[0]['taFullPassCount']}</span>`;
    personalHighscoreContainerTimeAttack.children[3].innerHTML = `<span style="padding-top: 2px;">${personalHighscores[0]['taDate']}</span>`;
    scoreDisplay.innerHTML = ``;
  } else {
    // personalHighscoreContainerTimeAttack.children[1].textContent = `0`;
    // personalHighscoreContainerTimeAttack.children[2].innerHTML = `<strong>Passes:</strong>&nbsp;<span style="padding-top: 2px;">0</span>`;
    // personalHighscoreContainerTimeAttack.children[3].innerHTML = ``;
    // scoreDisplay.innerHTML = ``;
  }
}

function displayPersonalArcadeScore() {
  document.querySelector('h3').textContent = 'Arcade';
  
  personalHighscoreContainerTimeAttack.classList.add('hidden');
  personalHighscoreContainer.classList.remove('hidden');

  // Check for existing personal highscore
  if (localStorage.getItem('highscore')) {
    personalHighscoreContainer.childNodes[3].textContent = `${personalHighscores[0]['totalPoints']}`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards:</strong>&nbsp;<span style="padding-top: 2px;">${personalHighscores[0]['totalCardsPlayed']}</span>`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;<span style="padding-top: 2px;">${personalHighscores[0]['totalSeconds']}</span>`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Loops:</strong>&nbsp;<span style="padding-top: 2px;">${personalHighscores[0]['indigoLoops']}</span>`;

    // don't display date as 'null' if no score stored
    if (personalHighscores[0]['date'] != null) {
      personalHighscoreContainer.childNodes[11].innerHTML = `<span style="padding-top: 2px;">${personalHighscores[0]['date']}</span>`;
    }
  } else {
    // personalHighscoreContainer.childNodes[3].textContent = `0`;
    // personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards:</strong>&nbsp;<span style="padding-top: 2px;">0</span>`;
    // personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;<span style="padding-top: 2px;">0</span>`;
    // personalHighscoreContainer.childNodes[8].innerHTML = `<strong>Loops:</strong>&nbsp;<span style="padding-top: 2px;">0</span>`;
    // personalHighscoreContainer.childNodes[9].innerHTML = ``;
  }
}

function displayGlobalArcadeScores() {

  // don't display global highscores, if achievements option clicked while scores are still loading
  if (!document.querySelector('ul').children[2].classList.contains('option-selected')) {
    document.querySelector('table').style.width = '1000px';

  scoreDisplay.innerHTML = `
  <tr>
    <th style="width: 50px;"></th>
    <th style="width: 250px; text-align: left"></th>
    <th class="mini-header" style="width: 155px">Points</th>
    <th class="mini-header" style="width: 115px">Cards</th>
    <th class="mini-header" style="width: 115px">Time</th>
    <th class="mini-header" style="width: 115px">Loops</th>
    <th style="width: 200px; text-align: left"></th>
  </tr>
  `;
  for (let i=0; i < globalArcadeScores.length; i++) {
    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
      <td class="center" style="font-size: 18px">${globalArcadeScores[i].rank}</td>
      <td>${globalArcadeScoresNames[i]}</td>
      <td class="center">${globalArcadeScores[i].score}</td>
      <td class="center">${hexToAsciiCardsPlayed(globalArcadeScores[i].detailData)}</td>
      <td class="center">${hexToAsciiSeconds(globalArcadeScores[i].detailData)}</td>
      <td class="center">${hexToAsciiIndigoLoops(globalArcadeScores[i].detailData)}</td>
      <td style="font-size: 18px">${hexToAsciiDate(globalArcadeScores[i].detailData)}</td>
    `
    scoreDisplay.appendChild(newHighscoreData);
  }
  }
}

function displayGlobalTimeAttackScores() {
  document.querySelector('table').style.width = '810px';

  scoreDisplay.innerHTML = `
  <tr>
    <th style="width: 50px"></th>
    <th style="width: 250px; text-align: left"></th>
    <th class="mini-header" style="width: 155px">Points</th>
    <th class="mini-header" style="width: 155px">Passes</th>
    <th style="width: 200px; text-align: left"></th>
  </tr>
  `;

  for (let i=0; i < globalTimeAttackScores.length; i++) {
    let newHighscoreData = document.createElement('tr');

    newHighscoreData.innerHTML = `
    <td class="center" style="font-size: 18px">${globalTimeAttackScores[i].rank}</td>
    <td>${globalTimeAttackScoresNames[i]}</td>
    <td class="center">${globalTimeAttackScores[i].score}</td>
    <td class="center">${hexToAsciiTAFullPasses(globalTimeAttackScores[i].detailData)}</td>
    <td style="font-size: 18px">${hexToAsciiTADate(globalTimeAttackScores[i].detailData)}</td>
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

function hexToAsciiTAFullPasses(str1) {
  let hex  = str1.toString();
	let str = '';
  let strParts = [];

  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  strParts = str.split(/(\s+)/);
	return strParts[0];
}

function hexToAsciiTADate(str1) {
  let hex  = str1.toString();
	let str = '';
  let strParts = [];

  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  strParts = str.split(/(\s+)/);
	return `${strParts[2]} ${strParts[4]} ${strParts[6]}`;
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
