document.addEventListener('DOMContentLoaded', function() {

    //LIMPAR FILTROS
    const botaoLimparFiltros = document.getElementById('limpar_filtros');
    let idsFiltros = [
        'filtro_tipo_item', 'filtro_status',
    ];
    botaoLimparFiltros.addEventListener('click', function(){
        limparFiltros(idsFiltros)
        filtrarTabela()
    });

    
    //FILTRAR TABELA
        //Filtrar
        $('#filtro_tipo_item, #filtro_status').change(function() {
            filtrarTabela();
        });

        //Renderizar tabela
        function filtrarTabela(page = 1) {
            var tipo_item = $('#filtro_tipo_item').val();
            var status = $('#filtro_status').val();
            //var responsavel = $('#filtro_responsavel').val();

            var dataToSend = {
                'tipo_item': tipo_item,
                'status': status,
                //'responsavel': responsavel,
            };

            $.ajax({
                url: "/sobre-sisdaf/backlog/filtro/",
                data: { ...dataToSend, page: page },
                dataType: 'json',
                success: function(data) {
                    recarregarTabela(data.data);
                    $('#numeroItens').text(data.total_backlogs.toLocaleString('pt-BR').replace(/,/g, '.'));
                    $('#currentPage').text(data.current_page);
                    $('#nextPage').prop('disabled', !data.has_next);
                    $('#previousPage').prop('disabled', !data.has_previous);
                    currentPage = data.current_page;
                }
            });
        }

        //Atualizar tabela
        function recarregarTabela(itens) {
            var $tableBody = $('.table tbody');
            $tableBody.empty();

            itens.forEach(item => {
                var tipoItemClass = '';
                var tipoItemText = '';
                switch (item.tipo_item) {
                    case 'adaptativo':
                        tipoItemClass = 'fundo-destaque tipo-adaptativo';
                        tipoItemText = 'Adaptativo';
                        break;
                    case 'evolutivo':
                        tipoItemClass = 'fundo-destaque tipo-evolutivo';
                        tipoItemText = 'Evolutivo';
                        break;
                    case 'corretivo':
                        tipoItemClass = 'fundo-destaque tipo-corretivo';
                        tipoItemText = 'Corretivo';
                        break;
                }
            
                var statusClass = '';
                var statusText = '';
                switch (item.status) {
                    case 'nao_iniciado':
                        statusClass = 'fundo-destaque status-naoiniciado';
                        statusText = 'Não iniciado';
                        break;
                    case 'em_desenvolvimento':
                        statusClass = 'fundo-destaque status-emdesenvolvimento';
                        statusText = 'Em desenvolvimento';
                        break;
                    case 'entregue':
                        statusClass = 'fundo-destaque status-entregue';
                        statusText = 'Entregue';
                        break;
                    case 'cancelado':
                        statusClass = 'fundo-destaque status-cancelado';
                        statusText = 'Cancelado';
                        break;
                }

                var row = `
                    <tr data-id="${item.id}">
                        <td class="col-id">${item.id}</td>
                        ${tipoItemText ? `<td class="col-texto4"><span class="${tipoItemClass}">${tipoItemText}</span></td>` : ''}
                        ${statusText ? `<td class="col-texto6"><span class="${statusClass}">${statusText}</span></td>` : ''}
                        <th class="col-texto6" style="font-weight: normal;">${item.responsavel}</th>
                        <td class="col-texto6">${new Date(item.data_entrada).toLocaleDateString()}</td>
                        <td class="col-texto6">${item.data_entrega ? new Date(item.data_entrega).toLocaleDateString() : ''}</td>
                        <td class="col-texto4">${item.dias}</td>
                        <td class="col-texto25">${item.item}</td>
                    </tr>
                `;
            
                $tableBody.append(row);
            });
        }

    let currentPage = 1;

    //Próxima página
    $('#nextPage').on('click', function() {
        filtrarTabela(currentPage + 1);
    });

    //Página anterior
    $('#previousPage').on('click', function() {
        filtrarTabela(currentPage - 1);
    });

    const modal_backlog = new bootstrap.Modal(document.getElementById('backlogModal'))

    //Abrir Modal
    $('#tabelaBacklogs tbody').on('click', 'tr', function() {
        const id_backlog = $(this).attr('data-id').toString();
        openModalBacklog(id_backlog)
    });
    
    function openModalBacklog(id_backlog) {
        fetch(`/sobre-sisdaf/backlog/buscardados/${id_backlog}/`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do Backlog.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                $('#backlog_id').val(data.backlog.id);
                $('#log_data_registro').val(data.backlog.data_registro);
                $('#log_responsavel_registro').val(data.backlog.responsavel_registro);
                $('#log_ult_atualizacao').val(data.backlog.ultima_atualizacao);
                $('#log_responsavel_atualizacao').val(data.backlog.responsavel_ultima_atualizacao);
                $('#log_edicoes').val(data.backlog.log_n_edicoes);

                //Dados do backlog
                $('#status').val(data.backlog.status);
                $('#tipo_item').val(data.backlog.tipo_item);
                $('#data_entrada').val(data.backlog.data_entrada);
                $('#data_entrega').val(data.backlog.data_entrega);
                $('#dias').val(data.backlog.dias);
                $('#responsavel').val(data.backlog.responsavel);
                $('#item').val(data.backlog.item);
                $('#detalhamento').val(data.backlog.detalhamento);
                        
                //Observações
                $('#observacoes_gerais').val(data.backlog.observacoes_gerais);

                // Abrir o modal
                modal_backlog.show()
            })
            .catch(error => {
                console.log(error);
            });        
    }


    //Exportar dados
    $('#exportarBacklogs').on('click', function() {

        //sweetAlert('Funcionalidade em desenvolvimento!')

        // Coleta valores dos campos
        var tipo_item = $('#filtro_tipo_item').val();
        var status = $('#filtro_status').val();       
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            'tipo_item': tipo_item,
            'status': status,
        };
        
        // Envia solicitação AJAX para o servidor
        fetch('/sobre-sisdaf/backlog/exportar/', {
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
            a.download = 'backlogs.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
});