$(document).ready(function() {
    
    //Mudar de página com delegação de eventos
    $('#tabFornecedoresFaq tbody').on('click', 'tr', function() {
        // buscarAtualizarFornecedores();
        const faqId = $(this).attr('data-id').toString();
        window.location.href = `/fornecedores/faq/ficha/${faqId}/`;
    });


    //Deletar
    $('#deletar_fornecedor_faq').on('click', function() {
        const faqId = $('#id_fornecedor_faq').val(); 
    
        if (!faqId) { //Trata-se de um novo registro que ainda não foi salvo
            window.location.href = `/fornecedores/faq/`;
            return; // Sai da função
        }
        $.ajax({
            url: `/fornecedores/faq/ficha/deletar/${faqId}/`,
            method: 'POST',
            headers: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')  // Pega o token CSRF para autenticação
            },
            success: function(response) {
                // Redireciona para a lista de denominações após a deleção bem-sucedida
                //alert(response.message);
                window.location.href = `/fornecedores/faq/`;
            },
            error: function(error) {
                // Aqui você pode adicionar qualquer lógica que deseja executar se houver um erro ao tentar deletar o fornecedor.
                alert('Ocorreu um erro ao tentar deletar o fornecedor. Por favor, tente novamente.');
            }
        });
    });

    //Exportar dados
    $('#exportarFornecedoresFaq').on('click', function() {
        // Coleta valores dos campos
        const topico = document.querySelector('#filtro_faq_topico').value;
        const contexto = document.querySelector('#filtro_faq_contexto').value;
        const resposta = document.querySelector('#filtro_faq_resposta').value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            topico: topico,
            contexto: contexto,
            resposta: resposta,
        };

        console.log('Exportar Fornecedores FAQs')

        // Envia solicitação AJAX para o servidor
        fetch('exportar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.blob()) // Trata a resposta como um Blob
        .then(blob => {
            // Inicia o download do arquivo
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = 'fornecedores_faqs_daf.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });

    
    // // Evento para o campo "natjuridica_codigo"
    // $('#filtro_faq_topico').change(function() {
    //     var codigo = $(this).val();
    //     $.get(filtrar_dados, { 'tipo': 'topico', 'codigo': codigo }, function(data) {
    //         $('#filtro_faq_topico').val(data.valor);
    //     });
    // });

    


});
    

document.addEventListener('DOMContentLoaded', function () {
    var faq_topico = document.getElementById('topico');
    var faq_outro_topico = document.getElementById('topico_outro');

    faq_topico.addEventListener('change', function() {
        if (faq_topico.value === 'outro') {
            faq_outro_topico.removeAttribute('readonly');
        } else {
            faq_outro_topico.setAttribute('readonly', true);
            faq_outro_topico.value = '';
        }
    });
});


$(document).ready(function(){
    // Filtrar
    $('#filtro_faq_contexto, #filtro_faq_resposta').keyup(function() {
        buscarAtualizarFaq();
    });

    
    //Filtrar
    $('#filtro_faq_topico').change(function() {
        buscarAtualizarFaq();
        console.log('filtro')
    });
});

//Limpar Filtros
$('.limpar-filtro-fornecedores-faq').on('click', function() {
    $('#filtro_faq_topico').val('');
    $('#filtro_faq_contexto').val('');
    $('#filtro_faq_resposta').val('');
    buscarAtualizarFaq();
});

//Renderizar tabela
function buscarAtualizarFaq(page = 1) {
    var topico = $('#filtro_faq_topico').val();
    var contexto = $('#filtro_faq_contexto').val();
    var resposta = $('#filtro_faq_resposta').val();

    var dataToSend = {
        'topico': topico,
        'contexto': contexto,
        'resposta': resposta,
    };

    $.ajax({
        url: "/fornecedores/faq/filtrar_dados/",
        data: { ...dataToSend, page: page },
        dataType: 'json',
        success: function(data) {
            recarregarTabelaFaqs(data.data);
            $('#numeroFornecedoresFaq').text(data.total_fornecedores_faq.toLocaleString('pt-BR').replace(/,/g, '.'));
            $('#currentPage').text(data.current_page);
            $('#nextPage').prop('disabled', !data.has_next);
            $('#previousPage').prop('disabled', !data.has_previous);
            currentPage = data.current_page;
        }
    });
}


function recarregarTabelaFaqs(faqs) {
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    faqs.forEach(faq => {
        var row = `
            <tr data-id="${ faq.id }">
                
                <td class="col-faq-id">${ faq.id }</td>
                <td class="col-faq-topico">${ getTopico(faq.topico) }</td>
                <td class="col-faq-contexto">${ capitalizeFirstLetter(faq.contexto) }</td>
                <td class="col-faq-resposta">${ capitalizeFirstLetter(faq.resposta) }</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getTopico(topico) {
    var topicos = {
        'contrato': 'Contrato',
        'entrega_produto': 'Entrega de Produto Farmacêutico',
        'nota_fiscal': 'Nota Fiscal',
        'pregao': 'Pregão Eletrônico',
        'processo_incorporacao': 'Processo de Incorporação',
        'outro': 'Outro',
    };
    return topicos[topico] || topico;
}

// //Salvar dados
// document.getElementById('btnSaveFaq').addEventListener('click', function(e) {
//     e.preventDefault(); // Evita o envio padrão do formulário
    
//     let postURL = document.getElementById('fornecedorFaqForm').getAttribute('data-post-url');
//     let formData = new FormData(document.getElementById('fornecedorFaqForm'));

//     fetch(postURL, {
//         method: 'POST',
//         body: formData,
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     })
//     console.log(postURL)
//     .then(response => response.json())
//     .then(data => {
        
//         if (data.data) {
//             // Armazenar os dados no localStorage
//             localStorage.setItem('temporaryFormData', JSON.stringify(data.data));
//         }
        
//         // Redirecione para a nova URL
//         window.location.href = data.redirect_url;

//     });
// });

document.getElementById('btnSaveFaq').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    let postURL = document.getElementById('fornecedorFaqForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('fornecedorFaqForm'));

    console.log('POST URL:', postURL); // Para depuração

    fetch(postURL, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        // Primeiro verifique se a resposta é ok
        if (!response.ok) {
            throw new Error('Server response was not ok: ' + response.statusText);
        }
        // Tente converter a resposta para JSON
        return response.json();
    })
    .then(data => {
        // Se chegou aqui, você tem um JSON válido
        console.log('Response Data:', data);
        if (data.data) {
            // Armazenar os dados no localStorage
            localStorage.setItem('temporaryFormData', JSON.stringify(data.data));
        }
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        } else {
            throw new Error('No redirect URL in the response');
        }
    })
    .catch(error => {
        // Isso captura qualquer erro que ocorra no processo de 'fetch' ou 'then'
        console.error('Fetch operation error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let formData = JSON.parse(localStorage.getItem('temporaryFormData'));

    if (formData) {
        for (let key in formData) {
            let inputElement = document.getElementById(key);
            if (inputElement) {
                inputElement.value = formData[key];
            }
        }
        // Limpar os dados do localStorage após preencher o formulário
        localStorage.removeItem('temporaryFormData');
    }
});