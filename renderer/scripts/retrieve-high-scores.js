const moment = require('moment');

const scoreDisplay = document.querySelector(".score-display");
const errorMsg = document.querySelector(".error-msg");
const personalHighscoreContainer = document.querySelector('.high-score-container').childNodes[1];
let highscoreStats = [];

// Check for existing personal highscore
if (localStorage.getItem('highscore')) {
  highscoreStats = JSON.parse(localStorage.getItem('highscore'));
  console.log(highscoreStats);
  personalHighscoreContainer.childNodes[3].textContent = `${highscoreStats[0]['totalPoints']}`;
  personalHighscoreContainer.childNodes[5].textContent = `Cards Played: ${highscoreStats[0]['totalCardsPlayed']}`;
  personalHighscoreContainer.childNodes[7].textContent = `Time: ${highscoreStats[0]['totalSeconds']}`;
  personalHighscoreContainer.childNodes[9].textContent = `Date: ${highscoreStats[0]['date']}`;
}


console.log(personalHighscoreContainer.childNodes);




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
