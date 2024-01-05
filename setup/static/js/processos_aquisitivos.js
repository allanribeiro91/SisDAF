// document.addEventListener('DOMContentLoaded', function() {
//     const table = document.getElementById('tabTramitacoes');
//     table.addEventListener('click', function(event) {
//       const target = event.target;
//       if (target.tagName === 'TD') {
//         const row = target.closest('tr');
//         const tramitacaoId = row.dataset.id;
//         const proaqId = row.dataset.proaqId;
//         openModal(tramitacaoId, proaqId);
//       }
//     });
// });











// $(document).ready(function(){
//     //Filtrar
//     $('#status_proaq, #modalidade_aquisicao, #unidade_daf, #denominacao').change(function() {
//         buscarAtualizarProaqs();
//     });
// });




// //Mudar de aba
// $('#proaq_ficha_evolucao').click(function() {
//     var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
//     if(id_proaq=='novo'){
//         id_proaq='nova'
//     }
//     window.location.href = '/proaq/ficha/evolucao/' + id_proaq + '/';
// });

// $('#proaq_ficha_dados_gerais').click(function() {
//     var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
//     if(id_proaq=='nova'){
//         window.location.href = '/proaq/ficha/novo/'
//     }else{
//         window.location.href = '/proaq/ficha/dadosgerais/' + id_proaq + '/';
//     }
    
// });

// $('#proaq_ficha_tramitacoes').click(function() {
//     var id_proaq = window.location.pathname.split('/').filter(function(e){ return e }).pop();
//     if(id_proaq=='novo'){
//         id_proaq='nova'
//     }
//     window.location.href = '/proaq/ficha/tramitacoes/' + id_proaq + '/';
// });



// $('#btnNovaTramitacao').click(function() {
//     document.getElementById('proaqTramitacaoForm').reset();
    
//     var modal = new bootstrap.Modal(document.getElementById('tramitacaoModal'));
//     modal.show();
// });



// //Salvar dados
// document.getElementById('btnSaveProaq').addEventListener('click', function(e) {
//     e.preventDefault(); // Evita o envio padrão do formulário
    
//     let postURL = document.getElementById('proaqForm').getAttribute('data-post-url');
//     let formData = new FormData(document.getElementById('proaqForm'));

//     fetch(postURL, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Atualize os campos do log com os dados retornados
//         document.getElementById('log_data_registro').value = data.registro_data;
//         document.getElementById('log_responsavel_registro').value = data.usuario_registro;
//         document.getElementById('lot_ult_atualizacao').value = data.ult_atual_data;
//         document.getElementById('log_responsavel_atualizacao').value = data.usuario_atualizacao;
//         document.getElementById('log_edicoes').value = data.log_n_edicoes;
        
//         // Redirecione para a nova URL
//         window.location.href = data.redirect_url;
//     });
// });



// // Configuração do AJAX para CSRF Token
// $.ajaxSetup({
//     headers: {
//         'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
//     }
// });

// // Quando o botão 'Salvar' é clicado
// $("#salvarProaqProduto").click(function() {
//     console.log('Clique detectado - salvarProaqProduto');
//     var selectedProducts = [];
//     var proaqId = $("#id_proaq").val();  // Certifique-se de que o ID do Proaq está disponível como um campo oculto ou de outra forma
    
//     // Limpar a lista (mesmo que já tenha sido inicializada vazia)
//     selectedProducts.length = 0;
//     console.log(selectedProducts);

//     // Para cada checkbox marcado, adicione o produto à lista
//     $("#proaqProdutosModal .modal-body input[type='checkbox']:checked").each(function() {
//         var productId = $(this).val();
//         selectedProducts.push({id: productId});
//     });

//     console.log(selectedProducts);

//     // Enviar a lista de produtos para o servidor via AJAX
//     $.ajax({
//         type: "POST",
//         url: '/proaq_produtos_relacionados/' + proaqId + '/',
//         data: {
//             produtos: JSON.stringify(selectedProducts)
//         },
//         success: function(response) {
//             if(response.status === "success") {
//                 location.reload();
//                 $('#proaqProdutosModal').modal('show');
//             } else {
//                 alert("Erro ao salvar produtos!");
//             }
//         }
//     });
// });


// //Salvar Tramitacao
// // document.getElementById('btnSalvarTramitacao').addEventListener('click', function(e) {
// //     e.preventDefault(); // Evita o envio padrão do formulário
    
// //     console.log('Salvar tramitação')

// //     let postURL = document.getElementById('proaqTramitacaoForm').getAttribute('data-post-url');
// //     let formData = new FormData(document.getElementById('proaqTramitacaoForm'));

// //     fetch(postURL, {
// //         method: 'POST',
// //         body: formData,
// //         headers: {
// //             'X-Requested-With': 'XMLHttpRequest'
// //         }
// //     })
    
// // });

// document.getElementById('btnSalvarTramitacao').addEventListener('click', function(e) {
//     e.preventDefault(); // Evita o envio padrão do formulário
    
//     console.log('Salvar tramitação')

//     let id_proaq = document.getElementById('proaq').value
//     console.log(id_proaq)
//     if(id_proaq=='None'){
//         alert('Salve primeiro os dados gerais do processo.')
//         return
//     }

//     let postURL = document.getElementById('proaqTramitacaoForm').getAttribute('data-post-url');
//     let formData = new FormData(document.getElementById('proaqTramitacaoForm'));
//     const tramitacaoId = document.getElementById('id_tramitacao').value;
//     if (tramitacaoId) {
//         formData.append('id_tramitacao', tramitacaoId);  // Adiciona o ID da tramitação ao FormData
//     }

//     fetch(postURL, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Erro ao salvar tramitação');
//         }
//     })
//     .then(data => {
//         if (data.redirect_url) {
//             window.location.href = data.redirect_url;
//         }
//     })
//     .catch(error => {
//         console.log(error);
//     });
// });





