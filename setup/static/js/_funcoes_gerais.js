function formatarComoMoeda(valor) {
    // Converte o valor para um número flutuante
    let numero = parseFloat(valor);

    // Formata o número como moeda
    let formatado = numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return formatado;
}


function formatoMoeda(valor) {
    if (typeof valor === 'number') {
        // Se o valor for um número, formatar diretamente
        valor = valor.toFixed(2);
    } else if (typeof valor === 'string') {
        // Se o valor for uma string, remover caracteres não numéricos e converter
        valor = valor.replace(/[^\d.,]/g, '');
        valor = valor.replace(/,/g, '.');
        valor = parseFloat(valor);
        if (isNaN(valor)) {
            valor = 0;
        }
        valor = valor.toFixed(2);
    } else {
        // Se o valor não for nem número nem string, definir como 0
        valor = '0.00';
    }

    // Converter para string para fazer as substituições
    valor = valor.toString();

    // Substituir ponto por vírgula e adicionar o símbolo da moeda
    valor = 'R$ ' + valor.replace('.', ',').replace(/(\d)(?=(\d{3})+\d)/g, "$1.");

    return valor;
}




function formatoQuantidade(campo) {
        
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