const pointsBreakdownView = document.getElementById('points-breakdown-view');

const regCardPoints = document.querySelector('.reg-card-points'),
comboCardPoints = document.querySelector('.combo-card-points'),
jackpotPointsDisplay = document.querySelector('.jackpot-points'),
timePointsDisplay = document.querySelector('.time-points');

const totalPointsDisplay = document.querySelector('.total-points-review-display');

const scoreReviewHeader = document.getElementById('score-review-header');

exports.pointsReview = (pointsBreakdown, totalPoints, hudMessageDisplay) => {
    hudMessageDisplay.style.opacity = "0";
    pointsBreakdownView.classList.remove('hidden');
    document.querySelector('.players-hand').style.setProperty('--players-bg-filter', 'blur(0)');

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

    totalPointsCount(totalPoints);
    themeUnlockCheck();
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
            
            clearInterval(pointTypeTally);
            pointTypeDisplay.innerHTML = `${pointTypeTotal}`;
            pointTypeDisplay.nextElementSibling.value = `${pointTypeTotal}`;
        }
    }, 30)
}

function themeUnlockCheck() {
    setTimeout(() => {
        document.getElementById("theme-unlocked-popup").style.zIndex = 6;
    }, 500);
    
    document.addEventListener('click', () =>{       
        document.getElementById("theme-unlocked-popup").style.zIndex = -10;

        document.getElementById("theme-unlocked-popup").classList.add('hidden');
       });
}

function totalPointsCount(totalPoints) {
    let i = 0;

    const totalPointsTally = setInterval(() => {
        if (totalPoints < 200) {
            i += 4;
        } else {
            i += Math.round(totalPoints/50);
        }

        totalPointsDisplay.innerHTML = `<span style="color: #ffff00">${i}</span>`;

        if (i >= totalPoints) {
            clearInterval(totalPointsTally);
            totalPointsDisplay.innerHTML = `<span style="color: #ffff00">${totalPoints}</span>`;
        }
    }, 30);
}