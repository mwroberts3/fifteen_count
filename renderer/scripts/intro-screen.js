const { ipcRenderer } = require('electron');

// set bootup for arcade mode buffering reasons
localStorage.setItem('first-boot', true);

// Check for Steam credentials
if (localStorage.getItem('steam-credentials')) {
  setTimeout(() => {
    goToTitleScreen();
  }, 3000);
}

// Check for display settings
ipcRenderer.on('display-settings-check', () => {
    ipcRenderer.send('display-settings', JSON.parse(localStorage.getItem('user-display-settings')))
  })
  
  const sdgLogo = document.querySelector('.sdg-logo');
  const steamLoginPopup = document.querySelector('#steam-login-popup');  
  
  setTimeout(() => {
    sdgLogo.classList.add('fade-out');
  }, 500);
  
  setTimeout(() => {
    sdgLogo.style.display = 'none';
    steamLoginPopup.style.display = 'flex';
    steamLoginPopup.style.opacity = 0;
  }, 3000);
  
  setTimeout(() => {
    document.querySelector('script').src = "./scripts/custom-cursor.js";
    steamLoginPopup.style.opacity = 1;
  }, 3050);

function goToTitleScreen() {
  window.location.replace("title-screen.html");
}