document.addEventListener("DOMContentLoaded", function() {
    //Componentes
    const data_publicacao = document.getElementById('data_publicacao')
    const data_vigencia = document.getElementById('data_vigencia')
    const prazo_vigencia = document.getElementById('prazo_vigencia')
    
    //Atualizar data de vigência e prazo
    data_publicacao.addEventListener('change', atualizarDatas);

    function atualizarDatas() {
        if (data_publicacao.value) {
            // Calcula a data de vigência (data_publicacao + 365 dias)
            let dataPublicacao = new Date(data_publicacao.value);
            let dataVigencia = new Date(dataPublicacao);
            dataVigencia.setDate(dataVigencia.getDate() + 365);

            // Formata a data de vigência para o formato apropriado (YYYY-MM-DD)
            let dataVigenciaFormatada = dataVigencia.toISOString().split('T')[0];
            data_vigencia.value = dataVigenciaFormatada;

            // Calcula o prazo de vigência (data_vigencia - data_atual)
            let dataAtual = new Date();
            let prazoVigencia = Math.round((dataVigencia - dataAtual) / (1000 * 60 * 60 * 24)) + 1;
            prazo_vigencia.value = prazoVigencia;
        } else {
            // Limpa os campos se a data de publicação estiver vazia
            data_vigencia.value = '';
            prazo_vigencia.value = '';
        }
    }
    
    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('showSuccessMessage') === 'true') {
        sweetAlert('Contrato salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('showSuccessMessage');
        atualizarDatas();
    }
    if (localStorage.getItem('objetosInseridos') === 'true') {
        sweetAlert('Itens da ARP vinculados com sucesso!', 'success', 'top-end');
        localStorage.removeItem('objetosInseridos');
        atualizarDatas();
    }
    if (localStorage.getItem('objetoSalvoSucesso') === 'true') {
        sweetAlert('Objeto salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('objetoSalvoSucesso');
    }
    if (localStorage.getItem('ParcelaSalva') === 'true') {
        sweetAlert('Parcela salva com sucesso!', 'success', 'top-end');
        let idParcela = localStorage.getItem('id_parcela');
        localStorage.removeItem('ParcelaSalva');
        if (idParcela) {
            localStorage.removeItem('id_parcela');
            openModalParcela(idParcela)
        }
    }
    if (localStorage.getItem('EntregaSalva') === 'true') {
        sweetAlert('Entrega salva com sucesso!', 'success', 'top-end');
        let idEntrega = localStorage.getItem('id_entrega');
        localStorage.removeItem('EntregaSalva');
        if (idEntrega) {
            localStorage.removeItem('id_entrega');
            openModalEntrega(idEntrega)
        }
    }

    //Componentes
    const unidadeDaf = document.getElementById('ct_unidade_daf')
    const unidadeDaf_display = document.getElementById('ct_unidade_daf_display') 
    const modalidadeAquisicao = document.getElementById('ct_modalidade_aquisicao')
    const modalidadeAquisicao_display = document.getElementById('ct_modalidade_aquisicao_display')
    const arp = document.getElementById('ct_arp')
    const arp_display = document.getElementById('ct_arp_display')
    const denominacaoGenerica = document.getElementById('ct_denominacao')
    const denominacaoGenerica_display = document.getElementById('ct_denominacao_display')
    const fornecedor = document.getElementById('ct_fornecedor')
    const fornecedor_display = document.getElementById('ct_fornecedor_display')
    const processoSei = document.getElementById('ct_processo_sei')
    const lei_licitacao = document.getElementById('ct_lei_licitacao')
    const lei_licitacao_valor = document.getElementById('ct_lei_licitacao_valor')
    const botao_salvar_contrato = document.getElementById('btnSalvarContrato')
    const contrato_id = document.getElementById('id_contrato').value
    const botao_deletar_contrato = document.getElementById('btnDeletarContrato')
    const botao_novo_objeto = document.getElementById('btnNovoObjeto')
    const botao_vincular_itens_arp = document.getElementsByClassName('swal2-confirm swal2-styled swal2-default-outline')
    const botao_nova_parcela = document.getElementById('btnNovaParcela')
    const modal_parcela = new bootstrap.Modal(document.getElementById('contratoParcelaModal'))
    const modal_inserir_objeto = new bootstrap.Modal(document.getElementById('contratoObjetoModal'))
    const modal_parcela_objeto = new bootstrap.Modal(document.getElementById('contratoParcelaObjeto'))
    const tabela_objetos_contrato = document.getElementById('tabObjetosContrato')
    const botao_salvar_objeto = document.getElementById('btnSalvarObjeto')
    const objeto_valor_unitario = document.getElementById('ctobjeto_valor_unitario')
    const objeto_produto = document.getElementById('ctobjeto_produto')
    const objeto_produto_hidden = document.getElementById('ctobjeto_produto_hidden')
    const botao_deletar_objeto = document.getElementById('btnDeletarObjeto')
    const objeto_numero_item = document.getElementById('ctobjeto_numero_item')
    const objeto_id = document.getElementById('objeto_id')
    const selecionar_objeto_parcela = document.getElementById('parcela_selecionar_objeto')
    const parcela_objeto_id = document.getElementById('parcela_objeto_id')
    const parcela_qtd_contratada = document.getElementById('id_parcela_qtd_contratada')
    const parcela_numero = document.getElementById('id_numero_parcela')
    const botao_inserir_nova_parcela = document.getElementById('inserirNovaParcela')
    const botao_salvar_parcela = document.getElementById('botaoSalvarParcela')
    const tabela_parcelas_contrato = document.getElementById('tabContratoParcelas')
    const botao_nova_entrega = document.getElementById('btnNovaEntrega')
    const modal_entrega = new bootstrap.Modal(document.getElementById('contratoEntregaModal'))
    const entrega_qtd_entregue = document.getElementById('id_entrega_qtd_entregue')
    const modal_entrega_parcela = new bootstrap.Modal(document.getElementById('contratoEntregaParcela'))
    const botao_inserir_nova_entrega = document.getElementById('inserirNovaEntrega')
    const selecionar_parcela_entrega = document.getElementById('entrega_selecionar_parcela')

    //Carregar dados
    carregarDados();
    
    
    //Formatação dos dados
    $('#ct_processo_sei').mask('00000.000000/0000-00');
    $('#ct_documento_sei').mask('000000');
    formatoQuantidade(entrega_qtd_entregue)

    //Dados da ARP
    arp_display.addEventListener('click', function() {
        
        var arp_numero = arp.value

        if (arp_numero == '') {
            sweetAlert('Não possui ARP!', 'warning')
            return
        }
        
        var width = 700;
        var height = 300;
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        
        var url = '/contratos/ficha-arp/' + arp_numero + '/';
        window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    })

    //Lei de Licitação
    lei_licitacao.addEventListener('change', leiLicitacao)

    //Salvar Contrato 
    botao_salvar_contrato.addEventListener('click', function(event){
        event.preventDefault();
        salvarContrato();
    })

    //Deletar Contrato
    botao_deletar_contrato.addEventListener('click', deletarContrato)
    
    //Inserir Objeto
    botao_novo_objeto.addEventListener('click', inserir_objeto)

    //Abrir Objeto
    tabela_objetos_contrato.addEventListener('click', function(event) {
      const target = event.target;
      if (target.tagName === 'TD') {
        const row = target.closest('tr');
        const objeto_id = row.dataset.id;
        carregar_lista_produtos();
        openModalObjeto(objeto_id);
        
      }
    });

    //Salvar objeto
    botao_salvar_objeto.addEventListener('click', function(e){
        e.preventDefault();

    
        //Verificar se ARP foi salva
        if (contrato_id == '') {
            sweetAlertPreenchimento("Salve primeiro o Contrato!");
            return
        }
        
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_objeto()
        if (preenchimento_incorreto === false) {
            return;
        }

        var csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
        
        //Enviar para o servidor
            //definir o caminho
            let objeto_id = document.getElementById('objeto_id').value;
            if (objeto_id === '') {
                postURL = '/contratos/contrato/objeto/salvar/novo/'
            } else
            {
                postURL = `/contratos/contrato/objeto/salvar/${objeto_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('objetoForm'));
            //formData.append('id_arp', id_arp);
            
            //enviar 
            fetch(postURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
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
                
                localStorage.setItem('objetoSalvoSucesso', 'true');
                window.location.reload();
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
    })

    //Formatar moeda
    objeto_valor_unitario.addEventListener('input', function(){
        valor = formatoMoeda(objeto_valor_unitario.value)
        objeto_valor_unitario.value = valor
    })

    //Produto
    objeto_produto.addEventListener('change', function() {
        var produto = objeto_produto.value
        objeto_produto_hidden.value = produto
    })

    //Deletar Objeto
    botao_deletar_objeto.addEventListener('click', function() {
        if (arp.value != ''){
            sweetAlert(
                title='Não é possível deletar este objeto pois este Contrato está vinculado a uma ARP.',
                icon='warning',
                )
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar Objeto do Contrato."
        const url_delete = "/contratos/contrato/objeto/deletar/" + objeto_id.value + "/"
        const url_apos_delete = window.location.href;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })

    // Coletar os números dos itens da tabela e armazenar no array
    var itensRegistrados = [];
    document.querySelectorAll('#tabObjetosContrato .col-item').forEach(function(td) {
        itensRegistrados.push(td.innerText.trim());
    });
    
    //Verificar Número do Item do Objeto
    objeto_numero_item.addEventListener('change', function(){
        var valorItem = this.value;

        // Verifica se o valor está fora do intervalo permitido
        if (valorItem < 1 || valorItem > 20) {
            const mensagem = 'O Número de Item da ARP deve ser entre 1 e 20!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
            return
        }

        // Verificar se o valor já existe no array de itens registrados
        if (itensRegistrados.includes(valorItem)) {
            const mensagem = 'Número do Objeto = ' + valorItem + '<br>Esse número já foi registrado!<br> Por favor, insira outro!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
        }
    });

    //Inserir Parcela - p1
    botao_nova_parcela.addEventListener('click', function(){
        if (itensRegistrados.length > 1) {
            modal_parcela_objeto.show()
        } else {
            sweetAlertPreenchimento("Informe os objetos do contrato!");
            return
        }
    });

    botao_inserir_nova_parcela.addEventListener('click', function(){
        id_objeto = document.getElementById('parcela_objeto_id').value
        
        const url = `/contratos/buscar_objeto/${id_objeto}/`;

        //campos do modal
        const id_parcela_objeto = document.getElementById('id_parcela_objeto')
        const id_objeto_item = document.getElementById('id_objeto_item')
        const id_objeto_produto = document.getElementById('id_objeto_produto')
        const id_parcela_valor_unitario = document.getElementById('id_parcela_valor_unitario')
        const id_parcela_fator_embalagem = document.getElementById('id_parcela_fator_embalagem')
        const id_qtd_saldo_arp = document.getElementById('id_qtd_saldo_arp')

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const objeto_json = data.objeto
                id_parcela_objeto.value = objeto_json.objeto_id;
                id_objeto_item.value = objeto_json.objeto_numero_item;
                id_objeto_produto.value = objeto_json.objeto_produto;
                id_parcela_fator_embalagem.value = objeto_json.objeto_fator_embalagem;
                id_parcela_valor_unitario.value = formatoMoeda(objeto_json.objeto_valor_unitario);
                id_qtd_saldo_arp.value = objeto_json.arp_item_saldo;
            })
            .catch(error => console.error('Erro ao buscar Objeto:', error));
        modal_parcela_objeto.hide();
        limpar_dados_modal_parcelas();
        modal_parcela.show();
    });

    //limpar dados do modal objeto
    function limpar_dados_modal_parcelas() {
        //logs
        document.getElementById('parcela_id').value = ''
        document.getElementById('parcela_log_data_registro').value = ''
        document.getElementById('parcela_log_responsavel_registro').value = ''
        document.getElementById('parcela_log_ult_atualizacao').value = ''
        document.getElementById('parcela_log_responsavel_atualizacao').value = ''
        document.getElementById('parcela_log_edicoes').value = ''
        
        document.getElementById('id_numero_parcela').value = ''
        document.getElementById('id_parcela_qtd_contratada').value = ''
        document.getElementById('id_parcela_qtd_a_entregar').value = ''
        document.getElementById('id_parcela_previsao_entrega').value = ''
        document.getElementById('id_parcela_valor_total').value = ''
        document.getElementById('ctobjeto_observacoes').value = ''
        
    }

    //Salvar Parcela
    botao_salvar_parcela.addEventListener('click', function(e){
        e.preventDefault();
        salvarParcela();
    })

    //Levar valor do id do objeto
    selecionar_objeto_parcela.addEventListener('change', function(){
        parcela_objeto_id.value = selecionar_objeto_parcela.value
    })

    //Formatar quantidade contratada da parcela
    parcela_qtd_contratada.addEventListener('input', function(){
        formatoQuantidade(parcela_qtd_contratada)
    })
    
    //Avaliar número da parcela
    parcela_numero.addEventListener('change', function(){
        var valorItem = this.value;

        // Verifica se o valor está fora do intervalo permitido
        if (valorItem < 1 || valorItem > 20) {
            const mensagem = 'O Número de Parcela deve ser entre 1 e 10!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
            return
        }
    })

    //Abrir Parcela
    tabela_parcelas_contrato.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          const parcela_id = row.dataset.id;
          //carregar_lista_produtos();
          openModalParcela(parcela_id);
          
        }
      });
  
    //Nova entrega
    botao_nova_entrega.addEventListener('click', function(){
        modal_entrega_parcela.show()
    })
    botao_inserir_nova_entrega.addEventListener('click', function(){
        id_parcela = document.getElementById('entrega_parcela_id').value

        const url = `/contratos/buscar_parcela/${id_parcela}/`;

        //campos do modal
        const id_entrega_item = document.getElementById('id_entrega_item')
        const id_entrega_parcela = document.getElementById('id_entrega_parcela')
        const id_entrega_contrato_hidden = document.getElementById('id_entrega_contrato_hidden')
        const id_entrega_parcela_hidden = document.getElementById('id_entrega_parcela_hidden')
        const id_entrega_numero_entrega = document.getElementById('id_entrega_numero_entrega')
        const id_entrega_produto = document.getElementById('id_entrega_produto')

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const parcela_json = data.parcela
                id_entrega_item.value = parcela_json.numero_item;
                id_entrega_parcela.value = parcela_json.numero_parcela;
                id_entrega_contrato_hidden.value = parcela_json.contrato_id;
                id_entrega_parcela_hidden.value = parcela_json.parcela_id;
                id_entrega_produto.value = parcela_json.produto;
            })
            .catch(error => console.error('Erro ao buscar Parcela:', error));

        modal_entrega_parcela.hide()
        limpar_dados_modal_entrega();
        modal_entrega.show()
    })

    //limpar dados do modal objeto
    function limpar_dados_modal_entrega() {
        //logs
        document.getElementById('id_entrega_item').value = ''
        document.getElementById('parcela_log_data_registro').value = ''
        document.getElementById('parcela_log_responsavel_registro').value = ''
        document.getElementById('parcela_log_ult_atualizacao').value = ''
        document.getElementById('parcela_log_responsavel_atualizacao').value = ''
        document.getElementById('parcela_log_edicoes').value = ''
        
        //campos
        document.getElementById('id_entrega_item').value = ''
        document.getElementById('id_entrega_parcela').value = ''
        document.getElementById('id_entrega_contrato_hidden').value = ''
        document.getElementById('id_entrega_parcela_hidden').value = ''
        document.getElementById('id_entrega_numero_entrega').value = ''
        document.getElementById('id_entrega_produto').value = ''
        document.getElementById('id_entrega_qtd_entregue').value = ''
        document.getElementById('id_parcela_previsao_entrega').value = ''
        document.getElementById('id_entrega_local_entrega').value = ''
        document.getElementById('id_entrega_notas_recebidas').value = ''
        document.getElementById('id_entrega_notas_status').value = ''
        document.getElementById('id_entrega_notas_pagamentos').value = ''
        document.getElementById('id_entrega_observacoes').value = ''
        
    }

    //Salvar Entrega
    const botao_salvar_entrega = document.getElementById('botaoSalvarEntrega') 
    botao_salvar_entrega.addEventListener('click', function(e){
        e.preventDefault();
        salvarEntrega();
    })

    function salvarEntrega() {

        const entrega_id = document.getElementById('entrega_id').value
        //const id_qtd_saldo_arp = document.getElementById('id_qtd_saldo_arp')

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_entrega()
        if (preenchimento_incorreto === false) {
            return;
        }
        
        //Verificar dupliciidade no Número da Entrega
        let duplicidade_entrega = verificar_numero_entrega_duplicidade()
        if (duplicidade_entrega == true) {
            return;
        }
        
        //Verificar Saldo a Entregar
        // if (arp.value != '') {
        //     let saldo_arp = parseFloat(id_qtd_saldo_arp.value)
        //     let qtd_contratada_str = parcela_qtd_contratada.value
        //     qtd_contratada_str = qtd_contratada_str.replace(/\./g, '');
        //     let qtd_contratada = parseFloat(qtd_contratada_str)
        //     if (qtd_contratada > saldo_arp) {
        //         sweetAlert('Saldo da ARP insuficiente!', 'warning', 'red')
        //         return
        //     }
        // }

        //Enviar para o servidor
            //definir o caminho
            if (entrega_id == '') {
                postURL = '/contratos/contrato/entrega/salvar/novo/'
            } else
            {
                postURL = `/contratos/contrato/entrega/salvar/${entrega_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('entregaForm'));
    
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
                    let id_entrega = data.entrega_id;
                    localStorage.setItem('EntregaSalva', 'true');
                    localStorage.setItem('id_entrega', id_entrega);
                    window.location.reload();
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

    function verificar_campos_entrega() {
        const campos = [
            { id: 'id_entrega_numero_entrega', mensagem: 'Informe o <b>Número da Entrega</b>!' },
            { id: 'id_entrega_qtd_entregue', mensagem: 'Informe a <b>Qtd Entregue</b>!' },
            { id: 'id_data_entrega', mensagem: 'Informe a <b>Data da Entrega</b>!' },
            { id: 'id_entrega_local_entrega', mensagem: 'Informe o <b>Local da Entrega</b>!'}
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '' || elemento.value == 0) {
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

    const numero_entrega = document.getElementById('id_entrega_numero_entrega')
    numero_entrega.addEventListener('change', function(){
        if (numero_entrega.value > 30) {
            sweetAlert('O número da entrega deve ser menor ou igual a 30!','warning' , 'orange')
            numero_entrega.value = ''
        }
    })

    selecionar_parcela_entrega.addEventListener('click', function(){
        document.getElementById('entrega_parcela_id').value = selecionar_parcela_entrega.value
    })

    //Funções
    function deletarContrato(){
        const url_apos_delete = "/contratos/contratos/";

        //Trata-se de um novo registro que ainda não foi salvo
        if (!contrato_id) { 
            window.location.href = url_apos_delete;
            return; // Sai da função
        }
        
        //parâmetros para deletar
        const mensagem = "Deletar Contrato."
        const url_delete = "/contratos/contrato/deletar/" + contrato_id + "/"
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    }  

    function carregarDados() {
        var unidade_daf_value = localStorage.getItem('memoria_unidadeDaf_value');
        var unidade_daf_text = localStorage.getItem('memoria_unidadeDaf_text');
        if (unidade_daf_value) {
            unidadeDaf.value = unidade_daf_value;
            unidadeDaf_display.value = unidade_daf_text;
        }

        var modalidadeAquisicao_value = localStorage.getItem('memoria_modalidadeAquisicao_value');
        var modalidadeAquisicao_text = localStorage.getItem('memoria_modalidadeAquisicao_text');
        if (modalidadeAquisicao_value) {
            modalidadeAquisicao.value = modalidadeAquisicao_value;
            modalidadeAquisicao_display.value = modalidadeAquisicao_text;
        }

        var numeroARP_value = localStorage.getItem('memoria_numeroARP_value');
        var numeroARP_text = localStorage.getItem('memoria_numeroARP_text');
        if (numeroARP_value) {
            arp.value = numeroARP_value;
            arp_display.value = numeroARP_text;
            buscarDadosSeiArp(numeroARP_value);
        } else {
            if (arp.value == '')
            arp_display.value = "Não se aplica"
        }

        var denominacao_value = localStorage.getItem('memoria_denominacao_value');
        var denominacao_text = localStorage.getItem('memoria_denominacao_text');
        if (denominacao_value) {
            denominacaoGenerica.value = denominacao_value;
            denominacaoGenerica_display.value = denominacao_text;
        }

        var fornecedor_value = localStorage.getItem('memoria_fornecedor_value');
        var fornecedor_text = localStorage.getItem('memoria_fornecedor_text');
        if (fornecedor_value) {
            fornecedor.value = fornecedor_value;
            fornecedor_display.value = fornecedor_text;
        }
        
        localStorage.clear();
    }
    
    function buscarDadosSeiArp(id_arp) {
        const url = `/contratos/arp/buscardadossei/${id_arp}/`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const arpInfo = data.arp[0]
                processoSei.value = arpInfo.numero_processo_sei;
                lei_licitacao.value = arpInfo.lei_licitacao;
                lei_licitacao_valor.value = arpInfo.lei_licitacao;
                processoSei.setAttribute('readonly', true);
                lei_licitacao.setAttribute('disabled', 'disabled');                
            })
            .catch(error => console.error('Erro ao buscar ARP:', error));
    }

    function leiLicitacao() {
        lei_licitacao_valor.value = lei_licitacao.value;
    }

    function salvarContrato() {

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_contrato()
        if (preenchimento_incorreto === false) {
            return;
        }
        
        //Enviar para o servidor
            //definir o caminho
            if (contrato_id == '') {
                postURL = '/contratos/contrato/ficha/novo/'
            } else
            {
                postURL = `/contratos/contrato/ficha/${contrato_id}/`
            }
    
            //pegar os dados
            let formData = new FormData(document.getElementById('contratoForm'));
    
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
                    sweetAlert('Contrato salvo com sucesso!', 'success', 'green')
                } else {
                    localStorage.setItem('showSuccessMessage', 'true');
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

    function verificar_campos_contrato() {
        const campos = [
            { id: 'ct_unidade_daf_display', mensagem: 'Informe a <b>Unidade DAF</b>!' },
            { id: 'ct_lei_licitacao_valor', mensagem: 'Informe a <b>Lei de Licitação</b>!' },
            { id: 'ct_processo_sei', mensagem: 'Informe o <b>Processo SEI</b>!' },
            { id: 'ct_documento_sei', mensagem: 'Informe o <b>Documento SEI</b>!' },
            { id: 'ct_numero_contrato', mensagem: 'Informe o <b>Número do Contrato</b>!' },
            { id: 'ct_status', mensagem: 'Informe o <b>Status</b>!' },
            { id: 'data_publicacao', mensagem: 'Informe a <b>Data da Publicação</b>!' },
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

    function inserir_objeto() {
        if (contrato_id == '') {
            sweetAlert('Salve o <b>Contrato</b> primeiro!', 'warning', 'orange')
            return
        }
        
        if (arp.value == '') {
            document.querySelectorAll('#contratoObjetoModal input').forEach(input => input.value = '');
            modal_inserir_objeto.show()
            modal_objeto_levar_id_contrato()
            carregar_lista_produtos()
            $('#ctobjeto_contrato_hidden').value = contrato_id
            return
        }
            
        if (tabela_objetos_contrato.rows.length == 1) {
            sweetAlertGenerico(
                title='Contrato com ARP', 
                html=(
                    '<br><p style="text-align: justify;">O presente contrato está vinculado a uma Ata de Registro de Preços.<br>' +
                    '<br>Clique em <b>"Vincular Itens da ARP"</b> para trazer os itens da ARP para este contrato.<br>' +
                    '<br>Serão vinculados todos os itens da ARP.<br>'
                    ),
                icon='info',
                iconColor='blue',
                confirmButtonText='Vincular Itens da ARP',
                confirmButtonColor='green',
                vincular_objetos)
        } else {
                sweetAlert('Itens da ARP já vinculados!', 'warning', 'orange')
            }
    }

    function vincular_objetos() {
        const url = `/contratos/vincularitensarp/${arp.value}-${contrato_id}/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                //carregarTabelaObjetosContrato(data.objetos)            
            })
            .catch(error => console.error('Erro ao vincular objetos:', error));
        
        localStorage.setItem('objetosInseridos', 'true');
        window.location.reload();
    }

    function carregarTabelaObjetosContrato(objetos) {
        tabela_objetos_contrato.empty();
        objetos.forEach(item => {
            var row = `
                <tr data-id="${ item.id }">
                    <td class="col-item">"${ item.numero_item }"</td>
                    <td class="col-produto">"${ item.produto }"</td>
                    <td class="col-parcelas">0</td>
                    <td class="col-valor">"${ item.fator_embalagem }"</td>
                    <td class="col-valor">"${ item.qtd_contratada }"</td>
                    <td class="col-valor">"0"</td>
                    <td class="col-valor">"0"</td>
                    <td class="col-valor">"${ item.valor_unitario }"</td>
                    <td class="col-valor">"${ item.valor_total }"</td>
                </tr>
            `;
            tabela_objetos_contrato.append(row);
        });
    }

    function buscarDadosItensARP(id_arp) {
        const url = `/contratos/buscararpsitens/${id_arp}/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                carregarTabelaItensARP(data.arps_itens)            
            })
            .catch(error => console.error('Erro ao buscar ARP:', error));
    }

    function carregarTabelaItensARP(itensARP) {
        var tabelaItensArp = $('.itensArp');
        tabelaItensArp.empty();
        itensARP.forEach(item => {
            var row = `
                <tr data-id-item-arp="${ item.id }">
                    <td class="col-itemarp-id">${ item.numero_item }</td>
                    <td class="col-itemarp-tipocota" style="text-transform: capitalize;">${ item.tipo_cota }</td>
                    <td class="col-itemarp-produto">${ item.produto }</td>
                    <td class="col-itemarp-qtd">${ item.qtd_registrada.toLocaleString('pt-BR') }</td>
                    <td class="col-itemarp-qtd">0</td>
                    <td class="col-itemarp-qtd">${ item.qtd_saldo.toLocaleString('pt-BR') }</td>
                </tr>
            `;
            tabelaItensArp.append(row);
        });
    }
    
    function openModalObjeto(id_objeto) {
        fetch(`/contratos/contrato/objeto/${id_objeto}/dados/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do Objeto.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                $('#objeto_id').val(data.id);
                $('#objeto_log_data_registro').val(data.log_data_registro);
                $('#objeto_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#objeto_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#objeto_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#objeto_log_edicoes').val(data.log_edicoes);
                $('#ctobjeto_numero_item').val(data.numero_item);
                $('#ctobjeto_fator_embalagem').val(data.fator_embalagem);
                let produto = data.produto;
                $('#ctobjeto_produto').val(produto);
                $('#ctobjeto_produto_hidden').val(produto);
                $('#ctobjeto_arpItem_hidden').val(data.arp_item);
                $('#ctobjeto_parcelas').val(data.numero_parcelas);
                $('#ctobjeto_valor_unitario').val(formatarComoMoeda(data.valor_unitario));
                $('#ctobjeto_qtd_contratada').val(data.qtd_contratada.toLocaleString('pt-BR'));
                $('#ctobjeto_qtd_entregue').val(data.qtd_entregue.toLocaleString('pt-BR'));
                $('#qtd_entregue').val(data.qtd_contratada.toLocaleString('pt-BR'));
                $('#ctobjeto_observacoes').val(data.observacoes);
    
                // Abrir o modal
                const modal = new bootstrap.Modal(document.getElementById('contratoObjetoModal'));
                modal.show();
                avaliar_arp_modificar_modal_objeto();
                modal_objeto_levar_id_contrato();
            })
            .catch(error => {
                console.log(error);
            });
    }

    function avaliar_arp_modificar_modal_objeto() {

        if (arp.value != '') {
            const objeto_numero_item = document.getElementById('ctobjeto_numero_item')
            const objeto_produto = document.getElementById('ctobjeto_produto')
            const objeto_valor_unitario = document.getElementById('ctobjeto_valor_unitario')

            objeto_numero_item.setAttribute('readonly', 'true')
            objeto_produto.setAttribute('disabled', 'disabled')
            objeto_valor_unitario.setAttribute('readonly', 'true')
        }
    }

    function modal_objeto_levar_id_contrato() {
        const objeto_contrato_id = document.getElementById('ctobjeto_contrato_hidden')

        objeto_contrato_id.value = contrato_id
    }

    function carregar_lista_produtos(){
        var url = '/contratos/arp/buscarprodutos/' + denominacaoGenerica.value + '/';
        $.ajax({
            url: url,
            success: function(data) {
                produtos = data;
                const selectProduto = $('#ctobjeto_produto');
                // Limpa as opções existentes
                selectProduto.empty();
                
                // Adiciona a opção padrão
                selectProduto.append('<option value="" disabled selected>Não Informado</option>');
                
                // Adiciona as opções retornadas pela requisição
                produtos.forEach(function(produto) {
                    selectProduto.append('<option value="' + produto.id + '">' + produto.produto + '</option>');
                });
                
            }
        });
    }

    function verificar_campos_objeto() {
        const campos = [
            { id: 'ctobjeto_numero_item', mensagem: 'Informe o <b>Número do Item</b>!' },
            { id: 'ctobjeto_fator_embalagem', mensagem: 'Informe o <b>Fator Embalagem</b> do Item!' },
            { id: 'ctobjeto_produto_hidden', mensagem: 'Informe o <b>Produto Farmacêutico</b>!' },
            { id: 'ctobjeto_valor_unitario', mensagem: 'Informe o <b>Valor Unitário</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '' || elemento.value == 0) {
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

    function salvarParcela(){
        const parcela_id = document.getElementById('parcela_id').value
        const id_qtd_saldo_arp = document.getElementById('id_qtd_saldo_arp')

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_parcela()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Verificar número do item e número da parcela
        let n_item_parcela = verificar_item_parcela()
        if (n_item_parcela == true) {
            return;
        }
        
        //Verificar Saldo ARP
        if (arp.value != '') {
            let saldo_arp = parseFloat(id_qtd_saldo_arp.value)
            let qtd_contratada_str = parcela_qtd_contratada.value
            qtd_contratada_str = qtd_contratada_str.replace(/\./g, '');
            let qtd_contratada = parseFloat(qtd_contratada_str)
            if (qtd_contratada > saldo_arp) {
                sweetAlert('Saldo da ARP insuficiente!', 'warning', 'red')
                return
            }
        }

        //Enviar para o servidor
            //definir o caminho
            if (parcela_id == '') {
                postURL = '/contratos/contrato/parcela/salvar/novo/'
            } else
            {
                postURL = `/contratos/contrato/parcela/salvar/${parcela_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('parcelaForm'));
    
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
                let id_parcela = data.parcela_id;
                localStorage.setItem('ParcelaSalva', 'true');
                localStorage.setItem('id_parcela', id_parcela);
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

    function verificar_campos_parcela() {
        const campos = [
            { id: 'id_numero_parcela', mensagem: 'Informe o <b>Número da Parcela</b>!' },
            { id: 'id_parcela_qtd_contratada', mensagem: 'Informe a <b>Qtd Contratada</b>!' },
            { id: 'id_parcela_previsao_entrega', mensagem: 'Informe a <b>Previsão de Entrega</b>!' },
        ];
    
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '' || elemento.value == 0) {
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
    
    function verificar_item_parcela() {
        
        // Coletar as combinações de item e parcela armazenar no array
        var combinacoesItensParcelas = [];
        document.querySelectorAll('#tabContratoParcelas tr').forEach(function(tr) {
            var item = tr.querySelector('.col-parcela-item').innerText.trim();
            var parcela = tr.querySelector('.col-parcela-parcela').innerText.trim();
            combinacoesItensParcelas.push(item + "-" + parcela);
        })
        
        var selectItem = document.getElementById('id_objeto_item').value;
        var selectParcela = document.getElementById('id_numero_parcela').value;

        var combinacao = selectItem.trim() + "-" + selectParcela.trim();

        if (combinacoesItensParcelas.includes(combinacao)) {
            const mensagem = "Já existe <b>PARCELA</b> com este número para este <b>ITEM</b>!";
            sweetAlertPreenchimento(mensagem);
            return true;
        }
        return false;
    }

    function verificar_numero_entrega_duplicidade() {
        
        // Coletar as combinações de item e parcela armazenar no array
        var combinacoesItensParcelasEntregas = [];
        document.querySelectorAll('#tabEntregas tr').forEach(function(tr) {
            var item = tr.querySelector('.col-numero-item').innerText.trim();
            var parcela = tr.querySelector('.col-numero-parcela').innerText.trim();
            var entrega = tr.querySelector('.col-numero-entrega').innerText.trim();
            combinacoesItensParcelasEntregas.push(item + "-" + parcela  + "-" + entrega);
        })
        
        var selectItem = document.getElementById('id_entrega_item').value;
        var selectParcela = document.getElementById('id_entrega_parcela').value;
        var selectEntrega = document.getElementById('id_entrega_numero_entrega').value;

        var combinacao = selectItem.trim() + "-" + selectParcela.trim() + "-" + selectEntrega.trim();

        if (combinacoesItensParcelasEntregas.includes(combinacao)) {
            const mensagem = "Já existe <b>ENTREGA</b> com este número para esta <b>PARCELA</b>!";
            sweetAlertPreenchimento(mensagem);
            return true;
        }
        return false;
    }

    function openModalParcela(id_parcela) {
        fetch(`/contratos/contrato/parcela/${id_parcela}/dados/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da Parcela.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                $('#parcela_id').val(data.id);
                $('#parcela_log_data_registro').val(data.log_data_registro);
                $('#parcela_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#parcela_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#parcela_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#parcela_log_edicoes').val(data.log_edicoes);
                $('#id_numero_parcela').val(data.numero_parcela);
                $('#id_objeto_item').val(data.numero_item);
                $('#id_parcela_objeto').val(data.objeto);
                let produto = data.produto;
                $('#id_objeto_produto').val(produto);
                $('#id_parcela_fator_embalagem').val(data.fator_embalagem);
                $('#id_parcela_qtd_contratada').val(data.qtd_contratada.toLocaleString('pt-BR'));
                $('#id_parcela_qtd_entregue').val(data.qtd_entregue.toLocaleString('pt-BR'));
                $('#id_parcela_qtd_a_entregar').val(data.qtd_a_entregar.toLocaleString('pt-BR'));
                $('#id_parcela_valor_unitario').val(formatarComoMoeda(data.valor_unitario));
                $('#id_parcela_valor_total').val(formatarComoMoeda(data.valor_total));
                $('#id_parcela_previsao_entrega').val(data.data_previsao_entrega);
                $('#id_parcela_ultima_entrega').val(data.data_ultima_entrega);
                $('#id_parcela_observacoes').val(data.observacoes);
    
                // Abrir o modal
                const modal = new bootstrap.Modal(document.getElementById('contratoParcelaModal'));
                modal.show();
            })
            .catch(error => {
                console.log(error);
            });
    }

    function openModalEntrega(id_entrega) {
        fetch(`/contratos/contrato/entrega/${id_entrega}/dados/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da Entrega.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                $('#parcela_id').val(data.id);
                $('#parcela_log_data_registro').val(data.log_data_registro);
                $('#parcela_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#parcela_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#parcela_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#parcela_log_edicoes').val(data.log_edicoes);
                $('#id_numero_parcela').val(data.numero_parcela);
                $('#id_objeto_item').val(data.numero_item);
                $('#id_parcela_objeto').val(data.objeto);
                let produto = data.produto;
                $('#id_objeto_produto').val(produto);
                $('#id_parcela_fator_embalagem').val(data.fator_embalagem);
                $('#id_parcela_qtd_contratada').val(data.qtd_contratada.toLocaleString('pt-BR'));
                $('#id_parcela_qtd_entregue').val(data.qtd_entregue.toLocaleString('pt-BR'));
                $('#id_parcela_qtd_a_entregar').val(data.qtd_a_entregar.toLocaleString('pt-BR'));
                $('#id_parcela_valor_unitario').val(formatarComoMoeda(data.valor_unitario));
                $('#id_parcela_valor_total').val(formatarComoMoeda(data.valor_total));
                $('#id_parcela_previsao_entrega').val(data.data_previsao_entrega);
                $('#id_parcela_ultima_entrega').val(data.data_ultima_entrega);
                $('#id_parcela_observacoes').val(data.observacoes);
    
                // Abrir o modal
                const modal = new bootstrap.Modal(document.getElementById('contratoParcelaModal'));
                modal.show();
            })
            .catch(error => {
                console.log(error);
            });
    }
});