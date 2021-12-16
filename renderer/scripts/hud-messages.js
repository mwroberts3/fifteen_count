let hudMessageCache = '';
let specialMessage = false;

exports.countdown = (hudMessageDisplay) => {
    hudMessageDisplay.innerHTML = '&nbsp;';
    hudMessageDisplay.innerHTML = 'ready?';
    let i = 0;
    // const countdownInterval = setInterval(() => {
    //     console.log(i);
    //     if (i < 5) {
    //         hudMessageDisplay.innerText += ".";
    //         i++;
    //     } else {
    //         clearInterval(countdownInterval);
    //     }
    // }, 500);

    setTimeout(() => {
        document.querySelectorAll('.card-sprite');

        for(let x=0; x < document.querySelectorAll('.card-sprite').length; x++) {
            document.querySelectorAll('.card-sprite')[x].style.filter = 'none';
        }
    }, 3000); 
};

exports.count = (hudMessageDisplay) => {

    if (!specialMessage) {
        setTimeout(() => {
            hudMessageDisplay.innerText = 'Count!';
        }, 40);
        hudMessageCache = 'Count!';
    } else {
        setTimeout(() => {
            hudMessageDisplay.innerText = 'Count!';
            hudMessageCache = 'Count!';
        }, 1000);
    }
}

exports.combo = (hudMessageDisplay) => {
    // !specialMessage ? hudMessageDisplay.innerText = 'Combo!' : hudMessageDisplay.innerText = '';
    if (!specialMessage) {
        setTimeout(() => {
            hudMessageDisplay.innerText = 'Combo!';
        }, 35);
        hudMessageCache = 'Combo!';
    }

}

exports.newHighscore = (hudMessageDisplay) => {  
    if (specialMessage) {
        setTimeout(() => {
            hudMessageDisplay.innerHTML = `&nbsp;`;
            hudMessageDisplay.style.transform = "translateY(100px)";
        }, 1000);

        setTimeout(() => {    
            hudMessageDisplay.innerText = 'NEW HIGHSCORE!';
            hudMessageDisplay.style.transition = "all 0.5s ease";    
            hudMessageDisplay.style.transform = "translateY(0)";
        }, 1035);
    } else {
        hudMessageDisplay.innerHTML = `&nbsp;`;
        hudMessageDisplay.style.transform = "translateY(100px)";
        
        setTimeout(() => {    
            hudMessageDisplay.innerText = 'NEW HIGHSCORE!';
            hudMessageDisplay.style.transition = "all 0.5s ease";    
            hudMessageDisplay.style.transform = "translateY(0)";
        }, 35);
    
        specialMessage = true;
    }

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.jackpotOnTable = (hudMessageDisplay) => {
    setTimeout(() => {
        hudMessageDisplay.innerText = 'Jackpot on the Board!';
    }, 50);

    specialMessage = true;

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.fullHandClear = (hudMessageDisplay) => {
    setTimeout(() => {
        hudMessageDisplay.innerText = 'Full Clear!';
    }, 60);

    specialMessage = true;

    setTimeout(() => {
        hudMessageDisplay.innerText = hudMessageCache

        specialMessage = false;
    }, 2000)
}

exports.gameOver = (hudMessageDisplay) => {
    hudMessageDisplay.innerText = 'Game Over';
}




