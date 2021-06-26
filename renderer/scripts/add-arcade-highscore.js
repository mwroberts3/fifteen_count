const moment = require('moment');

// Highscore check & ranking functions
// when entering name, might want to find a regular expression that with block swear words
exports.scoreReview = (hudMessage, currentHand, totalPoints, totalCardsPlayed, totalSeconds) => {
    let highscoreStats = [];

    hudMessage.innerText = "TIME IS UP!";
    currentHand.style.display = "none";
     
    if (localStorage.getItem('highscore')) {
      highscoreStats = JSON.parse(localStorage.getItem('highscore'));
      if (totalPoints > highscoreStats[0]['totalPoints']) {
        highscoreStats[0]['totalPoints'] = totalPoints;
        highscoreStats[0]['totalCardsPlayed'] = totalCardsPlayed;
        highscoreStats[0]['totalSeconds'] = totalSeconds;
        highscoreStats[0]['date'] = moment().format('MMM Do YYYY');
        localStorage.setItem('highscore', JSON.stringify(highscoreStats));
      }
    } else {
      highscoreStats.push({totalPoints, totalCardsPlayed, totalSeconds, date: moment().format('MMM Do YYYY'), timeAttack: 0, taDate: ''})
      localStorage.setItem('highscore', JSON.stringify(highscoreStats));
    }

    // db.collection("highscores")
    //   .where("hidden", "==", false)
    //   .orderBy("score", "desc")
    //   .limit(50)
    //   .get()
    //   .then((snapshot) => {
    //     let scoreRank = 0;
    //     highscoresArr = snapshot.docs.map((doc) => doc.data().score);
  
    //     highscoresArr.forEach((score) => {
    //       if (totalPoints > score) {
    //         scoreRank++;
    //       }
    //     });
  
    //     scoreRank = highscoresArr.length - scoreRank;
  
    //     if (highscoresArr.length < 50) {
    //       addNametoScore(scoreRank, totalPoints, totalCardsPlayed, totalSeconds);
    //     } else if (totalPoints > highscoresArr[highscoresArr.length - 1]) {
    //       addNametoScore(scoreRank, totalPoints, totalCardsPlayed, totalSeconds);
    //     } else {
    //       newHighscore("DIDN'T QUALIFY", totalPoints, totalCardsPlayed, totalSeconds);
    //     }
    //   });
  }
  
  function addNametoScore(scoreRank, totalPoints, totalCardsPlayed, totalSeconds) {
    const inputNameForm = document.getElementById("new-highscore-form");
  
    // Add score ranking to popup
    inputNameForm.querySelector("span").textContent = `${scoreRank + 1}`;

    // show popup and ask for name
    inputNameForm.classList.toggle("hidden");
    inputNameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!inputNameForm.querySelector("input").value) {
        inputNameForm.firstElementChild.textContent = 'please enter name';
      } else {
        newHighscore(inputNameForm.querySelector("input").value, totalPoints, totalCardsPlayed, totalSeconds);
      }
    });
  }
  
  function newHighscore(name, totalPoints, totalCardsPlayed, totalSeconds) {
    const now = new Date();
    db.collection("highscores")
      .add({
        date: firebase.firestore.Timestamp.fromDate(now),
        name: name,
        score: totalPoints,
        cards_played: totalCardsPlayed,
        seconds_played: totalSeconds,
        hidden: false,
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => console.log(err));
  }