function formatarComoMoeda(valor) {
    // Converte o valor para um número flutuante
    let numero = parseFloat(valor);

    // Formata o número como moeda
    let formatado = numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 4,
        maximumFractionDigits: 4 
    });
    return formatado;
}


function formatoMoeda(valor) {
    if (typeof valor === 'number') {
        // Se o valor for um número, formatar diretamente
        valor = valor.toFixed(4);
    } else if (typeof valor === 'string') {
        // Se o valor for uma string, remover caracteres não numéricos e converter
        valor = valor.replace(/[^\d.,]/g, '');
        valor = valor.replace(/,/g, '.');
        valor = parseFloat(valor);
        if (isNaN(valor)) {
            valor = 0;
        }
        valor = valor.toFixed(4);
    } else {
        // Se o valor não for nem número nem string, definir como 0
        valor = '0.0000';
    }

    // Converter para string para fazer as substituições
    valor = valor.toString();

    // Substituir ponto por vírgula e adicionar o símbolo da moeda
    valor = 'R$ ' + valor.replace('.', ',').replace(/(\d)(?=(\d{3})+\d)/g, "$1.");

    return valor;
}


function formatoQuantidade(campoId) {
    
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

function transformarValorEmFloat(valor) {
    valor = valor.replace('R$', '').trim();
    valor = valor.replace(/\./g, '').replace(',', '.');
    return parseFloat(valor);
}

function numeroSeparadorMilhar(valor) {
        
    valor = valor.value.replace(/[^0-9]/g, '');

    // Converte valor para número
    var numero = parseInt(valor, 10);

    // Se o valor for NaN, define como 0
    if (isNaN(numero)) {
        numero = 0;
    }

    // Adiciona pontos como separadores de milhar
    var valorFormatado = numero.toLocaleString('pt-BR');

    // Atualiza o valor do campo
    return valorFormatado;
}

function formatoValorMonetario(campoId) {
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

        // Formata o valor como um número com quatro casas decimais
        var valorFormatado = (numero / 10000).toFixed(4);

        // Divide o valor formatado em parte inteira e decimal
        var partes = valorFormatado.split('.');

        // Adiciona pontos como separadores de milhar na parte inteira
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Junta as partes com uma vírgula
        valorFormatado = partes.join(',');

        // Adiciona o símbolo de real
        valorFormatado = 'R$ ' + valorFormatado;

        // Atualiza o valor do campo
        this.value = valorFormatado;
    });
}



function converterDataParaFormatoInternacional(dataStr) {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
        return ano + '-' + mes + '-' + dia; // Converte para formato yyyy-mm-dd
    }
    return null; // Retorna null se a data não estiver no formato esperado
}

function formatarData(data) {
    const dia = data.getUTCDate().toString().padStart(2, '0');
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = data.getUTCFullYear();
    return `${ano}-${mes}-${dia}`;
}


function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os não dígitos

    if (cpf.length <= 3) {
        return cpf;
    } else if (cpf.length <= 6) {
        return cpf.replace(/^(\d{3})(\d+)/, '$1.$2');
    } else if (cpf.length <= 9) {
        return cpf.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else {
        return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    }
}


function validaCPF(cpf) {

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


function validaCNS(cns) {
    if (cns.match(/[1-2]\d{10}00[0-1]\d/) || cns.match(/[7-9]\d{14}/)) {
        return cnsSomaPonderada(cns) % 11 === 0;
    }
    return false;
}

function cnsSomaPonderada(cns) {
    let soma = 0;
    for (let i = 0; i < cns.length; i++) {
        soma += parseInt(cns.charAt(i), 10) * (15 - i);
    }
    return soma;
}


function calcular_idade(data_nascimento, data_obito) {
    var dataReferencia = data_obito ? new Date(data_obito) : new Date();
    var nascimento = new Date(data_nascimento);
    var idade = dataReferencia.getFullYear() - nascimento.getFullYear();
    var m = dataReferencia.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && dataReferencia.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}


function analisar_coerencia_datas(data1, data2, mensagem) {
    var inputData1 = document.getElementById(data1);
    var inputData2 = document.getElementById(data2);

    if (inputData1 && inputData2) {
        var valorData1 = new Date(inputData1.value);
        var valorData2 = new Date(inputData2.value);

        if (valorData2 < valorData1) {
            inputData2.value = '';

            // Usando SweetAlert para mostrar a mensagem
            sweetAlert(mensagem);

            return false
        }
    }

    return true
}


// Função para limpar os filtros
function limparFiltros(idsFiltros) {
    for (let id of idsFiltros) {
        document.getElementById(id).value = '';
    }
}



