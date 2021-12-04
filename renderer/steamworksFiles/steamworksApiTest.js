const key = "7D81BC02C39A9CFFC86EDB56A8B8F8CF";
const appID = 1744270;

// fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=440&count=3\r\nHost: api.steampowered.com/r/nContent-Length: 0\r\n\r\n`)
//     .then(response => response.json())
//     .then(data => console.log(data))

// let details = {
//     'key': key,
//     'appid': appID,
//     'name': 'test'
// }

// let formBody = [];
// for (let property in details) {
//   let encodedKey = encodeURIComponent(property);
//   let encodedValue = encodeURIComponent(details[property]);
//   formBody.push(encodedKey + "=" + encodedValue);
// }
// formBody = formBody.join("&");

// let obj = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     },
//     body: formBody
// }
    
// fetch(`https://partner.steam-api.com/ISteamLeaderboards/FindOrCreateLeaderboard/v2/`, obj)
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err))

// get Arcade Mode leaderboard ID
fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardsForGame/v2/?key=${key}&appid=${appID}`)
    .then(response => response.json())
    .then(data => console.log(data))

// add score to Arcade leaderboard
// 0x6279746573546f53656e6400

let details = {
    'key': key,
    'appid': appID,
    'leaderboardid': 7487751,
    'steamid': BigInt('76561199078987345'),
    'score': 2805,
    'scoremethod': 'KeepBest',
    'details': `cardsPlayed-400 seconds-1200 Nov 21st 2021`
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

// get leadboard entries for arcade leaderboard
// let details = {
//     'key': key,
//     'appid': appID,
//     'rangestart': 0,
//     'rangeend': 'max',
//     'leaderboardid': 7426696,
//     'datarequest': 'RequestGlobal'
// }
    
// fetch(`https://partner.steam-api.com/ISteamLeaderboards/GetLeaderboardEntries/v1/?key=${key}&appid=${appID}&rangestart=1&rangeend=100&leaderboardid=7434161&datarequest=RequestGlobal`)
//     .then(response => {
//         console.log(response);
//         console.log(response.json())
//         response.json()
//     })
//     .then(data => console.log(data))
//     .catch(err => console.log(err))
