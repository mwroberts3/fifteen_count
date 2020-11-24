const optionsSelect = document.querySelector(".how-to-nav");
const optionsDisplay = document.querySelectorAll("section");

optionsSelect.addEventListener("click", (e) => {
    e.target.classList.add("option-selected");
    
    Array.from(optionsSelect.children[0].children).forEach((option) => {
        if (option !== e.target) {
            option.classList.remove("option-selected");
        }
    })

    optionsDisplay.forEach((section) => {
        if (section.id !== e.target.classList[0]){
            section.classList.add("hidden");
        } else {
            section.classList.remove("hidden");
        }
    })
});

