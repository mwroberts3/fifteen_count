const scoreDisplay = document.querySelector(".score-display");

db.collection("highscores")
  .orderBy("score", "desc")
  .get()
  .then((querySnapshot) => {
    if (querySnapshot.size >= 3) {
      console.log("right on the money");
    }
    querySnapshot.forEach((doc) => {
      // console.log(doc.data().score);
      scoreDisplay.innerHTML += `
      <li>${doc.data().score} - ${doc.data().cards_played} - ${
        doc.data().name
      } - ${doc.data().date}</li>
      `;
    });
  });
