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
let pointsAdded = 0;

let cardIndex;
let shownHand = [];

class Card {
    constructor(face, suit, value, id) {
        this.face = face;
        this.suit = suit;
        this.value = value;
        this.checked = false;
        this.id = id;
    }

    checkCard(cardIndex) {
        cardsDisplay.childNodes[cardIndex].classList.toggle('ta-checked');
        if (cardsDisplay.childNodes[cardIndex].classList.contains('ta-checked')) {
            this.checked = true;
            count += activeHand[cardIndex].value
            if (count === 15) {
                activeHand.forEach(card => {
                    if (card.checked) {
                        console.log(card);
                    }
                });

                testHand = activeHand.filter(card => card.checked === true);

                testHand = [...new Set(testHand)];

                console.log(testHand);

                for (let i = 0; i < 18; i++) {
                    for (let k = 0; k < testHand.length; k++) {
                        if (activeHand[i]) {
                            if (activeHand[i].id === testHand[k].id) {
                                    console.log(activeHand[i].id, testHand[k].id)
                                    activeHand.splice(i, 1);
                                }
                        }
                    }
                }
                    redealReset();
            }
        } else {
            this.checked = false;
            count -= activeHand[cardIndex].value
        }
    }
}

buildDeckTimeAttack(deck);
shuffleTimeAttack(deck);
buildAndShowHand(redrawAmount);

// Check Cards Phase
cardsDisplay.addEventListener('click', e => {
    cardIndex = [...e.target.parentNode.children].indexOf(e.target);
    shownHand = cardsDisplay.childNodes;

  if (e.target.classList.contains('ta-card')) {
    activeHand[cardIndex].checkCard(cardIndex);
      countDisplay.textContent = `${count}`;
  }  
})

function buildDeckTimeAttack() {
    let tempCardId = 0;
    let tempSuit;
    const faces = [
        "-one",
        "zero",
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
      const value = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
      shuffle1 = Math.round(rand1 * 307);
      let rand2 = Math.random();
      shuffle2 = Math.round(rand2 * 307);
  
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
      console.log("draw amount", drawAmount);
    for (let i = 0; i < drawAmount; i++) {
        activeHand.unshift(deck.pop()); 
    }

    activeHand.forEach(card => {
        let cardInHand = document.createElement('div');

        cardInHand.classList.add('ta-card');
        cardInHand.textContent = card.value;
        cardInHand.style.background = card.suit;

        cardsDisplay.appendChild(cardInHand);
    })
  }

  function redealReset() {
      pointsAdded = document.querySelectorAll(".ta-checked").length;
      score += pointsAdded;
      scoreDisplay.textContent = `${score}`;
      
      count = 0;
      countDisplay.textContent = `${count}`;
      cardsDisplay.innerHTML = '';
      buildAndShowHand(pointsAdded);
  }

