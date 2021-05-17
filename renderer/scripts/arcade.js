const highScoresFunc = require('./add-arcade-highscore');

const utils = require('./utils');

const { pointsReview } = require('./points-review');

const { hudMessage } = require('./hud-messages');

// Fadein
utils.gamescreenFadeinFunc();

// Set Cosmos Theme BG Position
utils.setCosmosBg();

// DOM sections
const playersHandArea = document.querySelector(".players-hand");
const valueOptionOne = document.querySelector(".value-options-one");
let globalCardsInHand = [];
const valueOptionTwo = document.querySelector(".value-options-two");
const submitCards = document.querySelector(".submit-cards");
const hudMessageDisplay = document.querySelector(".hud-message");
const swapButton = document.querySelector(".swap-container");
const sameColorRed = (color) => color == "hearts" || color == "diamonds" || color == "joker";
const sameColorBlack = (color) => color == "clubs" || color == "spades" || color == "joker";;
const currentHand = document.querySelector(".show-hand");

// Player Display
const totalPointsDisplay = document.querySelector(".total-points");
const comboPointsDisplay = document.querySelector(".combo-points");
const fifteenCountDisplay = document.querySelector(".fifteen-count");
const totalCardsPlayedDisplay = document.querySelector(".total-cards-played");
const swapCostDisplay = document.querySelector(".two-sec-warning");
let totalPoints = 0;
const pointsBreakdown = {cardPoints: 0, comboPoints: 0, timePoints: 0, fullClearPoints: 0, jackpotPoints: 0, speedPoints: 0, fullClearTimes: 0};
let fifteenCount = 0;
let pointsInPlay = 0;
let totalCardsPlayed = 0;
totalPointsDisplay.innerHTML = `${totalPoints}`;
totalCardsPlayedDisplay.innerHTML = `
<div style="
  width: 60px; 
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;  
  ">
  ${totalCardsPlayed} 
</div>
<img src="img/cards-icon.png"/>
`;

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
let fullHandPointsBonus = 50;

let html = ``;

let totalComboPoints = 0;

// Deck and first draw variables
let cardCount = 54;
let deck = [];
let drawSize = 10;
let hand = [];

// Timer variables
const timer = document.querySelector(".timer");
let totalSeconds = 100;
let secondsLeft = 99;
let threeTimerStart = 0;
let elapsedTime = 0;
const bonusTimeDisplay = document.querySelector(".bonus-time");

// Setting up deck & displaying for play
buildDeck(deck);
deck = shuffle(deck, cardCount);
drawCards(drawSize);
showHand();
let gameTimer = setInterval(timerFunction, 1000);

// Hud message flags
let fullHandPlayed = false;

// Init gameplay loop
let jackpotLive = false;
let jackpotInit = false;
let jackpotRandTiming;
let jackpotSecondsThreshold = 50;
addFreshPointsToTotal();
setSecondsBonusIndicator();
selectCard();
let incomingHudMessages = setInterval(() => {
  hudMessage(firstSubmit, jackpotLive, incomingHudMessages, fullHandPlayed);
},10)

// Button submit
document.addEventListener("keyup", (e) => {
  if (e.code === actionBtn) {
    roundBonusCheck();
  }
}); 

// Bonus check
submitCards.addEventListener("click", roundBonusCheck);
// playersHandArea.addEventListener("dblclick", roundBonusCheck);

// Build deck
function buildDeck(deck) {
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
    "ten-one",
    "eleven-one",
    "twelve-one",
    "fifteen-one",
  ];
  const valueA = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 15];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < face.length; j++) {
      let card = { suit: "", color: "", face: "", valueA: 0, valueB: 0 };
      card.suit = suits[i];
      card.face = face[j];
      card.valueA = valueA[j];
      if (
        card.face == "ten-one" ||
        card.face == "eleven-one" ||
        card.face == "twelve-one" ||
        card.face == "fifteen-one"
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
}

// Shuffle Deck
function shuffle(deck, cardCount) {
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
}

// Draw hand of ten cards
function drawCards(drawSize) {
  for (i = 0; i < drawSize; i++) {
    hand.splice(i, 0, deck.pop());
  }
  submitCards.value = `Play Cards [${actionBtn}]`;
}

// display hand to player
function showHand() {
  html = ``;
  currentHand.innerHTML = html;
  hand.forEach((card) => {
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
}

// Set 100 second game timer and set-up bonus time display
  function timerFunction() {
    let threeTimerFinish = new Date().getTime();
    if (threeTimerFinish - threeTimerStart >= 1000) {
      // console.log(secondsLeft);
      timer.textContent = `${secondsLeft}`;
      secondsLeft--;
      elapsedTime++;
    }
    if (secondsLeft <= 4) {
      timer.style.color = 'red';
    } else {
      timer.style.color = 'rgb(152, 253, 0)';
    }
    if (secondsLeft === -1) {
      clearInterval(incomingHudMessages);
      hudMessageDisplay.textContent = `Game Over`;
    }
    if (secondsLeft <= -2) {
      clearInterval(incomingHudMessages);
      hudMessageDisplay.textContent = `Game Over`;
      clearInterval(gameTimer);
      timer.textContent = '0';
      pointsOnDisplay = totalPoints;
      firstSubmit = true;
      setSwapPermission();
      // pauseButton.removeEventListener("click", pauseGame);
      // document.removeEventListener("keyup", buttonPause); 
      totalPointsDisplay.innerHTML = `${totalPoints}`;
      if (highscoreDefeated) {
        personalHighscoreDisplay.childNodes[1].textContent = pointsOnDisplay;
      }
      let scoreReviewCheck = pointsReview(pointsBreakdown, totalPoints);

      highScoresFunc.scoreReview(hudMessage, currentHand, totalPoints, totalCardsPlayed, totalSeconds);
    }
  }

function reset() {
  let cardsInHand = document.querySelectorAll(".card-in-hand");

  // refill some bonus time (3 secs per round with sacrifice)
  if (comboSubmit) {
    secondsBonus += 3;
    if (secondsBonus > 12) {
      secondsBonus = 12;
    }
  }

  pointsValidity = false;
  firstSubmit = false;
  comboSubmit = false;
  comboSkip = false;
  comboCardcount = 0;
  totalPoints += totalComboPoints;
  pointsBreakdown.comboPoints += totalComboPoints;
  totalComboPoints = 0;
  comboPointsDisplay.textContent = '';
  comboPointsDisplay.classList.remove('combo-points-fadein');
  valueOptionOne.innerText = "-";
  valueOptionTwo.innerText = "-";

  setSwapPermission();
  setUncheckAllPermission();
  submitCards.value = `Play Cards [${actionBtn}]`;
  swapCostDisplay.textContent = `${cardsInHand.length - 10}s`;

  // Hud messaging reset
  clearInterval(incomingHudMessages);
  incomingHudMessages = setInterval(() => {
    hudMessage(firstSubmit, jackpotLive, incomingHudMessages, fullHandPlayed);
  },10)
}

// Combo Check
function comboCheck() {
  let checkedCardSuits = [];
  let checkedCards = document.querySelectorAll(".checked");
  comboCardcount = 0;
  pointsInPlay = 0;
  pointsValidity = false;
  checkedCards.forEach((card) => {
    if (
      card.children[0].getAttribute("rank") == "fifteen-one" &&
      fifteenCount === 15 &&
      checkedCards.length === 1
    ) {
      pointsInPlay = 15;
      pointsValidity = true;
    } else {
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

  setFifteenCountColor();
  // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
}

// Submitting cards
function cardsSubmit() {
  // hud message flag
  fullHandPlayed = false;
  // make sure multi-value cards have a value selected
  let checkedCards = document.querySelectorAll(".checked");
  checkedCards.forEach((card) => {
    if (!card.classList.contains("value-selected") && pointsValidity) {
      if (card.children[0].getAttribute("rank") === "ten-one" || card.children[0].getAttribute("rank") === "eleven-one" || card.children[0].getAttribute("rank") === "twelve-one" || card.children[0].getAttribute("rank") === "fifteen-one"){
        card.classList.remove("checked");
      }
    }
  });

  checkedCards = document.querySelectorAll(".checked");

  if (comboSkip === true) {
    reDeal(globalCardsInHand, hand);
    showHand();
    jackpotSelect();
    reset();
    selectCard();
    // setPlayersHandBg();
    document.querySelector('.players-hand').style.removeProperty('background-image');
  }
  if (pointsValidity === true) {
    totalPoints += pointsInPlay;
    pointsBreakdown.cardPoints += pointsInPlay;
    pointsInPlay = 0;
    fifteenCount = 0;
    submitCards.value = `Draw Cards [${actionBtn}]`;
    comboSkip = true;
    playersHandArea.style.backgroundImage = `url("./img/${themeSelection['bgImgCombo']}")`;
    // clearBgImgIntervals();

    // Check for jackpot bonus
    if (jackpotLive) {
      if (!firstSubmit) {
        checkedCardSuits = [];
        console.log(checkedCards);        
        let jackCheckedCheck = Array.from(checkedCards);       
        jackCheckedCheck = jackCheckedCheck.filter(card => card.classList.contains('jackpot-special-border'));

        // class formerly 'jackpot-card'

        if (jackCheckedCheck.length === 0) {
          totalCardsPlayed = Math.round(totalCardsPlayed/2);
        } else {
          // totalCardsPlayed = Math.round(totalCardsPlayed * 1.5);
          checkedCards.forEach((card) => {
              checkedCardSuits.push(card.children[0].getAttribute("suit"));
          });
          checkedCards.forEach((card) => {
            if (card.classList.contains('jackpot-special-border')){
              if (checkedCardSuits.every(sameColorRed) == true ||
              checkedCardSuits.every(sameColorBlack) == true) {
                console.log(totalPoints, (totalCardsPlayed * 2), totalPoints + (totalCardsPlayed * 2));
                totalPoints +=(totalCardsPlayed * 2);
                pointsBreakdown.jackpotPoints += totalCardsPlayed * 2;
              } else {
                console.log(totalPoints, totalCardsPlayed, totalPoints + totalCardsPlayed);
                totalPoints += totalCardsPlayed;
                pointsBreakdown.jackpotPoints += totalCardsPlayed;
              }
            }
          });
        }
      }
      jackpotLive = false;
    }

    // add seconds to clock, if at least half-amount of cards in hand are played
    if (checkedCards.length >= globalCardsInHand.length / 2 && !firstSubmit) {

      if (secondsBonus < 3) {
        secondsBonus = 3;
      }

      secondsLeft += secondsBonus + 1;
      totalSeconds += secondsBonus;

      totalPoints += secondsBonus;  

      pointsBreakdown.timePoints += secondsBonus;

      bonusTimeDisplay.textContent = `+${secondsBonus}`
      setTimeout(() => {

        bonusTimeDisplay.textContent = ``;
      }, 1000)

      secondsBonus--;
    }

    valueOptionOne.innerText = "-";
    valueOptionTwo.innerText = "-";
    firstSubmit = true;

    // First submit sound effect
    if (userSelectedSoundSettings.SFX) {
      firstSubmitSFX.play();
    }
    
    hudMessageDisplay.textContent = 'Combo!';
    setSwapPermission();
    setUncheckAllPermission();

    if (checkedCards.length === globalCardsInHand.length) {
      secondsLeft += fullHandBonus;
      totalSeconds += fullHandBonus;
      totalPoints += fullHandBonus;
      totalPoints += fullHandPointsBonus;

      pointsBreakdown['fullClearTimes']++;

      pointsBreakdown.fullClearPoints += fullHandPointsBonus;
      pointsBreakdown.timePoints += fullHandBonus

      // these will have game skip combo round after playing a full hand
      comboSubmit = true;
      bonusTimeDisplay.textContent = `+${(secondsBonus + 1) + fullHandBonus}`

      setTimeout(() => {

        bonusTimeDisplay.textContent = ``;
      }, 1000)

      // subtract 5 seconds from full hand bonus until reaches 0
      fullHandBonus -= 5;
      if (fullHandBonus <= 0) {
        fullHandBonus = 0;
      }

      // if Harmonia is acheived by playing 10 cards, the fullhandbonus is reset to 35
      if (checkedCards.length === 10) {
        fullHandBonus = 35;
      }

      fullHandPointsBonus += 50;

      // For hud message
      fullHandPlayed = true;

      // Full hand sound effect
      if (userSelectedSoundSettings.SFX) {
      fullClearSFX.play();
      }

      // Full hand border animation
      let i = 0;
      let borderAniCol = themeSelection['fullClearBrdGrd'];

      const borderAnimation = setInterval(() => {
        document.querySelector(".gui-container").style.border = `4px solid ${borderAniCol[i]}`;
        i++;

        if (i > themeSelection['fullClearBrdGrd'].length)  {
          clearInterval(borderAnimation);
          document.querySelector(".gui-container").style.border = `4px solid ${themeSelection['brdCol']}`;
        }
      }, 100);
    }
  }
  if (pointsValidity === true && comboSubmit === true) { 
    // combo submit sound effect
    if (userSelectedSoundSettings.SFX) {
    comboSubmitSFX.play();
    }

    document.querySelector('.players-hand').style.removeProperty('background-image');
    reDeal(globalCardsInHand, hand);
    showHand();
    jackpotSelect();
    reset();
    selectCard();
  }
  setSecondsBonusIndicator();
  setFifteenCountColor();
  // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
}

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

    totalPoints += roundBonusPoints;

    pointsBreakdown.speedPoints += roundBonusPoints;
  }

  cardsSubmit();
}

// Selecting cards
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

        if (userSelectedSoundSettings.SFX) {
        checkCardSFX.play();
        }

        valueOptionOne.innerText = "-";
        valueOptionTwo.innerText = "-";
        if (valueB > 0 && card.classList.contains("A")) {
          fifteenCount -= valueA;
          card.classList.toggle("A");
          card.classList.remove("value-selected");
          setFifteenCountColor();
          // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        } else if (valueB > 0 && card.classList.contains("B")) {
          fifteenCount -= valueB;
          card.classList.toggle("B");
          card.classList.remove("value-selected");
          setFifteenCountColor();
          // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        } else if (valueB === 0) {
          fifteenCount -= valueA;
        }
        comboCheck();
        setFifteenCountColor();
        // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
      } 
      // after initial checked cards have been played
      else if (firstSubmit) {
        if (!card.classList.contains("checked") && !card.classList.contains('joker')) {
          card.classList.add("combo-sacrifice");

          if (userSelectedSoundSettings.SFX) {
          sacrificeCardSFX.play();
          }

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
              setFifteenCountColor();
              // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
              card.classList.toggle("A");
              card.classList.add("value-selected");
              comboCheck();
            }
          });
          document.addEventListener("keyup", (e) => {
            if (e.code === actionBtn) {
              if (
                !card.classList.contains("A") &&
                !card.classList.contains("B") &&
                card.classList.contains("checked")
              ) {
                fifteenCount += valueA;
                setFifteenCountColor();
                // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
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
              setFifteenCountColor();
              // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
              card.classList.toggle("B");
              card.classList.add("value-selected");
              comboCheck();
            }
          });
          document.addEventListener("keyup", (e) => {
            if (e.code === lowValBtn) {
              if (
                !card.classList.contains("B") &&
                !card.classList.contains("A") &&
                card.classList.contains("checked")
              ) {
                fifteenCount += valueB;
                setFifteenCountColor();
                // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
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
          setFifteenCountColor();
          // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        }
        setFifteenCountColor();
        // fifteenCountDisplay.innerHTML = `${fifteenCount}`;
        card.classList.toggle("checked");

        // checked card sound effect
        if (userSelectedSoundSettings.SFX) {
        checkCardSFX.play();
        }

        comboCheck();
      }
    });
  });
}

function doubleComboCheck(valueA, comboCardcount) {
  comboSubmit = true;
  comboSkip = false;
  comboCardcount = 0;
  let checkedCards = document.querySelectorAll(".checked");
  let sacrificedCards = document.querySelectorAll(".combo-sacrifice");
  let checkedCardSuits = [];
  checkedCards.forEach((card) => {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
  });
  sacrificedCards.forEach((card) => {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
  });
  comboCardcount = checkedCardSuits.length - 1;
  if (
    checkedCardSuits.every(sameColorRed) == true ||
    checkedCardSuits.every(sameColorBlack) == true
  ) {
    comboCardcount *= 2;
  }

  totalComboPoints += Math.round(valueA * comboCardcount);
  submitCards.value = `Combo Submit / Draw Cards [${actionBtn}]`;
  comboPointsDisplay.textContent = `+${totalComboPoints}`;
  comboPointsDisplay.classList.add('combo-points-fadein');
}

// check for newHighscore
let highscoreDefeated = false;
function newHighscoreCheck() {
  if (!highscoreDefeated) {
    if (pointsOnDisplay > highscoreToBeat) {
      clearInterval(incomingHudMessages);
      hudMessageDisplay.textContent = 'NEW HIGHSCORE!';
      if (highscoreToBeat !== 0) {
        // New highscore sound effect
        if (userSelectedSoundSettings.SFX) {
        newHighscoreSFX.play();
        }
      }
      highscoreDefeated = true;
      setTimeout(() => { 
        incomingHudMessages = setInterval(() => {
          hudMessage(firstSubmit, jackpotLive, incomingHudMessages, fullHandPlayed);
        },10);
      }, 2000)
    } 
  }
}

// Swap card function(s) & event listeners
function setSwapPermission() {
  if (firstSubmit || secondsLeft <= 0) {
    swapButton.removeEventListener("click", swapButtonFunction);
    document.removeEventListener("keyup", swapButtonPush);
  } else if (!firstSubmit){
    swapButton.addEventListener("click", swapButtonFunction);
    document.addEventListener("keyup", swapButtonPush);
  }
}

function swapButtonPush(e) {
  if (e.code === swapBtn) {
    swapButtonFunction();
  }
}

function swapButtonFunction() {
  let cardsInHand = document.querySelectorAll(".card-in-hand");

  // uncheck already checked cards
  cardsInHand.forEach((card) => {
    if (card.classList.contains("checked")) {
      card.classList.toggle("checked");
    }

    // SWAP CARD ANIMATION ->->
    console.log(cardsInHand.length);

    let swapSlideAnimationLength;

    if (cardsInHand.length >= 8) {
      swapSlideAnimationLength = 100;
    } else if (cardsInHand.length < 8 && cardsInHand.length >= 1) {
      swapSlideAnimationLength = 200;
    }

    currentHand.style.margin = `15.188px 8.938px 15.188px ${8.938 - swapSlideAnimationLength}px`;
    
    currentHand.style.transition = "transform ease 0.2s";
    currentHand.style.transform = `translateX(${swapSlideAnimationLength}px)`;
    
    setTimeout(() => {
      currentHand.style.transition = "none";
      currentHand.style.margin = "15.188px 8.938px";
      currentHand.style.transform = "translateX(0)"
    }, 450);
  })

  // swapping with jackpot card in hand erases jackpot
  if (jackpotLive) {
    totalCardsPlayed = Math.round(totalCardsPlayed/2);
    jackpotLive = false;
  }

  cardsInHand[cardsInHand.length - 1].classList.toggle("checked");
  reDeal(cardsInHand, hand);
  showHand();
  jackpotSelect();
  reset();
  selectCard();
  secondsLeft -= (10 - cardsInHand.length);
  fifteenCount = 0;
  fifteenCountDisplay.textContent = ``;
  bonusTimeDisplay.style.color = "rgba(51, 131, 235, 0.9)";

  if (secondsLeft <= 5) {
    timer.style.color = 'red'
  }

  if (cardsInHand.length < 10) {
    timer.textContent = `${secondsLeft + 1}`;
    bonusTimeDisplay.textContent = `${(cardsInHand.length - 10)}`;
        setTimeout(() => {
          bonusTimeDisplay.textContent = ``;
          bonusTimeDisplay.style.color = "rgba(245, 217, 61, 0.9)";
        }, 1000)
  }

  if (userSelectedSoundSettings.SFX) {
    swapCardSFX.play();
  }
}

// Redeal
function reDeal(cardsInHand, hand) {
  let checkedCards = document.querySelectorAll(".checked");
  let sacrificedCards = document.querySelectorAll(".combo-sacrifice");
  let cardsPlayed = [];
  cardsInHand.forEach((card) => {
    if (card.classList.contains("combo-sacrifice")) {
      cardsPlayed.push(card);
    } else if (card.classList.contains("checked")) {
      cardsPlayed.push(card);
    }
  });

  for (let j = 0; j < cardsPlayed.length; j++) {
    for (let i = 0; i < hand.length; i++) {
      if (
        cardsPlayed[j].children[0].getAttribute("suit") == hand[i]["suit"] &&
        cardsPlayed[j].children[0].getAttribute("rank") == hand[i]["face"]
      ) {
        // ensure that last card in hand is always swapped, incase there's an identical card earlier up the hand
        if (hand[i]["suit"] === hand[hand.length - 1]["suit"] && hand[i]["face"] === hand[hand.length - 1]["face"]) {
          hand.splice(hand.length - 1, 1);
        } else {
          hand.splice(i, 1);
        }
        break;
      } else if (
        cardsPlayed[j].children[0].getAttribute("suit") == "joker" &&
        hand[i]["suit"] == null
      ) {
        // if swapping card ensure that last joker in hand is swapped, in case there's another joker higher up the hand
        if (hand[i]["suit"] == null && hand[hand.length-1]["suit"] == null) {
          hand.splice(hand.length-1, 1);
        } else {
          hand.splice(i, 1);
        }
        break;
      }
    }
  }

  totalCardsPlayed += cardsPlayed.length;
  totalCardsPlayedDisplay.innerHTML = `
  <div style="
    width: 60px; 
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;  
    ">
    ${totalCardsPlayed} 
  </div>
  <img src="img/cards-icon.png"/>
  `;

  // Check to see if all cards in hand were played, for possible replenish bonus
  let numberCheckedCards = 0;
  if (hand.length === 0 && sacrificedCards.length === 0 && cardsInHand.length > 1) {
    numberCheckedCards = 10;

    secondsBonus++;
  } else if (cardsInHand.length === 1 && firstSubmit){
    numberCheckedCards = 10;
    secondsBonus++;
  } else {
    numberCheckedCards = checkedCards.length;
  }

  deckCheck(numberCheckedCards);
  drawCards(numberCheckedCards);
}

// Deck check and rebuild functions
function deckCheck(drawSize) {
  if (deck.length <= drawSize) {
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
}

// Jackpot card
function jackpotSelect() {
  let cardsInHand = document.querySelectorAll('.card-in-hand');

  if (!jackpotInit) {
    jackpotRandTiming = Math.floor(Math.random() * (jackpotSecondsThreshold - (jackpotSecondsThreshold - 49)) + (jackpotSecondsThreshold - 49));
    jackpotInit = true;
  }

  if (elapsedTime >= jackpotRandTiming && jackpotInit) {
      let jackpotRandIndex = Math.floor(Math.random() * (cardsInHand.length - 0) + 0);

      let jackpotOverlay = document.createElement('div');

      jackpotOverlay.classList.add('jackpot-overlay');

      let style = getComputedStyle(cardsInHand[jackpotRandIndex]);

      console.log(style);

      console.log(cardsInHand[jackpotRandIndex].classList[2]);

      jackpotOverlay.style.background = `${style.background}`;

      let backgroundShiftX = (jackpotOverlay.style.backgroundPositionX.substr(0, jackpotOverlay.style.backgroundPositionX.length - 2)) - 10;

      let backgroundShiftY = (jackpotOverlay.style.backgroundPositionY.substr(0, jackpotOverlay.style.backgroundPositionY.length - 2)) - 10;

      // console.log(+jackpotOverlay.style.backgroundPositionY.substr(0, jackpotOverlay.style.backgroundPositionY.length - 2));

      jackpotOverlay.style.backgroundPosition = `${backgroundShiftX}px ${backgroundShiftY}px`;

      cardsInHand[jackpotRandIndex].appendChild(jackpotOverlay);

      cardsInHand[jackpotRandIndex].classList.add('jackpot-special-border');

      jackpotInit = false;
      jackpotSecondsThreshold += 50;
      jackpotLive = true;
  }
}

// Live points updates
let pointsOnDisplay = 0;
function addFreshPointsToTotal() {

setInterval(() => {
    if (pointsOnDisplay < totalPoints) {
      pointsOnDisplay++;
      totalPointsDisplay.innerHTML = `${pointsOnDisplay}`;
    } 
    if (pointsOnDisplay > highscoreToBeat) {
      personalHighscoreDisplay.childNodes[1].textContent = pointsOnDisplay;
    }
      newHighscoreCheck();
  }, 20);
};

function setSecondsBonusIndicator(){
const timeBonusIndicatorCont = document.querySelector('.time-bonus-indicator');
const bonusColSpec = [
  {key: 12, hex: '#419B41'},
  {key: 11, hex: '#4CA82B'},
  {key: 10, hex: '#80C837'},
  {key: 9, hex: '#ACD62A'},
  {key: 8, hex: '#E0E61A'},
  {key: 7, hex: '#EFCE10'},
  {key: 6, hex: '#E6AA19'},
  {key: 5, hex: '#E27A1D'},
  {key: 4, hex: '#DE5003'},
  {key: 3, hex: '#C93C38'},
];

if (secondsBonus < 3) {
  secondsBonus = 3;
}

let bonusSecCol = bonusColSpec.filter(color => color.key === secondsBonus);
bonusSecCol = bonusSecCol[0]['hex'];

timeBonusIndicatorCont.innerHTML = '';
for (let i = 0; i < secondsBonus; i++){
  let bonusBlock = document.createElement('div');
  bonusBlock.classList.add('bonus-block');
  bonusBlock.style.background = bonusSecCol;
  timeBonusIndicatorCont.appendChild(bonusBlock);
}
}

function setFifteenCountColor() {
  fifteenCountDisplay.style.color = fifteenCountColRange[fifteenCount];
  fifteenCountDisplay.setAttribute("style", `-webkit-text-stroke: 3px ${fifteenCountColRange[fifteenCount]}`);

if (fifteenCount > 15) {
  fifteenCountDisplay.setAttribute("style", `-webkit-text-stroke: 3px ${fifteenCountColRange[15]}`);

}
  
  if (fifteenCount > 0) {
    fifteenCountDisplay.textContent = `${fifteenCount}`;
  } else {
    fifteenCountDisplay.textContent = ``;
  }
}

// Pause Function(s) & Event Listeners
let pauseScreen = document.querySelector("#pause-screen");

// Pause game
let secondsLeftAtPause;
let pausedTimerSet;

// Button press
document.addEventListener('keyup', (e) => {
    if(e.code === pauseBtn) {
        if (pauseScreen.classList.contains('hidden')) {
            gamePaused = true;  
            pauseScreen.classList.remove('hidden');
            secondsLeftAtPause = secondsLeft;
            displaySecondsWhilePaused();
        } else {
          gamePaused = false;
            pauseScreen.classList.add('hidden');
            secondsLeft = secondsLeftAtPause;
            timer.textContent = `${secondsLeftAtPause + 1}`; 
            clearInterval(pausedTimerSet);
        }
    }
})

// Menu click
document.getElementById('pause-game-btn').addEventListener('click', () => {
  if (pauseScreen.classList.contains('hidden')) {
      gamePaused = true;  
      pauseScreen.classList.remove('hidden');
      secondsLeftAtPause = secondsLeft;
      displaySecondsWhilePaused();
  } 
  pauseScreen.addEventListener('click', () => {
    gamePaused = false;
      pauseScreen.classList.add('hidden');
      secondsLeft = secondsLeftAtPause;
      timer.textContent = `${secondsLeftAtPause + 1}`; 
      clearInterval(pausedTimerSet);
  })
})

function displaySecondsWhilePaused() {
  document.getElementById('resume-game-key').textContent = `${pauseBtn}`;
  document.querySelector('.seconds-left').textContent = `${secondsLeftAtPause + 1}`;
  pausedTimerSet = setInterval(() => {
      document.querySelector('.seconds-left').classList.toggle('hidden-vis');
  }, 500);
}

// Uncheck all cards
function setUncheckAllPermission() {
  if (!firstSubmit) {
    document.addEventListener("keydown", uncheckAllCards)
  } else {
    document.removeEventListener("keydown", uncheckAllCards)
  }
}

function uncheckAllCards(e) {
  let checkedCards = document.querySelectorAll(".checked");
  if(e.code === uncheckcardsBtn) {
    fifteenCount = 0;
    pointsValidity = false;
    checkedCards.forEach((card) => {
      card.classList.toggle("checked");
      card.classList.remove("value-selected");
      setFifteenCountColor();
      valueOptionOne.textContent = "-"
      valueOptionTwo.textContent = "-"
      if (card.classList.contains("A")) {
        card.classList.toggle("A");
      } else if (card.classList.contains("B")) {
        card.classList.toggle("B");
      }
    });
    if (userSelectedSoundSettings.SFX) {
      uncheckAllCardsSFX.play();
    }
  }
}

