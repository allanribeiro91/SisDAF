//Exportar dados
$('#btnExportarRepresentantes').on('click', function() {

    console.log('Exportar Representantes')
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var fornecedorId = window.location.pathname.split('/').filter(function(e){ return e }).pop();

    // // Define dados a serem enviados
    const data = {
        fornecedorId: fornecedorId,
    };

    // Envia solicitação AJAX para o servidor
    fetch(`/fornecedores/representantes/exportar/${fornecedorId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.blob()) // Trata a resposta como um Blob
    .then(blob => {
        // Inicia o download do arquivo
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'representantes_fornecedor.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("repforn_cpf");

    cpfInput.addEventListener("input", function () {
        let value = cpfInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito
        
        if(value.length == 11) {
            verificacao_cpf = isValidCPF(value)
            if(verificacao_cpf == false){
                sweetAlert("CPF inválido: " + cpfInput.value)
                value = ''
            }
        }
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        if (value.length > 2 && value.length <= 6) {
            value = value.replace(/^(\d{3})(\d+)/, '$1.$2');
        } else if (value.length > 6 && value.length <= 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
        }

        cpfInput.value = value; // Atualiza o valor do campo
    });

    
});


// Quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('openModalAfterReload') === 'true') {
        const representanteId = localStorage.getItem('representanteId');
        const id_fornecedor = localStorage.getItem('id_fornecedor');
        console.log('ID Representante' + representanteId)

        openModal(representanteId, id_fornecedor);
        sweetAlert('Dados salvos com sucesso!', 'success', 'top-end');

        // Limpa o localStorage
        localStorage.removeItem('openModalAfterReload');
        localStorage.removeItem('comunicacaoId');
        localStorage.removeItem('id_fornecedor');
    }
});


// Função para validar o CPF
function isValidCPF(cpf) {

    cpf = cpf.replace(/\D/g, ''); // Remove todos os não dígitos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF com todos os dígitos iguais é inválido
    }

    if (cpf.length === 11) {
        var sum = 0;
        var rest;
        for (var i = 1; i <= 9; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
            rest = 0;
        }
        if (rest !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;
        for (var i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
            rest = 0;
        }
        if (rest !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true; // CPF válido
    }

    return false; // CPF com menos de 11 dígitos não é válido
}

$('#btnNovoRepresentante').click(function() {
    document.getElementById('representanteFornecedorForm').reset();
    
    var modal = new bootstrap.Modal(document.getElementById('representanteFornecedorModal'));
    modal.show();
});


document.addEventListener("DOMContentLoaded", function () {
    const celularInput = document.getElementById("repforn_celular"); // Certifique-se de que o campo de input do celular tenha o id "celular"

    celularInput.addEventListener("input", function () {
        let value = celularInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito

        if (value.length > 11) {
            value = value.substring(0, 11); // Limita a 11 dígitos
        }

        if (value.length <= 2) {
            value = value.replace(/^(\d{0,2})/, '($1'); // Formato (##
        } else if (value.length <= 6) {
            value = value.replace(/^(\d{2})(\d+)/, '($1) $2'); // Formato (##) ####
        } else if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{0,3})/, '($1) $2-$3'); // Formato (##) #####-####
        } else {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Formato completo (##) #####-####
        }

        celularInput.value = value; // Atualiza o valor do campo
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("repforn_telefone"); // Certifique-se de que o campo de input do celular tenha o id "celular"

    telefoneInput.addEventListener("input", function () {
        let value = telefoneInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito

        if (value.length > 10) {
            value = value.substring(0, 10); // Limita a 10 dígitos
        }

        if (value.length <= 2) {
            value = value.replace(/^(\d{0,2})/, '($1'); // Formato (##
        } else if (value.length <= 6) {
            value = value.replace(/^(\d{2})(\d+)/, '($1) $2'); // Formato (##) ####
        } else if (value.length <= 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,3})/, '($1) $2-$3'); // Formato (##) ####-####
        } else {
            value = value.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Formato completo (##) ####-####
        }

        telefoneInput.value = value; // Atualiza o valor do campo
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var cargo = document.getElementById('repforn_cargo');
    var cargo_outro = document.getElementById('repforn_cargo_outro');

    cargo.addEventListener('change', function() {
        if (cargo.value === 'outro') {
            cargo_outro.removeAttribute('readonly');
        } else {
            cargo_outro.setAttribute('readonly', true);
            cargo_outro.value = '';
        }
    });


    const botao_salvar_representante = document.getElementById('btnSalvarRepresentante')
    botao_salvar_representante.addEventListener('click', function(e) {
        e.preventDefault(); // Evita o envio padrão do formulário
        
        console.log('Salvar representante')
    
        let id_fornecedor = document.getElementById('id_fornecedor').value
        console.log(id_fornecedor)
        if(id_fornecedor=='None'){
            alert('Salve primeiro os dados gerais do fornecedor.')
            return
        }
    
        let postURL = '/fornecedores/representantes/' + id_fornecedor + '/';
        let formData = new FormData(document.getElementById('representanteFornecedorForm'));
        const representanteId = document.getElementById('id_representante_fornecedor').value;
        if (representanteId) {
            formData.append('id_representante', representanteId);
        }
    
        fetch(postURL, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erro ao salvar representante');
            }
        })
        .then(data => {
            if (data.redirect_url) {
                // Antes de recarregar a página
                var representanteId = data.representante_id;
                localStorage.setItem('representanteId', representanteId);
                localStorage.setItem('id_fornecedor', id_fornecedor);
                localStorage.setItem('openModalAfterReload', 'true');
                //Recarregar a páigna
                window.location.href = data.redirect_url;
            }
        })
        .catch(error => {
            console.log(error);
        });
    });

});







document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('tabRepresentantes');
    table.addEventListener('click', function(event) {
      const target = event.target;
      if (target.tagName === 'TD') {
        const row = target.closest('tr');
        const representanteId = row.dataset.id;
        const fornecedorId = row.dataset.fornecedorId;
        openModal(representanteId, fornecedorId);
      }
    });
});

function openModal(representanteId, fornecedorId) {
    console.log(representanteId);
    fetch(`/fornecedores/representantes/${representanteId}/dados/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da fornecedor.');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os campos do formulário no modal com os dados recebidos
            document.getElementById('id_representante_fornecedor').value = data.id_representante;
            document.getElementById('repforn_log_data_registro').value = data.log_data_registro;
            document.getElementById('repforn_log_responsavel_registro').value = data.log_responsavel_registro;
            document.getElementById('repforn_lot_ult_atualizacao').value = data.lot_ult_atualizacao;
            document.getElementById('repforn_log_responsavel_atualizacao').value = data.log_responsavel_atualizacao;
            document.getElementById('repforn_log_edicoes').value = data.log_edicoes;
            document.getElementById('repforn_cpf').value = data.cpf;
            document.getElementById('repforn_nome_completo').value = data.nome_completo;
            document.getElementById('repforn_data_nascimento').value = data.data_nascimento;
            document.getElementById('repforn_genero_sexual').value = data.genero_sexual;
            let cargo = data.cargo;
            document.getElementById('repforn_cargo').value = cargo;
            document.getElementById('repforn_cargo_outro').value = data.cargo_outro;
            document.getElementById('repforn_telefone').value = data.telefone;
            document.getElementById('repforn_celular').value = data.celular;
            document.getElementById('repforn_email').value = data.email;
            document.getElementById('repforn_linkedin').value = data.linkedin;
            document.getElementById('observacoes_gerais').value = data.observacoes;
        
            //
            if(cargo == 'outro') {
                document.getElementById('repforn_cargo_outro').removeAttribute('readonly')
            } else {
                document.getElementById('repforn_cargo_outro').setAttribute('readonly', true)
            }

            // Abrir o modal
            const modal = new bootstrap.Modal(document.getElementById('representanteFornecedorModal'));
            modal.show();
        })
        .catch(error => {
            console.log(error);
        });
}


// document.getElementById('btnCancelarRepresentante').addEventListener('click', function() {
//     var modalElement = document.getElementById('representanteFornecedorModal');
//     var myModal = bootstrap.Modal.getInstance(modalElement);
//     myModal.hide();
//     window.location.reload();
// });


// Função para fechar o modal e recarregar a página
function closeModalAndReload() {
    var modalElement = document.getElementById('representanteFornecedorModal');
    var myModal = bootstrap.Modal.getInstance(modalElement);
    myModal.hide();
    //window.location.reload();
}


