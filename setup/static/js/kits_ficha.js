document.addEventListener('DOMContentLoaded', function() {

    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('kitSalvo') === 'true') {
        sweetAlert('Kit salvo com sucesso!', 'success', 'top-end');
        localStorage.removeItem('kitSalvo');
    }
    // if (localStorage.getItem('itemEmpenhoSalvo') === 'true') {
    //     sweetAlert('Item do Empenho salvo com sucesso!', 'success', 'top-end');
    //     let idItemEmpenho = localStorage.getItem('item_empenho_id');
    //     localStorage.removeItem('itemEmpenhoSalvo');
    //     if (idItemEmpenho) {
    //         localStorage.removeItem('item_empenho_id');
    //         openModalItemEmpenho(idItemEmpenho)
    //     }
    // }

    

    const botaoSalvarKit = document.getElementById('btnSalvarKit')
    botaoSalvarKit.addEventListener('click', function(e){
        e.preventDefault();
        salvarKit();
    })

    function salvarKit(){
        const kitId = document.getElementById('id_kit').value

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_kit()
        if (preenchimento_incorreto === false) {
            
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (kitId == '') {
                postURL = '/produtosdaf/kits/novo/'
            } else
            {
                postURL = `/produtosdaf/kits/ficha/${kitId}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('kitForm'));
    
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
                let idKit = data.kit_id;
                localStorage.setItem('kitSalvo', 'true');
                window.location.href = `/produtosdaf/kits/ficha/${idKit}/`
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

    function verificar_campos_kit() {
    
        const campos = [
            { id: 'id_nome', mensagem: 'Informe o <b>Nome do Kit</b>!' },
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