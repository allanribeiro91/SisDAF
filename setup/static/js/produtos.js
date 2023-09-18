let currentPage = 1;
$(document).ready(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
        }
    });

    //Salvar Tags
    $("#salvarTags").click(function() {
        console.log('Clique detectado - salvartags');
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
                    alert("Tags salvas com sucesso!")
                } else {
                    alert("Erro ao salvar tags!");
                }
            }
        });
    });
});




//Concentracao
document.addEventListener("DOMContentLoaded", function() {
    let concentracaoTipoSelect = document.getElementById("concentracao_tipo");
    let concentracaoInput = document.getElementById("concentracao");

    function updateConcentracaoReadonly() {
        if (concentracaoTipoSelect.value === "mostrar_nome" || concentracaoTipoSelect.value === "mostrar_nao") {
            concentracaoInput.removeAttribute("readonly");
        } else {
            concentracaoInput.setAttribute("readonly", "");
            concentracaoInput.value = "";
        }
    }

    // Chama a função para definir o estado inicial
    updateConcentracaoReadonly();

    // Adiciona um ouvinte de evento para atualizar o atributo readonly sempre que o valor do dropdown mudar
    concentracaoTipoSelect.addEventListener("change", updateConcentracaoReadonly);
});

//Deletar
$(document).ready(function() {
    $('#apagarRegistro').on('click', function() {
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
});

//Acessar ficha
$(document).ready(function() {
    console.log('ler');
    fetchAndRenderTableData();

    //Mudar de página com delegação de eventos
    $('.table tbody').on('click', 'tr', function() {
        const produtoId = $(this).attr('data-id').toString();
        window.location.href = `/produtosdaf/produtos/ficha/${produtoId}/`;
    });
});

//Limpar Filtros
$('.limpar-filtro').on('click', function() {
    $('#tipo_produto').val('');
    $('#produto').val('');
    $('#basico').prop('checked', false);
    $('#especializado').prop('checked', false);
    $('#estrategico').prop('checked', false);
    $('#farmacia_popular').prop('checked', false);
    $('#hospitalar').prop('checked', false);
    fetchAndRenderTableData();
});

//Filtrar
$('#tipo_produto, #produto').change(function() {
    fetchAndRenderTableData();
});

//Filtrar unidades
$('#comp_basico, #comp_especializado, #comp_estrategico, #disp_farmacia_popular, #hospitalar').change(function() {
    fetchAndRenderTableData();
});

//Renderizar tabela
function fetchAndRenderTableData(page = 1) {
    console.log('fetchAndRenderTableData')
    var selectedTipo = $('#tipo_produto').val();
    var produto = $('#produto').val();
    
    var dataToSend = {
        'tipo_produto': selectedTipo,
        'produto': produto,
    };
    
    if ($('#comp_basico').prop('checked')) {
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
            $('#currentPage').text(data.current_page);
            $('#nextPage').prop('disabled', !data.has_next);
            $('#previousPage').prop('disabled', !data.has_previous);
            currentPage = data.current_page;
        }
    });
}

//Próxima página
$('#nextPage').on('click', function() {
    fetchAndRenderTableData(currentPage + 1);
});

//Página anterior
$('#previousPage').on('click', function() {
    fetchAndRenderTableData(currentPage - 1);
});

//Atualizar tabela
function updateTable(produtos) {
    console.log('updateTable')
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    produtos.forEach(produto => {
        var row = `
            <tr data-id="${produto.id}">
                <td>${produto.id}</td>
                <td>${produto.denominacao__tipo_produto}</td>
                <td>${produto.produto}</td>
                <td style="text-align: center;">${produto.comp_basico ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${produto.comp_especializado ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${produto.comp_estrategico ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${produto.disp_farmacia_popular ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${produto.hospitalar ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

//Exportar dados
document.querySelector('#exportarBtn').addEventListener('click', function() {
    // Coleta valores dos campos
    const tipo_produto = document.querySelector('#tipo_produto').value;
    const denominacao = document.querySelector('#produto').value;
    const basico = document.querySelector('#comp_basico').checked;
    const especializado = document.querySelector('#comp_especializado').checked;
    const estrategico = document.querySelector('#comp_estrategico').checked;
    const farmacia_popular = document.querySelector('#disp_farm_popular').checked;
    const hospitalar = document.querySelector('#hospitalar').checked;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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

//Salvar dados
document.getElementById('btnSave').addEventListener('click', function(e) {
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

    .then(response => response.json())
    .then(data => {
        // Atualize os campos do log com os dados retornados
        document.getElementById('log_data_registro').value = data.registro_data;
        document.getElementById('log_responsavel_registro').value = data.usuario_registro;
        document.getElementById('lot_ult_atualizacao').value = data.ult_atual_data;
        document.getElementById('log_responsavel_atualizacao').value = data.usuario_atualizacao;
        document.getElementById('log_edicoes').value = data.log_n_edicoes;
        //location.reload();
    });
});



//////////Comportamentos da ficha do produto
//Mostrar descricao do atc
$(document).ready(function() {
    $('#atc_codigo').change(function() {
        var descricao = $(this).find(':selected').data('descricao');
        $('#atc_descricao').val(descricao || '');
    });
});

//Tipo de produto da denominacao generica
$(document).ready(function() {
    $('#denominacao').change(function() {
        var tipo_produto = $(this).find(':selected').data('tipo_produto');
        $('#tipo_produto').val(tipo_produto || '');
    });
});


//Mudar o nome do produto
document.addEventListener("DOMContentLoaded", function() {
    console.log("Script carregado!");
    let denominacaoSelect = document.getElementById("denominacao");
    let concentracaoInput = document.getElementById("concentracao");
    let formaFarmaceuticaSelect = document.getElementById("forma_farmaceutica");
    let concentracaoTipoSelect = document.getElementById("concetracao_tipo");
    let produtoInput = document.getElementById("produto_farmaceutico"); // Este é o campo "Produto Farmacêutico"

    function updateProduto() {
        let denominacao = denominacaoSelect.options[denominacaoSelect.selectedIndex].text;
        let concentracao = (concentracaoTipoSelect.value === "mostrar_nome") ? concentracaoInput.value : "";
        let formaFarmaceutica = formaFarmaceuticaSelect.options[formaFarmaceuticaSelect.selectedIndex].text;

        produtoInput.value = `${denominacao} ${concentracao} (${formaFarmaceutica})`.trim();
    }

    denominacaoSelect.addEventListener("change", updateProduto);
    concentracaoInput.addEventListener("input", updateProduto);
    formaFarmaceuticaSelect.addEventListener("change", updateProduto);
    concentracaoTipoSelect.addEventListener("change", updateProduto);
});







document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.tab-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove o atributo "active" de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Adiciona o atributo "active" ao botão clicado
            this.classList.add('active');
        });
    });
});

//Expandir área de observações
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.auto-expand');

    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto'; // Reset height to auto
            this.style.height = this.scrollHeight + 'px'; // Set height to scrollHeight
        });
    });
});


//Outros nomes (outros sistemas)
document.addEventListener("DOMContentLoaded", function() {
    function toggleReadonly(checkboxId, inputId1, inputId2) {
        let checkbox = document.getElementById(checkboxId);
        let input1 = document.getElementById(inputId1);
        let input2 = document.getElementById(inputId2);

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                input1.setAttribute("readonly", "");
                input2.setAttribute("readonly", "");
                input1.value = "";
                input2.value = "";
            } else {
                input1.removeAttribute("readonly");
                input2.removeAttribute("readonly");
            }
        });
    }

    toggleReadonly("sigtap_possui", "sigtap_codigo", "sigtap_nome");
    toggleReadonly("sismat_possui", "sismat_codigo", "sismat_nome");
    toggleReadonly("catmat_possui", "catmat_codigo", "catmat_nome");
    toggleReadonly("obm_possui", "obm_codigo", "obm_nome");
});




