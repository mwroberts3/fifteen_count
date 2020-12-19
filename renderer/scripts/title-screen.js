// Allow player to exit game from menu
const { ipcRenderer } = require('electron');

const exitGame = document.querySelector('.exit-game');

exitGame.addEventListener('click', () => {
    ipcRenderer.send('user-exit', 'user quit game');
});

// Set sound option settings
let userSelectedSoundSettings = {};
if (!localStorage.getItem('sound-settings')) {
  let tempSoundSettings = {
    BGM: true, SFX: true
  }
  localStorage.setItem('sound-settings', JSON.stringify(tempSoundSettings));
  userSelectedSoundSettings = tempSoundSettings;
} else {
  userSelectedSoundSettings = JSON.parse(localStorage.getItem('sound-settings'));
}

// Set BGM
if(!userSelectedSoundSettings.BGM) {
    document.querySelector('audio').src = '';
}

// Set up menu-item sound effect
if (userSelectedSoundSettings.SFX) {
    let menuOptionSound = new Audio('./soundfx/menu-option-hover.wav');
    
    document.addEventListener('mouseover', e => {
        if(e.target.tagName === 'BUTTON') {
            console.log('over option');
            menuOptionSound.play();
        }
    })
}

// Check for display settings
setTimeout(() => {
  ipcRenderer.send('display-settings', JSON.parse(localStorage.getItem('highscore')))
}, 10);