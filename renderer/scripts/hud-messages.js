const hudMessageDisplay = document.querySelector(".hud-message");

const hudMessageList = {
    jackPot: [
        'Jackpot on the table',
        "Don't miss that jackpot!",
        'Is it your day?',
        'Count!'
    ],
    fullHand: [
        'Skill or lucky break?',
        'Never a bad idea to clear the deck',
        'Nice move!',
        'Count!'
    ],
    count: [
        'Count!',
        'Count!',
        'Count!',
        'Fifteen is the number'
    ],
    combo: [
        // 'Combo!',
        // 'Combo!',
        // 'Combo!',
        // 'Combo!',
        // 'Combo!',
        // 'Combo!',
        'Which cards you gonna sacrifice to the gods?',
        'Which cards can you live without?'
    ]
}


class Messenger {
    constructor() {

    }

    countOrCombo(firstSubmit) {
        if (!firstSubmit){
            hudMessageDisplay.innerHTML = hudMessageList['count'][Math.floor(Math.random() * 4)];
        } else {
            hudMessageDisplay.innerHTML = hudMessageList['combo'][Math.floor(Math.random() * 2)];
        }
    }

    jackpotMessages() {
        hudMessageDisplay.innerHTML = hudMessageList['jackPot'][Math.floor(Math.random() * 4)];
        setTimeout(() => {
            this.countOrCombo();
        }, 2000);
    }

    fullHandPlayedMessage() {
        hudMessageDisplay.innerText = hudMessageList['fullHand'][Math.floor(Math.random() * 4)];
        setTimeout(() => {
            this.countOrCombo();
        }, 2000);
    }
}
console.log(hudMessageList);

message = new Messenger;

exports.hudMessage = (firstSubmit, jackpotLive, incomingHudMessages, fullHandPlayed) => {

    if (jackpotLive && !firstSubmit) {
        message.jackpotMessages();
        clearInterval(incomingHudMessages);
    } else if (fullHandPlayed && !firstSubmit) {
        message.fullHandPlayedMessage();
        clearInterval(incomingHudMessages);
    } else {
        message.countOrCombo(firstSubmit);
        clearInterval(incomingHudMessages);
    }
}



// Version 2
let hudMessageCache = '';
let specialMessage = false;

exports.count = (hudMessageDisplay) => {

    if (!specialMessage) {
        hudMessageDisplay.innerText = 'Count!';
        hudMessageCache = 'Count!';
    } else {
        setTimeout(() => {
            hudMessageDisplay.innerText = 'Count!';
            hudMessageCache = 'Count!';
        }, 1000);
    }
}

exports.combo = (hudMessageDisplay) => {
    hudMessageDisplay.innerText = 'Combo!';
    hudMessageCache = 'Combo!';
}

exports.newHighscore = (hudMessageDisplay) => {
    hudMessageDisplay.innerHTML = `&nbsp;`;
    hudMessageDisplay.style.transform = "translateY(100px)";
    
    setTimeout(() => {    
        hudMessageDisplay.innerText = 'NEW HIGHSCORE!';
        hudMessageDisplay.style.transition = "all 0.5s ease";    
        hudMessageDisplay.style.transform = "translateY(0)";
    }, 100);

    specialMessage = true;

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.jackpotOnTable = (hudMessageDisplay) => {
    hudMessageDisplay.innerText = 'Jackpot on the table';

    specialMessage = true;

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.fullHandClear = (hudMessageDisplay) => {
    hudMessageDisplay.innerText = 'Harmonia';

    specialMessage = true;

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.gameOver = (hudMessageDisplay) => {
    hudMessageDisplay.innerText = 'Game Over';
}




