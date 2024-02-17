document.addEventListener('DOMContentLoaded', function() {

    //Quantidade e Valores do Item
    formatoQuantidade('id_proaqitem_cmm_estimado')
    formatoQuantidade('id_proaqitem_qtd_a_ser_contratada')
    formatoValorMonetario('id_proaqitem_valor_unitario')
    
    const cmm_estimado = document.getElementById('id_proaqitem_cmm_estimado')
    const qtd_a_ser_contratada = document.getElementById('id_proaqitem_qtd_a_ser_contratada')
    const cobertura_dias = document.getElementById('id_proaqitem_cobertura_dias')
    const cobertura_meses = document.getElementById('id_proaqitem_cobertura_meses')
    const valor_unitario_estimado = document.getElementById('id_proaqitem_valor_unitario')
    const valor_total_estimado =  document.getElementById('id_proaqitem_valor_total')
    
    cmm_estimado.addEventListener('change', function(){
        cobertura_dias.value = calculo_cobertura_dias()
    })
    
    qtd_a_ser_contratada.addEventListener('change', function(){
        cobertura_dias.value = calculo_cobertura_dias()
        valor_total_estimado.value = calculo_valor_total()
    })

    qtd_a_ser_contratada.addEventListener('dblclick', function(){
        qtd_a_ser_contratada.value = calculo_qtd_12_meses()
        cobertura_dias.value = calculo_cobertura_dias()
        valor_total_estimado.value = calculo_valor_total()
    })

    valor_unitario_estimado.addEventListener('change', function(){
        valor_total_estimado.value = calculo_valor_total()
    })

    function calculo_cobertura_dias(){

        var cmm = 0
        if (cmm_estimado.value != ''){
            cmm = transformarValorEmFloat(cmm_estimado.value)
        }

        var qtd = qtd_a_ser_contratada.value
        if (qtd_a_ser_contratada.value != ''){
            qtd = transformarValorEmFloat(qtd_a_ser_contratada.value)
        }        

        var dias = qtd/(cmm / 30)
        dias = Math.ceil(parseInt(dias));
        calculo_cobertura_meses(dias)

        dias = dias.toLocaleString('pt-BR')

        return dias

    }
    
    function calculo_cobertura_meses(dias){

        var meses = dias/30
        if (dias == 365){
            meses = 12
        }        

        meses = parseInt(meses)

        cobertura_meses.value = meses.toLocaleString('pt-BR')

        return
    }

    function calculo_qtd_12_meses(){

        var cmm = 0
        if (cmm_estimado.value != ''){
            cmm = transformarValorEmFloat(cmm_estimado.value)
        }

        consumo_medio_diario = cmm / 30
        qtd_12_meses = consumo_medio_diario * 365.5
        qtd_12_meses = Math.ceil(parseInt(qtd_12_meses))
        qtd_12_meses = qtd_12_meses.toLocaleString('pt-BR')

        return qtd_12_meses

    }

    function calculo_valor_total(){
        
        var valor_unitario = transformarValorEmFloat(valor_unitario_estimado.value)
        var valor_total = 0
        var qtd = 0

        if (qtd_a_ser_contratada.value != ''){
            qtd = transformarValorEmFloat(qtd_a_ser_contratada.value)
        }

        valor_total = qtd * valor_unitario
        valor_total = valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return valor_total
    }


    //Verificar Número do Item
    const numero_item = document.getElementById('id_proaqitem_numero_item')

    // Coletar os números dos itens da tabela e armazenar no array
    var itensRegistrados = [];
    document.querySelectorAll('#tabProaqItens .col-item').forEach(function(td) {
        itensRegistrados.push(td.innerText.trim());
    });
    
    //Verificar Número do Item do Objeto
    numero_item.addEventListener('change', function(){
        var valorItem = this.value;

        // Verifica se o valor está fora do intervalo permitido
        if (valorItem < 1 || valorItem > 80) {
            sweetAlert('<span style="font-weight:normal">O número do item <span style="font-weight:bold; color:red">não pode</span> <br>ser maior que 80!</span>')
            numero_item.value = ''
            return
        }

        // Verificar se o valor já existe no array de itens registrados
        if (itensRegistrados.includes(valorItem)) {
            const mensagem = 'Número do Item = ' + valorItem + '<br>Esse número já foi registrado!<br> Por favor, insira outro!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
        }
    });
  
    //Passar o ID do Produto Farmacêutico
    const item_produto_display = document.getElementById('id_item_produto')
    const item_produto_value = document.getElementById('id_produto_id')
    item_produto_display.addEventListener('change', function(){
        item_produto_value.value = item_produto_display.value
        verificar_proaq_item_duplicidade()
    })

    const item_tipo_cota = document.getElementById('id_proaqitem_tipo_cota')
    item_tipo_cota.addEventListener('change', function(){
        verificar_proaq_item_duplicidade()
    })

    function verificar_proaq_item_duplicidade() {
        // Coletar as combinações de item e parcela armazenar no array
        var combinacoesItensProaq = [];
        document.querySelectorAll('#tabProaqItens tr').forEach(function(tr) {
            var tipo_cota = tr.querySelector('.col-produto').textContent;
            var produto = tr.querySelector('.col-texto-curto').textContent;
            combinacoesItensProaq.push(tipo_cota.trim() + "-" + produto.trim());
        });
        console.log(combinacoesItensProaq);
        
        var selectTipoCotaElement = document.getElementById('id_proaqitem_tipo_cota');
        var selectProdutoElement = document.getElementById('id_item_produto');

        var selectTipoCota = selectTipoCotaElement.options[selectTipoCotaElement.selectedIndex].text;
        var selectProduto = selectProdutoElement.options[selectProdutoElement.selectedIndex].text;
        
        var combinacao = selectProduto.trim() + "-" + selectTipoCota.trim();
        console.log(combinacao);
        if (combinacoesItensProaq.includes(combinacao)) {
            const mensagem = "Já existe <b>PRODUTO</b> com este <b>TIPO DE COTA</b>!";
            sweetAlertPreenchimento(mensagem);
            item_tipo_cota.value = '';
            return true;
        }
        return false;
    }

    //Verificar datas de referência do CMM
    const cmm_data_inicio = document.getElementById('id_proaqitem_cmm_data_inicio')
    const cmm_data_fim = document.getElementById('id_proaqitem_cmm_data_fim')
    cmm_data_inicio.addEventListener('change', function(){
        verificar_datas_cmm();
    })
    cmm_data_fim.addEventListener('change', function(){
        verificar_datas_cmm();
    })

    function verificar_datas_cmm(){
        if (cmm_data_inicio.value != '' && cmm_data_fim.value != ''){
            if(cmm_data_inicio.value > cmm_data_fim.value){
                sweetAlert('<span style="font-weight:normal">A <span style="font-weight:bold">Data de Início</span> <span style="font-weight:bold; color:red">não pode ser MAIOR</span> que a <span style="font-weight:bold">Data Fim!</span></span>')
                cmm_data_fim.value = '';
            }
        }
    }


    //Salvar Item do Processo Aquisitivo
    const botao_salvar_item_proaq = document.getElementById('btnSalvarItemProaq')
    const proaq_item_id = document.getElementById('proaq_item_id').value
    botao_salvar_item_proaq.addEventListener('click', function(event){
        event.preventDefault();
        salvarItemProcessoAquisitivo();
    })

    function salvarItemProcessoAquisitivo() {
        const id_proaq_item_modal = document.getElementById('proaq_item_id')
        
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_item_proaq()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (id_proaq_item_modal.value == '') {
                postURL = '/proaq/ficha/item/novo/'
            } else
            {
                postURL = `/proaq/ficha/item/${id_proaq_item_modal.value}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('itemProaqForm'));
    
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
                let id_proaq_item = data.id_proaq_item;
                localStorage.setItem('itemProaqSalvo', 'true');
                localStorage.setItem('id_proaq_item', id_proaq_item);
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

    function verificar_campos_item_proaq() {
        const campos = [
            { id: 'id_proaqitem_numero_item', mensagem: 'Informe o <b>Nº do Item</b>!' },
            { id: 'id_proaqitem_tipo_cota', mensagem: 'Informe o <b>Tipo de Cota</b>!' },
            { id: 'id_item_produto', mensagem: 'Informe o <b>Produto Farmacêutico</b>!' },
            { id: 'id_proaqitem_cmm_data_inicio', mensagem: 'Informe a <b>Data de Início</b> do CMM!' },
            { id: 'id_proaqitem_cmm_data_fim', mensagem: 'Informe a <b>Data Fim</b> do CMM!' },
            { id: 'id_proaqitem_qtd_a_ser_contratada', mensagem: 'Informe a <b>Qtd a ser Adquirida</b>!' },
            { id: 'id_proaqitem_valor_unitario', mensagem: 'Informe o <b>Valor Unitário Estimado</b>!' },
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


    
    
});