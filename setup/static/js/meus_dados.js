//Exportar dados
$('#btnExportarAcessos').on('click', function() {

    console.log('Exportar Acessos')
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Envia solicitação AJAX para o servidor
    fetch('exportar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => response.blob()) // Trata a resposta como um Blob
    .then(blob => {
        // Inicia o download do arquivo
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'acessos_sisdaf.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

$('#btnExportarLogs').on('click', function() {

    console.log('Exportar Logs')
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Envia solicitação AJAX para o servidor
    fetch('exportar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
    .then(response => response.blob()) // Trata a resposta como um Blob
    .then(blob => {
        // Inicia o download do arquivo
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'logs_sisdaf.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});

document.addEventListener("DOMContentLoaded", function() {
        
    const tipoVinculo = document.getElementById('tipo_vinculo');
    const orgaoOrigem = document.getElementById('orgao_origem');
    const orgaoOutro = document.getElementById('orgao_outro');

    // Função para verificar o estado dos campos
    function checkFields() {
        if (tipoVinculo.value === 'consultor' || tipoVinculo.value === 'nao_informado' || tipoVinculo.value === '') {
            orgaoOrigem.value = 'nao_informado';
            orgaoOutro.value = 'Não Informado';
            orgaoOrigem.setAttribute('disabled', 'disabled');
            orgaoOutro.setAttribute('readonly', 'readonly');
        } else {
            
            orgaoOrigem.removeAttribute('disabled');
            orgaoOutro.removeAttribute('readonly');
        }

        if (orgaoOrigem.value === 'outro') {
            orgaoOutro.removeAttribute('readonly');
        } else {
            orgaoOutro.value = 'Não Informado';
            orgaoOutro.setAttribute('readonly', 'readonly');
        }
    }

    // Chama a função no carregamento da página
    checkFields();

    // Adiciona um ouvinte de evento para verificar cada vez que o valor do dropdown muda
    tipoVinculo.addEventListener('change', checkFields);
    orgaoOrigem.addEventListener('change', checkFields);

    
});

document.addEventListener("DOMContentLoaded", function() {
    const ramalMs = document.getElementById('ramal_ms');

    // Limitar o número de caracteres a 4
    ramalMs.setAttribute('maxlength', '4');

    // Permitir apenas dígitos
    ramalMs.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });




    document.getElementById("file-input").addEventListener("change", function(){
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function() {
                document.getElementById("preview").setAttribute("src", this.result);
            });
            reader.readAsDataURL(file);
        }
    });
    
    
    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function(e) {
                document.getElementById('foto_usuario').src = e.target.result;
            };
    
            reader.readAsDataURL(input.files[0]);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const clickableInputs = document.querySelectorAll('.clickable-input');

    clickableInputs.forEach(function(input) {
        input.addEventListener('click', function(event) {
            const value = event.target.value;
            if (value) {
                window.open(value, '_blank');
            }
        });
    });


    const alterarSenha = document.getElementById('btnAlterarSenha')
    const modalAlterarSenha = new bootstrap.Modal(document.getElementById('alterarSenhaModal'))
    alterarSenha.addEventListener('click', function(event) {
        event.preventDefault();
        modalAlterarSenha.show();
    })

    const novaSenha = document.getElementById('novaSenha')
    const confirmarSenha = document.getElementById('confirmarSenha')
    novaSenha.addEventListener('change', function(){
        compararSenhas()
    })
    confirmarSenha.addEventListener('change', function(){
        compararSenhas()
    })

    function compararSenhas(){

        if (novaSenha.value == "" | confirmarSenha.value == "") {
            return
        }

        if (novaSenha.value !== confirmarSenha.value) {
            sweetAlert('Senhas diferentes!')
            confirmarSenha.value = ""
        }
    }

    const botaoSalvarSenha = document.getElementById('botaoSalvarSenha')
    botaoSalvarSenha.addEventListener('click', function(e){
        e.preventDefault();
        salvarNovaSenha();
    })
    
    function salvarNovaSenha(){

        if (novaSenha.value == '' || confirmarSenha.value == ''){
            sweetAlert('Informe a nova senha')
            return
        }
        
        const postURL = '/usuario/alterarsenha/'
        let senha = novaSenha.value
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        //enviar 
        fetch(postURL, {
            method: 'POST',
            body: JSON.stringify({senha: senha}),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
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
                sweetAlert('Nova senha salva com sucesso!', 'success', 'top-end');
                modalAlterarSenha.hide();
                novaSenha.value = '';
                confirmarSenha.value = '';
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

});

