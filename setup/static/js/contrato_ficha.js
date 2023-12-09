document.addEventListener("DOMContentLoaded", function() {
    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('showSuccessMessage') === 'true') {
        sweetAlert('Contrato salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('showSuccessMessage');
        atualizarDatas();
    }
    if (localStorage.getItem('objetosInseridos') === 'true') {
        sweetAlert('Objetos vinculados com sucesso!', 'success', 'top-end');
        localStorage.removeItem('objetosInseridos');
        atualizarDatas();
    }
    if (localStorage.getItem('objetoSalvoSucesso') === 'true') {
        sweetAlert('Objeto salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('objetoSalvoSucesso');
    }
    
    const unidadeDaf = this.getElementById('ct_unidade_daf')
    const unidadeDaf_display = this.getElementById('ct_unidade_daf_display') 
    const modalidadeAquisicao = this.getElementById('ct_modalidade_aquisicao')
    const modalidadeAquisicao_display = this.getElementById('ct_modalidade_aquisicao_display')
    const arp = this.getElementById('ct_arp')
    const arp_display = this.getElementById('ct_arp_display')
    const denominacaoGenerica = this.getElementById('ct_denominacao')
    const denominacaoGenerica_display = this.getElementById('ct_denominacao_display')
    const fornecedor = this.getElementById('ct_fornecedor')
    const fornecedor_display = this.getElementById('ct_fornecedor_display')
    const processoSei = this.getElementById('ct_processo_sei')
    const lei_licitacao = this.getElementById('ct_lei_licitacao')
    const lei_licitacao_valor = this.getElementById('ct_lei_licitacao_valor')
    const data_publicacao = this.getElementById('data_publicacao')
    const data_vigencia = this.getElementById('data_vigencia')
    const prazo_vigencia = this.getElementById('prazo_vigencia')
    const botao_salvar_contrato = this.getElementById('btnSalvarContrato')
    const contrato_id = this.getElementById('id_contrato').value
    const botao_deletar_contrato = this.getElementById('btnDeletarContrato')
    const botao_novo_objeto = this.getElementById('btnNovoObjeto')
    const botao_vincular_itens_arp = this.getElementsByClassName('swal2-confirm swal2-styled swal2-default-outline')
    const botao_nova_parcela = this.getElementById('btnNovaParcela')
    const modal_parcela = new bootstrap.Modal(document.getElementById('contratoParcelaModal'))
    const modal_inserir_objeto = new bootstrap.Modal(document.getElementById('contratoObjetoModal'))
    const modal_parcela_objeto = new bootstrap.Modal(document.getElementById('contratoParcelaObjeto'))
    const tabela_objetos_contrato = this.getElementById('tabObjetosContrato')
    const botao_salvar_objeto = this.getElementById('btnSalvarObjeto')
    const objeto_valor_unitario = document.getElementById('ctobjeto_valor_unitario')
    const objeto_produto = document.getElementById('ctobjeto_produto')
    const objeto_produto_hidden = document.getElementById('ctobjeto_produto_hidden')
    const botao_deletar_objeto = document.getElementById('btnDeletarObjeto')
    const objeto_numero_item = document.getElementById('ctobjeto_numero_item')
    const objeto_id = document.getElementById('objeto_id')
    const selecionar_objeto_parcela = document.getElementById('parcela_selecionar_objeto')
    const parcela_objeto_id = document.getElementById('parcela_objeto_id')
    const parcela_qtd_contratada = document.getElementById('id_parcela_qtd_contratada')

    //Carregar dados
    carregarDados();
    
    //Formatação dos dados
    $('#ct_processo_sei').mask('00000.000000/0000-00');
    $('#ct_documento_sei').mask('000000');

    //Atualizar data de vigência e prazo
    data_publicacao.addEventListener('change', atualizarDatas);

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
        e.preventDefault(); // Evita o envio padrão do formulário
        
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
    })

    //Inserir Parcela
    botao_nova_parcela.addEventListener('click', function(){
        //modal_parcela_objeto.show()
        modal_parcela.show()
    })

    //Levar valor do id do objeto
    selecionar_objeto_parcela.addEventListener('change', function(){
        parcela_objeto_id.value = selecionar_objeto_parcela.value
    })

    parcela_qtd_contratada.addEventListener('input', function(){
        formatoQuantidade(parcela_qtd_contratada)
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
            { id: 'ct_lei_licitacao_valor', mensagem: 'Informe a Lei de Licitação!' },
            { id: 'ct_processo_sei', mensagem: 'Informe o Processo SEI!' },
            { id: 'ct_documento_sei', mensagem: 'Informe o Documento SEI!' },
            { id: 'ct_numero_contrato', mensagem: 'Informe o Número do Contrato!' },
            { id: 'ct_status', mensagem: 'Informe o Status!' },
            { id: 'data_publicacao', mensagem: 'Informe a Data da Publicação!' },
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
                    '<br>Clique em <b>"Vincular Itens da ARP"</b> para trazer preencher os objetos do contrato.<br>' +
                    '<br>Serão vinculados todos os itens da ARP com quantidade igual a zero.<br>' +
                    '<br>Caso um dos itens não seja contratado, <b>você deverá deixar a quantidade igual a zero.</b></p><br>'
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
                carregarTabelaObjetosContrato(data.objetos)            
            })
            .catch(error => console.error('Erro ao vincular objetos:', error));
        
        localStorage.setItem('objetosInseridos', 'true');
        //window.location.reload();
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

    

});