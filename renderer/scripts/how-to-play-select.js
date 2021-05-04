const howToPlayModeSelect = document.querySelector('.how-to-play-mode-select');

howToPlayModeSelect.addEventListener('click', (e) => {
    if (!e.target.classList.contains('option-selected')) {
        e.target.classList.add('option-selected');

        console.log(e.target.previousElementSibling, e.target.nextElementSibling);

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