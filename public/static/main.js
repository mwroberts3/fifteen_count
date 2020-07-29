const startGame = document.querySelector(".start-game");
startGame.addEventListener("click", () => threeMinuteTimer());

let html = ``;
// BUILD THE DECK
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
  const valueB = 0;

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
};
drawCards(drawSize);

// write to webpage
const playersHand = document.querySelector(".show-hand");
const showHand = () => {
  html = ``;
  playersHand.innerHTML = html;
  hand.forEach((card) => {
    if (card["suit"] == "hearts" || card["suit"] == "diamonds") {
      html += `<div class="card-in-hand"><card-t rank="${card["face"]}" suit="${card["suit"]}" valueA ="${card["valueA"]}" valueB ="${card["valueB"]}" cardcolor = "crimson" suitcolor="white" courtcolors="gold,red,green,orange,#000,4"></card-t></div>`;
    } else if (card["suit"] == "spades" || card["suit"] == "clubs") {
      html += `<div class="card-in-hand"><card-t rank="${card["face"]}" suit="${card["suit"]}" valueA ="${card["valueA"]}" valueB ="${card["valueB"]}" cardcolor="black" suitcolor="#fff"></card-t></div>`;
    } else {
      html += `<div class="card-in-hand joker"><card-t rank="1" suit="joker" suitcolor="#fff" cardcolor="dodgerblue" letters="J" valueA = "-1" valueB = "0"></div>`;
    }
    playersHand.innerHTML = html;
  });
};

showHand();

// SET 3 MINUTE TIMER
const timer = document.querySelector(".timer");
function threeMinuteTimer() {
  let seconds = 180;
  setInterval(() => {
    timer.innerHTML = seconds;
    seconds--;
    if (seconds < 0) {
      timer.innerHTML = "TIME IS UP!";
    }
  }, 1000);
}

// DISPLAY POINTS
const totalPointsDisplay = document.querySelector(".total-points");
const fifteenCountDisplay = document.querySelector(".fifteen-count");
const PointsDisplay = document.querySelector(".points-in-play");
const totalCardsPlayedDisplay = document.querySelector(".total-cards-played");
let totalPoints = 0;
let fifteenCount = 0;
let pointsInPlay = 0;
let totalCardsplayed = 0;
totalPointsDisplay.innerHTML = `Total: ${totalPoints}`;
fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
PointsDisplay.innerHTML = `Points: ${pointsInPlay}`;
totalCardsPlayedDisplay.innerHTML = `Total Cards Played: ${totalCardsplayed}`;

// GAMEPLAY VARIABLES & SWITCHES
const playersHandArea = document.querySelector(".players-hand");
const valueOptionOne = document.querySelector(".value-options-one");
let globalCardsInHand = [];
const valueOptionTwo = document.querySelector(".value-options-two");
const submitCards = document.querySelector(".submit-cards");
const comboMessage = document.querySelector(".combo-message");
const sameColorRed = (color) => color == "hearts" || color == "diamonds";
const sameColorBlack = (color) => color == "clubs" || color == "spades";
let pointsValidity = false;
let firstSubmit = false;
let comboSubmit = false;
let comboSkip = false;
let comboCardcount = 0;

const reset = () => {
  pointsValidity = false;
  firstSubmit = false;
  comboSubmit = false;
  comboSkip = false;
  comboCardcount = 0;
  submitCards.value = "Play Cards [Shift]";
  comboMessage.innerText = "";
};

// Combo Check
const comboCheck = () => {
  let checkedCardSuits = [];
  let checkedCards = document.querySelectorAll(".checked");
  comboCardcount = 0;
  pointsInPlay = 0;
  pointsValidity = false;
  // console.log(checkedCards.length);
  checkedCards.forEach((card) => {
    if (
      card.children[0]["rank"] == "ace" &&
      fifteenCount === 15 &&
      checkedCards.length === 1
    ) {
      pointsInPlay = 15;
      pointsValidity = true;
      console.log("true ace");
    } else if (card.children[0]["suit"] != "joker") {
      checkedCardSuits.push(card.children[0]["suit"]);
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
  PointsDisplay.innerHTML = `Points: ${pointsInPlay}`;
  fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;

  // *****COMBO CHECK DEBUG CONSOLE*****
  // console.log("red combo:", checkedCardSuits.every(sameColorRed));
  // console.log("black combo:", checkedCardSuits.every(sameColorBlack));
  // console.log(checkedCardSuits, comboCardcount);
  // console.log(fifteenCount);
};

// submitting cards
const cardsSubmit = () => {
  if (comboSkip === true) {
    reDeal(globalCardsInHand, hand);
    showHand();
    reset();
    selectCard();
  }
  if (pointsValidity === true) {
    firstSubmit = true;
    totalPoints += pointsInPlay;
    pointsInPlay = 0;
    fifteenCount = 0;
    submitCards.value = "Draw cards [Shift]";
    comboMessage.innerText = "COMBO ROUND!";
    comboSkip = true;
  }
  if (pointsValidity === true && comboSubmit === true) {
    reDeal(globalCardsInHand, hand);
    showHand();
    reset();
    selectCard();
  }

  totalPointsDisplay.innerHTML = `Total: ${totalPoints}`;
  fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
  PointsDisplay.innerHTML = `Points: ${pointsInPlay}`;
  // console.log("clicking works");
  // console.log(pointsValidity);
};

// accepts shift key or button click to trigger next phase
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 16) {
    cardsSubmit();
  }
});
submitCards.addEventListener("click", cardsSubmit);
playersHandArea.addEventListener("dblclick", cardsSubmit);

// Selecting Cards to Play
function selectCard() {
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
    // let cardRank = card.querySelector("card-t").getAttribute("rank");
    card.addEventListener("click", () => {
      if (card.classList.contains("checked")) {
        card.classList.toggle("checked");
        valueOptionOne.innerText = "-";
        valueOptionTwo.innerText = "-";
        if (valueB > 0 && card.classList.contains("A")) {
          fifteenCount -= valueA;
          card.classList.toggle("A");
          fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
        } else if (valueB > 0 && card.classList.contains("B")) {
          fifteenCount -= valueB;
          card.classList.toggle("B");
          fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
        } else if (valueB === 0) {
          fifteenCount -= valueA;
        }
        comboCheck();
        fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;

        console.log("Fifteen Count:", fifteenCount);
      } else if (firstSubmit === true) {
        if (!card.classList.contains("checked")) {
          console.log("unchecked cards being found");
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
              fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
              card.classList.toggle("A");
              comboCheck();
            }
          });
          valueOptionTwo.addEventListener("click", () => {
            if (
              !card.classList.contains("B") &&
              !card.classList.contains("A") &&
              card.classList.contains("checked")
            ) {
              fifteenCount += valueB;
              fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
              card.classList.toggle("B");
              comboCheck();
            }
          });
        } else if (valueB === 0) {
          valueOptionOne.innerText = "-";
          valueOptionTwo.innerText = "-";
          fifteenCount += valueA;
          fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
        }
        fifteenCountDisplay.innerHTML = `Fifteen Count: ${fifteenCount}`;
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
  let checkedCards = document.querySelectorAll(".checked");
  let sacrificedCards = document.querySelectorAll(".combo-sacrifice");
  let checkedCardSuits = [];
  checkedCards.forEach((card) => {
    if (card.children[0]["suit"] != "joker") {
      checkedCardSuits.push(card.children[0]["suit"]);
    }
    if (card.children[0]["rank"] == "ace") {
      comboCardcount = 1;
    }
  });
  sacrificedCards.forEach((card) => {
    if (card.children[0]["suit"] != "joker") {
      checkedCardSuits.push(card.children[0]["suit"]);
    }
  });
  if (
    checkedCardSuits.every(sameColorRed) == true ||
    checkedCardSuits.every(sameColorBlack) == true
  ) {
    comboCardcount *= 2;
  }
  console.log(checkedCardSuits);
  submitCards.value = "combo submit / draw cards [Shift]";
  totalPoints += valueA * comboCardcount;
  totalPointsDisplay.innerHTML = `Total: ${totalPoints}`;
  console.log(valueA, comboCardcount, totalPoints);
}

function reDeal(cardsInHand, hand) {
  let lostCards = 0;
  let cardsSacrified = [];
  // console.log(cardsInHand, hand);
  cardsInHand.forEach((card) => {
    if (card.classList.contains("combo-sacrifice")) {
      lostCards++;
      cardsSacrified.push(card);
    }
    if (card.classList.contains("checked")) {
      cardsSacrified.push(card);
    }
  });

  for (let j = 0; j < cardsSacrified.length; j++) {
    for (let i = 0; i < hand.length; i++) {
      if (
        cardsSacrified[j].children[0]["suit"] == hand[i]["suit"] &&
        cardsSacrified[j].children[0]["rank"] == hand[i]["face"]
      ) {
        hand.splice(i, 1);
      } else if (
        cardsSacrified[j].children[0]["suit"] == "joker" &&
        hand[i]["suit"] == null
      ) {
        hand.splice(i, 1);
      }
    }
  }

  drawSize = cardsSacrified.length - lostCards;
  totalCardsplayed += cardsSacrified.length;
  totalCardsPlayedDisplay.innerHTML = `Total Cards Played: ${totalCardsplayed}`;
  deckCheck(drawSize);
  drawCards(drawSize);
}

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
