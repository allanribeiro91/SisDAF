//Abas do módulo Produtos DAF
document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.tab-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove o atributo "active" de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Adiciona o atributo "active" ao botão clicado
            this.classList.add('active');
        });
    });
});
