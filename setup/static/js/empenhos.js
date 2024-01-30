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


});
