document.addEventListener('DOMContentLoaded', function() {

    //Inserir Novo Empenho
    const botao_inserir_paciente = document.getElementById('btnInserirPaciente')
    botao_inserir_paciente.addEventListener('click', function(){
        window.location.href = '/gestao_pacientes/paciente/novo'
    })

    //Mudar de aba
    $('#tabPacientes tbody').on('click', 'tr', function() {
        const id_paciente = $(this).attr('data-id').toString();
        window.location.href = `/gestao_pacientes/paciente/${id_paciente}/`;
    });


});