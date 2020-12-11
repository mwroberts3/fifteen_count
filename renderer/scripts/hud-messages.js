const hudMessageDisplay = document.querySelector(".hud-message");


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
        hudMessageDisplay.innerHTML = 'Jackpot on the table!';
        setTimeout(() => {
            this.countOrCombo();
        }, 2000);
    }

    fullHandPlayed() {
        hudMessageDisplay.innerText = "Skill or lucky break?";
    }
}

message = new Messenger;

exports.hudMessage = (firstSubmit, jackpotLive, incomingHudMessages) => {

    if (jackpotLive && !firstSubmit) {
        message.jackpotMessages();
        clearInterval(incomingHudMessages);
    } else {
        message.countOrCombo(firstSubmit);
    }

}





