const { ipcRenderer } = require('electron');

const exitGame = document.querySelector('.exit-game');

exitGame.addEventListener('click', () => {
    ipcRenderer.send('user-exit', 'user quit game');
});