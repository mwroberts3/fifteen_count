// Settings Container
const optionsSelect = document.querySelector(".how-to-nav");
const optionsDisplay = document.querySelectorAll("section");

optionsSelect.addEventListener("click", (e) => {
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
  { index: 0, themeName: "Classic", bgImgPlayersHand: "classic-bg.png", bgImgCombo: "classic-bg-combo-round.png", bgCol: "#b3edff", cardSprites: "style/classicsprites.css", bgm: "bgm/Theme-Classic.mp3" },
    { index: 1, themeName: "Jungle", bgImgPlayersHand: "jungle-bg.png", bgImgCombo: "jungle-bg-combo-round.png", bgCol: "green", cardSprites: "style/junglesprites.css", bgm: "bgm/Clouds-Jungle.mp3" },
    { index: 2, themeName: "Universe", bgImgPlayersHand: "universe-bg.png", bgImgCombo: "universe-bg-combo-round.png", bgCol: "#000", cardSprites: "style/universesprites.css", bgm: "bgm/DescentIntoMadness-Universe.mp3" }
]

const themeSelectionMenu = document.querySelector('.theme-selection-menu');

themeSelectionMenu.addEventListener('click', (e) => {
  console.log(e.target.tagName);
  if (e.target.tagName === 'DIV') {
    e.target.classList.add('selected-theme');
    localStorage.setItem('theme-selection', JSON.stringify(arcadeThemes[e.target.dataset.index]));
  }
  if (e.target.tagName === 'SPAN') {
    e.target.parentElement.classList.add('selected-theme');
    localStorage.setItem('theme-selection', JSON.stringify(arcadeThemes[e.target.parentElement.dataset.index]));
  }
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
})

