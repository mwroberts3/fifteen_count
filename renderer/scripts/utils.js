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
  }, 15)
};

exports.fullClearBorderAni = (themeSelection) => {
  let i = 0;
  let borderAniCol = themeSelection['fullClearBrdGrd'];

  const borderAnimation = setInterval(() => {
    document.querySelector(".gui-container").style.border = `4px solid ${borderAniCol[i]}`;
    i++;

    if (i > themeSelection['fullClearBrdGrd'].length)  {
      clearInterval(borderAnimation);
      document.querySelector(".gui-container").style.border = `4px solid ${themeSelection['brdCol']}`;
    }
  }, 100);

  let jackpotCheckedCardCheck = Array.from(document.querySelectorAll(".checked")).filter((card) => card.classList.contains('jackpot-special-border'));

  console.log(jackpotCheckedCardCheck);

  if (jackpotCheckedCardCheck.length === 1) {
    jackpotBonusPointsAni(totalCardsPlayed, jackpotSameColorCheck, totalCardsPlayedDisplay);
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