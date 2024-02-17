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
    if (localStorage.getItem('evolucaoProaqSalvo') === 'true') {
        sweetAlert('Evolução do Processo Aquisitivo salvo com sucesso!', 'success', 'top-end');
        let idEvolucaoProaq = localStorage.getItem('id_evolucao_proaq');
        localStorage.removeItem('evolucaoProaqSalvo');
        if (idEvolucaoProaq) {
            localStorage.removeItem('id_evolucao_proaq');
            openModalEvolucaoProaq(idEvolucaoProaq)
        }
    }
    if (localStorage.getItem('tramitacaoProaqSalvo') === 'true') {
        sweetAlert('Tramitação do Processo Aquisitivo salvo com sucesso!', 'success', 'top-end');
        let idTramitacaoProaq = localStorage.getItem('id_proaq_tramitacao');
        localStorage.removeItem('tramitacaoProaqSalvo');
        if (idTramitacaoProaq) {
            localStorage.removeItem('id_proaq_tramitacao');
            openModalTramitacao(idTramitacaoProaq)
        }
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
    $('#id_tramitacaoproaq_documento_sei').mask('0000000000')


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

    //Deletar Evolução do Processo Aquisitivo
    const botao_deletar_proaq = document.getElementById('btnProaqDeletar')
    botao_deletar_proaq.addEventListener('click', function() {

        const url_apos_delete = "/proaq/";
        
        //Trata-se de um novo registro que ainda não foi salvo
        if (!proaq_id) {
            window.location.href = "/proaq/";
            return;
        }        

        //parâmetros para deletar
        const mensagem = "Deletar Processo Aquisitivo."
        const url_delete = "/proaq/ficha/dadosgerais/deletar/" + proaq_id + "/"

        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })


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


    //Modal Evolução do Processo Aquisitivo
    const botao_abrir_modal_evolucao_proaq = document.getElementById('botao_modal_evolucao_proaq')
    const modal_evolucao_proaq = new bootstrap.Modal(document.getElementById('proaqEvolucaoModal'))
    botao_abrir_modal_evolucao_proaq.addEventListener('click', function(){
        limpar_dados_modal_evolucao_proaq();
        modal_evolucao_proaq.show()
    })


    const botao_inserir_evolucao = document.getElementById('btnInserirEvolucao')
    const id_evolucaoproaq_proaq_hidden = document.getElementById('id_evolucaoproaq_proaq_hidden')
    const id_evolucaoproaq_fase_hidden = document.getElementById('id_evolucaoproaq_fase_hidden')
    const id_evolucaoproaq_data_saida_hidden = document.getElementById('id_evolucaoproaq_data_saida_hidden')
    const modal_evolucao_proaq_ficha = new bootstrap.Modal(document.getElementById('proaqEvolucaoFicha'))
    const evolucao_data_inicio = document.getElementById('id_evolucaoproaq_data_inicio')
    const evolucao_data_fim = document.getElementById('id_evolucaoproaq_data_fim')
    const fase_evolucao_dias = document.getElementById('id_evolucaoproaq_dias')

    botao_inserir_evolucao.addEventListener('click', function(){
        
        if(verificar_inserir_evolucao_proaq()){
            var maior_fase = maior_numero_fase_evolucao_proaq()
            var maior_data = obter_data_saida_por_numero(maior_fase)

            limpar_dados_modal_evolucao_proaq();
            id_evolucaoproaq_proaq_hidden.value = proaq_id
            indicar_fase_evolucao_nova(maior_fase);
            
            if(maior_data){
                id_evolucaoproaq_data_saida_hidden.value = maior_data
                evolucao_data_inicio.value = converterDataParaFormatoInternacional(maior_data)
            }
            
            modal_evolucao_proaq_ficha.show()
        }
    })

    function verificar_inserir_evolucao_proaq(){
        var numero_fase = maior_numero_fase_evolucao_proaq()

        if(numero_fase == 6){
            sweetAlert('Não há mais fases a serem inseridas!')
            return false
        }

        if(obter_data_saida_por_numero(numero_fase) == '-'){
            sweetAlert('Informe a Data de Saída da fase atual!')
            return false
        }

        return true

    }

    const fase_evolucao_numero = document.getElementById('id_evolucaoproaq_fase_numero');
    const fase_evolucao = document.getElementById('id_evolucaoproaq_fase');

    fase_evolucao.addEventListener('change', function() {
        const numeroFase = fase_evolucao.value.replace('fase', '');
        fase_evolucao_numero.value = numeroFase;
    });

    function indicar_fase_evolucao_nova(maior_fase){
        var fase_numero = maior_fase + 1
        var fase = 'fase' + fase_numero
        fase_evolucao.value = fase
        id_evolucaoproaq_fase_hidden.value = fase
        fase_evolucao_numero.value = fase_numero
    }

    evolucao_data_inicio.addEventListener('change', function(){
        
        if (fase_evolucao_numero.value > 1){
            verificar_data_inicio_ultima_data_saida();
            return
        }
        
        if (evolucao_data_inicio.value != '' && evolucao_data_fim.value != ''){
            verificar_datas_fases_evolucao();           
        }
        total_dias_fase_evolucao(); 
    });

    function verificar_data_inicio_ultima_data_saida(){
        var data_fim_ultima_fase = converterDataParaFormatoInternacional(id_evolucaoproaq_data_saida_hidden.value)
        
        if (evolucao_data_inicio.value < data_fim_ultima_fase){
            sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Entrada</span> <span style="font-weight:bold; color:red">não pode ser MENOR</span> que a <span style="font-weight:bold">Data de Saída</span> da Fase Anterior!</span>')
            evolucao_data_inicio.value = ''
            evolucao_data_fim.value = ''
            fase_evolucao_dias.value = 0
        }

    }

    evolucao_data_fim.addEventListener('change', function(){
        if (evolucao_data_inicio.value == ''){
            sweetAlert('<span style="font-weight:normal">Informe a <span style="font-weight:bold; color:red;">Data de Entrada</span>!</span>')
            evolucao_data_fim.value = ''
        }

        if (evolucao_data_inicio.value != '' && evolucao_data_fim.value != ''){
            verificar_datas_fases_evolucao();
            verificar_data_fim_fases_evolucao();
        }
        total_dias_fase_evolucao();
    });

    function verificar_datas_fases_evolucao(){
        if (evolucao_data_inicio.value > evolucao_data_fim.value){
            sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Saída</span> <span style="font-weight:bold; color:red">não pode ser MAIOR</span> que a <span style="font-weight:bold">Data de Entrada</span>!</span>')
            evolucao_data_fim.value = ''
        }
    }

    function total_dias_fase_evolucao(){
        var dias = 0;
        var data_inicio = new Date(evolucao_data_inicio.value);
        var data_fim = evolucao_data_fim.value;
        
        if (data_fim === '') {
            data_fim = new Date();
        } else {
            data_fim = new Date(data_fim);
        }
        
        var diferencaTempo = data_fim - data_inicio; // Diferença em milissegundos
        dias = diferencaTempo / (1000 * 3600 * 24); // Converte milissegundos em dias
        fase_evolucao_dias.value = dias.toFixed(0); // Arredonda para o número inteiro mais próximo
    }
    
    function verificar_data_fim_fases_evolucao(){

        var hoje = new Date();
        hoje.setHours(0,0,0,0);

        var dataFim = new Date(evolucao_data_fim.value);

        if (dataFim > hoje) {
            sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Saída</span> <span style="font-weight:bold; color:red">não pode ser MAIOR</span> que a <span style="font-weight:bold">Data Atual</span>!</span>')
            evolucao_data_fim.value = ''
        }
    }

    //Salvar Evolução
    const botao_salvar_evolucao_proaq = document.getElementById('botaoSalvarEvolucaoProaq')
    const proaq_evolucao_id = document.getElementById('proaq_evolucao_id').value
    botao_salvar_evolucao_proaq.addEventListener('click', function(event){
        event.preventDefault();
        salvarEvolucaoProcessoAquisitivo();
    })

    function salvarEvolucaoProcessoAquisitivo() {
        const evolucao_id = document.getElementById('proaq_evolucao_id')
        
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_evolucao_proaq()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (evolucao_id.value == '') {
                postURL = '/proaq/ficha/evolucao/nova/'
            } else
            {
                postURL = `/proaq/ficha/evolucao/${evolucao_id.value}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('evolucaoProaqForm'));
    
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
                let id_evolucao_proaq = data.id_evolucao_proaq;
                localStorage.setItem('evolucaoProaqSalvo', 'true');
                localStorage.setItem('id_evolucao_proaq', id_evolucao_proaq);
                window.location.href = data.redirect_url;
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

    function verificar_campos_evolucao_proaq() {
        const campos = [
            { id: 'id_evolucaoproaq_fase', mensagem: 'Informe a <b>Fase</b>!' },
            { id: 'id_evolucaoproaq_data_inicio', mensagem: 'Informe a <b>Data de Início</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '') {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);
    
        if (mensagensErro.length > 0) {
            const campos = mensagensErro.join('<br>')
            sweetAlertPreenchimento(campos)
            return false;
        }
    
        return true;
    }

    function limpar_dados_modal_evolucao_proaq(){

        //log
        document.getElementById('proaq_evolucao_id').value = ''
        document.getElementById('proaq_evolucao_log_data_registro').value = ''
        document.getElementById('proaq_evolucao_log_responsavel_registro').value = ''
        document.getElementById('proaq_evolucao_log_ult_atualizacao').value = ''
        document.getElementById('proaq_evolucao_log_responsavel_atualizacao').value = ''
        document.getElementById('proaq_evolucao_log_edicoes').value = ''

        //dados do item
        document.getElementById('id_evolucaoproaq_fase_numero').value = ''
        document.getElementById('id_evolucaoproaq_fase').value = ''
        document.getElementById('id_evolucaoproaq_data_inicio').value = ''
        document.getElementById('id_evolucaoproaq_data_fim').value = ''
        document.getElementById('id_evolucaoproaq_dias').value = ''
        document.getElementById('id_evolucaoproaq_observacoes').value = ''

        //campos ocultos
        document.getElementById('id_evolucaoproaq_proaq_hidden').value = ''
        document.getElementById('id_evolucaoproaq_fase_hidden').value = ''
        document.getElementById('id_evolucaoproaq_data_saida_hidden').value = ''
    }

    function openModalEvolucaoProaq(id_proaq_evolucao) {
        fetch(`/proaq/buscar_evolucao_proaq/${id_proaq_evolucao}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da Evolução do Processo Aquisitivo.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                //log
                $('#proaq_evolucao_id').val(data.id);
                $('#proaq_evolucao_log_data_registro').val(data.log_data_registro);
                $('#proaq_evolucao_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#proaq_evolucao_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#proaq_evolucao_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#proaq_evolucao_log_edicoes').val(data.log_edicoes);

                //dados do item
                $('#id_evolucaoproaq_fase_numero').val(data.fase_numero);
                $('#id_evolucaoproaq_fase').val(data.fase);
                $('#id_evolucaoproaq_fase_hidden').val(data.fase);
                $('#id_evolucaoproaq_data_inicio').val(data.data_entrada);
                $('#id_evolucaoproaq_data_fim').val(data.data_saida);
                $('#id_evolucaoproaq_observacoes').val(data.observacoes);

                //id proaq
                $('#id_evolucaoproaq_proaq_hidden').val(proaq_id)
                
                var maior_fase = maior_numero_fase_evolucao_proaq()
                var maior_data = obter_data_saida_por_numero(maior_fase)
                $('#id_evolucaoproaq_maior_fase_hidden').val(maior_fase);
                $('#id_evolucaoproaq_data_saida_hidden').val(maior_data);
                

                // Abrir o modal
                modal_evolucao_proaq_ficha.show();
                total_dias_fase_evolucao();

                
            })
            .catch(error => {
                console.log(error);
            });
    }


    //fechar
    document.querySelectorAll('.closeModalButtonFichaEvolucaoProaq').forEach(button => {
        button.addEventListener('click', function() {
            $('#proaqEvolucaoFicha').modal('hide');
            modal_evolucao_proaq.show()
        });
    });

    //Abrir Evolução do Processo Aquisitivo
    const tabela_evolucao_proaq = document.getElementById('tabEvolucaoProaq')
    tabela_evolucao_proaq.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          const evolucao_proaq_id = row.dataset.id;
          limpar_dados_modal_evolucao_proaq();
          modal_evolucao_proaq.hide();
          openModalEvolucaoProaq(evolucao_proaq_id);
        }
    });

    function maior_numero_fase_evolucao_proaq(){
        let maiorNumero = 0;

        // Verificar se a tabela existe
        if (tabela_evolucao_proaq) {
            const elementosNumero = tabela_evolucao_proaq.querySelectorAll('.col-evolucao-numero');
            
            elementosNumero.forEach(function(td) {
                const numero = parseInt(td.textContent);
                if (!isNaN(numero) && numero > maiorNumero) {
                    maiorNumero = numero;
                }
            });
        }

        return maiorNumero;
    }

    function obter_data_saida_por_numero(numeroFase) {
        const tabela_evolucao_proaq = document.getElementById('tabEvolucaoProaq');
    
        if (tabela_evolucao_proaq) {
            const linhas = tabela_evolucao_proaq.querySelectorAll('tbody tr');
            
            for (let tr of linhas) {
                const numeroCelula = tr.querySelector('.col-evolucao-numero');
                const dataSaidaCelula = tr.querySelector('.col-evolucao-data-saida'); // Substitua pela classe correta da coluna de data de saída
    
                if (numeroCelula) {
                    const numero = parseInt(numeroCelula.textContent);
                    if (!isNaN(numero) && numero === numeroFase) {
                        return dataSaidaCelula ? dataSaidaCelula.textContent.trim() : null;
                    }
                }
            }
        }
    
        return null; // Retorna null se não encontrar a fase ou a tabela não existir
    }


    //Deletar Evolução do Processo Aquisitivo
    const botao_deletar_evolucao_proaq = document.getElementById('btnDeletarEvolucaoProaq')
    botao_deletar_evolucao_proaq.addEventListener('click', function() {

        const evolucao_fase_id = document.getElementById('proaq_evolucao_id').value

        const proaq_id = document.getElementById('id_proaq').value
        const url_apos_delete = "/proaq/ficha/dadosgerais/" + proaq_id  + "/";
        
        //Trata-se de um novo registro que ainda não foi salvo
        if (!evolucao_fase_id) { 
            modal_evolucao_proaq_ficha.hide()
            modal_evolucao_proaq.show()
            return;
        }

        //Verificar se a fase do evolução
        const maior_fase_proaq = parseInt(document.getElementById('id_evolucaoproaq_maior_fase_hidden').value)
        const fase_proaq_ficha = parseInt(document.getElementById('id_evolucaoproaq_fase_numero').value)

        if (maior_fase_proaq > fase_proaq_ficha) {
            sweetAlert("Não é possível deletar essa fase pois existe uma fase posterior já registrada!")
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar Fase do Processo Aquisitivo."
        const url_delete = "/proaq/ficha/evolucao/deletar/" + evolucao_fase_id + "/"
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })
    

    const botao_mostrar_modal_evolucao_info = document.getElementById('botao_modal_evolucao_proaq_info')
    const modal_evolucao_proaq_fase = new bootstrap.Modal(document.getElementById('proaqEvolucaoInfoModal'))
    botao_mostrar_modal_evolucao_info.addEventListener('click', function(){
        modal_evolucao_proaq_fase.show()
    })

    document.querySelectorAll('.evolucao-fase').forEach(button => {
        button.addEventListener('click', function() {
            var id_proaq_fase = this.getAttribute('data-value')

            if(id_proaq_fase != 'None'){
                openModalEvolucaoProaq(this.getAttribute('data-value'));
            } else {
                sweetAlert('Fase não iniciada!')
            }
            
        });
    });
    



    //TRAMITAÇÕES
    const modal_tramitacao_proaq = new bootstrap.Modal(document.getElementById('tramitacaoModal'))
    const id_proaq_tramitacao_hidden = document.getElementById('id_proaq_hidden')
    const botao_inserir_tramitacao = document.getElementById('btnNovaTramitacao')
    const maior_data_tramitacao = document.getElementById('ultima_data_tramitacao')
    botao_inserir_tramitacao.addEventListener('click', function(){
        if (verificaDataSaidaVazio()){
            sweetAlert('<span style="font-weight:normal">Informe a última <span style="font-weight:bold">Data de Saída</span> antes de registrar uma nova tramitação.</span>')
            return
        }
        
        limpar_modal_tramitacao()
        
        maior_data_tramitacao.value = maiorDataSaidaTramitacao()
        document.getElementById('id_tramitacao_data_entrada').value = maiorDataSaidaTramitacao()
        
        id_proaq_tramitacao_hidden.value = proaq_id
        modal_tramitacao_proaq.show()
    })


    const tramitacao_etapa = document.getElementById('id_tramitacaoproaq_etapa')
    const tramitacao_etapa_outra = document.getElementById('id_tramitacaoproaq_etapa_processo_outro')
    const tramitacao_outra_checkbox = document.getElementById('id_tramitacao_outra_etapa_checkbox')

    tramitacao_outra_checkbox.addEventListener('change', function() {
        if (tramitacao_outra_checkbox.checked) {
            tramitacao_etapa.value = ''
            tramitacao_etapa.setAttribute('disabled', 'disabled')
            tramitacao_etapa_outra.removeAttribute('readonly');
            tramitacao_etapa_outra.value = ''
        } else {
            tramitacao_etapa.value = ''
            tramitacao_etapa.removeAttribute('disabled')
            tramitacao_etapa_outra.value = ''
            tramitacao_etapa_outra.setAttribute('readonly', 'true');
        }
    });

    function verificar_se_ha_outra_etapa(){
        if (tramitacao_etapa_outra.value != '') {
            var event = new Event('change');
            var outra_etapa = tramitacao_etapa_outra.value
            tramitacao_outra_checkbox.checked = true;
            tramitacao_outra_checkbox.dispatchEvent(event);
            tramitacao_etapa_outra.value = outra_etapa
        }    
    }
    verificar_se_ha_outra_etapa();


    const tramitacao_data_entrada = document.getElementById('id_tramitacao_data_entrada')
    const tramitacao_previsao_saida = document.getElementById('id_tramitacao_data_previsao')
    const tramitacao_data_saida = document.getElementById('id_tramitacao_data_saida')
    const tramitacao_dias_setor = document.getElementById('id_tramitacao_dias_setor')


    function datas_tramitacao() {
        var data_entrada = new Date(tramitacao_data_entrada.value);
        var data_saida = new Date(tramitacao_data_saida.value);
        var data_hoje = new Date(); // Supõe que 'today' seja a data atual

        // Verifica se data_saida é vazia
        if (data_saida == 'Invalid Date') {
            var diferencaTempo = data_hoje.getTime() - data_entrada.getTime();
        } else {
            var diferencaTempo = data_saida.getTime() - data_entrada.getTime();
        }
    
        // Calcula a diferença em dias
        var diferencaDias = diferencaTempo / (1000 * 3600 * 24);
        tramitacao_dias_setor.value = parseInt(diferencaDias);
    }
    
    function data_menor_ultima_tramitacao() {
        var ultimaDataTramitacaoTexto = document.getElementById('ultima_data_tramitacao').value;
        var dataEntradaTexto = tramitacao_data_entrada.value;
    
        if (ultimaDataTramitacaoTexto && dataEntradaTexto) {
            var ultimaDataTramitacao = new Date(ultimaDataTramitacaoTexto);
            var dataEntrada = new Date(dataEntradaTexto);

            if (dataEntrada < ultimaDataTramitacao) {
                sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Entrada</span> <span style="font-weight:bold; color:red">não pode ser MENOR</span> que a <span style="font-weight:bold">Última Data de Saída</span>!</span>');
                tramitacao_data_entrada.value = '';
                return;
            }
        }
    }
    

    tramitacao_data_entrada.addEventListener('change', function(){        
        if (tramitacao_data_entrada.value != ''){
            data_entrada_saida();
            datas_tramitacao();
            data_menor_ultima_tramitacao();
        }
    })



    tramitacao_previsao_saida.addEventListener('change', function(){        
        if (tramitacao_data_entrada.value != ''){
            data_entrada_saida();
            datas_tramitacao();
        }
    })

    tramitacao_data_saida.addEventListener('change', function(){        
        if (tramitacao_data_entrada.value != ''){
            data_entrada_saida();
            datas_tramitacao();
        }
    })


    function limpar_modal_tramitacao(){
        //log
        $('#id_tramitacao').val('')
        $('#tramitacao_log_data_registro').val('')
        $('#tramitacao_log_responsavel_registro').val('')
        $('#tramitacao_lot_ult_atualizacao').val('')
        $('#tramitacao_log_responsavel_atualizacao').val('')
        $('#tramitacao_log_edicoes').val('')

        //dados da tramitação
        $('#id_tramitacaoproaq_documento_sei').val('')
        $('#id_tramitacaoproaq_etapa').val('')
        $('#id_tramitacaoproaq_setor').val('')
        $('#id_tramitacaoproaq_etapa_processo_outro').val('')

        //datas
        $('#id_tramitacao_data_entrada').val('')
        $('#id_tramitacao_data_previsao').val('')
        $('#id_tramitacao_data_saida').val('')
        $('#id_tramitacao_dias_setor').val('')

        //observações
        $('#tramitacao_observacoes').val('')
    }
    
    function data_entrada_saida(){
        var data_entrada = new Date(tramitacao_data_entrada.value);
        var data_previsao = new Date(tramitacao_previsao_saida.value);
        var data_saida = new Date(tramitacao_data_saida.value);

        if (data_entrada != '' && data_previsao != '' && data_saida != ''){
            
            if (data_saida < data_entrada){
                sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Saída</span> <span style="font-weight:bold; color:red">não pode ser MENOR</span> que a <span style="font-weight:bold">Data de Entrada</span>!</span>')
                tramitacao_data_saida.value = ''
                return
            }

            if (data_previsao < data_entrada){
                sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Previsão de Saída</span> <span style="font-weight:bold; color:red">não pode ser MENOR</span> que a <span style="font-weight:bold">Data de Entrada</span>!</span>')
                tramitacao_previsao_saida.value = ''
            }
            
        }
    }

    const botao_salvar_tramitacao = document.getElementById('btnSalvarTramitacao')
    botao_salvar_tramitacao.addEventListener('click', function(event){
        event.preventDefault();
        salvarTramitacaoProaq();
    })
    
    function salvarTramitacaoProaq() {
        const id_tramitacao_modal = document.getElementById('id_tramitacao')
        
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_tramitacao_proaq()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (id_tramitacao_modal.value == '') {
                postURL = '/proaq/ficha/tramitacoes/nova/'
            } else
            {
                postURL = `/proaq/ficha/tramitacoes/salvar/${id_tramitacao_modal.value}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('proaqTramitacaoForm'));
    
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
                let id_proaq_tramitacao = data.id_tramitacao_proaq;
                localStorage.setItem('tramitacaoProaqSalvo', 'true');
                localStorage.setItem('id_proaq_tramitacao', id_proaq_tramitacao);
                window.location.href = data.redirect_url;
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

    function verificar_campos_tramitacao_proaq() {
        const campos = [
            { id: 'id_tramitacaoproaq_documento_sei', mensagem: 'Informe o <b>Documento SEI</b>!' },
            { id: 'id_tramitacaoproaq_setor', mensagem: 'Informe a <b>Área do MS/Fornecedor</b>!' },
            { id: 'id_tramitacao_data_entrada', mensagem: 'Informe a <b>Data da Entrada</b>!' },
            { id: 'id_tramitacao_data_previsao', mensagem: 'Informe a <b>Previsão de Saída</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '') {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);

        const mensagem_etapa = 'Informe a <b>Etapa do Processo</b>!'
        const tramitacao_proaq_etapa = document.getElementById('id_tramitacaoproaq_etapa')
        const tramitacao_proaq_etapa_outro = document.getElementById('id_tramitacaoproaq_etapa_processo_outro')
        if (tramitacao_proaq_etapa.value == '' && tramitacao_proaq_etapa_outro.value == ''){
            mensagensErro.push(mensagem_etapa);
        }
    
        if (mensagensErro.length > 0) {
            const campos = mensagensErro.join('<br>')
            sweetAlertPreenchimento(campos)
            return false;
        }
    
        return true;
    }

    function openModalTramitacao(id_tramitacao_item) {
        fetch(`/proaq/buscar_tramitacao_proaq/${id_tramitacao_item}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da Tramitação do Processo Aquisitivo.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                //log
                $('#id_tramitacao').val(data.id);
                $('#tramitacao_log_data_registro').val(data.log_data_registro);
                $('#tramitacao_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#tramitacao_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#tramitacao_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#tramitacao_log_edicoes').val(data.log_edicoes);

                //dados da tramitação
                $('#id_tramitacaoproaq_documento_sei').val(data.documento_sei);
                $('#id_tramitacaoproaq_setor').val(data.setor);
                $('#id_tramitacaoproaq_etapa').val(data.etapa_processo);
                $('#id_tramitacaoproaq_etapa_processo_outro').val(data.etapa_processo_outro);
                if (data.etapa_check_outro) {
                    $('#id_tramitacao_outra_etapa_checkbox').prop('checked', true);
                    $('#id_tramitacaoproaq_etapa').prop('disabled', true);
                    $('#id_tramitacaoproaq_etapa_processo_outro').prop('readonly', false);
                } else {
                    $('#id_tramitacao_outra_etapa_checkbox').prop('checked', false);
                    $('#id_tramitacaoproaq_etapa').prop('disabled', false);
                    $('#id_tramitacaoproaq_etapa_processo_outro').prop('readonly', true);
                }
                
                
                
                
                
                
                //datas
                $('#id_tramitacao_data_entrada').val(data.data_entrada);
                $('#id_tramitacao_data_previsao').val(data.data_previsao);
                $('#id_tramitacao_data_saida').val(data.data_saida);

                //observações
                $('#tramitacao_observacoes').val(data.observacoes);

                //id proaq
                $('#id_proaq_tramitacao_hidden').val(proaq_id)
                
                //ID Proaq
                id_proaq_tramitacao_hidden.value = proaq_id

                //Dias no setor
                datas_tramitacao()

                // Abrir o modal
                modal_tramitacao_proaq.show();


            })
            .catch(error => {
                console.log(error);
            });
    }

    //Abrir Tramitação do Processo Aquisitivo
    const tabela_tramitacoes = document.getElementById('tabTramitacoes')
    tabela_tramitacoes.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          const proaq_tramitacao_id = row.dataset.id;
          limpar_modal_tramitacao();
          openModalTramitacao(proaq_tramitacao_id);
        }
    });

    function maiorDataSaidaTramitacao() {

        let maiorData = new Date(0); // Data inicial para comparação (1 de janeiro de 1970)
    
        for (const linha of tabela_tramitacoes.rows) {
            const celulaDataSaida = linha.querySelector('#tramitacao_data_saida');
            if (celulaDataSaida) {
                const dataTexto = celulaDataSaida.textContent.trim();
    
                // Ignorar células sem data ou com texto 'NI'
                if (dataTexto !== '' && dataTexto !== 'NI') {
                    const dataSaida = new Date(dataTexto.split('/').reverse().join('-'));
    
                    if (dataSaida > maiorData) {
                        maiorData = dataSaida;
                    }
                }
            }
        }

        // Verifica se a maior data é válida antes de retornar
        return maiorData > new Date(0) ? formatarData(maiorData) : null;
    }
    
    function verificaDataSaidaVazio() {
        const tabela = document.getElementById('tabTramitacoes');
    
        for (const linha of tabela.rows) {
            const celulaDataSaida = linha.querySelector('#tramitacao_data_saida');
            if (celulaDataSaida && celulaDataSaida.textContent.trim() === '-') {
                return true; // Encontrou uma data de saída com "-"
            }
        }
    
        return false; // Não encontrou nenhuma data de saída com "-"
    }
    
    //Deletar Evolução do Processo Aquisitivo
    const botao_deletar_tramitacao = document.getElementById('btnDeletarTramitacao')
    botao_deletar_tramitacao.addEventListener('click', function() {

        const tramitacao_id = document.getElementById('id_tramitacao').value
        const url_apos_delete = "/proaq/ficha/dadosgerais/" + proaq_id  + "/";
        
        //Trata-se de um novo registro que ainda não foi salvo
        if (!tramitacao_id) { 
            modal_tramitacao_proaq.hide()
            return;
        }

        //parâmetros para deletar
        const mensagem = "Deletar Tramitação do Processo Aquisitivo."
        const url_delete = "/proaq/ficha/tramitacoes/deletar/" + tramitacao_id + "/"

        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })



    //RELATÓRIO
    const botao_relatorio = document.getElementById('btnProaqRelatorio')
    botao_relatorio.addEventListener('click', function(){

        if (proaq_id == '') {
            sweetAlert('Não há dados!', 'warning')
            return
        }
        
        var width = 1000;
        var height = 700;
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        
        var url = '/proaq/relatorio/dadosgerais/' + proaq_id + '/';
        window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    })

});