const pointsBreakdownView = document.getElementById('points-breakdown-view');

const regCardPoints = document.querySelector('.reg-card-points'),
comboCardPoints = document.querySelector('.combo-card-points'),
fullClearPointsDisplay = document.querySelector('.full-clear-points'),
jackpotPointsDisplay = document.querySelector('.jackpot-points'),
speedPointsDisplay = document.querySelector('.speed-points'),
timePointsDisplay = document.querySelector('.time-points');

const totalPointsDisplay = document.querySelector('.total-points-review-display');

let scoresCounted = 0;

exports.pointsReview = (pointsBreakdown, totalPoints) => {
    console.log(pointsBreakdown);
    pointsBreakdownView.classList.remove('hidden');
    displayPointPct(totalPoints, pointsBreakdown.cardPoints, regCardPoints);

    displayPointPct(totalPoints, pointsBreakdown.comboPoints, comboCardPoints);
    
    displayPointPct(totalPoints, pointsBreakdown.fullClearPoints, fullClearPointsDisplay);

    displayPointPct(totalPoints, pointsBreakdown.jackpotPoints, jackpotPointsDisplay);

    displayPointPct(totalPoints, pointsBreakdown.speedPoints, speedPointsDisplay);

    displayPointPct(totalPoints, pointsBreakdown.timePoints, timePointsDisplay);

    totalPointsDisplay.innerHTML = `${totalPoints}`;
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

            if (scoresCounted === 6) {
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
        
        document.addEventListener('click', () =>{
               document.getElementById("new-highscore-form").style.zIndex = 6;
           })
    }
}