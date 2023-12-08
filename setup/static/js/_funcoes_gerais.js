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

    // Remover tudo o que não for dígito
    valor = valor.replace(/\D/g, '');

    // Converter para float e dividir por 100 para obter os decimais corretos
    valor = (valor / 100).toFixed(2) + '';

    // Substituir ponto por vírgula e adicionar o símbolo da moeda
    valor = valor.replace('.', ',');
    valor = 'R$ ' + valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return valor

}
