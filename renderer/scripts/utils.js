// Quick fadein when starting arcade and time attack mode
exports.gamescreenFadeinFunc = () => {
document.querySelector('body').style.
opacity = 0;
let fadeTime = 0;

const gamescreenFadein = setInterval(() => {
  document.querySelector('body').style.opacity = fadeTime;
  fadeTime += 0.1;
  if (fadeTime >= 1) clearInterval(gamescreenFadein);
}, 39)
}

exports.timeAttackFadeIn = () => {
  document.querySelector('body').style.
opacity = 0;
let fadeTime = 0;

setTimeout(() => {
    const gamescreenFadein = setInterval(() => {
      document.querySelector('body').style.opacity = fadeTime;
      fadeTime += 0.1;
      if (fadeTime >= 1) {
          clearInterval(gamescreenFadein);
      }
    }, 39)
},250);
}

exports.timeAttackBackgroundAdjust = () =>
{
  document.querySelector('.ta-total-container').style.left = `-${window.innerWidth - 1200}px`;

let taBackgroundSizeCorrection = window.innerWidth - 1200;

document.querySelector('.ta-total-container').style.width = `calc(100vw + ${taBackgroundSizeCorrection}px)`;
}

// set bg position of Cosmos theme background after other content is loaded to keep it centered
exports.setCosmosBg = () => {
  let themeSelection = JSON.parse(localStorage.getItem('theme-selection'));

if (themeSelection['themeName'] === "Universe") {
  let bgHelper = document.querySelector('.background-helper');

  setTimeout(() => {
    bgHelper.style.position = "absolute";
    bgHelper.style.top = "-75%";
    bgHelper.style.left = "-50%";
    bgHelper.style.width = "200%";
    bgHelper.style.height = "250%";
  },250)
}
}

// Select Animations & Transistions
exports.jackpotBonusPointsAni = (totalCardsPlayed, jackpotSameColorCheck, totalCardsPlayedDisplay,jackpotMultiplierLvl, jackpotMultiplier) => {
  let jackpotBonusIndicator = document.createElement('div');

  if (jackpotSameColorCheck) {
    jackpotBonusIndicator.textContent = `+${Math.round((totalCardsPlayed * jackpotMultiplier[jackpotMultiplierLvl]))}`;
  } else {
    jackpotBonusIndicator.textContent = `+${totalCardsPlayed}`;
  }

  jackpotBonusIndicator.classList.add('jackpot-bonus-indicator');

  document.querySelector(".scoreboard").appendChild(jackpotBonusIndicator);

  setTimeout(() => {
    jackpotBonusIndicator.style.transform = `translateY(-30px)`;
    jackpotBonusIndicator.style.opacity = `0`;
    jackpotBonusIndicator.style.color = `#fff`;
  }, 15);

  // card icon rotation animation
  document.querySelector('#cards-icon').style.transition = "all 1s ease";
  document.querySelector('#cards-icon').style.transform = "rotate(360deg)";

  setTimeout(() => {
    document.querySelector('#cards-icon').style.transition = "none";

    document.querySelector('#cards-icon').style.transform = "rotate(0)";
  }, 1000);
};

exports.fullClearBorderAni = (themeSelection,totalCardsPlayed, jackpotSameColorCheck,jackpotMultiplierLvl, jackpotMultiplier) => {
  let i = 0;
  let borderAniCol = themeSelection['fullClearBrdGrd'];
  let guiElementController = document.querySelector('.gui-container');

  // check for Classic theme's shifting border color
  if (themeSelection['themeName'] == "Classic") { 
    guiElementController.style.animationName = 'none';  
  }

  const borderAnimation = setInterval(() => {
    document.querySelector(".gui-container").style.border = `4px solid ${borderAniCol[i]}`;
    i++;

    if (i > themeSelection['fullClearBrdGrd'].length)  {
      clearInterval(borderAnimation);
      document.querySelector(".gui-container").style.border = `4px solid ${themeSelection['brdCol']}`;

      // check for Classic theme's shifting border color
      if (themeSelection['themeName'] == "Classic") { 
        guiElementController.style.animationName = 'border-shift';  
      }
    }
  }, 100);

  let jackpotCheckedCardCheck = Array.from(document.querySelectorAll(".checked")).filter((card) => card.classList.contains('jackpot-special-border'));

  console.log(jackpotCheckedCardCheck);

  if (jackpotCheckedCardCheck.length === 1) {
    jackpotBonusPointsAni(totalCardsPlayed, jackpotSameColorCheck,jackpotMultiplierLvl, jackpotMultiplier);
  }
}

exports.swapCardAni = (dblSwapCheck, cardsInHand, currentHand, playersHandArea) => {
  let swapSlideAnimationLength;
  let validCardsInHand = 0;

  dblSwapCheck = true;

  if (cardsInHand.length <= 5) {
    swapSlideAnimationLength = 200;
  } else {
    swapSlideAnimationLength = 100;
  }
  
  currentHand.style.margin = `15.188px 8.938px 15.188px ${8.938 - swapSlideAnimationLength}px`;
  
  currentHand.style.transition = "transform ease 0.2s";
  currentHand.style.transform = `translateX(${swapSlideAnimationLength}px)`;

  let lastCardClone = cardsInHand[cardsInHand.length-1].cloneNode(true);
  lastCardClone.classList.add('lastCardSwapAnimation');
  if (cardsInHand.length <= 5) {
    lastCardClone.style.right = "120px";
  }

  currentHand.after(lastCardClone);
  setTimeout(() => {
    lastCardClone.style.opacity = "0";
    
    if (cardsInHand.length <= 5) {
      lastCardClone.style.transform = "translateX(240px)";
    }
    lastCardClone.style.transform = "translateX(120px)";
  }, 15);
  
  setTimeout(() => {
    currentHand.style.transition = "none";

    // correction for stutter 'glitch' when hand is a certain amount of cards
    if (cardsInHand.length === 8 || cardsInHand.length === 7 || cardsInHand.length === 3) {
      currentHand.style.margin = `15.188px 8.938px 15.188px ${8.938 - 10}px`;
      currentHand.style.transform = "translateX(10px)";
    } else {
      currentHand.style.margin = `15.188px 8.938px 15.188px 8.938px`;
      currentHand.style.transform = "translateX(0)";
    }
  }, 450);
  
  const dblSwapCorrection = setInterval(() => {
    if (!dblSwapCheck && cardsInHand.length <= 10) {
    swapCostDisplay.textContent = `-${11 - validCardsInHand}s`;
    }
    }, 200);

  setTimeout(() => {
    playersHandArea.removeChild(lastCardClone);
    dblSwapCheck = false;
    clearInterval(dblSwapCorrection)
  }, 200);

  return validCardsInHand;
}

exports.jackpotLevelAni = (jackpotLevelDisplay, jackpotMultiplierLvl) => {
  if (jackpotMultiplierLvl < 1) {
    jackpotLevelDisplay.style.animationName = "";
  } else if (jackpotMultiplierLvl === 1) {
    jackpotLevelDisplay.style.animationName = "jackpotlevelflicker";
    jackpotLevelDisplay.style.color = "#aaa";
  } else if (jackpotMultiplierLvl === 2) {
    jackpotLevelDisplay.style.animationDuration = "1.5s";
    jackpotLevelDisplay.style.color = "#ccc";
  } else if (jackpotMultiplierLvl === 3) {
    jackpotLevelDisplay.style.animationDuration = "0.5s";
    jackpotLevelDisplay.style.color = "#fff";
  }
}

// Internal Functions
function jackpotBonusPointsAni(totalCardsPlayed, jackpotSameColorCheck,jackpotMultiplierLvl, jackpotMultiplier) {
  let jackpotBonusIndicator = document.createElement('div');

  if (jackpotSameColorCheck) {
    jackpotBonusIndicator.textContent = `+${Math.round((totalCardsPlayed * jackpotMultiplier[jackpotMultiplierLvl]))}`;
  } else {
    jackpotBonusIndicator.textContent = `+${totalCardsPlayed}`;
  }

  jackpotBonusIndicator.classList.add('jackpot-bonus-indicator');

  document.querySelector(".scoreboard").appendChild(jackpotBonusIndicator);

  setTimeout(() => {
    jackpotBonusIndicator.style.transform = `translateY(-30px)`;
    jackpotBonusIndicator.style.opacity = `0`;
    jackpotBonusIndicator.style.color = `#fff`;
  }, 15);

  // card icon rotation animation
  document.querySelector('#cards-icon').style.transition = "all 1s ease";
  document.querySelector('#cards-icon').style.transform = "rotate(360deg)";

  setTimeout(() => {
    document.querySelector('#cards-icon').style.transition = "none";

    document.querySelector('#cards-icon').style.transform = "rotate(0)";
  }, 1000);
};

exports.classicThemeTransition = (playersHandBg, comboRoundCheck) => {
 
  if (comboRoundCheck) {
    let inversePct = 0;
    let blurPct = 5;
  
    const classicThemeInverse = setInterval(() => {
      playersHandBg.setProperty('--players-bg-filter', `blur(${blurPct}px) invert(${inversePct}%)`);
      inversePct += 3;
      blurPct++;

      if (inversePct >= 100) clearInterval(classicThemeInverse);
    }, 1);

  } else {
    playersHandBg.setProperty('--players-bg-filter', 'blur(15px) invert(0%)');
  }
}

exports.timeAttackBonusFinalPositionAni = () =>
{
  const bonusCard = document.querySelector(".ta-bonus-card");

  bonusCard.style.animationName = "bonusCardSwirl";
} 
