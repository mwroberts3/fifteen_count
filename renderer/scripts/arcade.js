const highScoresFunc = require('../steamworksFiles/add-arcade-highscore');

const utils = require('./utils');

const { pointsReview } = require('./points-review');

const hudMessage = require('./hud-messages');

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
const jackpotLevelDisplay = document.querySelector('.jackpot-level');
const swapCostDisplay = document.querySelector(".two-sec-warning");
let totalPoints = 0;
const pointsBreakdown = {cardPoints: 0, comboPoints: 0, timePoints: 0, jackpotPoints: 0, indigoLoopCount: 0};
let fifteenCount = 0;
let pointsInPlay = 0;
let sameColorCheckCheck = false;
let ultimateCardCount = 0;
let totalCardsPlayed = 0;
totalPointsDisplay.innerHTML = `${totalPoints}`;
totalCardsPlayedDisplay.innerHTML = `
  ${totalCardsPlayed} 
<p></p>
`;

// Dev tools
let pointsPerPlayBreakdown = [];

// Scoring variable
// Count Phase
let pointsPerCardCountPhase = 9;
let sameColorMultCountPhase = 1.25;

// Gameplay variables & switches
let pointsValidity = false;
let firstSubmit = false;
let comboSubmit = false;
let comboSkip = false;
let countdownStart = true;
let comboCardcount = 0;
let multiCardValueB = 0;

let dblSwapCheck = false;
let swappedCardTimeBonusNulify = false;
let swapActive = false;

let roundBonusTimer = 0;

let secondsBonus = 12;
let indigoLoopBonus = 36;
let halfHandPlay = false;

let html = ``;

let totalComboPoints = 0;

// Deck and first draw variables
let cardCount = 54;
let deck = [];
let drawSize = 10;
let hand = [];

// Timer variables
const timer = document.querySelector(".timer");

// Set timer color to white for countdown
timer.style.color = '#ddd';

// Set fifteen count display indicator
fifteenCountDisplay.style.color = `#666`;
fifteenCountDisplay.textContent = `15`;

if (themeSelection.themeName === 'Classic') {
  if (JSON.parse(localStorage.getItem('first-boot'))){
    threeSecCountdown = 4;
  } else {
    threeSecCountdown = 3;
  }
} else {
  threeSecCountdown = 3;
}

let totalSeconds = 100;
// let secondsLeft = 500;
let threeTimerStart = 0;
let elapsedTime = 0;
const bonusTimeDisplay = document.querySelector(".bonus-time");

let timeBonusLevelforAnimation = 0;

let gamePaused = false;

// prevent early lag bey priming background transistion in both Classic and Jungle theme
let playersHandBg = document.querySelector('.players-hand');

if (themeSelection.themeName === 'Classic') {
  utils.classicThemeBgPrimer(playersHandBg.style);
} else if (themeSelection.themeName === 'Jungle' &&JSON.parse(localStorage.getItem('first-boot'))) {
  localStorage.setItem('first-boot', false);
  window.location.reload();
}

// Setting up deck & displaying for play
buildDeck(deck);
deck = shuffle(deck, cardCount);
drawCards(drawSize);
showHand();
if (threeSecCountdown < 4) {
  timer.textContent = `${threeSecCountdown}`;
} else {
  timer.textContent = " ";
}
let countdownTimer = setInterval(countdownFunction, 1000);
let gameTimer = setInterval(timerFunction, 1000);

// Init gameplay loop
let jackpotLive = false;
let jackpotInit = false;
let jackpotRandTiming;
let jackpotSameColorCheck;
let jackpotSecondsThreshold = 25;
let jackpotMultiplierLvl = 1;
let jackpotMultiplier = 1.091;

let pointsOnDisplay = 0;
let highscoreDefeated = false;

addFreshPointsToTotal();
setSecondsBonusIndicator();

utils.arcadeModeCountDownAni();
hudMessage.countdown(hudMessageDisplay);

setTimeout(() => {
  // set BGM
  if (userSelectedSoundSettings.BGM && document.getElementById('arcade-how-to-play').classList.contains('hidden')) {
    document.getElementById('bgm-selection').src = themeSelection['bgm'];
  }

  selectCard();
  hudMessage.count(hudMessageDisplay);

  if (themeSelection.themeName === 'Classic' && document.getElementById('arcade-how-to-play').classList.contains('hidden')) {
    localStorage.setItem('first-boot', false);
  }
}, threeSecCountdown * 1000);

// Button submit
  document.addEventListener("keyup", (e) => {
    if (e.code === actionBtn && threeSecCountdown <= 1) {
      roundBonusCheck();
    }
  }); 

// Bonus check
submitCards.addEventListener("click", roundBonusCheck);

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
  submitCards.innerHTML = `Submit &nbsp;<span class="submit-cards-smaller-text">[${actionBtn}]</span>`;
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

function countdownFunction() {
  threeSecCountdown--;

  if(threeSecCountdown < 4) {
    timer.textContent = `${threeSecCountdown}`;
  }
  
  if (threeSecCountdown === 0) {
    timer.style.color = 'rgb(152, 253, 0)';
    timer.textContent = `GO!`;
  } else if (threeSecCountdown < 0 && document.getElementById('arcade-how-to-play').classList.contains('hidden')) {
    clearInterval(countdownTimer);
  }
}

// Set 100 second game timer and set-up bonus time display
function timerFunction() {
  if (threeSecCountdown <= -1) {

    let threeTimerFinish = new Date().getTime();
    if (threeTimerFinish - threeTimerStart >= 1000) {
      if (secondsLeft > 0) {
        timer.textContent = `${secondsLeft}`;
      } else {
        timer.textContent = '0';
      }
    }
    if (secondsLeft <= 5) {
      timer.style.color = 'red';
    } else {
      timer.style.color = 'rgb(152, 253, 0)';
    }
    if (secondsLeft <= 0) {
      hudMessage.gameOver(hudMessageDisplay);
      clearInterval(gameTimer);
      timer.textContent = '0';
      pointsOnDisplay = totalPoints;
      firstSubmit = true;
      setSwapPermission(); 
      totalPointsDisplay.innerHTML = `${totalPoints}`;
      if (highscoreDefeated) {
        personalHighscoreDisplay.childNodes[1].textContent = pointsOnDisplay;
      }
      
      pointsReview(pointsBreakdown, totalPoints, hudMessageDisplay);
  
      highScoresFunc.scoreReview(hudMessage, currentHand, totalPoints, ultimateCardCount, totalSeconds, pointsBreakdown.indigoLoopCount);
    }
  
    if (!gamePaused && document.getElementById('arcade-how-to-play').classList.contains('hidden')) {
      secondsLeft--;
      elapsedTime++;
    }
  }
}

function reset() {
  let cardsInHand = document.querySelectorAll(".card-in-hand");

  // check for jackpot loss due to swap
  // let jackpotLostArr = Array.from(cardsInHand).filter((card) => card.classList.contains('jackpot-special-border'));

  // console.log(jackpotLostArr);

  // refill some bonus time (2 secs per round with sacrifice)
  // effectively adds two seconds back to seconds bonus or three seconds if halfhand play
  if (comboSubmit) {
    if (halfHandPlay) {
      secondsBonus += 4;
    } else {
      secondsBonus += 2;
    }

    if (secondsBonus > 12) {
      secondsBonus = 12;
    }
  }

  halfHandPlay = false;

  // console.log('current seconds bonus', secondsBonus);

  // reset players hand background
  if (themeSelection['themeName'] !== 'Classic') {
    document.querySelector('.players-hand').style.removeProperty('background-image');
  } else {
    utils.classicThemeTransition(document.querySelector('.players-hand').style, false);
  }

  sameColorCheckCheck = false;
  pointsValidity = false;
  firstSubmit = false;
  comboSubmit = false;
  comboSkip = false;
  comboCardcount = 0;

  totalComboPoints = Math.round(totalComboPoints);
  totalPoints += totalComboPoints;
  pointsBreakdown.comboPoints += totalComboPoints;

  // add to points review array
  if (totalComboPoints > 0) {
    pointsPerPlayBreakdown.unshift({
      'points' : totalComboPoints,
      'type' : 'combo'
    })
  }

  totalComboPoints = 0;
  comboPointsDisplay.textContent = '';
  comboPointsDisplay.classList.remove('combo-points-fadein');
  multiCardValueB = 0;
  valueOptionOne.innerText = "-";
  valueOptionTwo.innerText = "-";

  utils.jackpotLevelAni(jackpotLevelDisplay, jackpotMultiplierLvl);

  setSwapPermission();
  setUncheckAllPermission();
  submitCards.innerHTML = `Submit &nbsp;<span class="submit-cards-smaller-text">[${actionBtn}]</span>`;

  cardsInHand.length >= 10 ? swapCostDisplay.textContent = `-1s` : swapCostDisplay.textContent = `${cardsInHand.length - 10}s`;


  // reset the swap cost display in case player did a double swap
  setTimeout(() => {
    document.querySelectorAll(".card-in-hand").length >= 10 ? swapCostDisplay.textContent = `-1s` : swapCostDisplay.textContent = `${document.querySelectorAll(".card-in-hand").length - 10}s`;
  }, 1000)
  
  pointsPerPlayBreakdown.unshift(totalPoints);
  console.log('scoring review', pointsPerPlayBreakdown);
  console.log('points breakdown', pointsBreakdown);
  console.log('ultimate card count', ultimateCardCount);

  hudMessage.count(hudMessageDisplay);
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
      pointsInPlay = pointsPerCardCountPhase;
      pointsValidity = true;
    } else {
      checkedCardSuits.push(card.children[0].getAttribute("suit"));
      comboCardcount++;
    }
  });
  if (comboCardcount > 1 && fifteenCount === 15) {
    pointsInPlay = comboCardcount * pointsPerCardCountPhase;
    pointsValidity = true;
    if (
      checkedCardSuits.every(sameColorRed) == true ||
      checkedCardSuits.every(sameColorBlack) == true
    ) {
      pointsInPlay *= sameColorMultCountPhase;
      sameColorCheckCheck = true;
    }
  }

  setFifteenCountColor();
}

// Submitting cards
function cardsSubmit() {
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
  }

  if (pointsValidity === true) {
    pointsInPlay = Math.round(pointsInPlay);
    totalPoints += pointsInPlay;
    pointsBreakdown.cardPoints += pointsInPlay;

    // add to points review array
    if (!firstSubmit) {
      pointsPerPlayBreakdown.unshift({
       'points' : pointsInPlay,
       'type' : 'checked cards',
       'amount' : checkedCards.length,
       'same Color' : sameColorCheckCheck
      });
    }

    pointsInPlay = 0;
    fifteenCount = 0;
    submitCards.innerHTML = `Draw &nbsp;<span class="submit-cards-smaller-text">[${actionBtn}]</span>`;
    comboSkip = true;
    // clearBgImgIntervals();

    // set players hand bg
    if (document.querySelectorAll(".combo-sacrifice").length < 1 && checkedCards.length < globalCardsInHand.length) {
      if (themeSelection['themeName'] !== 'Classic') {
        utils.jungleAndCosmosComboTrans(playersHandArea);
      } else {
        utils.classicThemeTransition(document.querySelector('.players-hand').style, true);
      }
    }

    // Check for jackpot bonus
    if (jackpotLive) {
      if (!firstSubmit) {
        checkedCardSuits = [];      
        let jackCheckedCheck = Array.from(checkedCards);       
        jackCheckedCheck = jackCheckedCheck.filter(card => card.classList.contains('jackpot-special-border'));

        if (jackCheckedCheck.length === 0) {
          totalCardsPlayed = Math.round(totalCardsPlayed * 0.5);

          jackpotMultiplierLvl -= globalCardsInHand.length;
         
          if (jackpotMultiplierLvl <= 0) {
            jackpotMultiplierLvl = 1;
          } 
          jackpotLevelDisplay.innerText = `${jackpotMultiplierLvl}`;

          jackpotMultiplier = (1 + (jackpotMultiplierLvl*10) / 110).toFixed(3);
                
          console.log(jackpotMultiplier);
          
          if (totalCardsPlayed < 0) totalCardsPlayed = 0;
        } else {
          checkedCards.forEach((card) => {
            checkedCardSuits.push(card.children[0].getAttribute("suit"));
          });
          
          checkedCards.forEach((card) => {
            if (card.classList.contains('jackpot-special-border')){

              let jackpotPointsInPlay = 0;

              totalPoints += Math.round(totalCardsPlayed * jackpotMultiplier);

              pointsBreakdown.jackpotPoints += Math.round(totalCardsPlayed * jackpotMultiplier);

              jackpotPointsInPlay = Math.round(totalCardsPlayed * jackpotMultiplier);

              // if (jackpotMultiplierLvl > 1) {
              //   totalPoints += Math.round(totalCardsPlayed * jackpotMultiplier);
              //   pointsBreakdown.jackpotPoints += Math.round(totalCardsPlayed * jackpotMultiplier);

              //   jackpotPointsInPlay = Math.round(totalCardsPlayed * jackpotMultiplier);
              // } else {
              //   console.log('LEVEL ONE')
              //   totalPoints += totalCardsPlayed;
              //   pointsBreakdown.jackpotPoints += totalCardsPlayed;

              //   jackpotPointsInPlay = totalCardsPlayed;
              // };

              // add to points review array
              pointsPerPlayBreakdown.unshift({
                'points' : jackpotPointsInPlay,
                'type' : 'jackpot',
                'level' : jackpotMultiplierLvl,
                'Multiplier' : jackpotMultiplier
              })

              if (userSelectedSoundSettings.SFX) {
                jackpotCheckSFX.play();
              }

              utils.jackpotBonusPointsAni(totalCardsPlayed, jackpotSameColorCheck, totalCardsPlayedDisplay, jackpotMultiplierLvl, jackpotMultiplier);

              if (checkedCardSuits.every(sameColorRed) ||
              checkedCardSuits.every(sameColorBlack)) {
                jackpotMultiplierLvl += 2;
                jackpotSameColorCheck = true;
              } else {
                jackpotMultiplierLvl++;
                jackpotSameColorCheck = false;
              }

              if (jackpotMultiplierLvl <= 1) {
                jackpotMultiplierLvl = 1;
              }


                jackpotMultiplier = (1 + (jackpotMultiplierLvl*10) / 110).toFixed(3);
                
                console.log(jackpotMultiplier);

              if (jackpotMultiplierLvl <= 0) {
                jackpotMultiplierLvl = 1;
              } 
              jackpotLevelDisplay.innerText = `${jackpotMultiplierLvl}`;
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
      pointsBreakdown.timePoints += Math.round(secondsBonus);

      // add to points review array
      pointsPerPlayBreakdown.unshift({
        'points' : secondsBonus,
        'type' : 'time(halfhand)'
      })

      bonusTimeDisplay.textContent = `+${secondsBonus}`
      setTimeout(() => {
        bonusTimeDisplay.textContent = ``;
      }, 1000)

      secondsBonus--;

      halfHandPlay = true;
    }

    valueOptionOne.innerText = "-";
    valueOptionTwo.innerText = "-";
    firstSubmit = true;

    // First submit sound effect
    if (userSelectedSoundSettings.SFX) {
      firstSubmitSFX.play();
    }

    // reset potential time bonus if card was swapped before submit
    swappedCardTimeBonusNulify = false;

    if (document.querySelector('.jackpot-special-border')) {
      document.querySelector('.jackpot-special-border').classList.remove('jackpot-special-border');
    }

    // fifteenCountAniReset();
    hudMessage.combo(hudMessageDisplay);
   
    setSwapPermission();
    setUncheckAllPermission();

    if (checkedCards.length === globalCardsInHand.length) {
      secondsLeft += indigoLoopBonus;
      totalSeconds += indigoLoopBonus;

      totalPoints += indigoLoopBonus;
      pointsBreakdown.timePoints += indigoLoopBonus;

      pointsBreakdown.indigoLoopCount++;

      // add to points review array
      pointsPerPlayBreakdown.unshift({
        'points' : indigoLoopBonus,
        'type' : 'time(indigo loop)',
        'count' : pointsBreakdown.indigoLoopCount
      })

      // console.log('indigo loop bonus', indigoLoopBonus);

      hudMessage.fullHandClear(hudMessageDisplay);

      // these will have game skip combo round after playing a full hand
      comboSubmit = true;
      bonusTimeDisplay.textContent = `+${(secondsBonus + 1) + indigoLoopBonus}`

      setTimeout(() => {
        bonusTimeDisplay.textContent = ``;
      }, 1000)

      // subtract 3 seconds from full hand bonus until reaches 0
      indigoLoopBonus -= 3;
      if (indigoLoopBonus <= 0) {
        indigoLoopBonus = 0;
      }

      // if Indigo Loop is acheived by playing ALL 10 cards, the indigoLoopBonus is reset to 35
      if (checkedCards.length === 10) {
        indigoLoopBonus = 36;
      }

      // Full hand sound effect
      if (userSelectedSoundSettings.SFX) fullClearSFX.play();

      // Fullhand check border animation
      utils.fullClearBorderAni(themeSelection, totalCardsPlayed, jackpotSameColorCheck,jackpotMultiplierLvl, jackpotMultiplier);
    }
  }
  if (pointsValidity === true && comboSubmit === true) { 
    // combo submit sound effect
    if (userSelectedSoundSettings.SFX) {
    comboSubmitSFX.play();
    }
    
    reDeal(globalCardsInHand, hand);
    showHand();
    jackpotSelect();
    reset();
    selectCard();
  }

  setSecondsBonusIndicator();
  setFifteenCountColor();
}

function roundBonusCheck() {
  let roundBonusTimerCheck = new Date();
  let roundBonusPoints = 0;
  let roundBonuses = [
    1.45,
    1.45,
    1.45,
    1.45,
    1.3,
    1.3,
    1.3,
  ];
  let diff =
    (roundBonusTimerCheck.getTime() - roundBonusTimer.getTime()) / 1000;
  diff = Math.round(diff);

  if (diff <= 6 && firstSubmit === false && pointsValidity === true && swappedCardTimeBonusNulify === false) {
    roundBonusPoints = (pointsInPlay * roundBonuses[diff]) - pointsInPlay;

    if (diff >= 3) {
      // show level 1 animation
      timeBonusLevelforAnimation = 1;
    } else {
      // show level 2 animation
      timeBonusLevelforAnimation = 2;
    }
    
    roundBonusPoints = Math.round(roundBonusPoints);
    
    totalPoints += roundBonusPoints;
    
    pointsBreakdown.timePoints += roundBonusPoints;  

    // add to points review array
    pointsPerPlayBreakdown.unshift(
      {
        'points' : roundBonusPoints,
        'type' : 'time(speed)',
        'bonus-level' : diff,
        'bonus-multiplier' : roundBonuses[diff]
      }
    )

  } else if (diff > 8 && firstSubmit === false && pointsValidity === true) {
    timeBonusLevelforAnimation = 0;
  }
  
  cardsSubmit();
}

// Selecting cards
setSwapPermission();
function selectCard() {
  setSwapPermission();
  setUncheckAllPermission();

  roundBonusTimer = new Date();
  let cardsInHand = document.querySelectorAll(".card-in-hand");
  globalCardsInHand = cardsInHand;

  // swap card seconds bonus correction
  globalCardsInHand = Array.from(cardsInHand).filter(card  => !card.classList.contains('lastCardSwapAnimation'));

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
        if (userSelectedSoundSettings.SFX) {
          checkCardSFX.play();
        }
        
        card.classList.toggle("checked");

        // check for value b's to update display
        if (card.querySelector("card-t").getAttribute("valueb") > 0) {
          multiCardValueB--;
        }
        
        if (card.classList.contains('value-selected')) {
          multiCardValueB++;
        }

        // reset value options
        let checkedCards = Array.from(document.querySelectorAll(".checked"));

        if (checkedCards.length === 1 && checkedCards[0].children[0].getAttribute('valueb') > 0) {
          if (fifteenCount === 0) {
            valueOptionOne.innerText = checkedCards[0].children[0].getAttribute('valuea');
          }
        } else {
          valueOptionOne.innerText = "-";
        }

        if (multiCardValueB > 0) {
          valueOptionTwo.innerText = `${multiCardValueB}`
        } else {
          valueOptionTwo.innerText = "-";
        }

        if (valueB > 0 && card.classList.contains("A")) {
          fifteenCount -= valueA;
          card.classList.toggle("A");
          card.classList.remove("value-selected");
          setFifteenCountColor();
        } else if (valueB > 0 && card.classList.contains("B")) {
          fifteenCount -= valueB;
          card.classList.toggle("B");
          card.classList.remove("value-selected");
          setFifteenCountColor();
        } else if (valueB === 0) {
          fifteenCount -= valueA;
        }
        comboCheck();
        setFifteenCountColor();
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
          multiCardValueB++;
         // check how many cards are checked to setting multivalue display settings
          if (multiCardValueB > 1) {
            valueOptionOne.innerText = "-";
          } else if (multiCardValueB === 1) {
            valueOptionOne.innerText = valueA;
          } else {
            valueOptionOne.innerText = "-";
          }
          valueOptionTwo.innerText = multiCardValueB;
          valueOptionOne.addEventListener("click", () => {
            if (
              !card.classList.contains("A") &&
              !card.classList.contains("B") &&
              card.classList.contains("checked")
            ) {
              valueOptionOne.textContent = '-';
              valueOptionTwo.textContent = '-';
              fifteenCount += valueA;
              multiCardValueB = 0;
              setFifteenCountColor();
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
                valueOptionOne.textContent = '-';
                valueOptionTwo.textContent = '-';
                fifteenCount += valueA;
                multiCardValueB = 0;
                setFifteenCountColor();
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
              valueOptionOne.textContent = '-';
              valueOptionTwo.textContent = '-';
              fifteenCount += valueB;
              multiCardValueB = 0;
              setFifteenCountColor();
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
                valueOptionOne.textContent = '-';
                valueOptionTwo.textContent = '-';
                fifteenCount += valueB;
                multiCardValueB = 0;
                setFifteenCountColor();
                card.classList.toggle("B");
                card.classList.add("value-selected");
                comboCheck();
              }
            }
          });
        } else if (valueB === 0) {
          multiCardValueB > 0 ? valueOptionTwo.innerText = multiCardValueB : valueOptionTwo.innerText = "-";
          fifteenCount += valueA;
          setFifteenCountColor();
        }
        setFifteenCountColor();
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
  submitCards.innerHTML = `Draw &nbsp;<span class="submit-cards-smaller-text">[${actionBtn}]</span>`;
  comboPointsDisplay.textContent = `+${totalComboPoints}`;
  comboPointsDisplay.classList.add('combo-points-fadein');
}

// check for newHighscore
function newHighscoreCheck() {
  if (!highscoreDefeated) {
    if (pointsOnDisplay > highscoreToBeat) {
      hudMessage.newHighscore(hudMessageDisplay);
      if (highscoreToBeat !== 0) {
        // New highscore sound effect
        if (userSelectedSoundSettings.SFX) newHighscoreSFX.play();
      }
      highscoreDefeated = true;
    } 
  }
}

// Swap card function(s) & event listeners
function setSwapPermission() {
  if (firstSubmit || secondsLeft <= 1) {
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
  swapActive = true;

  setTimeout(() => {
    swapActive = false;
  }, 100);

  // nulify potential time bonus on next submit after card is swapped
  swappedCardTimeBonusNulify = true;

  let cardsInHand = document.querySelectorAll(".card-in-hand");

  // uncheck already checked cards
  cardsInHand.forEach((card) => {
    if (card.classList.contains("checked")) {
      card.classList.toggle("checked");
    }
    multiCardValueB = 0;
  })

  // Swap Card Animation
  let validCardsInHand = utils.swapCardAni(dblSwapCheck, cardsInHand, currentHand, playersHandArea);
      
  // swapping with jackpot card in hand erases jackpot
  if (jackpotLive) {
    totalCardsPlayed = Math.round(totalCardsPlayed * 0.5);

    jackpotMultiplierLvl -= globalCardsInHand.length;
 
    if (jackpotMultiplierLvl < 0) {
      jackpotMultiplierLvl = 0;
    }

    if (jackpotMultiplierLvl <= 0) {
      jackpotMultiplierLvl = 1;
    } 
    jackpotLevelDisplay.innerText = `${jackpotMultiplierLvl}`;

    jackpotMultiplier = (1 + (jackpotMultiplierLvl*10) / 110).toFixed(3);
                
    console.log(jackpotMultiplier);

    if (totalCardsPlayed < 0) totalCardsPlayed = 0;
    jackpotLive = false;
  }
  
  for (let i = 0; i < cardsInHand.length; i++) {
    if (!cardsInHand[i].classList.contains('.lastCardSwapAnimation')) {
      validCardsInHand++;
    }
  }

  if (validCardsInHand > 10) validCardsInHand = 10;

  for (let i = 1; i < cardsInHand.length; i++) {
    if (!cardsInHand[cardsInHand.length - i].classList.contains('lastCardSwapAnimation')) {
      cardsInHand[cardsInHand.length - i].classList.toggle("checked");
      break;
    }
  }
  
  if (cardsInHand.length === 1) {
    cardsInHand[0].classList.add('checked');
  }

  reDeal(cardsInHand, hand);
  showHand();
  jackpotSelect();
  reset();
  selectCard();

  if (validCardsInHand < 10) {
    secondsLeft -= (10 - validCardsInHand);
    swapCostDisplay.textContent = `-${10 - validCardsInHand}s`;
  } else {
    secondsLeft--;
    swapCostDisplay.textContent = `-1s`;
  }

  fifteenCount = 0;
  fifteenCountDisplay.style.color = `#666`;
  fifteenCountDisplay.textContent = `15`;
  bonusTimeDisplay.style.color = "rgba(51, 131, 235, 0.9)";

  if (secondsLeft <= 5) {
    timer.style.color = 'red'
  }

  if (secondsLeft <= 0) {
    timer.innerText = '0'
  }

  if (cardsInHand.length < 10) {
    
    bonusTimeDisplay.textContent = `${(cardsInHand.length - 10)}`;
        setTimeout(() => {
          bonusTimeDisplay.textContent = ``;
          bonusTimeDisplay.style.color = "rgba(245, 217, 61, 0.9)";
        }, 1000)
  } else {
    timer.textContent = `${secondsLeft + 1}`;
    bonusTimeDisplay.textContent = `-1`;
        setTimeout(() => {
          bonusTimeDisplay.textContent = ``;
          bonusTimeDisplay.style.color = "rgba(245, 217, 61, 0.9)";
        }, 1000)
  }

  // prevent timer from showing negative int
  if (secondsLeft <= 0) {
    timer.textContent = `0`;
  } else {
    timer.textContent = `${secondsLeft + 1}`;
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
  ultimateCardCount += cardsPlayed.length;
  
  totalCardsPlayedDisplay.innerHTML = `
  ${totalCardsPlayed} 
  <p></p>
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
    jackpotRandTiming = Math.floor(Math.random() * (jackpotSecondsThreshold - (jackpotSecondsThreshold - 24)) + (jackpotSecondsThreshold - 24));

    jackpotInit = true;
    
    // // FOR JACKPOT TESTS
    // console.log(jackpotRandTiming);
    // jackpotRandTiming = 10;
  }

    if (elapsedTime >= jackpotRandTiming && jackpotInit) {

        let jackpotRandIndex = Math.floor(Math.random() * (cardsInHand.length - 0) + 0);

        // correct for swap/jackpot glitch when player is swapping and jackpot in last position
        if (jackpotRandIndex === cardsInHand.length - 1) {
          if (swapActive) {
            jackpotRandIndex--;
          } 
        }
  
        let jackpotOverlay = document.createElement('div');
  
        jackpotOverlay.classList.add('jackpot-overlay');
  
        let style = getComputedStyle(cardsInHand[jackpotRandIndex]);
  
        jackpotOverlay.style.background = `${style.background}`;
  
        let backgroundShiftX = (jackpotOverlay.style.backgroundPositionX.substr(0, jackpotOverlay.style.backgroundPositionX.length - 2)) - 10;
  
        let backgroundShiftY = (jackpotOverlay.style.backgroundPositionY.substr(0, jackpotOverlay.style.backgroundPositionY.length - 2)) - 10;
  
        jackpotOverlay.style.backgroundPosition = `${backgroundShiftX}px ${backgroundShiftY}px`;
  
        cardsInHand[jackpotRandIndex].appendChild(jackpotOverlay);
  
        cardsInHand[jackpotRandIndex].classList.add('jackpot-special-border');
  
        jackpotInit = false;
        jackpotSecondsThreshold += 25;
        jackpotLive = true;

        hudMessage.jackpotOnTable(hudMessageDisplay);
        
        // setTimeout(() => {

        //   // check for jackpot loss due to swap
        //   let jackpotLostArr = Array.from(cardsInHand).filter((card) => card.classList.contains('jackpot-special-border'));
  
        //   console.log(jackpotLostArr);
  
        //   if (jackpotLostArr.length >= 1) {
        //     hudMessage.jackpotLost(hudMessageDisplay);
        //     hudMessage.jackpotOnTable(hudMessageDisplay);
        //   } else { 
        //   }
        // },500);
    }
}

// Live points updates
function addFreshPointsToTotal() {
  let stringedPoints = pointsOnDisplay.toString();
  
  totalPointsDisplay.innerHTML = '';
  
  for(let i=0; i < stringedPoints.length; i++) {
    totalPointsDisplay.innerHTML += `<span>${stringedPoints[i]}</span>`;
  }
  
  setInterval(() => {
    
    if (pointsOnDisplay < totalPoints) {
        
        pointsOnDisplay++;
        
        let stringedPoints = pointsOnDisplay.toString();

        totalPointsDisplay.innerHTML = '';
        
        for(let i=0; i < stringedPoints.length; i++) {
          totalPointsDisplay.innerHTML += `<span>${stringedPoints[i]}</span>`;
        }

        if (timeBonusLevelforAnimation > 0) {
          let bonusColorFlash = '';
          if (timeBonusLevelforAnimation === 1) {
            bonusColorFlash = '#ffe865';
          } else {
            bonusColorFlash = '#ffd700';          
          }

          totalPointsDisplay.childNodes[0].style.color = `${bonusColorFlash}`;

          let iCount = 1;
          const timeBonusAniInterval = setInterval(() => {
            if (iCount < totalPointsDisplay.childNodes.length) {
              totalPointsDisplay.childNodes[iCount].style.color = `${bonusColorFlash}`;
              setTimeout(() => {
                totalPointsDisplay.childNodes[iCount - 2].style.color = '#ffff00';
              }, 40)
              iCount++;
            } else {
              totalPointsDisplay.childNodes[totalPointsDisplay.childNodes.length-1].style.color = '#ffff00';
              clearInterval(timeBonusAniInterval);
              timeBonusLevelforAnimation = 0;
            }
          }, 80)
        }  
        // totalPointsDisplay.innerHTML = `${pointsOnDisplay}`;
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
  fifteenCountColRange = [
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd",
    "#ddd"
  ]

  fifteenCountDisplay.style.color = fifteenCountColRange[fifteenCount];

  function fifteenCountAniReset() {
    fifteenCountDisplay.style.animationName = "";
  };

  if (fifteenCount === 15) {
    if (userSelectedSoundSettings.SFX) {
      fifteenCountSFX.play();
    }

    fifteenCountDisplay.style.color = '#fff';
    fifteenCountDisplay.textContent = `${fifteenCount}`;

    fifteenCountDisplay.style.animationName = "fifteen-count-animation";

  } else if (fifteenCount > 15) {
    fifteenCountDisplay.style.color = fifteenCountColRange[14];
    fifteenCountDisplay.textContent = `${fifteenCount}`;
    fifteenCountAniReset();
  } else if (fifteenCount < 15 && fifteenCount > 0) {
    fifteenCountDisplay.style.color = fifteenCountColRange[14];
    fifteenCountDisplay.textContent = `${fifteenCount}`;
    fifteenCountAniReset();
  } else {
    fifteenCountDisplay.style.color = `#666`;
    fifteenCountDisplay.textContent = `15`;
    fifteenCountAniReset();
  }
}

// Pause Function(s) & Event Listeners
let pauseScreen = document.querySelector("#pause-screen");

// Pause game
let secondsLeftAtPause;
let pausedTimerSet;

// Button press
document.addEventListener('keyup', (e) => {
    if(e.code === pauseBtn && threeSecCountdown <= 1 && secondsLeft >= 1) {
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
    multiCardValueB = 0;
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
