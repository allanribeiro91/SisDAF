$(document).ready(function() {

    //Abrir ficha de programação
    $('#tabProgramacoesEspecializado tbody').on('click', 'tr', function() {
        // const proaqId = $(this).attr('data-id').toString();
        window.location.href = `/programacao/especializado/ficha/programacao/`;
    });
});


