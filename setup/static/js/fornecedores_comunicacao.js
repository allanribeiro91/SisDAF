//Exportar dados
$('#btnExportarComunicacoes').on('click', function() {

    console.log('Exportar Comunicações')
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var fornecedorId = window.location.pathname.split('/').filter(function(e){ return e }).pop();

    // // Define dados a serem enviados
    const data = {
        fornecedorId: fornecedorId,
    };

    // Envia solicitação AJAX para o servidor
    fetch(`/fornecedores/comunicacoes/exportar/${fornecedorId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.blob()) // Trata a resposta como um Blob
    .then(blob => {
        // Inicia o download do arquivo
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'comunicacoes_fornecedor.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


// Quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('openModalAfterReload') === 'true') {
        const comunicacaoId = localStorage.getItem('comunicacaoId');
        const id_fornecedor = localStorage.getItem('id_fornecedor');
        console.log('ID Comunicação' + comunicacaoId)

        openModal(comunicacaoId, id_fornecedor);

        // Limpa o localStorage
        localStorage.removeItem('openModalAfterReload');
        localStorage.removeItem('comunicacaoId');
        localStorage.removeItem('id_fornecedor');
    }
});


document.getElementById('btnSalvarComunicacao').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    console.log('Salvar Comunicação')

    let id_fornecedor = document.getElementById('id_fornecedor').value
    console.log(id_fornecedor)
    if(id_fornecedor=='None'){
        alert('Salve primeiro os dados gerais do fornecedor.')
        return
    }

    // Avaliar preenchimento dos campos obrigatórios
    let unidade_daf = document.getElementById('comunicforn_unidade_daf').value;
    let tipo_comunicacao = document.getElementById('comunicforn_tipo_comunicacao').value;
    let topico_comunicacao = document.getElementById('comunicforn_topico_comunicacao').value;
    let status_envio = document.getElementById('comunicforn_status_envio').value;

    if (unidade_daf === 'nao_informado' || unidade_daf === '' ||
        tipo_comunicacao === 'nao_informado' || tipo_comunicacao === '' ||
        topico_comunicacao === 'nao_informado' || topico_comunicacao === '' ||
        status_envio === 'nao_informado' || status_envio === '') {
        alert("Preencha os campos obrigatórios!");
        return;
    }


    let postURL = '/fornecedores/comunicacoes/' + id_fornecedor + '/';
    let formData = new FormData(document.getElementById('comunicacaoFornecedorForm'));
    const comunicacaoId = document.getElementById('id_comunicacao_fornecedor').value;
    if (comunicacaoId) {
        formData.append('id_comunicacao', comunicacaoId);
    }

    // Avaliar o responsável
    let responsavel = document.getElementById('comunicforn_responsavel').value;
    
    if (responsavel === 'outro') {
        // Limpa ou remove o campo 'comunicforn_responsavel' do formData
        //formData.set('comunicforn_responsavel', '');
        console.log('Reponsavel ', responsavel)
        formData.delete('responsavel_resposta');
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
            throw new Error('Erro ao salvar comunicação');
        }
    })
    .then(data => {
        if (data.redirect_url) {
            // Antes de recarregar a página
            var comunicacaoId = data.comunicacao_id;
            localStorage.setItem('comunicacaoId', comunicacaoId);
            localStorage.setItem('id_fornecedor', id_fornecedor);
            localStorage.setItem('openModalAfterReload', 'true');
            //Recarregar a páigna
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.log(error);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('tabComunicacoes');
    table.addEventListener('click', function(event) {
      const target = event.target;
      if (target.tagName === 'TD') {
        const row = target.closest('tr');
        const comunicacaoId = row.dataset.id;
        const fornecedorId = row.dataset.fornecedorId;
        openModal(comunicacaoId, fornecedorId);
      }
    });
});

function openModal(comunicacaoId, fornecedorId) {
    console.log(comunicacaoId);
    fetch(`/fornecedores/comunicacoes/${comunicacaoId}/dados/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da comunicação.');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os campos do formulário no modal com os dados recebidos
            document.getElementById('id_comunicacao_fornecedor').value = data.id_comunicacao;
            document.getElementById('comunicforn_log_data_registro').value = data.log_data_registro;
            document.getElementById('comunicforn_log_responsavel_registro').value = data.log_responsavel_registro;
            document.getElementById('comunicforn_lot_ult_atualizacao').value = data.lot_ult_atualizacao;
            document.getElementById('comunicforn_log_responsavel_atualizacao').value = data.log_responsavel_atualizacao;
            document.getElementById('comunicforn_log_edicoes').value = data.log_edicoes;
            document.getElementById('comunicforn_unidade_daf').value = data.unidade_daf;
            loadUsuarios(data.unidade_daf, data.responsavel_resposta);
            document.getElementById('comunicforn_tipo_comunicacao').value = data.tipo_comunicacao;
            document.getElementById('comunicforn_topico_comunicacao').value = data.topico_comunicacao;
            document.getElementById('comunicforn_assunto').value = data.assunto;
            document.getElementById('comunicforn_demanda_original').value = data.demanda_original;
            document.getElementById('comunicforn_destinatario').value = data.destinatario;
            document.getElementById('comunicforn_mensagem_encaminhada').value = data.mensagem_encaminhada;
            document.getElementById('comunicforn_status_envio').value = data.status_envio;
            document.getElementById('comunicforn_data_envio').value = data.data_envio;
            //document.getElementById('comunicforn_responsavel').value = data.responsavel_resposta;
            document.getElementById('comunicforn_responsavel_outro').value = data.outro_responsavel;
            document.getElementById('comunicforn_observacoes').value = data.observacoes;

            // Abrir o modal
            const modal = new bootstrap.Modal(document.getElementById('comunicacaoFornecedorModal'));
            modal.show();
        })
        .catch(error => {
            console.log(error);
        });
}


document.addEventListener('DOMContentLoaded', function() {
    var responsavelSelect = document.getElementById('comunicforn_responsavel');
    var outroResponsavelInput = document.getElementById('comunicforn_responsavel_outro');

    // Função para verificar o valor selecionado e ajustar o campo "Outro Responsável"
    function handleResponsavelChange() {
        if (responsavelSelect.value === 'outro') {
            // Se "Outro" for selecionado, habilita o campo e limpa o valor
            outroResponsavelInput.removeAttribute('readonly');
            outroResponsavelInput.value = '';
        } else {
            // Se outra opção for selecionada, desabilita e limpa o campo
            outroResponsavelInput.setAttribute('readonly', true);
            outroResponsavelInput.value = '';
        }
    }

    // Adicionando o ouvinte de evento ao select
    responsavelSelect.addEventListener('change', handleResponsavelChange);

    // Chamando a função inicialmente para definir o estado inicial
    handleResponsavelChange();
});



// Chame as funções quando o campo "Unidade DAF" é alterado
$('#comunicforn_unidade_daf').change(function() {
    console.log('teste')
    checkUnidadeDaf();
    loadUsuarios($(this).val());
});

// Função para verificar o estado do campo "Unidade DAF" e habilitar/desabilitar "Responsável Técnico"
function checkUnidadeDaf() {
    var unidadeDaf = $('#comunicforn_unidade_daf').val();
    if (unidadeDaf != 'nao_informado') {
        $('#comunicforn_responsavel').prop('disabled', false);
    } else {
        $('#comunicforn_responsavel').prop('disabled', true);
    }
}

function loadUsuarios(unidade, selectedResponsavelName) {
    var urlBase = '/fornecedores/usuarios_unidadedaf/';
    var responsavelSelect = $('#comunicforn_responsavel');

    responsavelSelect.empty();

    // Adiciona "Não Informado" e verifica se deve ser a opção selecionada
    var naoInformadoSelected = !selectedResponsavelName || selectedResponsavelName === 'Não Informado';
    responsavelSelect.append('<option value="" ' + (naoInformadoSelected ? 'selected' : '') + '>Não Informado</option>');

    if (unidade != 'nao_informado') {
        $.ajax({
            url: urlBase + unidade + '/',
            success: function(data) {
                var found = false;
                $.each(data, function(index, usuario) {
                    var isSelected = usuario.nome === selectedResponsavelName;
                    found = found || isSelected;
                    responsavelSelect.append('<option value="' + usuario.id + '" ' + (isSelected ? 'selected' : '') + '>' + usuario.nome + '</option>');
                });

                
                // Adiciona "Outro" e verifica se deve ser a opção selecionada
                if (!found && selectedResponsavelName && selectedResponsavelName !== 'Não Informado') {
                    responsavelSelect.append('<option value="outro" selected>Outro</option>');
                    document.getElementById('comunicforn_responsavel_outro').removeAttribute('readonly');
                } else {
                    responsavelSelect.append('<option value="outro">Outro</option>');
                    document.getElementById('comunicforn_responsavel_outro').setAttribute('readonly', true);
                }
                responsavelSelect.prop('disabled', false);
            }
        });
    } else {
        // Adiciona apenas "Outro" se "Não Informado" é selecionado
        responsavelSelect.append('<option value="outro">Outro</option>');
        responsavelSelect.prop('disabled', true);
    }
}

