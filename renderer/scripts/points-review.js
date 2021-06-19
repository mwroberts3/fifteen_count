const pointsBreakdownView = document.getElementById('points-breakdown-view');

const regCardPoints = document.querySelector('.reg-card-points'),
comboCardPoints = document.querySelector('.combo-card-points'),
fullClearPointsDisplay = document.querySelector('.full-clear-points'),
jackpotPointsDisplay = document.querySelector('.jackpot-points'),
timePointsDisplay = document.querySelector('.time-points');

const totalPointsDisplay = document.querySelector('.total-points-review-display');

let scoresCounted = 0;

exports.pointsReview = (pointsBreakdown, totalPoints, hudMessageDisplay) => {
    console.log(pointsBreakdown);

    // totalPoints = Math.round(totalPoints);

    // pointsBreakdown.timePoints += pointsBreakdown.speedPoints;

    setTimeout(() => {
        hudMessageDisplay.textContent = 'Score Review';
    }, 1000);

    pointsBreakdownView.classList.remove('hidden');
    displayPointPct(totalPoints, pointsBreakdown.cardPoints, regCardPoints);

    displayPointPct(totalPoints, pointsBreakdown.comboPoints, comboCardPoints);
    
    // displayPointPct(totalPoints, pointsBreakdown.fullClearPoints, fullClearPointsDisplay);

    displayPointPct(totalPoints, pointsBreakdown.jackpotPoints, jackpotPointsDisplay);

    // displayPointPct(totalPoints, pointsBreakdown.speedPoints, speedPointsDisplay);

    displayPointPct(totalPoints, pointsBreakdown.timePoints, timePointsDisplay);

    totalPointsDisplay.innerHTML = `${totalPoints}`;
    totalPointsDisplay.style.visibility = 'hidden';
}

function displayPointPct(totalPoints, pointTypeTotal, pointTypeDisplay) {
    let i = 0;
    const pointTypeTally = setInterval(() => {
        i++;
        pointTypeDisplay.innerHTML = `${i}`;
        pointTypeDisplay.nextElementSibling.value = `${i}`;
        pointTypeDisplay.nextElementSibling.max = `${totalPoints}`;
        if (i >= pointTypeTotal) {
            clearInterval(pointTypeTally);
            pointTypeDisplay.innerHTML = `${pointTypeTotal}`;
            scoresCounted++;

            if (scoresCounted === 5) {
                fastForwardReview();
            }
        }
    }, 10)

    document.addEventListener('click', fastForwardReview);

    document.addEventListener('keyup', fastForwardReview);

    function fastForwardReview() {
        clearInterval(pointTypeTally);
        pointTypeDisplay.innerHTML = `${pointTypeTotal}`;
        pointTypeDisplay.nextElementSibling.value = `${pointTypeTotal}`;
        totalPointsDisplay.style.visibility = 'visible';
        
        document.addEventListener('click', () =>{
               document.getElementById("new-highscore-form").style.zIndex = 6;
           })
    }
}