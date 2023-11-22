$(document).ready(function() {

    //Mudar de aba
    $('#consultor_contrato_dados_gerais').click(function() {
        // var id_fornecedor = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        // window.location.href = '/fornecedores/representantes/' + id_fornecedor + '/';
        window.location.href = '/consultores/contrato/ficha/dadosgerais/';
    });

    $('#consultor_contrato_produtos').click(function() {
        // var id_fornecedor = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        // window.location.href = '/fornecedores/ficha/' + id_fornecedor + '/';
        window.location.href = '/consultores/contrato/ficha/produtos/';
    });
});
