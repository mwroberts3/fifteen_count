const howToPlayModeSelect = document.querySelector('.how-to-play-mode-select');
const arcadeHowtoVidOne = document.getElementById('arcade-howto-vid-1');

howToPlayModeSelect.addEventListener('click', (e) => {
    if (!e.target.classList.contains('option-selected')) {
        e.target.classList.add('option-selected');

        if (e.target.textContent === "Arcade") {
            document.getElementById('arcade-how-to-instructions').classList.remove('hidden');
            document.getElementById('ta-how-to-instructions').classList.add('hidden');
        } else if (e.target.textContent === "Time Attack") {
            document.getElementById('arcade-how-to-instructions').classList.add('hidden');
            document.getElementById('ta-how-to-instructions').classList.remove('hidden');
        }

        if (e.target.previousElementSibling) {
            e.target.previousElementSibling.classList.remove('option-selected');
        } else if (e.target.nextElementSibling) {
            e.target.nextElementSibling.classList.remove('option-selected');
        }
    };
})

arcadeHowtoVidOne.addEventListener('click', (e) => {
    if (e.target.classList.contains('static-vid')) {
        e.target.src = "img/how-to-images/arcade-how-to-gif1.gif";
        e.target.classList.remove('static-vid');
    } else {
        e.target.src = "img/how-to-images/arcade-howto-vid-1-static.png";
        e.target.classList.add('static-vid');
    }

    setTimeout(() => {
        e.target.src = "img/how-to-images/arcade-howto-vid-1-static.png";
        e.target.classList.add('static-vid');
    }, 8000);
})