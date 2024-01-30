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


    //LIMPAR FILTROS
    const botaoLimparFiltros = document.getElementById('limpar_filtros');
    let idsFiltros = [
        'filtro_paciente_obito', 'filtro_paciente_cns',
        'filtro_paciente_nome', 'filtro_paciente_sexo',
        'filtro_produtos_recebidos', 'filtro_vias_atendimento',
        'filtro_paciente_ses'
    ];
    botaoLimparFiltros.addEventListener('click', function(){
        limparFiltros(idsFiltros)
        filtrarTabelaPacientes()
    });

    
    //FILTRAR TABELA
        //Filtrar
        $('#filtro_paciente_obito, #filtro_paciente_sexo, #filtro_produtos_recebidos, #filtro_vias_atendimento, #filtro_paciente_ses').change(function() {
            filtrarTabelaPacientes();
        });

        //Renderizar tabela
        function filtrarTabelaPacientes(page = 1) {
            var obito = $('#filtro_paciente_obito').val();
            var cns = $('#filtro_paciente_cns').val();
            var paciente = $('#filtro_paciente_nome').val();
            var sexo = $('#filtro_paciente_sexo').val();
            var produto = $('#filtro_produtos_recebidos').val();
            var via_atendimento = $('#filtro_vias_atendimento').val();
            var ses = $('#filtro_paciente_ses').val();

            var dataToSend = {
                'obito': obito,
                'cns': cns,
                'paciente': paciente,
                'sexo': sexo,
                'produto': produto,
                'via_atendimento': via_atendimento,
                'ses': ses
            };

            $.ajax({
                url: "/gestao_pacientes/filtro/",
                data: { ...dataToSend, page: page },
                dataType: 'json',
                success: function(data) {
                    recarregarTabela(data.data);
                    $('#numeroPacientes').text(data.total_pacientes.toLocaleString('pt-BR').replace(/,/g, '.'));
                    $('#currentPage').text(data.current_page);
                    $('#nextPage').prop('disabled', !data.has_next);
                    $('#previousPage').prop('disabled', !data.has_previous);
                    currentPage = data.current_page;
                }
            });
        }

        //Atualizar tabela
        function recarregarTabela(pacientes) {
            var $tableBody = $('.table tbody');
            $tableBody.empty();

            pacientes.forEach(paciente => {
                var row = `
                    <tr data-id="${paciente.id}">
                        <td class="col-id">${paciente.id}</td>
                        <td class="col-texto4">${paciente.paciente_obito}</td>
                        <td class="col-texto6">${paciente.cns}</td>
                        <td class="col-texto6">${paciente.cpf}</td>
                        <td class="col-texto20">${paciente.nome}</td>
                        <td class="col-texto6">${paciente.sexo}</td>
                        <td class="col-texto4">${paciente.paciente_idade}</td>
                        <td class="col-texto15">${paciente.paciente_produtos_recebidos}</td>
                        <td class="col-texto6">${paciente.paciente_via_atendimento}</td>
                        <td class="col-texto6">${paciente.paciente_ses_ufs}</td>
                    </tr>
                `;
                $tableBody.append(row);
            });
        }



    //Exportar dados
    $('#exportarPacientes').on('click', function() {

        sweetAlert('Funcionalidade em desenvolvimento!')
        return

        // Coleta valores dos campos       
        var status_contrato = $('#filtro_status_contrato').val();
        var modalidade_aquisicao = $('#filtro_modalidade_aquisicao').val();
        var unidade_daf = $('#filtro_unidade_daf').val();
        var denominacao = $('#filtro_denominacao').val();
        var fornecedor = $('#filtro_fornecedor').val();
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            status_contrato: status_contrato,
            modalidade_aquisicao: modalidade_aquisicao,
            unidade_daf: unidade_daf,
            denominacao: denominacao,
            fornecedor: fornecedor,
        };
        
        // Envia solicitação AJAX para o servidor
        fetch('/contratos/contrato/exportar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.blob()) // Trata a resposta como um Blob
        .then(blob => {
            // Inicia o download do arquivo
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = 'contratos.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
});