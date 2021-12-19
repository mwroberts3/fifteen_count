const steamworksInfo = require('../steamworksFiles/steamworksInfo.json')

const moment = require('moment');

const newThemePopUp = document.getElementById('theme-unlocked-popup');

let steamCreds = JSON.parse(localStorage.getItem('steam-credentials'));

// Highscore check & ranking functions
exports.scoreReview = (hudMessage, currentHand, totalPoints, totalCardsPlayed, totalSeconds) => {
    let highscoreStats = [];

    hudMessage.innerText = "TIME IS UP!";
    currentHand.style.display = "none";

    let previousHighscore = 0;
    
    if (localStorage.getItem('highscore')) {
      highscoreStats = JSON.parse(localStorage.getItem('highscore'));

      previousHighscore = highscoreStats[0]['totalPoints'];

      if (totalPoints > highscoreStats[0]['totalPoints']) {
        highscoreStats[0]['totalPoints'] = totalPoints;
        highscoreStats[0]['totalCardsPlayed'] = totalCardsPlayed;
        highscoreStats[0]['totalSeconds'] = totalSeconds;
        highscoreStats[0]['date'] = moment().format('MMM Do YYYY');
        localStorage.setItem('highscore', JSON.stringify(highscoreStats));

        uploadScoreToSteam(totalPoints, totalCardsPlayed, totalSeconds);
      }
    } else {
      highscoreStats.push({totalPoints, totalCardsPlayed, totalSeconds, date: moment().format('MMM Do YYYY'), timeAttack: 0, taDate: ''})
      localStorage.setItem('highscore', JSON.stringify(highscoreStats));

      uploadScoreToSteam(totalPoints, totalCardsPlayed, totalSeconds);
    }

    newThemeUnlockedPopup();

    function newThemeUnlockedPopup() {
      // Check if player scored enough points to unlock a new theme
      if (previousHighscore < 500 && totalPoints >= 1000) {
        newThemePopUp.classList.remove('hidden');
        newThemePopUp.children[1].innerHTML = '<em>Jungle</em> and <em>Cosmos</em>&nbsp;&nbsp;themes unlocked!';
      } else if (previousHighscore < 500 && totalPoints >= 500) {
        newThemePopUp.classList.remove('hidden');
        newThemePopUp.children[1].innerHTML = '<em>Jungle</em>&nbsp;&nbsp;theme unlocked!';
      } else if (previousHighscore < 1000 && totalPoints >= 1000) {
        newThemePopUp.classList.remove('hidden');
        newThemePopUp.children[1].innerHTML = '<em>Cosmos</em>&nbsp;&nbsp;theme unlocked!';
      } 
    }

    function uploadScoreToSteam(totalPoints, totalCardsPlayed, totalSeconds) {
      let details = {
        'key': steamworksInfo.key,
        'appid': steamworksInfo.appID,
        'leaderboardid': 7434161,
        'steamid': BigInt(`${steamCreds.steamId}`),
        'score': totalPoints,
        'scoremethod': 'KeepBest',
        'details': `cardsPlayed-${totalCardsPlayed} seconds-${totalSeconds} ${moment().format('MMM Do YYYY')}`
      };

      let formBody = [];
      for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      let obj = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: formBody
      }

      fetch(`https://partner.steam-api.com/ISteamLeaderboards/SetLeaderboardScore/v1/`, obj)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }
  }