// Settings Container
const optionsSelect = document.querySelector(".how-to-nav");
const optionsDisplay = document.querySelectorAll("section");

// Option submenu select
optionsSelect.addEventListener("click", (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === 'LI'){

    e.target.classList.add("option-selected");
    
    Array.from(optionsSelect.children[0].children).forEach((option) => {
        if (option !== e.target) {
            option.classList.remove("option-selected");
        }
    })

    optionsDisplay.forEach((section) => {
        if (section.id !== e.target.classList[0]){
            section.classList.add("hidden");
        } else {
            section.classList.remove("hidden");
        }
    })
  }
});

// Controls
const buttonOptions = document.querySelector("#controls");
const buttonOptionsContainer = document.querySelector(".button-options-container");
const buttonLabels = buttonOptionsContainer.querySelectorAll('span');
const buttonSelectPopup = document.querySelector(".button-select");
const resetControlsBtn = document.querySelector('#reset-controls-btn');

let controls = [];
let defaultControls = [
  {buttonName: "actionBtn", button: "ShiftLeft"},
  {buttonName: "lowValBtn", button: "ControlLeft"},
  {buttonName: "uncheckcardsBtn", button: "KeyZ"},
  {buttonName: "swapBtn", button: "AltLeft"},
  {buttonName: "pauseBtn", button: "Space"},
];

const setControls = () => {
  if (!localStorage.getItem('controls')) {
    controls = defaultControls;
    localStorage.setItem('controls', JSON.stringify(controls));
  } else {
    controls = JSON.parse(localStorage.getItem('controls'))
  }
}

setControls();

const buttonsDisplay = () => {
  for (let i = 0; i < buttonLabels.length; i++) {
    for(let k = 0; k < controls.length; k++){
      if (buttonLabels[i].classList.contains(controls[k]['buttonName'])) {
        buttonLabels[i].textContent = controls[k]['button']
      }
    }
  }
};

buttonsDisplay();

// Set custom buttons
  buttonOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN"){
      buttonSelectPopup.classList.remove("hidden");
      let buttonToReplace = e.target;
      let buttonName = e.target.classList[1];

      document.addEventListener("keyup", (e) => {
        buttonSelectPopup.classList.add("hidden");
        buttonToReplace.textContent = `${e.code}`;
        buttonToReplace = '';
        controls = controls.filter(row => row.buttonName !== buttonName);
        controls = controls.filter(row => row.buttonName !== '');
        controls.push({buttonName, button: e.code});
        buttonName = '';
        controls.sort((a, b) => a.buttonName - b.buttonName);
        localStorage.setItem('controls', JSON.stringify(controls));
      })
    }
  });

// Reset to default controls
resetControlsBtn.addEventListener('click', () => {
localStorage.removeItem('controls');
  setControls();
  buttonsDisplay();
})

// Select theme dropdown
const arcadeThemes = [
  { index: 0, themeName: "Classic", bgImgPlayersHand: ["classic-bg.png"], bgImgCombo: "classic-bg-combo-round.png", bgCol: "#b3edff", cardSprites: "style/classicsprites.css", bgm: "bgm/Theme-Classic.mp3", fifteenCountGradient: ['#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222', '#111', '#000'] },
    { index: 1, themeName: "Jungle", bgImgPlayersHand: ["jungle-bg-1.png","jungle-bg-2.png","jungle-bg-3.png","jungle-bg-4.png","jungle-bg-5.png","jungle-bg-6.png","jungle-bg-7.png","jungle-bg-8.png"], bgImgCombo: "jungle-bg-combo-round.png", bgCol: "#ccead5", cardSprites: "style/junglesprites.css", bgm: "bgm/Clouds-Jungle.mp3", fifteenCountGradient: ['#000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#eee', '#fff'] },
    { index: 2, themeName: "Universe", bgImgPlayersHand: ["universe-bg.png"], bgImgCombo: "universe-bg-combo-round.png", bgCol: "#000", cardSprites: "style/universesprites.css", bgm: "bgm/DescentIntoMadness-Universe.mp3", fifteenCountGradient: ['#000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#eee', '#fff'] }
]

// Preselect theme in menu if player has already choosen theme
let preselectedTheme;
if (localStorage.getItem('theme-selection')) {
  let tempArrayHousing = JSON.parse(localStorage.getItem('theme-selection'));
  preselectedTheme = tempArrayHousing['index'];
  tempArrayHousing = Array.from(document.querySelector('.theme-selection-menu').children);
  tempArrayHousing[preselectedTheme].classList.add('selected-theme');
} else {
  document.querySelector('.theme-selection-menu').children[0].classList.add('selected-theme');
}

// Check for unlocked themes
let tempHighscoreCheck;
if (localStorage.getItem('highscore')) {
  tempHighscoreCheck = JSON.parse(localStorage.getItem('highscore'))[0]['totalPoints'];
  console.log(tempHighscoreCheck);
} else {
  tempHighscoreCheck = 0;
}
  let tempArrayHousing = Array.from(document.querySelector('.theme-selection-menu').children);
  // Jungle theme check
  if (tempHighscoreCheck >= 5000) {
    tempArrayHousing[1].classList.remove('locked');
    tempArrayHousing[1].classList.add('unlocked');
  } else {
    tempArrayHousing[1].textContent = 'Jungle (5000pts)';
  }
  // Cosmos theme check
  if (tempHighscoreCheck >= 10000) {
    tempArrayHousing[2].classList.remove('locked');
    tempArrayHousing[2].classList.add('unlocked'); 
  } else {
    tempArrayHousing[2].textContent = 'Cosmos (10000pts)';
  }

// Select new active theme
const themeSelectionMenu = document.querySelector('.theme-selection-menu');

themeSelectionMenu.addEventListener('click', (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === 'DIV' && e.target.classList.contains('unlocked')) {
    e.target.classList.add('selected-theme');
    localStorage.setItem('theme-selection', JSON.stringify(arcadeThemes[e.target.dataset.index]));
    deselectNonselectedThemes(e);
  }
  if (e.target.tagName === 'SPAN' && e.target.parentElement.classList.contains('unlocked')) {
    e.target.parentElement.classList.add('selected-theme');
    localStorage.setItem('theme-selection', JSON.stringify(arcadeThemes[e.target.parentElement.dataset.index]));
    deselectNonselectedThemes(e);
  }
})

function deselectNonselectedThemes(e) {
  themeSelectionMenu.childNodes.forEach((child) => {
    console.log(child)
    if (child.nodeType !== 3){ 
      if (child !== e.target) {
        if (child !== e.target.parentElement) {
          child.classList.remove('selected-theme');
        }
      }
    }
  })
}

// Save Changes to Sound Settings
let tempSoundSettings = {
  BGM: true, SFX: true
}
if (!localStorage.getItem('sound-settings')) {
  localStorage.setItem('sound-settings', JSON.stringify(tempSoundSettings)); 
} else {
  tempSoundSettings = JSON.parse(localStorage.getItem('sound-settings'));
}

// Pre-Set checkboxes
if (tempSoundSettings.BGM) {
  document.getElementById('BGM-check').checked = true;
} else {
  document.getElementById('BGM-check').checked = false;
}

if (tempSoundSettings.SFX) {
  document.getElementById('SFX-check').checked = true;
} else {
  document.getElementById('SFX-check').checked = false;
}

document.querySelector(".music-options-selection").addEventListener('click', (e) => {
  if (!document.getElementById('BGM-check').checked) {
    tempSoundSettings.BGM = false;
  } else {
    tempSoundSettings.BGM = true;
  }
  if (!document.getElementById('SFX-check').checked) {
    tempSoundSettings.SFX = false;
  } else {
    tempSoundSettings.SFX = true;
  }
  localStorage.setItem('sound-settings', JSON.stringify(tempSoundSettings)); 
});