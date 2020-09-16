**_FIFTEEN COUNT_**
https://github.com/cardmeister/cardmeister.github.io

things to fix as of 7/26/20:
-shouldn't be able to get rid of face cards when no value is selected, but fifteen count is still fifteen

-shouldn't be able to combo with jokers

-SHOULD NOT BE ABLE TO SWAP CARDS WHEN ONE CARD LEFT IN HAND

-shouldn't be able to combo already checked cards in the combo phase, GAMEBREAKING BUG

-possible to have mouse scroll from one edge to the oposite side, ala pacman?

-checking more cards of the same suit, even when 15 count is 15, adds points to the points in play

-sometimes getting really low combo scores...notice this a lot with aces...

-animate the total score as points are being added up

-don't have eventlistener on each individual card, but have event delgation on the containing div (SEE TODO LIST PROJECT). This should give game better performance

-bonus points still being applied even though count isn't 15

-time bonus shouldn't work for first hand...actually, maybe it should?

-if player plays ALL cards in hand, there should be a combo round after

-should be a button to uncheck all cards

-Need to have way for players to swap out cards, don't want so many games ending in dead ends with > 10 seconds on the clock

-Maybe add a function to remove right-most card for a new one at the cost of time...maybe start at -3 seconds per swap

-was able to use all cards to get Fifteen Count 1/~10 times

-the other new idea of having the time bonus limit be have of hand seems like a decent idea

-NEED PAUSE BUTTON

-swap card button swaps ALL checked cards, not just the last one in the hand
