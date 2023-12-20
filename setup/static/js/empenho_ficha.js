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
        e.preventDefault;
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
            if (fiscal_id == '') {
                postURL = '/contratos/contrato/fiscal/salvar/novo/'
            } else
            {
                postURL = `/contratos/contrato/fiscal/salvar/${fiscal_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('fiscalForm'));
    
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
                let id_fiscal = data.fiscal_id;
                localStorage.setItem('empenhoSalvo', 'true');
                return
                localStorage.setItem('id_fiscal', id_fiscal);
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

});