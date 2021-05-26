// Quick fadein when starting arcade and time attack mode
exports.gamescreenFadeinFunc = () => {
document.querySelector('body').style.
opacity = 0;
let fadeTime = 0;

const gamescreenFadein = setInterval(() => {

  document.querySelector('body').style.opacity = fadeTime;
  fadeTime += 0.1;
  if (fadeTime >= 1) clearInterval(gamescreenFadein);
}, 39)
}

// set bg position of Cosmos theme background after other content is loaded to keep it centered
exports.setCosmosBg = () => {
  let themeSelection = JSON.parse(localStorage.getItem('theme-selection'));

if (themeSelection['themeName'] === "Universe") {
  let bgHelper = document.querySelector('.background-helper');

  setTimeout(() => {
    bgHelper.style.position = "absolute";
    bgHelper.style.top = "-75%";
    bgHelper.style.left = "-50%";
    bgHelper.style.width = "200%";
    bgHelper.style.height = "250%";
  },250)
}
}