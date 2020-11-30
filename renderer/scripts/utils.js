// Quick fadein when starting arcade and time attack mode
exports.gamescreenFadeinFunc = () => {
document.querySelector('body').style.opacity = 0;
let fadeTime = 0;
const gamescreenFadein = setInterval(() => {
  document.querySelector('body').style.opacity = fadeTime;
  fadeTime += 0.1;
  console.log(i);
  if (fadeTime >= 1) clearInterval(gamescreenFadein);
}, 39)
}


