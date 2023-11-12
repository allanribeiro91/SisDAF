document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('tabTramitacoes');
    table.addEventListener('click', function(event) {
      const target = event.target;
      if (target.tagName === 'TD') {
        const row = target.closest('tr');
        const tramitacaoId = row.dataset.id;
        const proaqId = row.dataset.proaqId;
        openModal(tramitacaoId, proaqId);
      }
    });
});




function openModal(tramitacaoId, proaqId) {
    console.log(tramitacaoId);
    fetch(`/proaq/tramitacao/${tramitacaoId}/dados/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da tramitação');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os campos do formulário no modal com os dados recebidos
            document.getElementById('id_tramitacao').value = data.id_tramitacao;
            document.getElementById('log_data_registro').value = data.log_data_registro;
            document.getElementById('log_responsavel_registro').value = data.log_responsavel_registro;
            document.getElementById('lot_ult_atualizacao').value = data.lot_ult_atualizacao;
            document.getElementById('log_responsavel_atualizacao').value = data.log_responsavel_atualizacao;
            document.getElementById('log_edicoes').value = data.log_edicoes;
            document.getElementById('tramitacao_docsei').value = data.documento_sei;
            document.getElementById('tramitacao_local').value = data.tramitacao_local;
            document.getElementById('tramitacao_etapa').value = data.tramitacao_etapa;
            document.getElementById('tramitacao_data_entrada').value = data.tramitacao_data_entrada;
            document.getElementById('tramitacao_data_previsao').value = data.tramitacao_data_previsao;
            document.getElementById('tramitacao_data_saida').value = data.tramitacao_data_saida;
            document.getElementById('tramitacao_observacoes').value = data.tramitacao_observacoes;

            // Abrir o modal
            const modal = new bootstrap.Modal(document.getElementById('tramitacaoModal'));
            modal.show();
        })
        .catch(error => {
            console.log(error);
        });
}


$('#apagarTramitacao').on('click', function() {
    const tramitacaoId = $('#id_tramitacao').val();  // Pega o ID da tramitacao

    if (!tramitacaoId) { //Trata-se de um novo registro que ainda não foi salvo
        window.location.reload();
        return; // Sai da função
    }
    
    $.ajax({
        url: `/proaq/ficha/tramitacoes/deletar/${tramitacaoId}/`,
        method: 'POST',
        headers: {
            'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')  // Pega o token CSRF para autenticação
        },
        success: function(response) {
            // Redireciona para a lista de denominações após a deleção bem-sucedida
            //alert(response.message);
            window.location.reload();
        },
        error: function(error) {
            // Aqui você pode adicionar qualquer lógica que deseja executar se houver um erro ao tentar deletar a denominação.
            alert('Ocorreu um erro ao tentar deletar a tramitação. Por favor, tente novamente.');
        }
    });
});


//Exportar dados
$('#exportarProaqs').on('click', function() {
    // Coleta valores dos campos
    const status_proaq = document.querySelector('#status_proaq').value;
    const modalidade_aquisicao = document.querySelector('#modalidade_aquisicao').value;
    const unidade_daf = document.querySelector('#unidade_daf').value;
    const denominacao = document.querySelector('#denominacao').value;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Define dados a serem enviados
    const data = {
        status_proaq: status_proaq,
        modalidade_aquisicao: modalidade_aquisicao,
        unidade_daf: unidade_daf,
        denominacao: denominacao,
    };

    console.log('Exportar Processos Aquisitivos')

    // Envia solicitação AJAX para o servidor
    fetch('exportar/', {
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
        a.download = 'processos_aquisitivos.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});






$(document).ready(function() {

    // Função para verificar o estado do campo "Unidade DAF" e habilitar/desabilitar "Responsável Técnico"
    function checkUnidadeDaf() {
        var unidadeDaf = $('#unidade_daf').val();
        if (unidadeDaf) {
            $('#responsavel_tecnico').prop('disabled', false);
        } else {
            $('#responsavel_tecnico').prop('disabled', true);
        }
    }

    // Função para carregar usuários baseado na unidade
    function loadUsuarios(unidade, selectedUserId) {
        var urlBase = '/proaq_usuarios_por_unidade/';
        if (unidade) {
            $.ajax({
                url: urlBase + unidade + '/',
                success: function(data) {
                    var responsavelSelect = $('#responsavel_tecnico');
                    responsavelSelect.empty();
                    responsavelSelect.append('<option value="" disabled>Não Informado</option>');
                    $.each(data, function(index, usuario) {
                        var selected = usuario.id == selectedUserId ? 'selected' : '';
                        responsavelSelect.append('<option value="' + usuario.id + '" ' + selected + '>' + usuario.nome + '</option>');
                    });
                    responsavelSelect.prop('disabled', false);  // Habilita o select
                }
            });
        }
    }

    // Mudar de página com delegação de eventos
    $('#tabProcessosAquisitivos tbody').on('click', 'tr', function() {
        const proaqId = $(this).attr('data-id').toString();
        window.location.href = `/proaq/ficha/dadosgerais/${proaqId}/`;
    });

    // Chame as funções quando a página é carregada
    checkUnidadeDaf();
    loadUsuarios(initialUnidade, initialResponsavelTecnico);

    // Chame as funções quando o campo "Unidade DAF" é alterado
    $('#unidade_daf').change(function() {
        checkUnidadeDaf();
        loadUsuarios($(this).val());
    });






});

$(document).ready(function(){
    $('#numero_processo_sei').mask('00000.000000/0000-00');
});

$(document).ready(function(){
    $('#numero_etp').on('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
});

$(document).ready(function(){
    $('#unidade_daf').change(function() {
        var unidade = $(this).val();
        if (unidade) {
            $('#responsavel_tecnico').prop('disabled', false);
        } else {
            $('#responsavel_tecnico').prop('disabled', true);
        }
    });
});

    

$(document).ready(function(){
    //Filtrar
    $('#status_proaq, #modalidade_aquisicao, #unidade_daf, #denominacao').change(function() {
        buscarAtualizarProaqs();
    });
});


//Renderizar tabela
function buscarAtualizarProaqs(page = 1) {
    var status = $('#status_proaq').val();
    var modalidadeAquisicao = $('#modalidade_aquisicao').val();
    var unidadeDAF = $('#unidade_daf').val();
    var denominacao_id = $('#denominacao').val();

    var dataToSend = {
        'status': status,
        'modalidadeAquisicao': modalidadeAquisicao,
        'unidadeDAF': unidadeDAF,
        'denominacao_id': denominacao_id
    };

    $.ajax({
        url: "/proaq/filtro/",
        data: { ...dataToSend, page: page },
        dataType: 'json',
        success: function(data) {
            recarregarTabela(data.data);
            $('#numeroProdutos').text(data.numero_produtos.toLocaleString('pt-BR').replace(/,/g, '.'));
            $('#currentPage').text(data.current_page);
            $('#nextPage').prop('disabled', !data.has_next);
            $('#previousPage').prop('disabled', !data.has_previous);
            currentPage = data.current_page;
        }
    });
}



//Atualizar tabela
function recarregarTabela(proaqs) {
    console.log('recarregarTabela')
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    proaqs.forEach(proaq => {
        var row = `
            <tr data-id="${proaq.id}">
                <td class="col-id">${proaq.id}</td>
                <td class="col-status">${proaq.get_status_label}</td>
                <td class="col-unidadedaf">${proaq.get_unidade_daf_label}</td>
                <td class="col-modalidade">${proaq.get_modalidade_aquisicao_label}</td>
                <td class="col-processo">${proaq.numero_processo_sei}</td>
                <td class="col-etp">${proaq.numero_etp}</td>
                <td class="col-denominacao">${proaq.get_denominacao_nome}</td>
                <td class="col-responsavel">${proaq.get_usuario_nome}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

//Limpar Filtros
$('.limpar-filtro-proaq').on('click', function() {
    $('#status_proaq').val('');
    $('#modalidade_aquisicao').val('');
    $('#unidade_daf').val('');
    $('#denominacao').val('');
    buscarAtualizarProaqs();
});

//Mudar de aba
$('#proaq_ficha_evolucao').click(function() {
    var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
    if(id_proaq=='novo'){
        id_proaq='nova'
    }
    window.location.href = '/proaq/ficha/evolucao/' + id_proaq + '/';
});

$('#proaq_ficha_dados_gerais').click(function() {
    var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
    if(id_proaq=='nova'){
        window.location.href = '/proaq/ficha/novo/'
    }else{
        window.location.href = '/proaq/ficha/dadosgerais/' + id_proaq + '/';
    }
    
});

$('#proaq_ficha_tramitacoes').click(function() {
    var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
    if(id_proaq=='novo'){
        id_proaq='nova'
    }
    window.location.href = '/proaq/ficha/tramitacoes/' + id_proaq + '/';
});



$('#btnNovaTramitacao').click(function() {
    document.getElementById('proaqTramitacaoForm').reset();
    
    var modal = new bootstrap.Modal(document.getElementById('tramitacaoModal'));
    modal.show();
});



//Salvar dados
document.getElementById('btnSaveProaq').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    let postURL = document.getElementById('proaqForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('proaqForm'));

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
        
        // Redirecione para a nova URL
        window.location.href = data.redirect_url;
    });
});



// Configuração do AJAX para CSRF Token
$.ajaxSetup({
    headers: {
        'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
    }
});

// Quando o botão 'Salvar' é clicado
$("#salvarProaqProduto").click(function() {
    console.log('Clique detectado - salvarProaqProduto');
    var selectedProducts = [];
    var proaqId = $("#id_proaq").val();  // Certifique-se de que o ID do Proaq está disponível como um campo oculto ou de outra forma
    
    // Limpar a lista (mesmo que já tenha sido inicializada vazia)
    selectedProducts.length = 0;
    console.log(selectedProducts);

    // Para cada checkbox marcado, adicione o produto à lista
    $("#proaqProdutosModal .modal-body input[type='checkbox']:checked").each(function() {
        var productId = $(this).val();
        selectedProducts.push({id: productId});
    });

    console.log(selectedProducts);

    // Enviar a lista de produtos para o servidor via AJAX
    $.ajax({
        type: "POST",
        url: '/proaq_produtos_relacionados/' + proaqId + '/',
        data: {
            produtos: JSON.stringify(selectedProducts)
        },
        success: function(response) {
            if(response.status === "success") {
                location.reload();
                $('#proaqProdutosModal').modal('show');
            } else {
                alert("Erro ao salvar produtos!");
            }
        }
    });
});


//Salvar Tramitacao
// document.getElementById('btnSalvarTramitacao').addEventListener('click', function(e) {
//     e.preventDefault(); // Evita o envio padrão do formulário
    
//     console.log('Salvar tramitação')

//     let postURL = document.getElementById('proaqTramitacaoForm').getAttribute('data-post-url');
//     let formData = new FormData(document.getElementById('proaqTramitacaoForm'));

//     fetch(postURL, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     })
    
// });

document.getElementById('btnSalvarTramitacao').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    console.log('Salvar tramitação')

    let id_proaq = document.getElementById('proaq').value
    console.log(id_proaq)
    if(id_proaq=='None'){
        alert('Salve primeiro os dados gerais do processo.')
        return
    }

    let postURL = document.getElementById('proaqTramitacaoForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('proaqTramitacaoForm'));
    const tramitacaoId = document.getElementById('id_tramitacao').value;
    if (tramitacaoId) {
        formData.append('id_tramitacao', tramitacaoId);  // Adiciona o ID da tramitação ao FormData
    }

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
            throw new Error('Erro ao salvar tramitação');
        }
    })
    .then(data => {
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.log(error);
    });
});





