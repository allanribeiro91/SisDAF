document.addEventListener('DOMContentLoaded', function() {
    var cnpjSelect = document.getElementById('cnpj_fornecedor');
    var nomeFantasiaInput = document.getElementById('nome_fantasia');
    var hierarquiaInput = document.getElementById('hierarquia');
    var porteInput = document.getElementById('porte');
    var tipoDireitoInput = document.getElementById('tipo_direito');

    function atualizarInformacoesFornecedor() {
        var selectedOption = cnpjSelect.options[cnpjSelect.selectedIndex];

        if(selectedOption && selectedOption.value) {
            nomeFantasiaInput.value = selectedOption.getAttribute('data-nome-fantasia') || '';
            hierarquiaInput.value = selectedOption.getAttribute('data-hierarquia') || '';
            porteInput.value = selectedOption.getAttribute('data-porte') || '';
            tipoDireitoInput.value = selectedOption.getAttribute('data-tipo-direito') || '';
        } else {
            nomeFantasiaInput.value = '';
            hierarquiaInput.value = '';
            porteInput.value = '';
            tipoDireitoInput.value = '';
        }
    }

    cnpjSelect.addEventListener('change', atualizarInformacoesFornecedor);

    // Chama a função imediatamente para definir o estado inicial dos campos
    atualizarInformacoesFornecedor();

    
});

$(document).ready(function() {

    //Abrir a ficha da ARP
    $('#tabARPs tbody').on('click', 'tr', function() {
        // buscarAtualizarFornecedores();
        const arpId = $(this).attr('data-id').toString();
        window.location.href = `/contratos/arp/ficha/${arpId}/`;
    });
    
    $('#btnNovoItemARP').click(function() {
        document.getElementById('arpItemForm').reset();
        
        var modal = new bootstrap.Modal(document.getElementById('arpProdutoModal'));
        modal.show();
    });

    //Exportar dados
    $('#exportarARPs').on('click', function() {
        // Coleta valores dos campos       
        const status_arp = document.querySelector('#status_arp').value;
        const unidade_daf = document.querySelector('#unidade_daf').value;
        const denominacao = document.querySelector('#denominacao').value;
        const fornecedor = document.querySelector('#fornecedor').value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            status_arp: status_arp,
            unidade_daf: unidade_daf,
            denominacao: denominacao,
            fornecedor: fornecedor,
        };

        console.log('Exportar ARPs')
        
        // Envia solicitação AJAX para o servidor
        fetch('/contratos/arp/exportar/', {
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
            a.download = 'arps.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });
    
    


    // Buscar produtos
    var denominacaoLabel = "Não Informado";
    var selectProduto = $('#arp_produto_farmaceutico'); // Referência para o campo de seleção de produto

    // Quando uma denominação genérica é selecionada
    $('#denominacao_generica').change(function() {
        denominacaoLabel = $("#denominacao_generica option:selected").text();
        if (denominacaoLabel) {
            var urlBase = '/contratos/arp/buscarprodutos/';
            var url = urlBase + denominacaoLabel + '/';
            $.ajax({
                url: url,
                success: function(data) {
                    produtos = data;
                    console.log(produtos);

                    // Limpa as opções existentes
                    selectProduto.empty();
                    
                    // Adiciona a opção padrão
                    selectProduto.append('<option value="" disabled selected>Não Informado</option>');
                    
                    // Adiciona as opções retornadas pela requisição
                    produtos.forEach(function(produto) {
                        selectProduto.append('<option value="' + produto.id + '">' + produto.produto + '</option>');
                    });
                }
            });
        }
    });

    $('#arp_processo_sei').mask('00000.000000/0000-00');
    
    $('#arp_documento_sei').mask('000000');
    
    // $('#arp_denominacao').select2().next('.select2-container').addClass('form-control');
    
    // $('#cnpj_fornecedor').select2().next('.select2-container').addClass('form-control');

    
        //Filtrar
        $('#status_arp, #unidade_daf, #denominacao, #fornecedor').change(function() {
            filtrarARPs();
        });
    
    
    //Limpar Filtros
    $('.limpar-filtro-arps').on('click', function() {
        $('#status_arp').val('');
        $('#unidade_daf').val('');
        $('#denominacao').val('');
        $('#fornecedor').val('');
        filtrarARPs();
    });
    
    //Renderizar tabela
    function filtrarARPs(page = 1) {
        var status_arp = $('#status_arp').val();
        var unidade_daf = $('#unidade_daf').val();
        var denominacao = $('#denominacao').val();
        var fornecedor = $('#fornecedor').val();
    
        var dataToSend = {
            'status_arp': status_arp,
            'unidade_daf': unidade_daf,
            'denominacao': denominacao,
            'fornecedor': fornecedor,
        };
    
        $.ajax({
            url: "/contratos/arp/filtrar/",
            data: { ...dataToSend, page: page },
            dataType: 'json',
            success: function(data) {
                recarregarTabelaARPs(data.data);
                $('#numeroARPs').text(data.total_arps.toLocaleString('pt-BR').replace(/,/g, '.'));
                $('#currentPage').text(data.current_page);
                $('#nextPage').prop('disabled', !data.has_next);
                $('#previousPage').prop('disabled', !data.has_previous);
                currentPage = data.current_page;
            }
        });
    }
    
    
    function recarregarTabelaARPs(arps) {
        var $tableBody = $('.table tbody');
        $tableBody.empty();
    
        arps.forEach(arp => {
            var row = `
                <tr data-id="${ arp.id }">
                        <td class="col-arp-id">${ arp.id }</td>
                        <td class="col-arp-status" style="text-transform: uppercase;">${ arp.status }</td>
                        <td class="col-arp-unidadedaf" style="text-transform: uppercase;">${ arp.unidade_daf }</td>
                        <td class="col-arp-processo-sei">${ arp.numero_processo_sei }</td>
                        <td class="col-arp-doc-sei">${ arp.numero_documento_sei }</td>
                        <td class="col-arp-data">${ arp.data_publicacao }</td>
                        <td class="col-arp-denominacao">${ arp.denominacao }</td>
                        <td class="col-arp-fornecedor">${ arp.fornecedor }</td>
                    </tr>
            `;
            $tableBody.append(row);
        });
    }
});


document.getElementById('btnSaveArp').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    
    //Verificar preenchimento dos campos
    let preenchimento_incorreto = verificar_preenchimento_campos()
    if (preenchimento_incorreto === false) {
        return;
    }

    let postURL = document.getElementById('arpForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('arpForm'));
    
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
        //console.log('Response Data:', data);
        if (data.data) {
            // Armazenar os dados no localStorage
            localStorage.setItem('temporaryFormData', JSON.stringify(data.form));
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


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function formatarValorMonetario(campoId) {
    var campo = document.getElementById(campoId);
    
    campo.addEventListener('input', function (e) {
        // Impede caracteres não-numéricos de serem digitados
        var valor = this.value.replace(/[^0-9]/g, '');

        // Converte valor para número
        var numero = parseInt(valor, 10);

        // Se o valor for NaN, define como 0
        if (isNaN(numero)) {
            numero = 0;
        }

        // Formata o valor como um número com duas casas decimais
        var valorFormatado = (numero / 100).toFixed(2);

        // Substitui o ponto por uma vírgula
        valorFormatado = valorFormatado.replace('.', ',');

        // Adiciona pontos como separadores de milhar
        valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Adiciona o símbolo de real
        valorFormatado = 'R$ ' + valorFormatado;

        // Atualiza o valor do campo
        this.value = valorFormatado;
    });
}


function formatarQuantidade(campoId) {
    var campo = document.getElementById(campoId);
    
    campo.addEventListener('input', function (e) {
        // Impede caracteres não-numéricos de serem digitados
        var valor = this.value.replace(/[^0-9]/g, '');

        // Converte valor para número
        var numero = parseInt(valor, 10);

        // Se o valor for NaN, define como 0
        if (isNaN(numero)) {
            numero = 0;
        }

        // Adiciona pontos como separadores de milhar
        var valorFormatado = numero.toLocaleString('pt-BR');

        // Atualiza o valor do campo
        this.value = valorFormatado;
    });
}

function formatarValorTotal(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


function valor_total_item_art() {
    const valor_unitario = parseFloat(document.getElementById('arp_valor_unitario').value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
    const valor_reequilibrio = parseFloat(document.getElementById('arp_valor_reequilibrio').value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
    const quantidade = parseFloat(document.getElementById('arp_qtd_registrada').value.replace(/[^0-9]/g, '').replace('.', '')) || 0;
    const valor_total = document.getElementById('arp_valor_total');
    const valor_reequilibrio_bool = document.getElementById('arp_valor_reequilibrio_check').checked;

    let valor;

    if (valor_reequilibrio_bool) {
        valor = valor_reequilibrio;
    } else {
        valor = valor_unitario;
    }

    const total = valor * quantidade;

    valor_total.value = formatarValorTotal(total);

}

document.addEventListener('DOMContentLoaded', function() {


    formatarValorMonetario('arp_valor_reequilibrio');
    formatarValorMonetario('arp_valor_unitario');
    formatarQuantidade('arp_qtd_registrada')

    document.getElementById('arp_valor_reequilibrio').addEventListener('input', valor_total_item_art);
    document.getElementById('arp_valor_unitario').addEventListener('input', valor_total_item_art);
    document.getElementById('arp_qtd_registrada').addEventListener('input', valor_total_item_art);

    var checkbox = document.getElementById('arp_valor_reequilibrio_check');
    var input = document.getElementById('arp_valor_reequilibrio');

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            input.removeAttribute('readonly');
            input.focus();
        } else {
            input.setAttribute('readonly', 'readonly');
            input.value = '';
            valor_total_item_art(); 
        }
    });

    

    
});



document.getElementById('arp_valor_total').addEventListener('keydown', function (e) {
    e.preventDefault();
});


function verificar_preenchimento_campos() {
    const campos = [
        { id: 'unidade_daf', mensagem: 'Preencha a Unidade DAF!' },
        { id: 'arp_processo_sei', mensagem: 'Preencha o Número do Processo SEI!' },
        { id: 'arp_numero_arp', mensagem: 'Preencha o Número da ARP!' },
        { id: 'arp_status', mensagem: 'Preencha o Status!' },
        { id: 'arp_denominacao', mensagem: 'Selecione a Denominação Genérica!' },
        { id: 'cnpj_fornecedor', mensagem: 'Selecione o Fornecedor!' }
    ];

    let mensagensErro = campos.reduce((mensagens, campo) => {
        const elemento = document.getElementById(campo.id);
        if (!elemento || elemento.value === '') {
            mensagens.push(campo.mensagem);
        }
        return mensagens;
    }, []);

    if (mensagensErro.length > 0) {
        Swal.fire({
            title: 'Atenção!',
            html: mensagensErro.join('<br>'),
            icon: 'warning',
            iconColor: 'red',
            confirmButtonText: 'Ok',
            confirmButtonColor: 'green',
        });
        return false;
    }

    return true;
}

  