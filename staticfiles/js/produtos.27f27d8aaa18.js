document.addEventListener('DOMContentLoaded', function() {

    if (localStorage.getItem('produtoSalvo') === 'true') {
        sweetAlert('Produto salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('produtoSalvo');
    }

});

$(document).ready(function() {
    //Mudar de aba
    $('#tabMeusDados').click(function() {
        var id_produto = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        window.location.href = '/produtosdaf/produtos/ficha/' + id_produto + '/'
    });

    $('#tabConsumoMedio').click(function() {
        var id_produto = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        //alert(id_produto)
        if(id_produto=='novo'){
            alert("Não existe registro de consumo médio mensal.")
        }
        window.location.href = '/produtosdaf/produtos/ficha/cmm/' + id_produto + '/'
    });
    
    
    //Deletar
    $('#apagarProduto').on('click', function() {
        const produtoId = $('#id').val();  // Pega o ID da denominação do campo de input
    
        if (!produtoId) { //Trata-se de um novo registro que ainda não foi salvo
            window.location.href = `/produtosdaf/produtos`;
            return; // Sai da função
        }
        $.ajax({
            url: `/produtosdaf/produtos/deletar/${produtoId}/`,
            method: 'POST',
            headers: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')  // Pega o token CSRF para autenticação
            },
            success: function(response) {
                // Redireciona para a lista de denominações após a deleção bem-sucedida
                //alert(response.message);
                window.location.href = `/produtosdaf/produtos`;
            },
            error: function(error) {
                // Aqui você pode adicionar qualquer lógica que deseja executar se houver um erro ao tentar deletar a denominação.
                alert('Ocorreu um erro ao tentar deletar o produto. Por favor, tente novamente.');
            }
        });
    });

    //Mudar de página com delegação de eventos
    $('#tabproduto tbody').on('click', 'tr', function() {
        fetchAndRenderTableData();
        const produtoId = $(this).attr('data-id').toString();
        window.location.href = `/produtosdaf/produtos/ficha/${produtoId}/`;
    });

    //Mostrar descricao do atc
    $('#atc_codigo').change(function() {
        var descricao = $(this).find(':selected').data('descricao');
        $('#atc_descricao').val(descricao || '');
    });

    //Tipo de produto da denominacao generica
    $('#denominacao').change(function() {
        var tipo_produto = $(this).find(':selected').data('tipo_produto');
        $('#tipo_produto').val(tipo_produto || '');
    });

    //Salvar Tags
    $.ajaxSetup({
        headers: {
            'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $("#salvarTagsProdutos").off('click').click(function() {
        var selectedTags = [];
        var id_do_produto = $("#id").val();
       
        // Limpar a lista (mesmo que já tenha sido inicializada vazia)
        selectedTags.length = 0;
        console.log(selectedTags);

        $("#tagsModal .modal-body input[type='checkbox']:checked").each(function() {
            var tagValue = $(this).val();
            var tagId = $(this).data('id');
            selectedTags.push({id: tagId, value: tagValue});
        });

        console.log(selectedTags);

        $.ajax({
            type: "POST",
            url: '/produtosdaf/produtos/salvartags/' + id_do_produto + '/',
            data: {
                tags: JSON.stringify(selectedTags)
            },
            success: function(response) {
                if(response.status === "success") {
                    location.reload();
                    $('#tagsModal').modal('show');
                    //alert("Tags salvas com sucesso!")
                } else {
                    alert("Erro ao salvar tags!");
                }
            }
        });
    });


    //Limpar Filtros
    $('#limpar-filtros').on('click', function() {
        $('#tipo_produto').val('');
        $('#produto').val('');
        $('#denominacao').val('');
        $('#comp_unidade_basico').prop('checked', false);
        $('#comp_especializado').prop('checked', false);
        $('#comp_estrategico').prop('checked', false);
        $('#disp_farmacia_popular').prop('checked', false);
        $('#hospitalar').prop('checked', false);
        fetchAndRenderTableData();
    });

    let produtoCurrentPage = 1;

    //Próxima página
    $('#produtoNextPage').on('click', function() {
        fetchAndRenderTableData(produtoCurrentPage + 1);
    });

    //Página anterior
    $('#produtoPreviousPage').on('click', function() {
        fetchAndRenderTableData(produtoCurrentPage - 1);
    });

    //Filtrar
    $('#tipo_produto, #produto, #denominacao').change(function() {
        
        fetchAndRenderTableData();
    });

    //Filtrar unidades
    $('#comp_unidade_basico, #comp_especializado, #comp_estrategico, #disp_farmacia_popular, #hospitalar').change(function() {
        fetchAndRenderTableData();
    });

    //Exportar dados
    $('#exportarBtnProdutosFarmaceuticos').on('click', function() {
        // Coleta valores dos campos
        const tipo_produto = document.querySelector('#tipo_produto').value;
        const denominacao = document.querySelector('#produto').value;
        const basico = document.querySelector('#comp_unidade_basico').checked;
        const especializado = document.querySelector('#comp_especializado').checked;
        const estrategico = document.querySelector('#comp_estrategico').checked;
        const farmacia_popular = document.querySelector('#disp_farmacia_popular').checked;
        const hospitalar = document.querySelector('#hospitalar').checked;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        console.log('exportar')

        // Define dados a serem enviados
        const data = {
            tipo_produto: tipo_produto,
            denominacao: denominacao,
            basico: basico,
            especializado: especializado,
            estrategico: estrategico,
            farmacia_popular: farmacia_popular,
            hospitalar: hospitalar
        };

        // Envia solicitação AJAX para o servidor
        fetch('produtos/exportar/', {
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
            a.download = 'produtos_daf.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });


   


//Renderizar tabela
function fetchAndRenderTableData(page = 1) {

    var selectedTipo = $('#tipo_produto').val();
    var produto = $('#produto').val();
    var denominacao = $('#denominacao').val();

    var dataToSend = {
        'tipo_produto': selectedTipo,
        'produto': produto,
        'denominacao': denominacao,
    };
    
    if ($('#comp_unidade_basico').prop('checked')) {
        dataToSend.basico = true;
    }
    if ($('#comp_especializado').prop('checked')) {
        dataToSend.especializado = true;
    }
    if ($('#comp_estrategico').prop('checked')) {
        dataToSend.estrategico = true;
    }
    if ($('#disp_farmacia_popular').prop('checked')) {
        dataToSend.farmacia_popular = true;
    }
    if ($('#hospitalar').prop('checked')) {
        dataToSend.hospitalar = true;
    }

    $.ajax({
        url: "/produtosdaf/produtos/filtro/",
        data: { ...dataToSend, page: page },
        dataType: 'json',
        success: function(data) {
            updateTable(data.data);
            $('#numeroProdutos').text(data.numero_produtos.toLocaleString('pt-BR').replace(/,/g, '.'));
            $('#produtoCurrentPage').text(data.current_page);
            $('#produtoNextPage').prop('disabled', !data.has_next);
            $('#produtoPreviousPage').prop('disabled', !data.has_previous);
            produtoCurrentPage = data.current_page;
        }
    });
}

});



//Atualizar tabela
function updateTable(produtos) {
    console.log('updateTable')
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    produtos.forEach(produto => {
        var row = `
            <tr data-id="${produto.id}">
                <td class="col-id">${produto.id}</td>
                <td class="col-texto8">${produto.denominacao__tipo_produto}</td>
                <td class="col-texto18">${produto.produto}</td>
                <td class="col-texto6" style="text-align: center !important;">${produto.comp_basico ? '<span class="produto-unidadedaf">Sim</span>' : 'Não'}</td>
                <td class="col-texto6" style="text-align: center !important;">${produto.comp_especializado ? '<span class="produto-unidadedaf">Sim</span>' : 'Não'}</td>
                <td class="col-texto6" style="text-align: center !important;">${produto.comp_estrategico ? '<span class="produto-unidadedaf">Sim</span>' : 'Não'}</td>
                <td class="col-texto6" style="text-align: center !important;">${produto.disp_farmacia_popular ? '<span class="produto-unidadedaf">Sim</span>' : 'Não'}</td>
                <td class="col-texto6" style="text-align: center !important;">${produto.hospitalar ? '<span class="produto-unidadedaf">Sim</span>' : 'Não'}</td>
                <td class="col-texto15">${produto.produtos_tags}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}



//Salvar dados
document.getElementById('btnSalvarProduto').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    let postURL = document.getElementById('produtoForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('produtoForm'));
    
    //for (let [key, value] of formData.entries()) {
    //    console.log(key, value);
    //}
    
    //fetch("{% if form.instance.id %}{% url 'produtos_ficha' form.instance.id %}{% else %}{% url 'novo_produto' %}{% endif %}", {
    fetch(postURL, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })

    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao salvar produto farmacêutico.');
        }
    })
    .then(data => {
        if (data.redirect_url) {

            localStorage.setItem('produtoSalvo', 'true');
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.log(error);
    });
});



document.addEventListener('DOMContentLoaded', function() {
    var denominacaoSelect = document.getElementById('denominacao');
    var concentracaoInput = document.getElementById('concentracao');
    var formaFarmaceuticaSelect = document.getElementById('forma_farmaceutica');
    var produtoInput = document.getElementById('produto');
    var concentracaoTipoSelect = document.getElementById('concentracao_tipo');

    function updateProdutoValue() {
        var denominacaoText = denominacaoSelect.options[denominacaoSelect.selectedIndex].text;
        var concentracaoValue = concentracaoInput.value;
        var formaFarmaceuticaText = formaFarmaceuticaSelect.options[formaFarmaceuticaSelect.selectedIndex].text;
        var showConcentracao = concentracaoTipoSelect.options[concentracaoTipoSelect.selectedIndex].text === 'Mostrar no nome';

        var produtoValue = denominacaoText;
        if (showConcentracao && concentracaoValue) {
            produtoValue += ' ' + concentracaoValue;
        }
        produtoValue += ' (' + formaFarmaceuticaText + ')';
        produtoInput.value = produtoValue;
    }

    function handleConcentracaoTipoChange() {
        var concentracaoTipoValue = concentracaoTipoSelect.value;
        if (concentracaoTipoValue === 'nao_informado' || concentracaoTipoValue === 'nao_se_aplica') {
            concentracaoInput.value = '';
            concentracaoInput.setAttribute('readonly', true);
        } else {
            concentracaoInput.removeAttribute('readonly');
        }
        updateProdutoValue();
    }

    // Event listener for changes
    denominacaoSelect.addEventListener('change', updateProdutoValue);
    concentracaoInput.addEventListener('input', updateProdutoValue);
    formaFarmaceuticaSelect.addEventListener('change', updateProdutoValue);
    concentracaoTipoSelect.addEventListener('change', handleConcentracaoTipoChange);

    // Call the function to set the initial state
    handleConcentracaoTipoChange();
});
