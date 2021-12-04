const steamAuthLogin = () => {
    const tempInfoCont = document.querySelector('#temp-login-info-container');
    let userName = '';
    let steamId = '';

    const credentialExtraction = () => {
      userName = tempInfoCont.querySelector('#steam-username').textContent;
      
      steamId = tempInfoCont.querySelector('#steam-id-number').textContent;

      localStorage.setItem('steam-credentials', JSON.stringify({userName, steamId}));
    }

    const steamLoginCheck = setInterval(() => {
        fetch("http://localhost:3000/steam-info")
          .then((res) => res.text(res))
          .then((data) => {
            if (data.length > 50) {
              tempInfoCont.innerHTML = data;
              credentialExtraction();
              clearInterval(steamLoginCheck);
            }
          });
      }, 2000);
}