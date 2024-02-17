$(document).ready(function() {  

    //Mudar de aba
    $('#tabContratos tbody').on('click', 'tr', function() {
        const id_contrato = $(this).attr('data-id').toString();
        window.location.href = `/contratos/contrato/ficha/${id_contrato}/`;
    });


    //Filtrar
    $('#filtro_status_contrato, #filtro_modalidade_aquisicao, #filtro_unidade_daf, #filtro_denominacao, #filtro_fornecedor').change(function() {
        filtrarContratos();
    });


    //Limpar Filtros
    $('#limpar_filtros').on('click', function() {
        window.location.reload();
    });

    //Renderizar tabela
    function filtrarContratos(page = 1) {
        var status_contrato = $('#filtro_status_contrato').val();
        var modalidade_aquisicao = $('#filtro_modalidade_aquisicao').val();
        var unidade_daf = $('#filtro_unidade_daf').val();
        var denominacao = $('#filtro_denominacao').val();
        var fornecedor = $('#filtro_fornecedor').val();
    
        var dataToSend = {
            'status_contrato': status_contrato,
            'modalidade_aquisicao': modalidade_aquisicao,
            'unidade_daf': unidade_daf,
            'denominacao': denominacao,
            'fornecedor': fornecedor,
        };
    
        $.ajax({
            url: "/contratos/contratos/filtrar/",
            data: { ...dataToSend, page: page },
            dataType: 'json',
            success: function(data) {
                recarregarTabelaContratos(data.data);
                $('#numeroARPs').text(data.total_arps.toLocaleString('pt-BR').replace(/,/g, '.'));
                $('#currentPage').text(data.current_page);
                $('#nextPage').prop('disabled', !data.has_next);
                $('#previousPage').prop('disabled', !data.has_previous);
                currentPage = data.current_page;
            }
        });
    }
    
    
    function recarregarTabelaContratos(contratos) {
        var $tableBody = $('.table tbody');
        $tableBody.empty();

        contratos.forEach(contrato => {
                        
            let statusHtml = '';
            if (contrato.status === 'vigente') {
                statusHtml = `<span class="status-vigente"><span class="bolinha bolinha-vigente"></span>Vigente</span>`;
            } else if (contrato.status === 'suspenso') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-suspenso"></span>Suspenso</span>`;
            } else if (contrato.status === 'encerrado') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-encerrado"></span>Encerrado</span>`;
            } else if (contrato.status === 'cancelado') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-cancelado"></span>Cancelado</span>`;
            }

            var row = `
                <tr data-id="${ contrato.id }">
                        <td class="col-id">${ contrato.id }</td>
                        <td class="col-status">${ statusHtml }</td>
                        <td class="col-unidadedaf" style="text-transform: uppercase;">${ contrato.unidade_daf }</td>
                        <td class="col-modalidade">${ contrato.modalidade_aquisicao }</td>
                        <td class="col-contrato">${ contrato.arp }</td>
                        <td class="col-contrato">${ contrato.tipo_contrato }</td>
                        <td class="col-contrato">${ contrato.numero_contrato }</td>
                        <td class="col-data">${ contrato.data_publicacao }</td>
                        <td class="col-data">${ contrato.data_vigencia }</td>
                        <td class="col-denominacao">${ contrato.denominacao }</td>
                        <td class="col-fornecedor">${ contrato.fornecedor }</td>
                        <td class="col-valor">${ contrato.valor_total.toLocaleString('pt-BR') }</td>
                </tr>
            `;

            $tableBody.append(row);
        });
    }


    //Exportar dados
    $('#exportarBtn').on('click', function() {

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


    function formatarValorMonetario2(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

            
});