const steamworksInfo = require('../steamworksFiles/steamworksInfo.json')

const moment = require('moment');

exports.uploadTAHighscoreToSteam = (score) => {
    let details = {
        'key': steamworksInfo.key,
        'appid': steamworksInfo.appID,
        'leaderboardid': 7487751,
        'steamid': BigInt('76561199078987345'),
        'score': score,
        'scoremethod': 'KeepBest',
        'details': `${moment().format('MMM Do YYYY')}`
    }

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let obj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: formBody
    }

    fetch(`https://partner.steam-api.com/ISteamLeaderboards/SetLeaderboardScore/v1/`, obj)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
}