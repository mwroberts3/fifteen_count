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

    ]
}


class Messenger {
    constructor() {

    }

    countOrCombo(firstSubmit) {
        if (!firstSubmit){
            hudMessageDisplay.innerText = "Count!";
        } else {
            hudMessageDisplay.innerText = "Combo!";
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
    }
}





