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

    //Deletar
    $('#btnDeletarArp').on('click', function() {
        const id_arp = $('#id_arp').val(); 
        const url_apos_delete = "/contratos/arps/";

        //Trata-se de um novo registro que ainda não foi salvo
        if (!id_arp) { 
            window.location.href = url_apos_delete;
            return; // Sai da função
        }
        
        //parâmetros para deletar
        const mensagem = "Deletar Ata de Registro de Preços."
        const url_delete = "/contratos/arp/deletar/" + id_arp + "/"
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)

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
    // var denominacao = "Não Informado";
    

    // Antes de abrir o modal, carregar a lista de produtos
    $('#btnNovoItemARP').on('click', function() {
        const denominacao = document.getElementById('arp_denominacao').value
        
        if (denominacao) {
            var url = '/contratos/arp/buscarprodutos/' + denominacao + '/';
            $.ajax({
                url: url,
                success: function(data) {
                    produtos = data;
                    const selectProduto = $('#arp_produto_farmaceutico');
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
    
    //Enviar para o servidor
        //definir o caminho
        let arp_id = document.getElementById('id_arp').value;
        if (arp_id === '') {
            postURL = '/contratos/arp/ficha/nova/'
        } else
        {
            postURL = `/contratos/arp/ficha/${arp_id}/`
        }

        //pegar os dados
        let formData = new FormData(document.getElementById('arpForm'));
        
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
            
            if (data.novo === false) {
                //logs       
                document.getElementById('lot_ult_atualizacao').value = data.log_atualizacao_data
                document.getElementById('log_responsavel_atualizacao').value = data.log_atualizacao_usuario
                document.getElementById('log_edicoes').value = data.log_edicoes

                //alert
                sweetAlert('ARP salva com sucesso!', 'success', 'green')
            } else {
                localStorage.setItem('showSuccessMessage', 'true');
                window.location.href = data.redirect_url;
            }
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
    
});


document.getElementById('btnSalvarItemArp').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    const id_arp = document.getElementById('id_arp').value
    
    alert(id_arp)
    return

    //Verificar preenchimento dos campos
    // let preenchimento_incorreto = verificar_campos_item_arp()
    // if (preenchimento_incorreto === false) {
    //     return;
    // }
    
    //Enviar para o servidor
        //definir o caminho
        let id_arp_item = document.getElementById('id_arp_item').value;
        if (id_arp_item === '') {
            postURL = '/contratos/arp/item/ficha/novo/'
        } else
        {
            postURL = `/contratos/arp/item/ficha/${id_arp_item}/`
        }
        
        //pegar os dados
        let formData = new FormData(document.getElementById('arpItemForm'));
        
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
            
            if (data.novo === false) {
                //logs       
                document.getElementById('arp_item_log_ult_atualizacao').value = data.log_atualizacao_data
                document.getElementById('arp_item_log_responsavel_atualizacao').value = data.log_atualizacao_usuario
                document.getElementById('arp_item_log_edicoes').value = data.log_edicoes

                //alert
                sweetAlert('Item da ARP salva com sucesso!', 'success', 'green')
            } else {
                localStorage.setItem('showSuccessMessage', 'true');
                window.location.href = data.redirect_url;
            }
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

    if (localStorage.getItem('showSuccessMessage') === 'true') {
        sweetAlert('ARP salva com sucesso!', 'success', 'top-end');
        localStorage.removeItem('showSuccessMessage'); // Limpar a bandeira
    }

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
        const campos = mensagensErro.join('<br>')
        sweetAlertPreenchimento(campos)
        return false;
    }

    return true;
}

function verificar_campos_item_arp() {
    const campos = [
        { id: 'arp_n_item', mensagem: 'Informe o <b>Número</b> do Item!' },
        { id: 'arp_tipo_cota', mensagem: 'Informe o <b>Tipo de Cota</b>!' },
        { id: 'arp_empate_ficto', mensagem: 'Informe se o item é <b>Empate Ficto</b>!' },
        { id: 'arp_produto_farmaceutico', mensagem: 'Informe o <b>Produto Farmacêutico</b>!' },
        { id: 'arp_valor_unitario', mensagem: 'Informe o <b>Valor Unitário</b>!' },
        { id: 'arp_qtd_registrada', mensagem: 'Informe a <b>Quantidade Registrada</b>!' }
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

  