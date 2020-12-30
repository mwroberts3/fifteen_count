// DOM sections
const timerAndScoreDisplay = document.querySelector(".ta-timer-score-display"),
timerDisplay = document.querySelector('.ta-timer-display'),
countDisplay = document.querySelector('.ta-count-display'),
scoreDisplay = document.querySelector('.ta-score-display');

const cardsDisplay = document.querySelector(".ta-cards-display");
const taHighscoreDicount = document.querySelector(".ta-alltime-score-display");

let deck = [];
let activeHand = [];
let cardsToBeDelete = [];
let testHand = [];

let redrawAmount = 18;

let score = 0;
let count = 0;
let pointsAdded;
let secondsLeft = 179;
let bonusUnleashed = false;
let bombsOff = false;
let bonusAdded = false;
let bonusPoints = 0;
let cardBonusIndex;

const sameColorRed = (color) => color == "red"; 
const sameColorBlack = (color) => color == "black"; 

let cardIndex;
let shownHand = [];

// Init gameplay
const timeAttackTimer = setInterval(() => {
    if (secondsLeft === 0) {
        clearInterval(timeAttackTimer);

        if (score > highscoreToBeat) {
            highscoreStats[0]['timeAttack'] = score;
            localStorage.setItem('highscore', JSON.stringify(highscoreStats));
        }
    }
    timerDisplay.textContent = `${secondsLeft}`
    secondsLeft--;
}, 1000)

class Card {
    constructor(face, suit, value, id) {
        this.face = face;
        this.suit = suit;
        this.value = value;
        this.checked = false;
        this.id = id;
        this.bonus = false;
    }

    checkCard(cardIndex, shownHand) {
        cardsDisplay.childNodes[cardIndex].classList.toggle('ta-checked');
        if (userSelectedSoundSettings.SFX) {
            checkCardSFX.play();
        }
        if (cardsDisplay.childNodes[cardIndex].classList.contains('ta-checked')) {
            this.checked = true;
            count += activeHand[cardIndex].value
            if (count === 15) {
                testHand = activeHand.filter(card => card.checked === true);

                testHand = [...new Set(testHand)];

                checkAndScoreBonusCard();

                for (let i = 0; i < 18; i++) {
                    for (let k = 0; k < testHand.length; k++) {
                        if (activeHand[i]) {
                            if (activeHand[i].id === testHand[k].id) {
                                    activeHand.splice(i, 1);
                                }
                        }
                    }
                }

                redealReset();
            }
        } else {
            this.checked = false;
            count -= activeHand[cardIndex].value;
            if (count === 15) {
                testHand = activeHand.filter(card => card.checked === true);

                testHand = [...new Set(testHand)];

                checkAndScoreBonusCard();

                for (let i = 0; i < 18; i++) {
                    for (let k = 0; k < testHand.length; k++) {
                        if (activeHand[i]) {
                            if (activeHand[i].id === testHand[k].id) {
                                    activeHand.splice(i, 1);
                                }
                        }
                    }
                }

                redealReset();
            }
        }
    }
}

buildDeckTimeAttack(deck);
shuffleTimeAttack(deck);
buildAndShowHand(redrawAmount);

// Check Cards Phase
cardsDisplay.addEventListener('click', e => {
    cardIndex = [...e.target.parentNode.children].indexOf(e.target);
    
    if (e.target.classList.contains('ta-card')) {
        activeHand[cardIndex].checkCard(cardIndex, shownHand);
        countDisplay.textContent = `${count}`;    
        console.log(cardIndex);
    }  

    if (e.target.classList.contains('bonus-card-overlay')){
        cardIndex = [...e.target.parentNode.parentNode.children].indexOf(e.target.parentNode);
        activeHand[cardIndex].checkCard(cardIndex, shownHand);
        countDisplay.textContent = `${count}`; 
        console.log(e.target.parentNode);
        console.log(cardIndex);
    }
})

function buildDeckTimeAttack() {
    let tempCardId = 0;
    let tempSuit;
    const faces = [
        "-one",
        "-one",
        "zero",
        "zero",
        "one",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
      ]; 
      const value = [-1, -1, 0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      for (let i = 0; i < 22; i++) {
          for (let k = 0; k < faces.length; k++) {
              i < 11 ? tempSuit = 'red' : tempSuit = 'black';
              deck.push(new Card(faces[k], tempSuit, value[k], tempCardId))
              tempCardId++;
          }
      }

      console.log(deck);
}

// Shuffle Deck
function shuffleTimeAttack() {
    for (let i = 0; i < 3000; i++) {
      let rand1 = Math.random();
      shuffle1 = Math.round(rand1 * 374);
      let rand2 = Math.random();
      shuffle2 = Math.round(rand2 * 374);
  
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

  function buildAndShowHand(drawAmount) {
      bombsOff = false;

    for (let i = 0; i < drawAmount; i++) {
        activeHand.unshift(deck.pop()); 
    }
    
    activeHand.forEach((card, index) => {
        let cardInHand = document.createElement('div');
        
        cardInHand.classList.add('ta-card');
        cardInHand.textContent = card.value;
        cardInHand.style.background = card.suit;
        
        if (!bonusUnleashed && index === 0) {
            let bonusCardOverlay = document.createElement('div');
            bonusCardOverlay.classList.add('bonus-card-overlay');
            card.bonus = true;
            cardInHand.classList.add('ta-bonus-card');  
            bonusUnleashed = true;
            cardInHand.appendChild(bonusCardOverlay);
        }
        
        if (card.bonus) {
            cardInHand.style.background = `url("./img/ta-bonus-card.gif")`;
            cardBonusIndex = index;
            let bonusCardOverlay = document.createElement('div');
            bonusCardOverlay.classList.add('bonus-card-overlay');
            cardInHand.classList.add('ta-bonus-card');  
            cardInHand.appendChild(bonusCardOverlay);
            bonusCardOverlay.style.background = card.suit;
        }

        cardsDisplay.appendChild(cardInHand);
    })

    // Choose random bomb card
    shownHand = cardsDisplay.childNodes;
    
    let bombCardIndex1 = cardBonusIndex;
    while (bombCardIndex1 === cardBonusIndex) {
        bombCardIndex1 = Math.floor(Math.random() * 18);    
        shownHand[bombCardIndex1].classList.add('ta-bomb-card');
        shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
    }

    // Add a second bomb card after 1 minute
    let bombCardIndex2 = cardBonusIndex;
    if (secondsLeft <= 120) {
        while (bombCardIndex2 === cardBonusIndex || bombCardIndex2 === bombCardIndex1) {
            bombCardIndex2 = Math.floor(Math.random() * 18);    
            shownHand[bombCardIndex2].classList.add('ta-bomb-card');
            shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
        }
    }

    // Add a third bomb card after 2 minutes
    let bombCardIndex3 = cardBonusIndex;
    if (secondsLeft <= 60) {
        while (bombCardIndex3 === cardBonusIndex || bombCardIndex3 === bombCardIndex1 || bombCardIndex3 === bombCardIndex2) {
            bombCardIndex3 = Math.floor(Math.random() * 18);    
            shownHand[bombCardIndex3].classList.add('ta-bomb-card');
            shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
        }
    }
}

function redealReset() {
      bonusAdded = false;

          scoreDisplay.textContent = `${score}`;
          count = 0;
          countDisplay.textContent = `${count}`;
          cardsDisplay.innerHTML = '';
          buildAndShowHand(cardsToReplace);

        //   Add bonus class to bonus card
          let tempBonusIndex = getBonusCardIndex();    
          shownHand = cardsDisplay.childNodes;
          
          if (tempBonusIndex) {
              shownHand[tempBonusIndex].classList.add('ta-bonus-card');
          }
  }

  function checkAndScoreBonusCard() {
      let tempBonusIndex = getBonusCardIndex();
      shownHand = cardsDisplay.childNodes;

    // Score checked cards
    addPointsToScore();
      
    // Score bonus card  
    if (tempBonusIndex === 17 && shownHand[tempBonusIndex].classList.contains('ta-checked')) {
        bonusUnleashed = false;

        if (!bonusAdded) {
            bonusPoints = sameSuitCheck(score, true);
            
            console.log('bonus points:', bonusPoints);
            score += bonusPoints;
            bonusAdded = true;
            if (userSelectedSoundSettings.SFX) {
                bonusCardSFX.play();
            }
        }
    } else if (shownHand[tempBonusIndex].classList.contains('ta-checked')) {
        bonusUnleashed = false;
    }
  }

  function getBonusCardIndex() {
    let tempBonusIndex;
    activeHand.forEach((card, index) => {
        if (card.bonus) {
            tempBonusIndex = index;
        }
    }) 

    return tempBonusIndex;
  }

  function addPointsToScore() {
    cardsToReplace = document.querySelectorAll(".ta-checked").length;
    console.log('cards to replace: ', cardsToReplace);

    pointsAdded = sameSuitCheck(cardsToReplace, false);

    console.log('points added: ', pointsAdded);

    score += pointsAdded;

    shownHand.forEach((card) => {
        if (card.classList.contains('ta-bomb-card') && card.classList.contains('ta-checked')) {
            bonusUnleashed = false;
            bombsOff = true;
            if (userSelectedSoundSettings.SFX) {
                bombCardSFX.play();
            }
        }
    }) 

    if (bombsOff) {
        activeHand.splice(0);
        cardsToReplace = 18;
    } 
  }

  function sameSuitCheck(pointsInPlay, forBonusCard) {
    let checkedCardSuits = [];
    
    console.log(pointsInPlay);
    activeHand.forEach(card => {
        if (card.checked) {
            checkedCardSuits.push(card.suit);
        }
    })

    if(checkedCardSuits.every(sameColorBlack) || checkedCardSuits.every(sameColorRed)) {
        if (forBonusCard) {
            pointsInPlay = Math.round(score/2)
        } else {
            pointsInPlay = Math.round(pointsInPlay * 1.25)
        }
    } else {
        if (forBonusCard) {
            pointsInPlay = Math.round(score/4)
        }
    }

    return pointsInPlay;
  }

// Uncheck all cards
document.addEventListener('keydown', uncheckAllCards);

function uncheckAllCards(e) {
    let checkedCards = document.querySelectorAll(".ta-checked");
    if(e.code === uncheckcardsBtn) {
      count = 0;
      countDisplay.textContent = 0;
      checkedCards.forEach((card) => {
        card.classList.remove("ta-checked");
      });
      activeHand.forEach(card => {
          card.checked = false;
      })
      if (userSelectedSoundSettings.SFX) {
        uncheckAllCardsSFX.play();
      }
    }
  }

// Pause game
let secondsLeftAtPause;
let pausedTimerSet;
// Button press
document.addEventListener('keyup', (e) => {
    if(e.code === pauseBtn) {
        if (document.querySelector(".ta-pause-screen").classList.contains('hidden')) {
            console.log('pausing');  
            document.querySelector(".ta-pause-screen").classList.remove('hidden');
            secondsLeftAtPause = secondsLeft;
            displaySecondsWhilePaused();
        } else {
            document.querySelector(".ta-pause-screen").classList.add('hidden');
            secondsLeft = secondsLeftAtPause;
            timerDisplay.textContent = `${secondsLeftAtPause + 1}`; 
            clearInterval(pausedTimerSet);
        }
    }
})
// Menu click
document.getElementById('pause-game-btn').addEventListener('click', () => {
    if (document.querySelector(".ta-pause-screen").classList.contains('hidden')) {
        console.log('pausing');  
        document.querySelector(".ta-pause-screen").classList.remove('hidden');
        secondsLeftAtPause = secondsLeft;
        displaySecondsWhilePaused();
    } 
    document.querySelector(".ta-pause-screen").addEventListener('click', () => {
        document.querySelector(".ta-pause-screen").classList.add('hidden');
        secondsLeft = secondsLeftAtPause;
        timerDisplay.textContent = `${secondsLeftAtPause + 1}`; 
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