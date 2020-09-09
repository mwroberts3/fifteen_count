const highscores = db
  .collection("highscores")
  .orderBy("score")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach(() => {
      console.log(doc.id, " => ", doc.data());
    });
  });
