document.addEventListener('DOMContentLoaded', function() {

    //Inserir Novo Empenho
    const botao_inserir_empenho = document.getElementById('inserirEmpenho')
    botao_inserir_empenho.addEventListener('click', function(){
        window.location.href = '/contratos/empenhos/novo'
    })

    //Mudar de aba
    $('#tabEmpenhos tbody').on('click', 'tr', function() {
        const id_empenho = $(this).attr('data-id').toString();
        window.location.href = `/contratos/empenhos/ficha/${id_empenho}/`;
    });


});
