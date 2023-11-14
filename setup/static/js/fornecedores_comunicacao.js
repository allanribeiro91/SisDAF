document.getElementById('btnSalvarComunicacao').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    console.log('Salvar Comunicação')

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
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.log(error);
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     const table = document.getElementById('tabRepresentantes');
//     table.addEventListener('click', function(event) {
//       const target = event.target;
//       if (target.tagName === 'TD') {
//         const row = target.closest('tr');
//         const representanteId = row.dataset.id;
//         const fornecedorId = row.dataset.fornecedorId;
//         openModal(representanteId, fornecedorId);
//       }
//     });
// });

// function openModal(representanteId, fornecedorId) {
//     console.log(representanteId);
//     fetch(`/fornecedores/representantes/${representanteId}/dados/`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Erro ao buscar dados da fornecedor.');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Atualizar os campos do formulário no modal com os dados recebidos
//             document.getElementById('id_representante_fornecedor').value = data.id_representante;
//             document.getElementById('repforn_log_data_registro').value = data.log_data_registro;
//             document.getElementById('repforn_log_responsavel_registro').value = data.log_responsavel_registro;
//             document.getElementById('repforn_lot_ult_atualizacao').value = data.lot_ult_atualizacao;
//             document.getElementById('repforn_log_responsavel_atualizacao').value = data.log_responsavel_atualizacao;
//             document.getElementById('repforn_log_edicoes').value = data.log_edicoes;
//             document.getElementById('repforn_cpf').value = data.cpf;
//             document.getElementById('repforn_nome_completo').value = data.nome_completo;
//             document.getElementById('repforn_data_nascimento').value = data.data_nascimento;
//             document.getElementById('repforn_genero_sexual').value = data.genero_sexual;
//             document.getElementById('repforn_cargo').value = data.cargo;
//             document.getElementById('repforn_telefone').value = data.telefone;
//             document.getElementById('repforn_celular').value = data.celular;
//             document.getElementById('repforn_email').value = data.email;
//             document.getElementById('repforn_linkedin').value = data.linkedin;
//             document.getElementById('observacoes_gerais').value = data.observacoes;

//             // Abrir o modal
//             const modal = new bootstrap.Modal(document.getElementById('representanteFornecedorModal'));
//             modal.show();
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }