const steamAuthLogin = () => {
    const steamLoginPopup = document.querySelector('#steam-login-popup');
    const steamLoginPopupBtnContainer = document.querySelector('#steam-popup-btn-container');
    const tempInfoCont = document.querySelector('#temp-login-info-container');
    let userName = '';
    let steamId = '';

    const credentialExtraction = () => {
      userName = tempInfoCont.querySelector('#steam-username').textContent;
      
      steamId = tempInfoCont.querySelector('#steam-id-number').textContent;

      localStorage.setItem('steam-credentials', JSON.stringify({userName, steamId}));
    }

    const steamLoginCheck = setInterval(() => {
        fetch("http://localhost:5481/steam-info")
          .then((res) => res.text(res))
          .then((data) => {
            console.log(data)
            if (data.length > 50) {
              // change contents of steam login popup after steam login
              if (steamLoginPopup) {
                steamLoginPopupBtnContainer.style.display = 'none';
                steamLoginPopup.textContent = 'Thanks for logging in!'
              }

              tempInfoCont.innerHTML = data.substring(500);
              credentialExtraction();
              // clearInterval(steamLoginCheck);
            }
          });
      }, 2000);
}