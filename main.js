// BUILD THE DECK
let deck = [];
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
    let card = { suit: "", face: "", valueA: 0, valueB: 0 };
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
      card.valueB = null;
    }
    deck.push(card);
  }
}

// add Jokers
for (let i = 0; i < 2; i++) {
  let card = { suit: null, face: "joker", valueA: -1, valueB: null };
  deck.push(card);
}

// SHUFFLE DECK
for (let i = 0; i < 1400; i++) {
  let rand1 = Math.random();
  shuffle1 = Math.round(rand1 * 54);
  let rand2 = Math.random();
  shuffle2 = Math.round(rand2 * 54);

  temp = deck[shuffle2];

  deck[shuffle2] = deck[shuffle1];
  deck[shuffle1] = temp;
}

// removes any undefined elements (index numbers that weren't randomly generated)
deck = deck.filter(function (element) {
  return element !== undefined;
});

// DRAW HAND OF 10 CARDS
let handSize = 10;
let hand = [];
for (i = 0; i < handSize; i++) {
  hand.splice(i, 0, deck.pop());
}

// *************DEBUG CONSOLE*****************
// console.log(hand);

// for (let i = 0; i < deck.length; i++) {
//   console.log(
//     deck[i]["suit"],
//     deck[i]["face"],
//     deck[i]["valueA"],
//     deck[i]["valueB"]
//   );
// }

// console.log(deck);
// *******************************************
