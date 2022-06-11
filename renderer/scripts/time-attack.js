const highScoresFunc = require('../steamworksFiles/add-time-attack-highscore');

const moment = require('moment');

const utils = require('./utils');

utils.timeAttackFadeIn();
utils.timeAttackBackgroundAdjust();

// DOM sections
const timerDisplay = document.querySelector('.ta-timer-display'),
countDisplay = document.querySelector('.ta-count-display'),
scoreDisplay = document.querySelector('.ta-score-display');

const cardsDisplay = document.querySelector(".ta-cards-display");
const taHighscoreDisplay = document.querySelector(".ta-alltime-score-display");

let deck = [];
let activeHand = [];
let testHand = [];

let redrawAmount = 18;

let score = 0;
let count = 0;
let fullPassCount = 0;
let pointsAdded;
let secondsLeft = 180;
let threeSecCountdown = 2;
let bonusUnleashed = false;
let bombsOff = false;
let bonusAdded = false;
let bonusPoints = 0;
let cardBonusIndex;
let firstSpin = false;
let gamePaused = false;

let highscoreDefeated = false;

const sameColorRed = (color) => color == "#3c535b"; 
const sameColorBlack = (color) => color == "#08aa72"; 

let cardIndex;
let shownHand = [];

let bombCardIndex1;
let bombIcon;

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

// Set background 15 and white timer color for countdown
countDisplay.style.color = '#555';
countDisplay.textContent = '15';
timerDisplay.style.color = '#ddd';

// Set 180 seconds timer and countdown timer
const timeAttackTimer = setInterval(() => {
    if (threeSecCountdown > -1) {
        timerDisplay.textContent = `${threeSecCountdown}`;
        
        if (threeSecCountdown === 0) {
            timerDisplay.style.color = 'rgb(152, 253, 0)';

            // Set BGM
            if (userSelectedSoundSettings.BGM && document.getElementById('time-attack-how-to-play').classList.contains('hidden')) {
                document.getElementById('bgm-selection').src = './bgm/covered-face.mp3';
            }

            document.querySelectorAll('.ta-card').forEach((card) => {
                card.style.filter = 'grayscale(0)';
            });

            document.querySelector('.ta-card').style.background = `url("./img/ta-bonus-card.png")`;

            shownHand[bombCardIndex1].appendChild(bombIcon);

            timerDisplay.textContent = 'GO!'
        }
        
        threeSecCountdown--;
    } else {
    // GAME OVER
    if (secondsLeft === 1 && !gamePaused) {
        clearInterval(timeAttackTimer);
        
        document.querySelector('.ta-game-over').classList.remove('hidden');
        document.querySelector('.ta-game-over-inner-container').children[1].innerHTML = `Points <span style="color: #ffff00">${score}</span>`;
        
        if (score > highscoreToBeat) {
            highscoreStats[0]['timeAttack'] = score;
            highscoreStats[0]['taDate'] = moment().format('MMM Do YYYY');
            highscoreStats[0]['taFullPassCount'] = fullPassCount;
            localStorage.setItem('highscore', JSON.stringify(highscoreStats));
        }

        // upload score to steam
        highScoresFunc.uploadTAHighscoreToSteam(score, fullPassCount);
    }
        
    if (document.getElementById('time-attack-how-to-play').classList.contains('hidden')) {
        secondsLeft--;
    }

    if (secondsLeft <= 5) {
        timerDisplay.style.color = '#ff3232'
    }
    
    if (secondsLeft > -1) {
        timerDisplay.textContent = `${secondsLeft}`
    }
}
}, 1000)

let pointsOnDisplay = 0;
setInterval(() => {
    if (pointsOnDisplay < score) {
        pointsOnDisplay++;
        newHighscoreCheckAndUpdate();
    }
    scoreDisplay.textContent = `${pointsOnDisplay}`;
    if (secondsLeft === 0) {
        pointsOnDisplay = score;
        scoreDisplay.textContent = `${pointsOnDisplay}`;
    }
},100)

// Init gameplay
buildDeckTimeAttack(deck);
shuffleTimeAttack(deck);
buildAndShowHand(redrawAmount);
newHighscoreCheckAndUpdate();

// grayscale cards for countdown
document.querySelectorAll('.ta-card').forEach((card) => {
    card.style.filter = 'grayscale(1)';
})

// Check Cards Phase
setTimeout(() => {
    cardsDisplay.addEventListener('click', e => {
        cardIndex = [...e.target.parentNode.children].indexOf(e.target);
        
        if (e.target.classList.contains('ta-card')) {
            activeHand[cardIndex].checkCard(cardIndex, shownHand);

            if (count < 1) {
                countDisplay.style.color = '#555';
                countDisplay.textContent = '15';
            } else {
                countDisplay.style.color = '#fff';
                countDisplay.textContent = `${count}`;    
            }
        }  
    
        if (e.target.classList.contains('bonus-card-overlay') || e.target.classList.contains('bomb-icon')){
            cardIndex = [...e.target.parentNode.parentNode.children].indexOf(e.target.parentNode);
            activeHand[cardIndex].checkCard(cardIndex, shownHand);
            
            if (count < 1) {
                countDisplay.style.color = '#555';
                countDisplay.textContent = '15';
            } else {
                countDisplay.style.color = '#fff';
                countDisplay.textContent = `${count}`;    
            }
        }
    })
}, 3000);

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
              i < 11 ? tempSuit = '#3c535b' : tempSuit = '#08aa72';
              deck.push(new Card(faces[k], tempSuit, value[k], tempCardId))
              tempCardId++;
          }
      }
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

        console.log(card.value)

        if (card.value === 0) {
            cardInHand.style.color = '#fdfd69';
        }
        
        if (!bonusUnleashed && index === 0) {
            let bonusCardOverlay = document.createElement('div');
            bonusCardOverlay.classList.add('bonus-card-overlay');
            card.bonus = true;
            cardInHand.classList.add('ta-bonus-card');  
            bonusUnleashed = true;
            cardInHand.appendChild(bonusCardOverlay);
        }
        
        if (card.bonus) {
            if (threeSecCountdown < 1) {
                cardInHand.style.background = `url("./img/ta-bonus-card.png")`;
            }

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
    
    bombCardIndex1 = cardBonusIndex;
    bombIcon = document.createElement('div');
    bombIcon.classList.add('bomb-icon');

    while (bombCardIndex1 === cardBonusIndex) {
        bombCardIndex1 = Math.floor(Math.random() * 18);    
        shownHand[bombCardIndex1].classList.add('ta-bomb-card');

        if (threeSecCountdown < 0) {
            shownHand[bombCardIndex1].appendChild(bombIcon);
        }

        shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
    }
    
    // Add a second bomb card after 1 minute
    let bombCardIndex2 = cardBonusIndex;
    let bombIcon2 = document.createElement('div');
    bombIcon2.classList.add('bomb-icon');
    if (secondsLeft <= 120) {
        while (bombCardIndex2 === cardBonusIndex || bombCardIndex2 === bombCardIndex1) {
            bombCardIndex2 = Math.floor(Math.random() * 18);    
            shownHand[bombCardIndex2].classList.add('ta-bomb-card');
            shownHand[bombCardIndex2].appendChild(bombIcon2);
            shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
        }
    }
    
    // Add a third bomb card after 2 minutes
    let bombCardIndex3 = cardBonusIndex;
    let bombIcon3 = document.createElement('div');
    bombIcon3.classList.add('bomb-icon');
    if (secondsLeft <= 60) {
        while (bombCardIndex3 === cardBonusIndex || bombCardIndex3 === bombCardIndex1 || bombCardIndex3 === bombCardIndex2) {
            bombCardIndex3 = Math.floor(Math.random() * 18);    
            shownHand[bombCardIndex3].classList.add('ta-bomb-card');
            shownHand[bombCardIndex3].appendChild(bombIcon3);
            shownHand[cardBonusIndex].classList.remove('ta-bomb-card');
        }
    }
}

function redealReset() {
    bonusAdded = false;
    count = 0;
    if (count < 1) {
        countDisplay.style.color = '#555';
        countDisplay.textContent = '15';
    } else {
        countDisplay.style.color = '#fff';
        countDisplay.textContent = `${count}`;    
    }
    cardsDisplay.innerHTML = '';
    buildAndShowHand(cardsToReplace);

    //   Add bonus class to bonus card
    let tempBonusIndex = getBonusCardIndex();    
    shownHand = cardsDisplay.childNodes;
    
    if (tempBonusIndex) {
        shownHand[tempBonusIndex].classList.add('ta-bonus-card');
    }

    if (tempBonusIndex === 0) {
        firstSpin = false;
    }
  }

  function checkAndScoreBonusCard() {
      let tempBonusIndex = getBonusCardIndex();
      shownHand = cardsDisplay.childNodes;
      
    // Score bonus card if in final position
    if (tempBonusIndex === 17 && shownHand[tempBonusIndex].classList.contains('ta-checked')) {
        bonusUnleashed = false;

        fullPassCount++;

        // check achievement
        utils.achievementsCheck("ach-ta-1", fullPassCount, 3);
        utils.achievementsCheck("ach-ta-2", fullPassCount, 5);
        utils.achievementsCheck("ach-ta-3", fullPassCount, 6);

        if (!bonusAdded) {
            bonusPoints = sameSuitCheck(score, true);
            score += bonusPoints;
            bonusAdded = true;
            
            if (userSelectedSoundSettings.SFX) {
                bonusCardSFX.play();
            }
        }
    } else if (shownHand[tempBonusIndex].classList.contains('ta-checked')) {
        bonusUnleashed = false;
    }

    // Score checked cards
    addPointsToScore();
  }

  function getBonusCardIndex() {
    let tempBonusIndex;
    activeHand.forEach((card, index) => {
        if (card.bonus) {
            tempBonusIndex = index;

            if (index === 17 && !firstSpin) {
                firstSpin = true;
                utils.timeAttackBonusFinalPositionAni();
            }
        }
    }) 

    return tempBonusIndex;
  }

  function addPointsToScore() {
    cardsToReplace = document.querySelectorAll(".ta-checked").length;

    pointsAdded = sameSuitCheck(cardsToReplace, false);
    score += pointsAdded;
    console.log('Current Score:', score);

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
    
    activeHand.forEach(card => {
        if (card.checked) {
            checkedCardSuits.push(card.suit);
        }
    })

    if(checkedCardSuits.every(sameColorBlack) || checkedCardSuits.every(sameColorRed)) {
        if (forBonusCard) {
            // adds half of current score as points if bonus card play from final position is all same color
            pointsInPlay = Math.round(score/2)

            console.log('Bonus Play (same color):', pointsInPlay);
        } else {
            // same color play not involving bonus card multiplies points added by 1.25
            pointsInPlay = Math.round(pointsInPlay * 1.25)

            console.log('Standard Play (same color):', pointsInPlay);
        }
    } else {
        if (forBonusCard) {
            // adds a fourth of current score as points if bonus card play from final position is all same color
            pointsInPlay = Math.round(score/4)

            console.log('Bonus Play (diff color):', pointsInPlay);
        } else {
            console.log('Standard Play (diff color):', pointsInPlay);
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
      if (count < 1) {
        countDisplay.style.color = '#555';
        countDisplay.textContent = '15';
    } else {
        countDisplay.style.color = '#fff';
        countDisplay.textContent = `${count}`;    
    }
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
    if(e.code === pauseBtn && threeSecCountdown < 0) {
        if (document.querySelector(".ta-pause-screen").classList.contains('hidden')) {
            gamePaused = true;
            document.querySelector(".ta-pause-screen").classList.remove('hidden');
            secondsLeftAtPause = secondsLeft;
            displaySecondsWhilePaused();
        } else {
            gamePaused = false;
            document.querySelector(".ta-pause-screen").classList.add('hidden');
            secondsLeft = secondsLeftAtPause;
            timerDisplay.textContent = `${secondsLeftAtPause}`; 
            clearInterval(pausedTimerSet);
        }
    }
})
// Menu click
document.getElementById('pause-game-btn').addEventListener('click', () => {
    if (document.querySelector(".ta-pause-screen").classList.contains('hidden')) {
        gamePaused = true;
        document.querySelector(".ta-pause-screen").classList.remove('hidden');
        secondsLeftAtPause = secondsLeft;
        displaySecondsWhilePaused();
    } 
    document.querySelector(".ta-pause-screen").addEventListener('click', () => {
        gamePaused = false;
        document.querySelector(".ta-pause-screen").classList.add('hidden');
        secondsLeft = secondsLeftAtPause;
        timerDisplay.textContent = `${secondsLeftAtPause}`; 
        clearInterval(pausedTimerSet);
    })
})

function displaySecondsWhilePaused() {
    document.getElementById('resume-game-key').textContent = `${pauseBtn}`;
    document.querySelector('.seconds-left').textContent = `${secondsLeftAtPause}`;
    pausedTimerSet = setInterval(() => { 
        document.querySelector('.seconds-left').classList.toggle('hidden-vis');
    }, 500);
}

function newHighscoreCheckAndUpdate() {
    if (pointsOnDisplay > highscoreToBeat && !highscoreDefeated) {
        highscoreDefeated = true;

        if (userSelectedSoundSettings.SFX) {
            newHighscoreSFX.play();
        }

        setInterval(() => {
            taHighscoreDisplay.innerText = `${pointsOnDisplay}`
        }, 100);
    }
}