// setup custom cursor
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
cursor.setAttribute(
    "style",
    "top: " +
    (e.pageY + 1) +
    "px; left: " +
    (e.pageX - ((window.innerWidth - 1200) / 2)) +
    "px; display: block"
);

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