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




