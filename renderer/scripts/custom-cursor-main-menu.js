// setup custom cursor
const cursor = document.querySelector(".cursor");


document.addEventListener("mousemove", (e) => {
    cursor.setAttribute(
        "style",
        "top: " +
        (e.pageY + 5) +
        "px; left: " +
        (e.pageX ) +
        "px; display: block"
        );

console.log(window.innerWidth);
        
if (document.querySelector(".container")) {
    cursor.setAttribute(
        "style",
        "top: " +
        (e.pageY - 19) +
        "px; left: " +
        (e.pageX - ((window.innerWidth - 1200) / 2) + 2) +
        "px; display: block"
    );
};

});