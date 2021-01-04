const { ipcRenderer } = require('electron');

// Check for display settings
ipcRenderer.on('display-settings-check', () => {
    ipcRenderer.send('display-settings', JSON.parse(localStorage.getItem('user-display-settings')))
  })

const sdgLogo = document.querySelector('.sdg-logo');

setTimeout(() => {
    sdgLogo.classList.add('fade-out');
}, 500)

setTimeout(() => {
window.location.replace("title-screen.html");
}, 3000);