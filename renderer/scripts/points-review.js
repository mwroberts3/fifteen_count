const pointsBreakdownView = document.getElementById('points-breakdown-view');

const regCardPoints = document.querySelector('.reg-card-points'),
comboCardPoints = document.querySelector('.combo-card-points'),
fullClearPointsDisplay = document.querySelector('.full-clear-points'),
jackpotPointsDisplay = document.querySelector('.jackpot-points'),
timePointsDisplay = document.querySelector('.time-points');

const totalPointsDisplay = document.querySelector('.total-points-review-display');

const scoreReviewHeader = document.getElementById('score-review-header');

let scoresCounted = 0;

exports.pointsReview = (pointsBreakdown, totalPoints, hudMessageDisplay) => {
    hudMessageDisplay.style.opacity = "0";
    pointsBreakdownView.classList.remove('hidden');

    setTimeout(() => {
        scoreReviewHeader.style.opacity = '1';
    }, 20);

    if (pointsBreakdown.cardPoints > 0) {
        displayPointPct(totalPoints, pointsBreakdown.cardPoints, regCardPoints);
    }

    if (pointsBreakdown.comboPoints > 0) {
    displayPointPct(totalPoints, pointsBreakdown.comboPoints, comboCardPoints);
    }
    
    if (pointsBreakdown.jackpotPoints > 0) {
    displayPointPct(totalPoints, pointsBreakdown.jackpotPoints, jackpotPointsDisplay);
    }

    if (pointsBreakdown.timePoints > 0) {
    displayPointPct(totalPoints, pointsBreakdown.timePoints, timePointsDisplay);
    }

    totalPointsDisplay.innerHTML = `${totalPoints}`;
    totalPointsDisplay.style.visibility = 'hidden';
}

function displayPointPct(totalPoints, pointTypeTotal, pointTypeDisplay) {
    let i = 0;
    const pointTypeTally = setInterval(() => {
        if (pointTypeTotal < 200) {
            i += 4;
        } else {
            i += Math.round(pointTypeTotal / 50);
        }
        pointTypeDisplay.innerHTML = `${i}`;
        pointTypeDisplay.nextElementSibling.value = `${i}`;
        pointTypeDisplay.nextElementSibling.max = `${totalPoints}`;
        if (i >= pointTypeTotal) {
            clearInterval(pointTypeTally);
            pointTypeDisplay.innerHTML = `${pointTypeTotal}`;
            scoresCounted++;

            if (scoresCounted >= 3) {
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