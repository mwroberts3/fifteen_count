const scoreDisplay = document.querySelector(".score-display");
const errorMsg = document.querySelector(".error-msg");

db.collection("highscores")
  .where("hidden", "==", false)
  .orderBy("score", "desc")
  .get()
  .then((querySnapshot) => {
    let scoreRank = 1;
    querySnapshot.forEach((doc) => {
      // console.log(doc.data().score);
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
  }).catch((err) => errorMsg.textContent = `not connected to internet, ${err}`);
