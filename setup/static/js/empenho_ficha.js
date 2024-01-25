document.addEventListener('DOMContentLoaded', function() {

    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('empenhoSalvo') === 'true') {
        sweetAlert('Empenho Orçamentário salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('empenhoSalvo');
    }
    if (localStorage.getItem('itemEmpenhoSalvo') === 'true') {
        sweetAlert('Item do Empenho salvo com sucesso!', 'success', 'top-end');
        let idItemEmpenho = localStorage.getItem('item_empenho_id');
        localStorage.removeItem('itemEmpenhoSalvo');
        if (idItemEmpenho) {
            localStorage.removeItem('item_empenho_id');
            openModalItemEmpenho(idItemEmpenho)
        }
    }

    //Formato PROCESSO SEI e DOCUMENTO SEI
    $('#empenho_processo_sei').mask('00000.000000/0000-00');
    $('#empenho_documento_sei').mask('000000');

    const empenho_unidade_daf_display = document.getElementById('empenho_unidade_daf_display')
    const empenho_unidade_daf = document.getElementById('empenho_unidade_daf')
    empenho_unidade_daf.addEventListener('change', function(){
        empenho_unidade_daf_display.value = empenho_unidade_daf.value
    })


    const empenho_status = document.getElementById('empenho_status')
    const empenho_numero = document.getElementById('empenho_numero')
    const empenho_documento_sei = document.getElementById('empenho_documento_sei')
    const empenho_data_empenho = document.getElementById('empenho_data_empenho')

    function verificar_status_empenho(){
        if (empenho_status.value == 'empenhado' || empenho_status.value == 'cancelado'){
            empenho_numero.removeAttribute('readonly')
            empenho_data_empenho.removeAttribute('readonly')
            empenho_documento_sei.removeAttribute('readonly')
        }else{
            empenho_numero.setAttribute('readonly', 'readonly')
            empenho_numero.value = ''
            empenho_data_empenho.setAttribute('readonly', 'readonly')
            empenho_data_empenho.value = ''
            empenho_documento_sei.setAttribute('readonly', 'readonly')
            empenho_documento_sei.value = ''
        }
    }

    

    const qtd_entregue_empenho = document.getElementById('qtd_entregue_empenho').value
    const status_empenho_hidden = document.getElementById('status_empenho_hidden').value
    function avaliar_entrega_antes_mudar_status(){
        var qtd_entregue = parseFloat(qtd_entregue_empenho)
        var status_empenho = status_empenho_hidden

        if (status_empenho == 'empenhado' && qtd_entregue > 0){
            empenho_status.value = 'empenhado'
            sweetAlert('Não é possível alterar o status de um empenho com entregas já realizadas!')
            return false
        }

        return true
    }

    function avaliar_entrega_antes_deletar(){
        var qtd_entregue = parseFloat(qtd_entregue_empenho)

        if (qtd_entregue > 0){
            empenho_status.value = 'empenhado'
            sweetAlert('Não é possível deletar um empenho com entregas já realizadas!')
            return false
        }

        return true
    }

    verificar_status_empenho();
    status_cor();  
    empenho_status.addEventListener('change', function(){
         
        var avaliacao = avaliar_entrega_antes_mudar_status()
        if (avaliacao == false){
            return
        }
        status_cor(); 
        verificar_status_empenho();
        
    })

    const botao_salvar_empenho = document.getElementById('btnSalvarEmpenho')
    botao_salvar_empenho.addEventListener('click', function(e){
        e.preventDefault();
        salvar_empenho();
    })

    function salvar_empenho(){
        const empenho_id = document.getElementById('id_empenho').value

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_empenho()
        if (preenchimento_incorreto === false) {
            
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (empenho_id == '') {
                postURL = '/contratos/empenhos/ficha/novo/'
            } else
            {
                postURL = `/contratos/empenhos/ficha/${empenho_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('empenhoForm'));
    
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
                let id_empenho = data.empenho_id;
                localStorage.setItem('empenhoSalvo', 'true');
                window.location.href = `/contratos/empenhos/ficha/${id_empenho}/`
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

    function verificar_campos_empenho() {
    
        const campos = [
            { id: 'empenho_unidade_daf', mensagem: 'Informe a <b>Unidade DAF</b>!' },
            { id: 'empenho_status', mensagem: 'Informe o <b>Status do Empenho</b>!' },
            { id: 'empenho_processo_sei', mensagem: 'Informe o <b>Nº do Processo SEI</b>!' },
            { id: 'empenho_data_solicitacao', mensagem: 'Informe a <b>Data da Solicitação</b>!' },
        ];
        
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '' || elemento.value == 0) {
                mensagens.push(campo.mensagem);
            }
            return mensagens;
        }, []);

        if (empenho_status.value == 'empenhado' || empenho_status.value == 'cancelado'){
            if(empenho_numero.value == '') {
                mensagensErro.push('Informe o <b>Número do Empenho</b>!');
            }
            if(empenho_status.value == '') {
                mensagensErro.push('Informe o <b>Status do Empenho</b>!');
            }
            if(empenho_documento_sei.value == '') {
                mensagensErro.push('Informe o <b>Documento SEI do Empenho</b>!');
            }
        }
        
        if (mensagensErro.length > 0) {
            const campos = mensagensErro.join('<br>')
            sweetAlertPreenchimento(campos)
            return false;
        }
        
        return true;
    }

    const id_empenho = document.getElementById('id_empenho')
    function verificar_id_empenho(){
        if (id_empenho.value > 0){
            empenho_unidade_daf.setAttribute('disabled', 'disabled')
        }else{
            empenho_unidade_daf.removeAttribute('disabled')
        }
    }
    verificar_id_empenho()


    const botao_inserir_novo_item = document.getElementById('btnNovoItemEmpenho')
    const modal_empenho_contrato_selecionar = new bootstrap.Modal(document.getElementById('empenhoContratoItem'))
    botao_inserir_novo_item.addEventListener('click', function(){

        modal_empenho_contrato_selecionar.show()
    })

    const empenho_selecionar_contrato = document.getElementById('empenho_selecionar_contrato')
    const empenho_selecionar_parcela = document.getElementById('empenho_selecionar_parcela')
    empenho_selecionar_contrato.addEventListener('change', function(){
        buscarParcelasContrato(empenho_selecionar_contrato.value)
        empenho_selecionar_parcela.removeAttribute('disabled')
    })
    
    const empenho_parcela_qtd_a_empenhar = document.getElementById('empenho_parcela_qtd_a_empenhar')
    const empenho_parcela_id = document.getElementById('empenho_parcela_id')
    empenho_selecionar_parcela.addEventListener('change', function(){
        const selectedOption = empenho_selecionar_parcela.options[empenho_selecionar_parcela.selectedIndex];
        empenho_parcela_qtd_a_empenhar.value = selectedOption.getAttribute('data-qtd-a-empenhar');
        empenho_parcela_qtd_a_empenhar.value = parseFloat(empenho_parcela_qtd_a_empenhar.value).toLocaleString('pt-BR')
        empenho_parcela_id.value = empenho_selecionar_parcela.value
    })
    
    function buscarParcelasContrato(id_contrato) {
        const url = `/contratos/buscar_parcelas/${id_contrato}/`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                empenho_selecionar_parcela.innerHTML = '<option value=""></option>';

                data.parcelas.forEach(parcela => {
                    const option = document.createElement('option');
                    option.value = parcela.id;
                    option.textContent = parcela.detalhe;
                    option.setAttribute('data-qtd-a-empenhar', parcela.qtd_a_empenhar);
                    empenho_selecionar_parcela.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar Parcelas:', error));
    }
    
    const botao_selecionar_contrato_empenho = document.getElementById('inserirNovoItem')
    const hidden_id_empenhoItem_empenho = document.getElementById('id_empenhoItem_empenho')
    const modal_empenho_item = new bootstrap.Modal(document.getElementById('empenhoItemModal'))
    botao_selecionar_contrato_empenho.addEventListener('click', function(){

        if (empenho_selecionar_parcela.value == ''){
            sweetAlert('Selecione a Parcela!')
            return
        }
        
        if (empenho_parcela_qtd_a_empenhar.value == 0){
            sweetAlert('Não há Quantidade a ser Empenhada!')
            return
        }
        else{
            modal_empenho_contrato_selecionar.hide()

            limparDadosItemEmpenho();
            buscarDadosDaParcela();

            //
            hidden_id_empenhoItem_empenho.value = id_empenho.value

            modal_empenho_item.show()
        }
    })

    function buscarDadosDaParcela() {
        const id_parcela = document.getElementById('empenho_parcela_id').value
        const url = `/contratos/buscar_parcela/${id_parcela}/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const dados_json = data.parcela
                carregar_dados_parcela_item_empenho(dados_json)
            })
            .catch(error => console.error('Erro ao buscar Parcela:', error));
    }

    function carregar_dados_parcela_item_empenho(dados){

        //dados da parcela
        $('#id_item_contrato').val(dados.numero_contrato)
        $('#id_item_numero_item').val(dados.numero_item)
        $('#id_item_numero_parcela').val(dados.numero_parcela)
        $('#id_item_produto').val(dados.produto)

        //Parâmetros
        $('#itemEmpenho_fatorEmbalagem').val(dados.fator_embalagem)
        $('#itemEmpenho_valorUnitario').val(formatarComoMoeda(dados.valor_unitario))
        $('#itemEmpenho_qtdEmpenhar').val(dados.qtd_a_empenhar.toLocaleString('pt-BR'))
        $('#itemEmpenho_valorEmpenhar').val(formatarComoMoeda(dados.valor_a_empenhar))

        //Campos ocultos
        $('#id_empenhoItem_parcela').val(dados.parcela_id)
    }


    function limparDadosItemEmpenho(){
        //logs
        document.getElementById('item_id').value = ''
        document.getElementById('item_log_data_registro').value = ''
        document.getElementById('item_log_responsavel_registro').value = ''
        document.getElementById('item_log_ult_atualizacao').value = ''
        document.getElementById('item_log_responsavel_atualizacao').value = ''
        document.getElementById('item_log_edicoes').value = ''
        
        //dados da parcela
        document.getElementById('id_item_contrato').value = ''
        document.getElementById('id_item_numero_item').value = ''
        document.getElementById('id_item_numero_parcela').value = ''
        document.getElementById('id_item_produto').value = ''

        //Parâmetros
        document.getElementById('itemEmpenho_fatorEmbalagem').value = ''
        document.getElementById('itemEmpenho_valorUnitario').value = ''
        document.getElementById('itemEmpenho_qtdEmpenhar').value = ''
        document.getElementById('itemEmpenho_valorEmpenhar').value = ''

        //Empenho
        document.getElementById('itemEmpenho_embalagens').value = ''
        document.getElementById('itemEmpenho_qtdEmpenho').value = ''
        document.getElementById('itemEmpenho_valorEmpenho').value = ''

        //Observações
        document.getElementById('itemEmpenho_observacoes').value = ''

        //Campos ocultos
        document.getElementById('id_empenhoItem_empenho').value = ''
        document.getElementById('id_empenhoItem_parcela').value = ''
        document.getElementById('id_empenhoItem_qtd_empenhada').value = ''

    }
    
    //regras de qtd e valor do empenho
    const fator_embalagem = document.getElementById('itemEmpenho_fatorEmbalagem')
    const valor_unitario = document.getElementById('itemEmpenho_valorUnitario')
    const qtd_a_empenhar = document.getElementById('itemEmpenho_qtdEmpenhar')
    const valor_a_empenhar = document.getElementById('itemEmpenho_valorEmpenhar')
    const qtd_empenho = document.getElementById('itemEmpenho_qtdEmpenho')
    const embalagens_empenho = document.getElementById('itemEmpenho_embalagens')
    const valor_empenho = document.getElementById('itemEmpenho_valorEmpenho')
    
    qtd_empenho.addEventListener('input', function(){
        formatoQuantidade(qtd_empenho)
    })

    valor_empenho.addEventListener('input', function(){
        formatoValorMonetario('itemEmpenho_valorEmpenho'); 
    })

    qtd_empenho.addEventListener('input', function(){
        formatoQuantidade(qtd_empenho.id)
    })

    qtd_empenho.addEventListener('dblclick', function(){
        qtd_empenho.value = qtd_a_empenhar.value
        qtd_empenho_inserida()
    })

    qtd_empenho.addEventListener('change', function(){
        qtd_empenho_inserida()
    })

    valor_empenho.addEventListener('change', function(){
        valor_empenho_inserida()
    })

    valor_empenho.addEventListener('dblclick', function(){
        valor_empenho.value = valor_a_empenhar.value
        valor_empenho_inserida()
    })

    function qtd_empenho_inserida() {
        var v_fator_embalagem = transformarValorEmFloat(fator_embalagem.value);
        var v_valor_unitario = transformarValorEmFloat(valor_unitario.value);
        var v_qtd_a_empenhar = transformarValorEmFloat(qtd_a_empenhar.value);
        var v_qtd_empenho = transformarValorEmFloat(qtd_empenho.value);
        var v_embalagens_empenho = transformarValorEmFloat(embalagens_empenho.value);
        var v_valor_empenho = transformarValorEmFloat(valor_empenho.value);
        
        // Arredondar o valor para o menor valor mais próximo múltiplo do fator embalagem
        v_qtd_empenho = v_qtd_empenho / v_fator_embalagem;
        v_embalagens_empenho = Math.floor(v_qtd_empenho);
        v_qtd_empenho = v_embalagens_empenho * v_fator_embalagem;
        v_valor_empenho = v_qtd_empenho * v_valor_unitario
        
    
        // Formatação com separadores de milhar
        embalagens_empenho.value = v_embalagens_empenho.toLocaleString('pt-BR');
        qtd_empenho.value = v_qtd_empenho.toLocaleString('pt-BR');
        valor_empenho.value = formatarComoMoeda(v_valor_empenho)
    }


    function valor_empenho_inserida() {        
        var v_fator_embalagem = transformarValorEmFloat(fator_embalagem.value);
        var v_valor_unitario = transformarValorEmFloat(valor_unitario.value);
        var v_qtd_a_empenhar = transformarValorEmFloat(qtd_a_empenhar.value);
        var v_qtd_empenho = transformarValorEmFloat(qtd_empenho.value);
        var v_embalagens_empenho = transformarValorEmFloat(embalagens_empenho.value);
        var v_valor_empenho = transformarValorEmFloat(valor_empenho.value);
        
        // Arredondar o valor para o menor valor mais próximo múltiplo do fator embalagem        
        v_qtd_empenho = v_valor_empenho / v_valor_unitario     
        v_embalagens_empenho = Math.floor(v_qtd_empenho / v_fator_embalagem);
        v_qtd_empenho = v_embalagens_empenho * v_fator_embalagem;
        v_valor_empenho = v_qtd_empenho * v_valor_unitario
    
        // Formatação com separadores de milhar
        embalagens_empenho.value = v_embalagens_empenho.toLocaleString('pt-BR');
        qtd_empenho.value = v_qtd_empenho.toLocaleString('pt-BR');
        valor_empenho.value = formatarComoMoeda(v_valor_empenho)
    }




    //Salvar Empenho
    const botao_salvar_item_empenho = document.getElementById('botaoSalvarItemEmpenho')
    botao_salvar_item_empenho.addEventListener('click', function(event){
        event.preventDefault();
        salvarItemEmpenho();
    })
    
    function salvarItemEmpenho() {
        const id_item_empenho_modal = document.getElementById('item_id')
        
        if (qtd_empenho.value == 0 || valor_empenho == 0){
            sweetAlert('A <b>Quantidade</b> ou <b>Valor</b> do Empenho não pode ser 0!')
            return
        }


        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_item_empenho()
        if (preenchimento_incorreto === false) {
            return;
        }
        

        //Enviar para o servidor
            //definir o caminho
            if (id_item_empenho_modal.value == '') {
                postURL = '/contratos/empenho/item/novo/'
            } else
            {
                postURL = `/contratos/empenho/item/salvar/${id_item_empenho_modal.value}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('itemEmpenhoForm'));
    
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
                let item_empenho_id = data.item_empenho_id;
                localStorage.setItem('itemEmpenhoSalvo', 'true');
                localStorage.setItem('item_empenho_id', item_empenho_id);
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

    function verificar_campos_item_empenho() {
        const campos = [
            { id: 'itemEmpenho_qtdEmpenho', mensagem: 'Informe a <b>Quantidade do Empenho</b>!' },
            { id: 'itemEmpenho_valorEmpenho', mensagem: 'Informe o <b>Valor Total do Empenho</b>!' },
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

    function openModalItemEmpenho(item_empenho_id) {
        fetch(`/contratos/empenho/item/${item_empenho_id}/dados`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do Item do Empenho.');
                }
                return response.json();
            })
            .then(data => {
                // Atualizar os campos do formulário no modal com os dados recebidos
                //log
                $('#item_id').val(data.id);
                $('#item_log_data_registro').val(data.log_data_registro);
                $('#item_log_responsavel_registro').val(data.log_responsavel_registro);
                $('#item_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                $('#item_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                $('#item_log_edicoes').val(data.log_edicoes);

                //dados da parcela
                $('#id_item_contrato').val(data.contrato)
                $('#id_item_numero_item').val(data.numero_item)
                $('#id_item_numero_parcela').val(data.numero_parcela)
                $('#id_item_produto').val(data.produto)

                //Parâmetros
                $('#itemEmpenho_fatorEmbalagem').val(data.fator_embalagem)
                $('#itemEmpenho_valorUnitario').val(formatarComoMoeda(data.valor_unitario))
                $('#itemEmpenho_qtdEmpenhar').val(data.qtd_a_empenhar.toLocaleString('pt-BR'))
                $('#itemEmpenho_valorEmpenhar').val(formatarComoMoeda(data.valor_a_empenhar))

                //Empenho
                $('#itemEmpenho_embalagens').val(data.qtd_embalagens.toLocaleString('pt-BR'))
                $('#itemEmpenho_qtdEmpenho').val(data.qtd_empenhada.toLocaleString('pt-BR'))
                $('#itemEmpenho_valorEmpenho').val(formatarComoMoeda(data.valor_empenhado))

                //Observações
                $('#itemEmpenho_observacoes').val(data.observacoes)

                //Campos ocultos
                $('#id_empenhoItem_empenho').val(data.empenho_id)
                $('#id_empenhoItem_parcela').val(data.parcela_id)
                $('#id_empenhoItem_qtd_empenhada').val(data.qtd_empenhada)

                // Abrir o modal
                modal_empenho_item.show();

            })
            .catch(error => {
                console.log(error);
            });
    }
    
    //Abrir Item do Empenho
    const tab_itens_empenho = document.getElementById('tabItensEmpenho')
    tab_itens_empenho.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          const item_empenho_id = row.dataset.id;

          limparDadosItemEmpenho();
          openModalItemEmpenho(item_empenho_id);
        }
    });

     
    

    function status_cor(){
        if (empenho_status.value == 'empenhado') {
            empenho_status.style.backgroundColor = '#c2f6ff';
        }
        if (empenho_status.value == 'pre_empenho') {
            empenho_status.style.backgroundColor = '#ffffd4';
        }
        if (empenho_status.value == 'cancelado') {
            empenho_status.style.backgroundColor = '#ffcbc2';
        }
        if (empenho_status.value == '') {
            empenho_status.style.backgroundColor = 'white';
        }
    }


    const botao_deletar_item_empenho = document.getElementById('btnDeletarItemEmpenho')
    botao_deletar_item_empenho.addEventListener('click', function() {
        var id_item_empenho = document.getElementById('item_id').value

        if (id_item_empenho == ''){
            modal_empenho_item.hide()
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar o Item do Empenho."
        const url_delete = "/contratos/empenho/item/deletar/" + id_item_empenho + "/"

        const url_apos_delete = window.location.href;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })


    const botao_deletar_empenho = document.getElementById('btnDeletarEmpenho')
    botao_deletar_empenho.addEventListener('click', function() {
        var id_empenho = document.getElementById('id_empenho').value

        if (id_empenho == ''){
            window.location.href = "/contratos/empenhos/"
            return
        }

        var avaliar_qtd_entrega = avaliar_entrega_antes_deletar()
        if (avaliar_qtd_entrega == false){
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar o Empenho."
        const url_delete = "/contratos/empenho/deletar/" + id_empenho + "/"

        const url_apos_delete = "/contratos/empenhos/";
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })    


    //Relatório ARP
    const botao_relatorio_empenho = document.getElementById('btnEmpenhoRelatorio')
    botao_relatorio_empenho.addEventListener('click', function(){
        const id_empenho = document.getElementById('id_empenho').value
        if (id_empenho == '') {
            sweetAlert('Não há dados!', 'warning')
            return
        }

        var width = 1000;
        var height = 700;
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        
        var url = '/contratos/relatorio/empenho/' + id_empenho + '/';
        window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    })

});