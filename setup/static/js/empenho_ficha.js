document.addEventListener('DOMContentLoaded', function() {

    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('empenhoSalvo') === 'true') {
        sweetAlert('Empenho Orçamentário salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('empenhoSalvo');
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

    verificar_status_empenho()
    empenho_status.addEventListener('change', verificar_status_empenho)

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
            alert('Deu certo!')
        }
    })

});