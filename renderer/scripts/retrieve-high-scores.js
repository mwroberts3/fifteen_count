const moment = require('moment');

const scoreDisplay = document.querySelector(".score-display");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[3];

let arcadeScoresDisplayed = true;
let taScoresDisplayed = false;

let highScoresArr = [];

if (localStorage.getItem('highscore')) {
  highScoresArr = JSON.parse(localStorage.getItem('highscore'));
}

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
  document.querySelector('h3').textContent = 'Time Attack Scores'

  if (localStorage.getItem('highscore') && highScoresArr[0].timeAttack > 0) {
    personalHighscoreContainer.children[1].textContent = `${highScoresArr[0]['timeAttack']}`;
    personalHighscoreContainer.children[2].innerHTML = `<strong>Date:</strong>&nbsp;${highScoresArr[0]['taDate']}`;
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
  document.querySelector('h3').textContent = 'Arcade Scores';
  
  // Check for existing personal highscore
  if (localStorage.getItem('highscore')) {
    personalHighscoreContainer.childNodes[3].textContent = `${highScoresArr[0]['totalPoints']}`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards Played:</strong>&nbsp;${highScoresArr[0]['totalCardsPlayed']}`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;${highScoresArr[0]['totalSeconds']}`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Date:</strong>&nbsp;${highScoresArr[0]['date']}`;
  } else {
    personalHighscoreContainer.childNodes[3].textContent = `0`;
    personalHighscoreContainer.childNodes[5].innerHTML = `<strong>Cards Played:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[7].innerHTML = `<strong>Time:</strong>&nbsp;0`;
    personalHighscoreContainer.childNodes[9].innerHTML = `<strong>Date:</strong>&nbsp;na`;
  }
  
  db.collection("highscores")
    .where("hidden", "==", false)
    .orderBy("score", "desc")
    .get()
    .then((querySnapshot) => {
      let scoreRank = 1;
      querySnapshot.forEach((doc) => {
        scoreDisplay.innerHTML += `
        <tr>
          <td>${scoreRank}</td>
          <td>
            <span class="points-display">
              ${doc.data().score}
            </span>
          </td>
          <td>
          ${doc.data().name}
        </td>
          <td>
            ${doc.data().cards_played}(${Math.round(doc.data().score / doc.data().cards_played)})
          </td>
          <td>
            ${doc.data().seconds_played}
          </td>
          <td>
            ${moment(doc.data().date.toDate()).format('MMM D YYYY')}
          </td>
        </tr>
        `;
        scoreRank++;
      });
    }).catch(err => console.log(err));
}
