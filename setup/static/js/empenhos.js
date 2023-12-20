document.addEventListener('DOMContentLoaded', function() {

    //Inserir Novo Empenho
    const botao_inserir_empenho = document.getElementById('inserirEmpenho')
    botao_inserir_empenho.addEventListener('click', function(){
        window.location.href = '/contratos/empenhos/novo'
    })



});
