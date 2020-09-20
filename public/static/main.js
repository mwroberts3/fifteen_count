// CONTROL OPTIONS (from options page)
// IN PROGRESS
// not sure how to change these on one screen and use on another without local storage...not sure if local storage works with steam...maybe with steam tools or maybe vue can do this, or electron tools
const actionBtn = "ShiftLeft";
const lowValBtn = "ControlLeft";
const uncheckAllBtn = "KeyA";
const swapCard = "KeyC";
const pauseBtn = "Space";

const buttonOptions = document.querySelector("#controls");
const buttonSelectPopup = document.querySelector(".button-select");

if (buttonOptions) {
  buttonOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN"){
      buttonSelectPopup.classList.remove("hidden");
      let buttonToReplace = e.target;
  
      document.addEventListener("keyup", (e) => {
        console.log(e.code);
        buttonSelectPopup.classList.add("hidden");
        buttonToReplace.textContent = `[${e.code}]`;
        buttonToReplace = '';
      })
    }
  });
}
// *************************************

// DOM sections
const playersHandArea = document.querySelector(".players-hand");
const valueOptionOne = document.querySelector(".value-options-one");
let globalCardsInHand = [];
const valueOptionTwo = document.querySelector(".value-options-two");
const submitCards = document.querySelector(".submit-cards");
const comboMessage = document.querySelector(".combo-message");
const hudMessage = document.querySelector(".hud-message");
const swapButton = document.querySelector(".swap-container");
const sameColorRed = (color) => color == "hearts" || color == "diamonds";
const sameColorBlack = (color) => color == "clubs" || color == "spades";

// Display
const totalPointsDisplay = document.querySelector(".total-points");
const fifteenCountDisplay = document.querySelector(".fifteen-count");
const PointsDisplay = document.querySelector(".points-in-play");
const totalCardsPlayedDisplay = document.querySelector(".total-cards-played");
let totalPoints = 0;
let fifteenCount = 0;
let pointsInPlay = 0;
let totalCardsPlayed = 0;
totalPointsDisplay.innerHTML = `${totalPoints} Points`;
fifteenCountDisplay.innerHTML = `${fifteenCount}`;
totalCardsPlayedDisplay.innerHTML = `${totalCardsPlayed} Cards Played`;

// Gameplay variables & switches
let pointsValidity = false;
let firstSubmit = false;
let comboSubmit = false;
let comboSkip = false;
let countdownStart = true;
let comboCardcount = 0;

let roundBonusTimer = 0;

let secondsBonus = 12;
let fullHandBonus = 35;

let html = ``;

// Build Deck
let cardCount = 54;
let deck = [];

const buildDeck = (deck) => {
  const suits = ["clubs", "diamonds", "hearts", "spades"];
  const face = [
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "jack",
    "queen",
    "king",
    "ace",
  ];
  const valueA = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < face.length; j++) {
      let card = { suit: "", color: "", face: "", valueA: 0, valueB: 0 };
      card.suit = suits[i];
      card.face = face[j];
      card.valueA = valueA[j];
      if (
        card.face == "jack" ||
        card.face == "queen" ||
        card.face == "king" ||
        card.face == "ace"
      ) {
        card.valueB = 1;
      } else {
        card.valueB = 0;
      }
      if (card.suit == "clubs" || card.suit == "spades") {
        card.color = "black";
      } else if (card.suit == "diamonds" || card.suit == "hearts") {
        card.color = "red";
      } else {
        card.color = null;
      }

      deck.push(card);
    }
  }
  // add Jokers
  for (let i = 0; i < 2; i++) {
    let card = { suit: null, face: "joker", valueA: -1, valueB: 0 };
    deck.push(card);
  }
};

buildDeck(deck);


// SHUFFLE DECK
const shuffle = (deck, cardCount) => {
  for (let i = 0; i < 1400; i++) {
    let rand1 = Math.random();
    shuffle1 = Math.round(rand1 * cardCount);
    let rand2 = Math.random();
    shuffle2 = Math.round(rand2 * cardCount);

    temp = deck[shuffle2];

    deck[shuffle2] = deck[shuffle1];
    deck[shuffle1] = temp;
  }
  // removes any undefined elements (index numbers that weren't randomly generated)
  deck = deck.filter(function (element) {
    return element !== undefined;
  });
  return deck;
};
deck = shuffle(deck, cardCount);

// DRAW HAND OF 10 CARDS
let drawSize = 10;
let hand = [];

const drawCards = (drawSize) => {
  for (i = 0; i < drawSize; i++) {
    hand.splice(i, 0, deck.pop());
  }
  console.log("deck size:", deck.length, "drawsize:", drawSize);
  hudMessage.innerText = "Count";
};
drawCards(drawSize);

// write to webpage
const currentHand = document.querySelector(".show-hand");
const showHand = () => {
  html = ``;
  currentHand.innerHTML = html;
  hand.forEach((card) => {
    console.log(card["valueA"]);
    if (card["suit"] === "hearts" || card["suit"] === "diamonds") {
      html += `
      <div class="card-in-hand card-sprite red-${card["face"]}">
        <card-t rank="${card["face"]}" suit="${card["suit"]}" valueA ="${card["valueA"]}" valueB ="${card["valueB"]}">
        </card-t>
      </div>
      `;
    } else if (card["suit"] == "spades" || card["suit"] == "clubs") {
      html += `
      <div class="card-in-hand card-sprite black-${card["face"]}">
        <card-t rank="${card["face"]}" suit="${card["suit"]}" valueA ="${card["valueA"]}" valueB ="${card["valueB"]}">
        </card-t>
      </div>`;
    } else {
      html += `
      <div class="card-in-hand card-sprite joker">
        <card-t rank="1" suit="joker" valueA = "-1" valueB = "0">
        </card-t>
      </div>`;
    }
    currentHand.innerHTML = html;
  });
};

showHand();


// Set 100 second game timer and set-up bonus time display
const timer = document.querySelector(".timer");
let totalSeconds = 100;
let secondsLeft = 99;
let threeTimerStart = 0;


const bonusTimeDisplay = document.querySelector(".bonus-time")

  
let gameTimer  = setInterval(timerFunction, 1000)

  function timerFunction() {
    let threeTimerFinish = new Date().getTime();
    if (threeTimerFinish - threeTimerStart >= 1000) {
      timer.textContent = `${secondsLeft}`;
      secondsLeft--;
    }
    if (secondsLeft <= -1) {
      pauseButton.removeEventListener("click", pauseGame);
      document.removeEventListener("keyup", buttonPause); 
      scoreReview();
      clearInterval(gameTimer );
    }
  }

const reset = () => {
  pointsValidity = false;
  firstSubmit = false;
  comboSubmit = false;
  comboSkip = false;
  comboCardcount = 0;
  setSwapPermission();
  setUncheckAllPermission();
  submitCards.value = "Play Cards [Shift]";
  // comboMessage.innerText = "";
};

// Combo Check
const comboCheck = () => {
  let checkedCardSuits = [];
  let checkedCards = document.querySelectorAll(".checked");
  comboCardcount = 0;
  pointsInPlay = 0;
  pointsValidity = false;
  console.log(checkedCards.length);
  checkedCards.forEach((card) => {
    if (
      card.children[0].getAttribute("rank") == "ace" &&
      fifteenCount === 15 &&
      checkedCards.length === 1
    ) {
      pointsInPlay = 15;
      pointsValidity = true;
      console.log("true ace");
    } else if (card.children[0].getAttribute("rank") != "joker") {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
      comboCardcount++;
    }
  });
  if (comboCardcount > 1 && fifteenCount === 15) {
    pointsInPlay = comboCardcount * 15;
    pointsValidity = true;
    if (
      checkedCardSuits.every(sameColorRed) == true ||
      checkedCardSuits.every(sameColorBlack) == true
    ) {
      pointsInPlay *= 2;
    }
  }

  fifteenCountDisplay.innerHTML = `${fifteenCount}`;

  // *****COMBO CHECK DEBUG CONSOLE*****
  // console.log("red combo:", checkedCardSuits.every(sameColorRed));
  // console.log("black combo:", checkedCardSuits.every(sameColorBlack));
  // console.log(checkedCardSuits, comboCardcount);
  // console.log(fifteenCount);
};

// SUBMITTING CARDS
const cardsSubmit = () => {
  // make sure multi-value cards have a value selected
  let checkedCards = document.querySelectorAll(".checked");
  checkedCards.forEach((card) => {
    console.log(card.children[0].getAttribute("rank"));
    if (!card.classList.contains("value-selected") && pointsValidity) {
      if (card.children[0].getAttribute("rank") === "jack" || card.children[0].getAttribute("rank") === "queen" || card.children[0].getAttribute("rank") === "king" || card.children[0].getAttribute("rank") === "ace"){
        card.classList.remove("checked");
      }
    }
  });

  checkedCards = document.querySelectorAll(".checked");

  if (comboSkip === true) {
    reDeal(globalCardsInHand, hand);
    showHand();
    reset();
    selectCard();
    playersHandArea.classList.toggle("combo-round");
    hudMessage.innerText = "Count";
  }
  if (pointsValidity === true) {
    totalPoints += pointsInPlay;
    pointsInPlay = 0;
    fifteenCount = 0;
    submitCards.value = "Draw cards [Shift]";
    comboSkip = true;
    playersHandArea.classList.toggle("combo-round");
    hudMessage.innerText = "Combo!";
    // adds 7 seconds to clock, if at least half-amount of cards in hand are played
    if (checkedCards.length >= globalCardsInHand.length / 2 && !firstSubmit) {

      if (secondsBonus < 3) {
        secondsBonus = 3;
      }

      console.log("seconds left", secondsLeft);

      secondsLeft += secondsBonus + 1;
      totalSeconds += secondsBonus;

      bonusTimeDisplay.textContent = `+${secondsBonus}`
      setTimeout(() => {

        bonusTimeDisplay.textContent = ``;
      }, 1000)


      console.log("seconds bonus +", secondsBonus);

      secondsBonus--;

      console.log("seconds left", secondsLeft);
    }

    firstSubmit = true;
    setSwapPermission();
    setUncheckAllPermission();

    if (checkedCards.length === globalCardsInHand.length) {
      secondsLeft += fullHandBonus;
      totalSeconds += fullHandBonus;

      // these will have game skip combo round after playing a full hand
      comboSubmit = true;
      playersHandArea.classList.toggle("combo-round");

      bonusTimeDisplay.textContent = `+${(secondsBonus + 1) + fullHandBonus}`

      setTimeout(() => {

        bonusTimeDisplay.textContent = ``;
      }, 1000)


      fullHandBonus--;
    }
  }
  if (pointsValidity === true && comboSubmit === true) {
    reDeal(globalCardsInHand, hand);
    showHand();
    reset();
    selectCard();
  }

  totalPointsDisplay.innerHTML = `${totalPoints} Points`;
  fifteenCountDisplay.innerHTML = `${fifteenCount}`;

  // console.log("clicking works");
  // console.log(pointsValidity);
};

// BUTTON SUBMIT
// accepts shift key or button click or doubleclick to trigger next phase
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 16) {
    roundBonusCheck();
  }
});

submitCards.addEventListener("click", roundBonusCheck);
playersHandArea.addEventListener("dblclick", roundBonusCheck);



function roundBonusCheck() {

  let roundBonusTimerCheck = new Date();

  let roundBonusPoints = 0;

  let roundBonuses = [
    0.1,
    1.09,
    1.08,
    1.07,
    1.06,
    1.05,
    1.04,
    1.03,
    1.02,
    1.01,
  ];
  let checkedCards = document.querySelectorAll(".checked").length;
  let diff =


    (roundBonusTimerCheck.getTime() - roundBonusTimer.getTime()) / 1000;
  diff = Math.round(diff);

  if (diff <= 9 && firstSubmit === false && pointsValidity === true) {


    roundBonusPoints = pointsInPlay * roundBonuses[diff] - pointsInPlay;


    roundBonusPoints = Math.round(roundBonusPoints);

    totalPoints += roundBonusPoints + checkedCards;
  }
  console.log(
    "round time:",
    diff,
    "points in play:",
    pointsInPlay,

    "speed bonus points:",

    roundBonusPoints,
    "checked cards: ",
    checkedCards,

    "total bonus points: ",

    roundBonusPoints + checkedCards
  );

  cardsSubmit();
}

// SELECTING CARDS
function selectCard() {

  setSwapPermission();
  setUncheckAllPermission();

  roundBonusTimer = new Date();
  let cardsInHand = document.querySelectorAll(".card-in-hand");
  globalCardsInHand = cardsInHand;


  cardsInHand.forEach((card) => {
    let valueA = parseInt(
      card.querySelector("card-t").getAttribute("valueA"),
      10
    );
    let valueB = parseInt(
      card.querySelector("card-t").getAttribute("valueB"),
      10
    );
    card.addEventListener("click", () => {
      if (countdownStart) {
        countdownStart = false;
      }
      if (card.classList.contains("checked") && !firstSubmit) {
        card.classList.toggle("checked");
        valueOptionOne.innerText = "-";
        valueOptionTwo.innerText = "-";
        if (valueB > 0 && card.classList.contains("A")) {
          fifteenCount -= valueA;
          card.classList.toggle("A");
          card.classList.remove("value-selected");
          fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        } else if (valueB > 0 && card.classList.contains("B")) {
          fifteenCount -= valueB;
          card.classList.toggle("B");
          card.classList.remove("value-selected");
          fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        } else if (valueB === 0) {
          fifteenCount -= valueA;
        }
        comboCheck();
        fifteenCountDisplay.innerHTML = `${fifteenCount}`;

        console.log("Fifteen Count:", fifteenCount);
      } 
      // after initial checked cards have been played
      else if (firstSubmit) {
        // allows players to combo any card except a joker
        if (!card.classList.contains("checked") && card.children[0].getAttribute("suit") !== "joker") {
          card.classList.toggle("combo-sacrifice");
          doubleComboCheck(valueA, comboCardcount);
        }
      } else {
        if (valueB > 0) {
          valueOptionOne.innerText = valueA;
          valueOptionTwo.innerText = valueB;
          valueOptionOne.addEventListener("click", () => {
            if (
              !card.classList.contains("A") &&
              !card.classList.contains("B") &&
              card.classList.contains("checked")
            ) {
              fifteenCount += valueA;
              fifteenCountDisplay.innerHTML = `${fifteenCount}`;
              card.classList.toggle("A");
              card.classList.add("value-selected");
              comboCheck();
            }
          });
          document.addEventListener("keyup", (e) => {
            if (e.keyCode === 16) {
              if (
                !card.classList.contains("A") &&
                !card.classList.contains("B") &&
                card.classList.contains("checked")
              ) {
                fifteenCount += valueA;
                fifteenCountDisplay.innerHTML = `${fifteenCount}`;
                card.classList.toggle("A");
                card.classList.add("value-selected");
                comboCheck();
              }
            }
          });
          valueOptionTwo.addEventListener("click", () => {
            if (
              !card.classList.contains("B") &&
              !card.classList.contains("A") &&
              card.classList.contains("checked")
            ) {
              fifteenCount += valueB;
              fifteenCountDisplay.innerHTML = `${fifteenCount}`;
              card.classList.toggle("B");
              card.classList.add("value-selected");
              comboCheck();
            }
          });
          document.addEventListener("keyup", (e) => {
            if (e.keyCode === 17) {
              if (
                !card.classList.contains("B") &&
                !card.classList.contains("A") &&
                card.classList.contains("checked")
              ) {
                fifteenCount += valueB;
                fifteenCountDisplay.innerHTML = `${fifteenCount}`;
                card.classList.toggle("B");
                card.classList.add("value-selected");
                comboCheck();
              }
            }
          });
        } else if (valueB === 0) {
          valueOptionOne.innerText = "-";
          valueOptionTwo.innerText = "-";
          fifteenCount += valueA;
          fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        }
        fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        card.classList.toggle("checked");

        comboCheck();

        // console.log(cardRank);
        // console.log(valueA, valueB);
        // console.log("Fifteen Count:", fifteenCount);
      }
    });
  });
}

selectCard();

function doubleComboCheck(valueA, comboCardcount) {
  comboSubmit = true;
  comboSkip = false;
  comboCardcount = 0;
  let checkedCards = document.querySelectorAll(".checked");
  let sacrificedCards = document.querySelectorAll(".combo-sacrifice");
  let checkedCardSuits = [];
  console.log("checked cards", checkedCards, checkedCards.length);
  checkedCards.forEach((card) => {
    if (card.children[0].getAttribute("suit") != "joker") {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
      comboCardcount++;
      console.log("comboCardcount", comboCardcount);
    }
  });
  sacrificedCards.forEach((card) => {
    if (card.children[0].getAttribute("suit") != "joker") {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
    }
  });
  if (
    checkedCardSuits.every(sameColorRed) == true ||
    checkedCardSuits.every(sameColorBlack) == true
  ) {
    comboCardcount *= 2;
  }
  submitCards.value = "combo submit / draw cards [Shift]";
  totalPointsDisplay.innerHTML = `${totalPoints} + ${valueA * comboCardcount}`;
  totalPoints += valueA * comboCardcount;
  console.log(valueA, comboCardcount, totalPoints);
}

// SWAP CARD FUNCTION(s) & Event Listeners
function setSwapPermission() {
  console.log(firstSubmit);
  if (firstSubmit) {
    swapButton.removeEventListener("click", swapButtonFunction);
    document.removeEventListener("keyup", swapButtonPush);
  } else if (!firstSubmit){
    swapButton.addEventListener("click", swapButtonFunction);
    document.addEventListener("keyup", swapButtonPush);
  }
}

function swapButtonPush(e) {
  if (e.keyCode === 67) {
    swapButtonFunction();
  }
}

function swapButtonFunction() {
  let cardsInHand = document.querySelectorAll(".card-in-hand");

  // unchecked, already checked cards
  cardsInHand.forEach((card) => {
    if (card.classList.contains("checked")) {
      card.classList.toggle("checked");
    }
  })

  cardsInHand[cardsInHand.length - 1].classList.toggle("checked");
  reDeal(cardsInHand, hand);
  showHand();
  reset();
  selectCard();
  secondsLeft -= 2;
  fifteenCount = 0;
  fifteenCountDisplay.textContent = `${fifteenCount}`;
  bonusTimeDisplay.style.color = "rgba(51, 131, 235, 0.9)";
  bonusTimeDisplay.textContent = `-3`;
      setTimeout(() => {

        bonusTimeDisplay.textContent = ``;
        bonusTimeDisplay.style.color = "rgba(245, 217, 61, 0.9)";
      }, 1000)
}

// REDEAL FUNCTION
function reDeal(cardsInHand, hand) {
  let checkedCards = document.querySelectorAll(".checked");
  let sacrificedCards = document.querySelectorAll(".combo-sacrifice");
  let cardsPlayed = [];
  console.log("cards in hand", cardsInHand);
  console.log("hand", hand);
  cardsInHand.forEach((card) => {
    if (card.classList.contains("combo-sacrifice")) {
      cardsPlayed.push(card);
    } else if (card.classList.contains("checked")) {
      cardsPlayed.push(card);
      console.log("cards played", cardsPlayed);
    }
  });

  for (let j = 0; j < cardsPlayed.length; j++) {
    for (let i = 0; i < hand.length; i++) {
      console.log(cardsPlayed[j].children[0].getAttribute("suit"));
      console.log(hand[i]["suit"]);
      if (
        cardsPlayed[j].children[0].getAttribute("suit") == hand[i]["suit"] &&
        cardsPlayed[j].children[0].getAttribute("rank") == hand[i]["face"]
      ) {
        hand.splice(i, 1);
        break;
      } else if (
        cardsPlayed[j].children[0].getAttribute("suit") == "joker" &&
        hand[i]["suit"] == null
      ) {
        hand.splice(i, 1);
        break;
      }
    }
  }

  totalCardsPlayed += cardsPlayed.length;
  totalCardsPlayedDisplay.innerHTML = `${totalCardsPlayed} Cards Played`;

  // Check to see if all cards in hand were played, for possible replenish bonus

  console.log("hand length", hand.length);
  let numberCheckedCards = 0;
  if (hand.length === 0 && sacrificedCards.length === 0) {
    numberCheckedCards = 10;

    secondsBonus = 12;
  } else {
    numberCheckedCards = checkedCards.length;
  }

  deckCheck(numberCheckedCards);
  drawCards(numberCheckedCards);
}

// HIGHSCORE CHECK & RANKING FUNCTIONS
// when entering name, might want to find a regular expression that with block swear words
function scoreReview() {
  hudMessage.innerText = "TIME IS UP!";
  currentHand.style.display = "none";

  // gameplay analytics
  console.log("total clicks", totalClicks);
  console.log("total seconds", totalSeconds);
  console.log("total points", totalPoints);
  
  db.collection("highscores")
    .where("hidden", "==", false)
    .orderBy("score", "desc")
    .limit(50)
    .get()
    .then((snapshot) => {
      let scoreRank = 0;
      highscoresArr = snapshot.docs.map((doc) => doc.data().score);

      highscoresArr.forEach((score) => {
        if (totalPoints > score) {
          scoreRank++;
        }
      });

      scoreRank = highscoresArr.length - scoreRank;

      if (highscoresArr.length < 50) {
        addNametoScore(scoreRank);
      } else if (totalPoints > highscoresArr[highscoresArr.length - 1]) {
        addNametoScore(scoreRank);
      } else {
        newHighscore("DIDN'T QUALIFY");
      }

      console.log(highscoresArr);
    });
}

function addNametoScore(scoreRank) {
  const inputNameForm = document.getElementById("new-highscore-form");

  // Add score ranking to popup
  inputNameForm.querySelector("span").textContent = `${scoreRank + 1}`;

  // show popup and ask for name
  inputNameForm.classList.toggle("hidden");
  inputNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newHighscore(inputNameForm.querySelector("input").value);
  });
}

function newHighscore(name) {
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

// DECK CHECK AND REBUILD FUNCTIONS
function deckCheck(drawSize) {
  if (deck.length <= drawSize) {
    console.log("deck is less than drawsize");
    reBuildDeck();
  }
}

function reBuildDeck() {
  let tempDeck = [];
  deck.forEach((card) => {
    tempDeck.push(card);
  });
  deck = [];
  buildDeck(deck);
  deck = shuffle(deck, cardCount);
  tempDeck.forEach((card) => {
    deck.push(card);
  });
  console.log(tempDeck, deck);
}

// Pause Function(s) & Event Listeners
let gamePause = false;
let pauseScreen = document.querySelector("#pause-screen");
let pauseButton = document.querySelector(".menu-options");
let timeRemaining = document.querySelector(".time-remaining");

pauseButton.addEventListener("click", pauseGame);
document.addEventListener("keyup", buttonPause); 

function buttonPause(e) {
  if (e.keyCode === 32 && !gamePause) {
    pauseGame();
  } else if (e.keyCode === 32 && gamePause) {
    resumeGame();
  }
}

function pauseGame() {
  gamePause = true;
  clearInterval(gameTimer );
  pauseScreen.classList.remove("hidden");
  timeRemaining.textContent = `${secondsLeft + 1}`;
  
  setInterval(() => {
    timeRemaining.innerHTML = `&nbsp;&nbsp;`;
  }, 500)

  setInterval(() => {
    timeRemaining.textContent = `${secondsLeft + 1}`;
  }, 1000)
  
  
  
  pauseScreen.addEventListener("click", (e) => {
    console.log(e);
    if (e.target.tagName !== "BUTTON") {
      resumeGame();
    }
  });
}

function resumeGame() {
  gameTimer  = setInterval(timerFunction, 1000);
  gamePause = false;
  pauseScreen.classList.add("hidden");
}

// Uncheck all cards
function setUncheckAllPermission() {
  if (!firstSubmit) {
    document.addEventListener("keyup", uncheckAllCards)
  } else {
    document.removeEventListener("keyup", uncheckAllCards)
  }
}

function uncheckAllCards(e) {
  let checkedCards = document.querySelectorAll(".checked");
  if (e.code === "ArrowLeft") {
    fifteenCount = 0;
    checkedCards.forEach((card) => {
      card.classList.toggle("checked");
      card.classList.remove("value-selected");
      fifteenCountDisplay.textContent = `${fifteenCount}`
      valueOptionOne.textContent = "-"
      valueOptionTwo.textContent = "-"
      if (card.classList.contains("A")) {
        card.classList.toggle("A");
      } else if (card.classList.contains("B")) {
        card.classList.toggle("B");
      }
    });
  }
}

// GAMEPLAY ANALYTICS
let totalClicks = 0;

document.addEventListener("click", () => {
  totalClicks++;
});
