document.addEventListener("DOMContentLoaded", function() {

    //ID Contrato
    var id_contrato = window.location.pathname.split('/').filter(function(e){ return e }).pop();

    //Mudar de aba
    const aba_contrato_ficha = document.getElementById('contrato_ficha_dados_gerais')
    // const aba_contrato_anotacoes = document.getElementById('contrato_ficha_anotacoes')

    aba_contrato_ficha.addEventListener('click', function(){
        window.location.href = '/contratos/contrato/ficha/' + id_contrato + '/';
    })

    // aba_contrato_anotacoes.addEventListener('click', function(){
    //     window.location.href = '/contratos/contrato/anotacoes/' + id_contrato + '/';
    // })

});

