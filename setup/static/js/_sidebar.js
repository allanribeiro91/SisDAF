document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");
    const sidebar = document.querySelector(".sidebar");
    const workspace = document.querySelector(".workspace");
    const icon = toggleButton.querySelector("i");

    toggleButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (sidebar.style.flexBasis === "30px") {
            sidebar.style.flexBasis = "12%";
            sidebar.classList.remove("collapsed");
            icon.className = "fas fa-arrow-left";
        } else {
            sidebar.style.flexBasis = "30px";
            sidebar.classList.add("collapsed");
            icon.className = "fas fa-arrow-right";
        }
    });
});
