$(document).ready(function() {

    
    $('#btnNovoItemARP').click(function() {
        document.getElementById('arpItemForm').reset();
        
        var modal = new bootstrap.Modal(document.getElementById('arpProdutoModal'));
        modal.show();
    });

    document.getElementById('cnpj_fornecedor').addEventListener('change', function () {
        const cnpjInput = this;
        const datalist = document.getElementById('cnpjs');
        const options = Array.from(datalist.options);
        let valid = false;

        for (let i = 0; i < options.length; i++) {
            if (cnpjInput.value === options[i].value) {
                valid = true;
                break;
            }
        }

        if (!valid || cnpjInput.value === '') {
            alert('Selecione uma das opções da lista.')
            cnpjInput.value = 'Não informado';
        }
        
        const selectedOption = options.find(option => option.value === cnpjInput.value);

        if (selectedOption) {
            const nomeFantasia = selectedOption.dataset.nomeFantasia;
            const hierarquia = capitalizeFirstLetter(selectedOption.dataset.hierarquia);
            const porte = capitalizeFirstLetter(selectedOption.dataset.porte);
            const tipoDireito = capitalizeFirstLetter(selectedOption.dataset.tipoDireito);

            document.getElementById('nome_fantasia').value = nomeFantasia;
            document.getElementById('hierarquia').value = hierarquia;
            document.getElementById('porte').value = porte;
            document.getElementById('tipo_direito').value = tipoDireito;
        } else {
            document.getElementById('nome_fantasia').value = '';
            document.getElementById('hierarquia').value = '';
            document.getElementById('porte').value = '';
            document.getElementById('tipo_direito').value = '';
        }

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

    $('#processo_sei').mask('00000.000000/0000-00');
    
    $('#documento_sei').mask('000000');

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


document.addEventListener('DOMContentLoaded', function() {
    
});





