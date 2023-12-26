document.addEventListener('DOMContentLoaded', function() {
    
    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('itemProaqSalvo') === 'true') {
        sweetAlert('Item do Processo Aquisitivo salvo com sucesso!', 'success', 'top-end');
        let idItemProaq = localStorage.getItem('id_proaq_item');
        localStorage.removeItem('itemProaqSalvo');
        if (idItemProaq) {
            localStorage.removeItem('id_proaq_item');
            openModalItemProaq(idItemProaq)
        }
    }
    if (localStorage.getItem('proaqSalvo') === 'true') {
        sweetAlert('Processo Aquisitivo salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('proaqSalvo');
    }
    
    

    const status_proaq = document.getElementById('id_proaq_status');
    status_cor()
    status_proaq.addEventListener('change', function() {
        status_cor();        
    });

    function status_cor(){
        if (status_proaq.value == 'em_execucao') {
            status_proaq.style.backgroundColor = '#c2f6ff';
        }
        if (status_proaq.value == 'finalizado') {
            status_proaq.style.backgroundColor = '#b6b6b6';
        }
        if (status_proaq.value == 'suspenso') {
            status_proaq.style.backgroundColor = '#ffffd4';
        }
        if (status_proaq.value == 'cancelado') {
            status_proaq.style.backgroundColor = '#ffcbc2';
        }
    }


    const id_proaq_unidade_daf_hidden = document.getElementById('id_proaq_unidade_daf')
    const id_proaq_unidade_daf_display = document.getElementById('id_proaq_unidade_daf_display')
    const id_proaq_modalidade_aquisicao_hidden = document.getElementById('id_proaq_modalidade_aquisicao')
    const id_proaq_modalidade_aquisicao_display = document.getElementById('id_proaq_modalidade_aquisicao_display')
    const id_proaq_denominacao_hidden = document.getElementById('id_proaq_denominacao_hidden')
    const id_proaq_denominacao_display = document.getElementById('id_proaq_denominacao_display')

    // Carregar dados de novo Processo Aquisitivo
    const url_novo_proaq = '/novo/';
    if (window.location.pathname.endsWith(url_novo_proaq)) {
        carregarDadosNovoProaq();
    }

    function carregarDadosNovoProaq() {
        var unidade_daf_value = localStorage.getItem('localstorage_unidadeDaf_value');
        var unidade_daf_text = localStorage.getItem('localstorage_unidadeDaf_text');
        if (unidade_daf_value) {
            id_proaq_unidade_daf_hidden.value = unidade_daf_value;
            id_proaq_unidade_daf_display.value = unidade_daf_text;
        }

        var modalidadeAquisicao_value = localStorage.getItem('localstorage_modalidadeAquisicao_value');
        var modalidadeAquisicao_text = localStorage.getItem('localstorage_modalidadeAquisicao_text');
        if (modalidadeAquisicao_value) {
            id_proaq_modalidade_aquisicao_hidden.value = modalidadeAquisicao_value;
            id_proaq_modalidade_aquisicao_display.value = modalidadeAquisicao_text;
        }

        var denominacao_value = localStorage.getItem('localstorage_denominacao_value');
        var denominacao_text = localStorage.getItem('localstorage_denominacao_text');
        if (denominacao_value) {
            id_proaq_denominacao_hidden.value = denominacao_value;
            id_proaq_denominacao_display.value = denominacao_text;
        }
        
        localStorage.clear();
    }

    const responsavel_tecnico = document.getElementById('id_proaq_responsavel_tecnico')
    const outro_responsavel_tecnico = document.getElementById('id_proaq_outro_responsavel')
    const outro_responsavel_checkbox = document.getElementById('id_proaq_outro_resp_checkbox')

    outro_responsavel_checkbox.addEventListener('change', function() {
        if (outro_responsavel_checkbox.checked) {
            responsavel_tecnico.value = ''
            responsavel_tecnico.setAttribute('disabled', 'disabled')
            outro_responsavel_tecnico.removeAttribute('readonly');
            outro_responsavel_tecnico.value = ''
        } else {
            responsavel_tecnico.value = ''
            responsavel_tecnico.removeAttribute('disabled')
            outro_responsavel_tecnico.value = ''
            outro_responsavel_tecnico.setAttribute('readonly', 'true');
        }
    });

    function verificar_se_ha_outro_responsavel(){
        if (outro_responsavel_tecnico.value != '') {
            var event = new Event('change');
            var outro_tecnico = outro_responsavel_tecnico.value
            outro_responsavel_checkbox.checked = true;
            outro_responsavel_checkbox.dispatchEvent(event);
            outro_responsavel_tecnico.value = outro_tecnico
        }    
    }
    verificar_se_ha_outro_responsavel();
   
    //Máscara de Número do Processo SEI
    $('#id_proaq_numero_processo_sei').mask('00000.000000/0000-00');


    //Salvar Processo Aquisitivo
    const proaq_id = document.getElementById('id_proaq').value
    const botao_salvar_processo_aquisitivo = document.getElementById('btnSaveProaq') 
    botao_salvar_processo_aquisitivo.addEventListener('click', function(event){
        event.preventDefault();
        salvarProcessoAquisitivo();
    })

    function salvarProcessoAquisitivo() {
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_proaq()
        if (preenchimento_incorreto === false) {
            return;
        }
        
        //Enviar para o servidor
            //definir o caminho
            if (proaq_id == '') {
                postURL = '/proaq/ficha/novo/'
            } else
            {
                postURL = `/proaq/ficha/dadosgerais/${proaq_id}/`
            }
    
            //pegar os dados
            let formData = new FormData(document.getElementById('proaqForm'));
    
            //enviar 
            fetch(postURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
        
        //Retorno do Servidor
        .then(response => {
            // Primeiro verifique se a resposta é ok
            if (!response.ok) {
                sweetAlert('Dados não foram salvos.', 'error', 'red');
                throw new Error('Server response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.retorno === "Salvo") {
                
                if (data.novo === false) {
                    //logs       
                    document.getElementById('lot_ult_atualizacao').value = data.log_atualizacao_data
                    document.getElementById('log_responsavel_atualizacao').value = data.log_atualizacao_usuario
                    document.getElementById('log_edicoes').value = data.log_edicoes
    
                    //alert
                    sweetAlert('Processo Aquisitivo salvo com sucesso!', 'success', 'green')
                } else {
                    localStorage.setItem('proaqSalvo', 'true');
                    window.location.href = data.redirect_url;
                }
            }
    
            if (data.retorno === "Não houve mudanças") {
                //alert
                sweetAlert('Dados não foram salvos.<br>Não houve mudanças.', 'warning', 'orange')
            }
    
            if (data.retorno === "Erro ao salvar") {
                //alert
                sweetAlert('Dados não foram salvos.', 'error', 'red')
            }
        })
        .catch(error => {
            console.error('Fetch operation error:', error);
        });
            
    }

    function verificar_campos_proaq() {
        const campos = [
            { id: 'id_proaq_unidade_daf_display', mensagem: 'Informe a <b>Unidade DAF</b>!' },
            { id: 'id_proaq_modalidade_aquisicao_display', mensagem: 'Informe a <b>Modalidade de Aquisição</b>!' },
            { id: 'id_proaq_denominacao_display', mensagem: 'Informe a <b>Denominação Genérica</b>!' },
            { id: 'id_proaq_status', mensagem: 'Informe o <b>Status do Processo</b>!' },
            { id: 'id_proaq_numero_processo_sei', mensagem: 'Informe o <b>Nº do Processo SEI</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '') {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);

        const mensagem_responsavel_tecnico = 'Informe o <b>Responsável Técnico</b>!'
        if (outro_responsavel_checkbox.checked == false && outro_responsavel_tecnico.value == ''){
            if(responsavel_tecnico.value == '') {
                mensagensErro.push(mensagem_responsavel_tecnico);
            }
        }else{
            if(outro_responsavel_tecnico.value == '') {
                mensagensErro.push(mensagem_responsavel_tecnico);
            }
        }
    
        if (mensagensErro.length > 0) {
            const campos = mensagensErro.join('<br>')
            sweetAlertPreenchimento(campos)
            return false;
        }
    
        return true;
    }


    const botao_inserir_novo_item = document.getElementById('btnNovoItem')
    const modal_proaq_item = new bootstrap.Modal(document.getElementById('proaqItemModal'))
    const id_proaq_item_hidden = document.getElementById('id_proaq_item_hidden')
    botao_inserir_novo_item.addEventListener('click', function(){
        if (proaq_id == ''){
            sweetAlert('<span style="font-weight:normal">Salve primeiro o</span><br>Processo Aquisitivo!')
        } else{
            limpar_dados_modal_item();
            id_proaq_item_hidden.value = proaq_id
            modal_proaq_item.show();
        }
    })

    function limpar_dados_modal_item(){

        //log
        document.getElementById('proaq_item_id').value = ''
        document.getElementById('proaq_item_log_data_registro').value = ''
        document.getElementById('proaq_item_log_responsavel_registro').value = ''
        document.getElementById('proaq_item_log_ult_atualizacao').value = ''
        document.getElementById('proaq_item_log_responsavel_atualizacao').value = ''
        document.getElementById('proaq_item_log_edicoes').value = ''

        //dados do item
        document.getElementById('id_proaqitem_tipo_cota').value = ''
        document.getElementById('id_item_produto').value = ''
        document.getElementById('id_produto_id').value = ''
        document.getElementById('id_proaqitem_numero_item').value = ''
        document.getElementById('id_proaqitem_cmm_data_inicio').value = ''
        document.getElementById('id_proaqitem_cmm_data_fim').value = ''
        document.getElementById('id_proaqitem_cmm_estimado').value = ''
        document.getElementById('id_proaqitem_qtd_a_ser_contratada').value = ''
        document.getElementById('id_proaqitem_cobertura_dias').value = ''
        document.getElementById('id_proaqitem_cobertura_meses').value = ''
        document.getElementById('id_proaqitem_valor_unitario').value = ''
        document.getElementById('id_proaqitem_valor_total').value = ''
        document.getElementById('id_proaqitem_observacoes').value = ''

    }

    function openModalItemProaq(id_proaq_item) {
        fetch(`/proaq/buscar_item_proaq/${id_proaq_item}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do Item do Processo Aquisitivo.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                //log
                $('#proaq_item_id').val(data.id);
                $('#proaq_item_log_data_registro').val(data.log_data_registro);
                $('#proaq_item_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#proaq_item_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#proaq_item_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#proaq_item_log_edicoes').val(data.log_edicoes);

                //dados do item
                $('#id_proaqitem_tipo_cota').val(data.tipo_cota);
                $('#id_item_produto').val(data.produto);
                $('#id_produto_id').val(data.produto);
                $('#id_proaqitem_numero_item').val(data.numero_item);
                $('#id_proaqitem_cmm_data_inicio').val(data.data_inicio);
                $('#id_proaqitem_cmm_data_fim').val(data.data_fim);
                $('#id_proaqitem_cmm_estimado').val(data.cmm_estimado.toLocaleString('pt-BR'));
                $('#id_proaqitem_qtd_a_ser_contratada').val(data.qtd_a_ser_contratada.toLocaleString('pt-BR'));
                $('#id_proaqitem_valor_unitario').val(formatarComoMoeda(data.valor_unitario_estimado));
                $('#id_proaqitem_observacoes').val(data.observacoes);

                //id proaq
                $('#id_proaq_item_hidden').val(proaq_id)
                
                // Abrir o modal
                // const modal = new bootstrap.Modal(document.getElementById('proaqItemModal'));
                // modal.show();
                modal_proaq_item.show();
                
                const qtd_contratada = document.getElementById('id_proaqitem_qtd_a_ser_contratada')
                if (qtd_contratada) {
                    var event = new Event('change');
                    qtd_contratada.dispatchEvent(event);
                }

            })
            .catch(error => {
                console.log(error);
            });
    }

    //Abrir Item do Processo Aquisitivo
    tabela_proaq_itens = document.getElementById('tabProaqItens')
    tabela_proaq_itens.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          const proaq_item_id = row.dataset.id;
          limpar_dados_modal_item();
          openModalItemProaq(proaq_item_id);
        }
    });

    

    //Deletar Item do Processo Aquisitivo
    const botao_deletar_proaq_item = document.getElementById('btnDeletarItemProaq')
    botao_deletar_proaq_item.addEventListener('click', function() {
        const proaq_item_id = document.getElementById('proaq_item_id')
        
        if (proaq_item_id.value == ''){
            modal_proaq_item.hide();
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar Item do Processo Aquisitivo."
        const url_delete = "/proaq/ficha/item/deletar/" + proaq_item_id.value + "/"
        const url_apos_delete = window.location.href;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })
});