const { ipcRenderer } = require('electron');

// Controls Popup
const buttonSelectPopup = document.querySelector(".button-select");

// Settings Container
const optionsSelect = document.querySelector(".how-to-nav");
const optionsDisplay = document.querySelectorAll("section");

// Option submenu select
optionsSelect.addEventListener("click", (e) => {
  if (e.target.tagName === 'LI'){
    buttonSelectPopup.classList.add('hidden');
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
            
            if(section.id === 'steam') {
              steamLoginCheck();
            }
        }
    })
  }
});

// Controls
const buttonOptions = document.querySelector(".controls-select");
const resetControlsBtn = document.querySelector('#reset-controls-btn');

let controls = {};
let defaultControls = {
  actionBtn: "KeyS",
  lowValBtn: "KeyZ",
  uncheckcardsBtn: "KeyC",
  swapBtn: "KeyV",
  pauseBtn: "Space"
};

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
  document.querySelector('.actionBtn').textContent = `${controls.actionBtn}`;
  document.querySelector('.lowValBtn').textContent = `${controls.lowValBtn}`;
  document.querySelector('.uncheckcardsBtn').textContent = `${controls.uncheckcardsBtn}`;
  document.querySelector('.swapBtn').textContent = `${controls.swapBtn}`;
  document.querySelector('.pauseBtn').textContent = `${controls.pauseBtn}`;
};

buttonsDisplay();

// Set custom buttons
let buttonToReplace;
let buttonName;
  buttonOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN"){
      buttonSelectPopup.children[0].textContent = 'Please select new key';
      buttonSelectPopup.classList.remove("hidden");
      buttonToReplace = e.target;
      buttonName = e.target.classList[1];
    }    
  });

  document.addEventListener("keyup", (e) => {
    if (buttonToReplace) {
      if (Object.values(controls).find(value => value === e.code) === undefined) {
        buttonSelectPopup.classList.add("hidden");
        buttonToReplace.textContent = `${e.code}`;
        controls[`${buttonName}`] = e.code;
        localStorage.setItem('controls', JSON.stringify(controls));
      } else {
        buttonSelectPopup.children[0].textContent = 'Key already in use'
      }
    }
  })
  
  // Reset to default controls
  resetControlsBtn.addEventListener('click', () => {
    localStorage.removeItem('controls');
    controls = {
      actionBtn: "ShiftLeft",
      lowValBtn: "ControlLeft",
      uncheckcardsBtn: "KeyZ",
      swapBtn: "KeyX",
      pauseBtn: "Space"
    }
    localStorage.setItem('controls', JSON.stringify(controls));
    buttonSelectPopup.classList.add('hidden');
    buttonsDisplay();
  })

// Arcade auto-submit
const arcadeAutoSubmitCheckbox = document.querySelector('#auto-submit-checkbox');
let tempAutoSubmitSetting;

if (localStorage.getItem('auto-submit')) {
  tempAutoSubmitSetting = JSON.parse(localStorage.getItem('auto-submit'));
} else {
  localStorage.setItem('auto-submit', JSON.stringify(false));
  tempAutoSubmitSetting = false;
}

if (tempAutoSubmitSetting) {
  arcadeAutoSubmitCheckbox.checked = true;
} else {
  arcadeAutoSubmitCheckbox.check = false;
}

arcadeAutoSubmitCheckbox.addEventListener('click', () => {
  tempAutoSubmitSetting = !tempAutoSubmitSetting

  localStorage.setItem('auto-submit', JSON.stringify(tempAutoSubmitSetting));
})


// Select theme dropdown
const arcadeThemes = [
  { index: 0, themeName: "Classic", bgImgPlayersHand: ["classic-bg.png"], bgImgCombo: "classic-bg-combo-round.png", bgCol: "#b3edff", brdCol: "#fff", fullClearBrdGrd: [
    "#232f33",
    "#35474c",
    "#475e66",
    "#59767f",
    "#6b8e99",
    "#7da5b2",
    "#8fbdcc",
    "#a1d5e5",
    "#b3edff"
  ], cardSprites: "style/classicsprites.css", bgm: "bgm/indigo-theme.mp3", fifteenCountGradient: ['#999', '#999', '#999', '#999', '#999', '#999', '#999', '#888', '#777', '#666', '#555', '#444', '#333', '#222', '#111', '#000'] },
    { index: 1, themeName: "Jungle", bgImgPlayersHand: ["jungle-bg-1.png","jungle-bg-2.png","jungle-bg-3.png","jungle-bg-4.png","jungle-bg-5.png","jungle-bg-6.png","jungle-bg-7.png","jungle-bg-8.png"], bgImgCombo: "jungle-bg-combo-round.png", bgCol: "#ccead5", brdCol: "rgba(0, 0, 0, 0)", fullClearBrdGrd: [
      "#ffef99",
      "#ffe34c",
      "#ffd700",
      "#ffef99",
      "#ffe34c",
      "#ffd700",
      "#ffef99",
      "#ffe34c",
      "#ffd700"
    ], cardSprites: "style/junglesprites.css", bgm: "bgm/Clouds-Jungle.mp3", fifteenCountGradient: ['#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#fff'] },
    { index: 2, themeName: "Universe", bgImgPlayersHand: ["universe-bg.png"], bgImgCombo: "universe-bg-combo-round.png", bgCol: "#000", brdCol: "rgba(0,0,0,0)", fullClearBrdGrd: [
      "#111",
      "#222",
      "#333",
      "#444",
      "#555",
      "#666",
      "#777",
      "#888",
      "#999",
      "#aaa",
      "#bbb",
      "#ccc",
      "#ddd",
      "#eee"
    ], cardSprites: "style/universesprites.css", bgm: "bgm/DescentIntoMadness-Universe.mp3", fifteenCountGradient: ['#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888', '#888', '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#eee', '#fff'] }
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
  if (tempHighscoreCheck >= 15000) {
    tempArrayHousing[2].classList.remove('locked');
    tempArrayHousing[2].classList.add('unlocked'); 
  } else {
    tempArrayHousing[2].textContent = 'Cosmos (15000pts)';
  }

// Select new active theme
const themeSelectionMenu = document.querySelector('.theme-selection-menu');

themeSelectionMenu.addEventListener('click', (e) => {
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
  themeSelectionMenu.childNodes.forEach((theme) => {
    if (theme.nodeType !== 3){ 
      if (theme !== e.target) {
        if (theme !== e.target.parentElement && theme.classList) {
          theme.classList.remove('selected-theme');
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

// Select Display preference
if (localStorage.getItem('user-display-settings')) {
  document.getElementById('window-select').checked = true;
} else {
  document.getElementById('fullscreen-select').checked = true;
}

// Display options
document.getElementById('window-select').addEventListener('click', () => {
  ipcRenderer.send('window-selected')
  localStorage.setItem('user-display-settings', JSON.stringify({ window: true }))
})

document.getElementById('fullscreen-select').addEventListener('click', () => {
  ipcRenderer.send('fullscreen-selected')
  localStorage.removeItem('user-display-settings')
})

let steamCredentials = JSON.parse(localStorage.getItem('steam-credentials'));

function steamLoginCheck() {
  const steamButtonPrompt = document.querySelector('#steam-login-prompt');

  setInterval(steamCredentialsDisplay, 1000);

  steamCredentialsDisplay();

  function steamCredentialsDisplay() {
    steamCredentials = JSON.parse(localStorage.getItem('steam-credentials'));

    if (steamCredentials.userName === "" && steamCredentials.steamId === "") {
      steamButtonPrompt.innerHTML = `
      <p>Login to Steam to activate leaderboards</p>
      <a
              href="http://localhost:5481/auth/steam/"
              target="_blank"
              draggable="false"
            >
              <div id="steam-login-btn" onclick="steamAuthLogin()"></div>
            </a>
      `;
    } else {
      steamButtonPrompt.innerHTML = `
        <p>${steamCredentials.userName}</p>
        <button class="main-btn" onclick="steamLogout()">Logout</button>
      `;
    }
  }
}

function steamLogout() {
  localStorage.setItem('steam-credentials', JSON.stringify({userName: '', steamId: ''}))
}

// Reset score data
function resetLocalScores() {
  let tempScores = JSON.parse(localStorage.getItem('highscore'));

  tempScores[0].date = null;
  tempScores[0].totalPoints = 0;
  tempScores[0].indigoLoops = 0;
  tempScores[0].totalCardsPlayed = 0;
  tempScores[0].totalSeconds = 0;

  tempScores[0].taDate = null;
  tempScores[0].timeAttack = 0;
  if (tempScores[0].taFullPassCount) {
    tempScores[0].taFullPassCount = 0
  };

  localStorage.setItem('highscore', JSON.stringify(tempScores));

  localStorage.setItem('achievements', JSON.stringify([]));
}