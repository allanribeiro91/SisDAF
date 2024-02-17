document.addEventListener('DOMContentLoaded', function() {

    if (localStorage.getItem('ItemARPSalvo') === 'true') {
        sweetAlert('Item da ARP salva com sucesso!', 'success', 'top-end');
        let idItemARP = localStorage.getItem('id_item_arp');
        localStorage.removeItem('ItemARPSalvo');
        if (idItemARP) {
            localStorage.removeItem('id_item_arp');
            openModelItemArp(idItemARP)
        }
    }

    const status_arp = document.getElementById('arp_status')
    status_cor();   
    status_arp.addEventListener('change', function(){
        status_cor();   
    })

    function status_cor(){
        if (status_arp.value == 'vigente') {
            status_arp.style.backgroundColor = '#c2f6ff';
        }
        if (status_arp.value == 'nao_publicado') {
            status_arp.style.backgroundColor = '#d9b3ff';
        }
        if (status_arp.value == 'encerrado') {
            status_arp.style.backgroundColor = '#b6b6b6';
        }
        if (status_arp.value == 'suspenso') {
            status_arp.style.backgroundColor = '#ffffd4';
        }
        if (status_arp.value == 'cancelado') {
            status_arp.style.backgroundColor = '#ffcbc2';
        }
        if (status_arp.value == '') {
            status_arp.style.backgroundColor = 'white';
        }
    }

    const select_unidade_daf = document.getElementById('arp_unidade_daf');
    const select_denominacao = document.getElementById('arp_denominacao');
    const arp_unidade_daf = document.getElementById('arp_unidade_daf');
    const arp_unidade_daf_display = document.getElementById('arp_unidade_daf_display');


    const fornecedor_id = document.getElementById('cnpj_fornecedor')
    const fornecedor_hidden = document.getElementById('arp_fornecedor_hidden')
    fornecedor_id.addEventListener('change', function(){
        fornecedor_hidden.value = fornecedor_id.value
    })

    select_unidade_daf.addEventListener('change', function(){
        if (select_unidade_daf.value != '') {
            ativarDenominacaoGenerica('habilitar')
            buscarDenominacoes(select_unidade_daf.value)
        } else {
            ativarDenominacaoGenerica('desabilitar')
        }
    })

    arp_unidade_daf.addEventListener('change', unidade_daf_mudanca)

    function unidade_daf_mudanca(){
        arp_unidade_daf_display.value = arp_unidade_daf.value;
    }

    function ativarDenominacaoGenerica(valor) {
        if (valor == 'habilitar') {
            select_denominacao.removeAttribute('disabled');
        } else {
            select_denominacao.setAttribute('disabled', 'disabled');
            select_denominacao.value = '';
        }
    }

    function buscarDenominacoes(unidadeDaf) {
        const url = `/produtosdaf/buscardenominacoes/${unidadeDaf}/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                select_denominacao.innerHTML = '<option value=""></option>';

                data.denominacoes_list.forEach(denominacao => {
                    const option = document.createElement('option');
                    option.value = denominacao.id;
                    option.textContent = denominacao.denominacao + " (ID: " + denominacao.id + ")";
                    select_denominacao.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar Denominações:', error));
    }
    
    ajustarCampoDenominacao();
    
    var itensRegistrados = [];

    // Coletar os números dos itens da tabela e armazenar no array
    document.querySelectorAll('#tabItensARP .col-id').forEach(function(td) {
        itensRegistrados.push(td.innerText.trim());
    });

    // Adicionar ouvinte de evento ao campo arp_n_item
    document.getElementById('arp_n_item').addEventListener('change', function() {
        var valorItem = this.value;

        // Verifica se o valor está fora do intervalo permitido
        if (valorItem < 1 || valorItem > 20) {
            const mensagem = 'O Número de Item da ARP deve ser entre 1 e 20!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
            return
        }

        // Verificar se o valor já existe no array de itens registrados
        if (itensRegistrados.includes(valorItem)) {
            const mensagem = 'Número de Item da ARP = ' + valorItem + '<br>Esse número já foi registrado!<br> Por favor, insira outro!'
            sweetAlertPreenchimento(mensagem)
            this.value = '';
        }
    });

    const table = document.getElementById('tabItensARP');
    table.addEventListener('click', function(event) {
      const target = event.target;
      $('#arp_denominacao').trigger('change');
      if (target.tagName === 'TD') {
        const row = target.closest('tr');
        const itemArpId = row.dataset.id;
        openModelItemArp(itemArpId);
      }
    });
});

function ajustarCampoDenominacao() {
    
    var tabelaItens = document.getElementById('tabItensARP');
    var linhasTabela = tabelaItens.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var campoDenominacao = document.getElementById('arp_denominacao');
    var campoFornecedor = document.getElementById('cnpj_fornecedor');
    var campoUnidadeDaf = document.getElementById('arp_unidade_daf');

    // Verifica se a tabela tem 1 ou mais linhas (excluindo a linha do valor total)
    if (linhasTabela.length > 1) {
        campoUnidadeDaf.setAttribute('disabled', 'disabled');
        campoDenominacao.setAttribute('disabled', 'disabled');
        campoFornecedor.setAttribute('disabled', 'disabled');
        document.getElementById('arp_denominacao_hidden').value = campoDenominacao.value;
        document.getElementById('arp_fornecedor_hidden').value = campoFornecedor.value;
    } else {
        campoUnidadeDaf.removeAttribute('disabled');
        campoDenominacao.removeAttribute('disabled');
    }
}

function openModelItemArp(itemArpId) {
    fetch(`/contratos/arp/item/${itemArpId}/dados/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do Item da ARP.');
            }
            return response.json();
        })
        .then(data => {
            // Atualizar os campos do formulário no modal com os dados recebidos
            
            //Log
            $('#id_arp_item').val(data.id);
            $('#arp_item_log_data_registro').val(data.log_data_registro);
            $('#arp_item_log_responsavel_registro').val(data.log_responsavel_registro);
            $('#arp_item_log_ult_atualizacao').val(data.lot_ult_atualizacao);
            $('#arp_item_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
            $('#arp_item_log_edicoes').val(data.log_edicoes);
            
            //Dados do Item
            $('#arp_n_item').val(data.numero_item);
            $('#arp_tipo_cota').val(data.tipo_cota);
            if (data.empate_ficto) {
                $('#arp_empate_ficto').val('True');
            } else if (data.empate_ficto == null) {
                $('#arp_empate_ficto').val('');
            } 
            else {
                $('#arp_empate_ficto').val('False');
            }
            let produto = data.produto;
            $('#arp_produto_farmaceutico').val(produto);
            $('#arp_valor_unitario').val(formatarComoMoeda(data.valor_unit_homologado));
            let reequilibrioBool = data.valor_unit_reequilibrio_bool;
            $('#arp_valor_reequilibrio_check').prop('checked', reequilibrioBool);
            if (data.valor_unit_reequilibrio_bool === true) {
                // Marcar o checkbox e atualizar o input
                $('#arp_valor_reequilibrio_check').prop('checked', true);
                $('#arp_valor_reequilibrio').val(formatarComoMoeda(data.valor_unit_reequilibrio)).removeAttr('readonly');
            } else {
                // Desmarcar o checkbox e limpar/atualizar o input
                $('#arp_valor_reequilibrio_check').prop('checked', false);
                $('#arp_valor_reequilibrio').val('').attr('readonly', 'readonly');
                valor_total_item_arp(); 
            }
            $('#arp_qtd_registrada').val(data.qtd_registrada.toLocaleString('pt-BR'));
            $('#arp_observacoes_gerais').val(data.observacoes);

            //Quantidades Contratadas
            $('#arp_item_contratos').val(data.contratos);
            $('#arp_item_qtd_contratada').val(data.qtd_contratada.toLocaleString('pt-BR'));
            $('#arp_item_valor_contratado').val(data.valor_contratado.toLocaleString('pt-BR'));
            $('#arp_item_saldo_quantidade').val(data.saldo_quantidade.toLocaleString('pt-BR'));
            $('#arp_item_saldo_valor').val(data.saldo_valor.toLocaleString('pt-BR'));
            $('#arp_item_saldo_percentual').val((data.saldo_percentual * 100).toLocaleString('pt-BR') + '%');


            // Abrir o modal
            const modal = new bootstrap.Modal(document.getElementById('itemARPmodal'));
            modal.show();
        })
        .catch(error => {
            console.log(error);
        });
}

// function formatarComoMoeda(valor) {
//     // Converte o valor para um número flutuante
//     let numero = parseFloat(valor);

//     // Formata o número como moeda
//     let formatado = numero.toLocaleString('pt-BR', {
//         style: 'currency',
//         currency: 'BRL'
//     });
//     return formatado;
// }


$(document).ready(function() {

    
    
    const botao_novo_arp = document.getElementById('btnNovoItemARP')
    const id_arp = document.getElementById('id_arp').value
    $('#btnNovoItemARP').click(function() {
        document.getElementById('arpItemForm').reset();
        $('#arp_denominacao').trigger('change');

        if (id_arp == ''){
            sweetAlert('Salve primeiro a ARP.')
            return
        }

        var modal = new bootstrap.Modal(document.getElementById('itemARPmodal'));
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

    //Deletar
    $('#btnDeletarItemArp').on('click', function() {
        const id_arp_item = $('#id_arp_item').val(); 
        const url_apos_delete = window.location.href;
        
        //Trata-se de um novo registro que ainda não foi salvo
        if (!id_arp_item) { 
            $('#itemARPmodal').modal('hide');
            return;
        }
        
        //parâmetros para deletar
        const mensagem = "Deletar Item da Ata de Registro de Preços."
        const url_delete = "/contratos/arp/item/deletar/" + id_arp_item + "/"
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)

    });

    
    
    


    // Buscar produtos
    // var denominacao = "Não Informado";
    

    // Antes de abrir o modal, carregar a lista de produtos
    $('#arp_denominacao').on('change', function() {
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
    
    $('#arp_documento_sei').mask('0000000000');
    
    // $('#arp_denominacao').select2().next('.select2-container').addClass('form-control');
    
    // $('#cnpj_fornecedor').select2().next('.select2-container').addClass('form-control');

    
        
    
    

    
    
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
        
        console.log('Denominação: ', formData.get('arp_denominacao'))
        console.log('ARP Denominação: ', arp_denominacao.value)

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


var combinacoesExistentes = [];
document.addEventListener('DOMContentLoaded', function() {
    

    // Coletar as combinações de produto e tipo de cota da tabela e armazenar no array
    document.querySelectorAll('#tabItensARP tr').forEach(function(tr) {
        var produto = tr.querySelector('.col-produto').innerText.trim();
        var tipoCota = tr.querySelector('.col-tipo').innerText.trim();
        combinacoesExistentes.push(produto + "-" + tipoCota);
    });

});

function verificarCombinacaoExistente() {
    var selectProduto = document.getElementById('arp_produto_farmaceutico');
    var produtoSelecionado = selectProduto.options[selectProduto.selectedIndex].textContent;

    var selectTipoCota = document.getElementById('arp_tipo_cota');
    var tipoCotaSelecionado = selectTipoCota.options[selectTipoCota.selectedIndex].textContent;

    var combinacao = produtoSelecionado.trim() + "-" + tipoCotaSelecionado.trim();

    if (combinacoesExistentes.includes(combinacao)) {
        const mensagem = "Já existe item desta ARP registrado para esse <br>produto e tipo de cota!";
        sweetAlertPreenchimento(mensagem);
        return true;
    }
    return false;
}


document.getElementById('btnSalvarItemArp').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário

    const id_arp = document.getElementById('id_arp').value
    const id_item_arp = document.getElementById('id_arp_item').value
    
    //Verificar se ARP foi salva
    if (id_arp == '') {
        sweetAlertPreenchimento("Salve primeiro a ARP!");
        return
    }

    //Verificar preenchimento dos campos
    let preenchimento_incorreto = verificar_campos_item_arp()
    if (preenchimento_incorreto === false) {
        return;
    }
    
    //Verificar duplicidade
    if (id_item_arp < 1) {
        let duplicidade = verificarCombinacaoExistente()
        if (duplicidade === true) {
            return;
        }    
    }
    
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
        formData.append('id_arp', id_arp);
        
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
            
            let item_arp_id = data.item_arp_id;
            localStorage.setItem('ItemARPSalvo', 'true');
            localStorage.setItem('id_item_arp', item_arp_id);
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
    
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatarValorMonetario2(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}


// function formatarValorMonetario(campoId) {
//     var campo = document.getElementById(campoId);
    
//     campo.addEventListener('input', function (e) {
//         // Impede caracteres não-numéricos de serem digitados
//         var valor = this.value.replace(/[^0-9]/g, '');

//         // Converte valor para número
//         var numero = parseInt(valor, 10);

//         // Se o valor for NaN, define como 0
//         if (isNaN(numero)) {
//             numero = 0;
//         }

//         // Formata o valor como um número com duas casas decimais
//         var valorFormatado = (numero / 100).toFixed(2);

//         // Substitui o ponto por uma vírgula
//         valorFormatado = valorFormatado.replace('.', ',');

//         // Adiciona pontos como separadores de milhar
//         valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//         // Adiciona o símbolo de real
//         valorFormatado = 'R$ ' + valorFormatado;

//         // Atualiza o valor do campo
//         this.value = valorFormatado;
//     });
// }


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


function valor_total_item_arp() {
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

    formatoValorMonetario('arp_valor_reequilibrio');
    formatoValorMonetario('arp_valor_unitario');
    formatarQuantidade('arp_qtd_registrada')

    document.getElementById('arp_valor_reequilibrio').addEventListener('input', valor_total_item_arp);
    document.getElementById('arp_valor_unitario').addEventListener('input', valor_total_item_arp);
    document.getElementById('arp_qtd_registrada').addEventListener('input', valor_total_item_arp);

    var checkbox = document.getElementById('arp_valor_reequilibrio_check');
    var input = document.getElementById('arp_valor_reequilibrio');

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            input.removeAttribute('readonly');
            input.focus();
        } else {
            input.setAttribute('readonly', 'readonly');
            input.value = '';
            valor_total_item_arp(); 
        }
    });

    
    
    
});


document.getElementById('arp_valor_total').addEventListener('keydown', function (e) {
    e.preventDefault();
});


function verificar_preenchimento_campos() {
    const campos = [
        { id: 'arp_unidade_daf', mensagem: 'Preencha a Unidade DAF!' },
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


document.addEventListener("DOMContentLoaded", function() {
    const dataPublicacaoInput = document.getElementById('data_publicacao');
    const dataVigenciaInput = document.getElementById('data_vigencia');
    const prazoVigenciaInput = document.getElementById('prazo_vigencia');

    function atualizarDatas() {
        if (dataPublicacaoInput.value) {
            // Calcula a data de vigência (data_publicacao + 365 dias)
            let dataPublicacao = new Date(dataPublicacaoInput.value);
            let dataVigencia = new Date(dataPublicacao);
            dataVigencia.setDate(dataVigencia.getDate() + 365);

            // Formata a data de vigência para o formato apropriado (YYYY-MM-DD)
            let dataVigenciaFormatada = dataVigencia.toISOString().split('T')[0];
            dataVigenciaInput.value = dataVigenciaFormatada;

            // Calcula o prazo de vigência (data_vigencia - data_atual)
            let dataAtual = new Date();
            let prazoVigencia = Math.round((dataVigencia - dataAtual) / (1000 * 60 * 60 * 24)) + 1;
            prazoVigenciaInput.value = prazoVigencia;
        } else {
            // Limpa os campos se a data de publicação estiver vazia
            dataVigenciaInput.value = '';
            prazoVigenciaInput.value = '';
        }
    }

    // Evento de mudança para atualizar as datas
    dataPublicacaoInput.addEventListener('change', atualizarDatas);

    // Atualizar as datas quando a página é carregada
    atualizarDatas();


    //Relatório ARP
    const botao_relatorio_arp = document.getElementById('btnArpRelatorio')
    botao_relatorio_arp.addEventListener('click', function(){
        const arp_id = document.getElementById('id_arp').value
        if (arp_id == '') {
            sweetAlert('Não há dados!', 'warning')
            return
        }
        
        var width = 1000;
        var height = 700;
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        
        var url = '/contratos/relatorio/arp/' + arp_id + '/';
        window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    })

});

