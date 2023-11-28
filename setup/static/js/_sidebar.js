// document.addEventListener("DOMContentLoaded", function() {
//     const toggleButton = document.getElementById("toggleButton");
//     const sidebar = document.querySelector(".sidebar");
//     const workspace = document.querySelector(".workspace");
//     const icon = toggleButton.querySelector("i");

//     const expandedWidth = sidebar.offsetWidth;  // captura a largura inicial em pixels

//     toggleButton.addEventListener("click", function(event) {
//         event.preventDefault();
//         if (sidebar.style.flexBasis === "30px" || sidebar.style.flexBasis === "") {
//             sidebar.style.flexBasis = `${expandedWidth}px`;  // usa a largura em pixels
//             sidebar.classList.remove("collapsed");
//             icon.className = "fas fa-arrow-left";
//         } else {
//             sidebar.style.flexBasis = "30px";
//             sidebar.classList.add("collapsed");
//             icon.className = "fas fa-arrow-right";
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");
    const sidebar = document.querySelector(".sidebar");
    const icon = toggleButton.querySelector("i");
    const expandedWidth = sidebar.offsetWidth;  // captura a largura inicial em pixels

    // Função para expandir a sidebar
    function expandSidebar() {
        sidebar.style.flexBasis = `${expandedWidth}px`;  // usa a largura em pixels
        sidebar.classList.remove("collapsed");
        icon.className = "fas fa-arrow-left";
    }

    // Função para recolher a sidebar
    function collapseSidebar() {
        sidebar.style.flexBasis = "30px";
        sidebar.classList.add("collapsed");
        icon.className = "fas fa-arrow-right";
    }

    // Evento de clique no botão de alternância
    toggleButton.addEventListener("click", function(event) {
        event.preventDefault();
        if (sidebar.classList.contains("collapsed")) {
            expandSidebar();
        } else {
            collapseSidebar();
        }
    });

    // // Recolher a sidebar automaticamente após 5 segundos
    // setTimeout(collapseSidebar, 5000);

    // Expandir a sidebar quando o mouse entra
    sidebar.addEventListener("mouseenter", expandSidebar);

    // // Recolher a sidebar quando o mouse sai
    // sidebar.addEventListener("mouseleave", collapseSidebar);
});
