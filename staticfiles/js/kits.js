document.addEventListener('DOMContentLoaded', function() {

    //Inserir Novo Empenho
    const botaoInserirKit = document.getElementById('btnInserirKit')
    botaoInserirKit.addEventListener('click', function(){
        window.location.href = '/produtosdaf/kits/novo/'
    })

    //Mudar de aba
    $('#tabKits tbody').on('click', 'tr', function() {
        const idKit = $(this).attr('data-id').toString();
        window.location.href = `/produtosdaf/kits/ficha/${idKit}/`;
    });

    //Exportar dados
    $('#btnExportarKits').on('click', function() {

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
