document.addEventListener('DOMContentLoaded', function() {

    //Abrir a ficha da ARP
    $('#tabARPs tbody').on('click', 'tr', function() {
        // buscarAtualizarFornecedores();
        const arpId = $(this).attr('data-id').toString();
        window.location.href = `/contratos/arp/ficha/${arpId}/`;
    });  

    //Filtrar
    $('#filtro_status_arp, #filtro_unidade_daf, #filtro_denominacao, #filtro_fornecedor').change(function() {
        filtrarARPs();
    });


    //Limpar Filtros
    $('#limpar_filtros').on('click', function() {
        // $('#filtro_status_arp').val('');
        // $('#filtro_unidade_daf').val('');
        // $('#filtro_denominacao').val('');
        // $('#filtro_fornecedor').val('');
        // filtrarARPs();
        window.location.reload();
    });

    //Renderizar tabela
    function filtrarARPs(page = 1) {
        var status_arp = $('#filtro_status_arp').val();
        var unidade_daf = $('#filtro_unidade_daf').val();
        var denominacao = $('#filtro_denominacao').val();
        var fornecedor = $('#filtro_fornecedor').val();
    
        var dataToSend = {
            'status_arp': status_arp,
            'unidade_daf': unidade_daf,
            'denominacao': denominacao,
            'fornecedor': fornecedor,
        };
    
        $.ajax({
            url: "/contratos/arp/filtrar/",
            data: { ...dataToSend, page: page },
            dataType: 'json',
            success: function(data) {
                recarregarTabelaARPs(data.data);
                $('#numeroARPs').text(data.total_arps.toLocaleString('pt-BR').replace(/,/g, '.'));
                $('#currentPage').text(data.current_page);
                $('#nextPage').prop('disabled', !data.has_next);
                $('#previousPage').prop('disabled', !data.has_previous);
                currentPage = data.current_page;
            }
        });
    }
    
    
    function recarregarTabelaARPs(arps) {
        var $tableBody = $('.table tbody');
        $tableBody.empty();

        arps.forEach(arp => {
            let valor = formatarValorMonetario2(arp.valor_total_arp)
            
            let statusHtml = '';
            if (arp.status === 'vigente') {
                statusHtml = `<span class="status-vigente"><span class="bolinha bolinha-vigente"></span>Vigente</span>`;
            } else if (arp.status === 'suspenso') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-suspenso"></span>Suspenso</span>`;
            } else if (arp.status === 'encerrado') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-encerrado"></span>Encerrado</span>`;
            } else if (arp.status === 'cancelado') {
                statusHtml = `<span class="status-suspenso"><span class="bolinha bolinha-cancelado"></span>Cancelado</span>`;
            }

            var row = `
                <tr data-id="${ arp.id }">
                        <td class="col-arp-id">${ arp.id }</td>
                        <td class="col-arp-status">${ statusHtml }</td>
                        <td class="col-arp-unidadedaf" style="text-transform: uppercase;">${ arp.unidade_daf }</td>
                        <td class="col-arp-processo-sei">${ arp.numero_processo_sei }</td>
                        <td class="col-arp-doc-sei">${ arp.numero_documento_sei }</td>
                        <td class="col-arp-doc-sei">${ arp.numero_arp }</td>
                        <td class="col-arp-data">${ arp.data_publicacao }</td>
                        <td class="col-arp-data">${ arp.data_vigencia }</td>
                        <td class="col-arp-data">${ arp.prazo_vigencia }</td>
                        <td class="col-arp-denominacao">${ arp.denominacao }</td>
                        <td class="col-arp-fornecedor">${ arp.fornecedor }</td>
                        <th class="col-arp-contratos" style="font-weight: normal;">${ arp.contratos }</th>
                        <td class="col-arp-valor" style="font-weight: normal; text-align: right !important;">${valor}</td>
                </tr>
            `;

            $tableBody.append(row);
        });
    }


    //Exportar dados
    $('#exportarARPs').on('click', function() {
        // Coleta valores dos campos       
        const status_arp = document.querySelector('#filtro_status_arp').value;
        const unidade_daf = document.querySelector('#filtro_unidade_daf').value;
        const denominacao = document.querySelector('#filtro_denominacao').value;
        const fornecedor = document.querySelector('#filtro_fornecedor').value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            status_arp: status_arp,
            unidade_daf: unidade_daf,
            denominacao: denominacao,
            fornecedor: fornecedor,
        };

        console.log('Exportar ARPs')
        
        // Envia solicitação AJAX para o servidor
        fetch('/contratos/arp/exportar/', {
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
            a.download = 'arps.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });

    function formatarValorMonetario2(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }
});