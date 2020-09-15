const scoreDisplay = document.querySelector(".score-display");

db.collection("highscores")
  .where("hidden", "==", false)
  .orderBy("score", "desc")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.data().score);
      scoreDisplay.innerHTML += `
      <li>POINTS: ${doc.data().score} - ${
        doc.data().cards_played
      } PPC: ${Math.round(
        doc.data().score / doc.data().cards_played
      )} LENGTH(sec): ${doc.data().seconds_played} - ${
        doc.data().name
      } - ${doc.data().date.toDate()}</li>
      `;
    });
  });
