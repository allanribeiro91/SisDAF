$(document).ready(function() {
    

    //Mudar de aba
    $('#fornecedor_ficha_representantes').click(function() {
        var id_fornecedor = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        window.location.href = '/fornecedores/representantes/' + id_fornecedor + '/';
    });

    $('#fornecedor_ficha_dados_gerais').click(function() {
        var id_fornecedor = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        window.location.href = '/fornecedores/ficha/' + id_fornecedor + '/';
    });

    $('#fornecedor_ficha_comunicacoes').click(function() {
        var id_fornecedor = window.location.pathname.split('/').filter(function(e){ return e }).pop();
        window.location.href = '/fornecedores/comunicacoes/' + id_fornecedor + '/';
    });

    

    $('#btnNovoRepresentante').click(function() {
        document.getElementById('representanteFornecedorForm').reset();
        
        var modal = new bootstrap.Modal(document.getElementById('representanteFornecedorModal'));
        modal.show();
    });

    $('#btnNovaComunicacao').click(function() {
        document.getElementById('comunicacaoFornecedorForm').reset();
        
        var modal = new bootstrap.Modal(document.getElementById('comunicacaoFornecedorModal'));
        modal.show();
    });

    //Deletar
    $('#deletar_fornecedor').on('click', function() {
        const fornecedorId = $('#id_fornecedor').val(); 
    
        if (!fornecedorId) { //Trata-se de um novo registro que ainda não foi salvo
            window.location.href = `/fornecedores/`;
            return; // Sai da função
        }
        $.ajax({
            url: `/fornecedores/ficha/deletar/${fornecedorId}/`,
            method: 'POST',
            headers: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')  // Pega o token CSRF para autenticação
            },
            success: function(response) {
                // Redireciona para a lista de denominações após a deleção bem-sucedida
                //alert(response.message);
                window.location.href = `/fornecedores/`;
            },
            error: function(error) {
                // Aqui você pode adicionar qualquer lógica que deseja executar se houver um erro ao tentar deletar o fornecedor.
                alert('Ocorreu um erro ao tentar deletar o fornecedor. Por favor, tente novamente.');
            }
        });
    });

    function formatCNPJ() {
        var cnpj = document.getElementById('cnpj');
        var value = cnpj.value;
        
        // Remove qualquer caracter que não seja número
        value = value.replace(/\D/g, "");
        
        // Adiciona um ponto depois do segundo e quinto dígito
        value = value.replace(/^(\d{2})(\d)/, "$1.$2");
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        
        // Adiciona uma barra depois do oitavo dígito
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
        
        // Adiciona um hífen depois do décimo segundo dígito
        value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
        
        cnpj.value = value;
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');
    
        if (cnpj == '') return false;
    
        if (cnpj.length != 14)
            return false;
    
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;
    
        // Valida DVs
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
    
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
    
        return true;
    }

    $('#cnpj').on('input', function() {
        formatCNPJ();
        var cnpj = $(this).val();
        if (cnpj.length == 18) {  // Verifica o comprimento aqui
            if (!validarCNPJ(cnpj)) {
                alert("CNPJ inválido: " + cnpj);
                $(this).val(''); // Limpa o campo CNPJ
            }
        }
    }).attr('maxlength', '18');


    //Exportar dados
    $('#exportarFornecedores').on('click', function() {
        // Coleta valores dos campos
        const hierarquia = document.querySelector('#hierarquia').value;
        const cnpj_porte = document.querySelector('#cnpj_porte').value;
        const tipo_direito = document.querySelector('#tipo_direito').value;
        const uf_fornecedor = document.querySelector('#uf_fornecedor').value;
        const fornecedor_nome = document.querySelector('#fornecedor_nome').value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        // Define dados a serem enviados
        const data = {
            hierarquia: hierarquia,
            cnpj_porte: cnpj_porte,
            tipo_direito: tipo_direito,
            uf_fornecedor: uf_fornecedor,
            fornecedor_nome: fornecedor_nome,
        };

        console.log('Exportar Fornecedores')

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
            a.download = 'fornecedores_daf.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });

    //Mudar de página com delegação de eventos
    $('#tabFornecedores tbody').on('click', 'tr', function() {
        buscarAtualizarFornecedores();
        const fornecedorId = $(this).attr('data-id').toString();
        window.location.href = `/fornecedores/ficha/${fornecedorId}/`;
    });


    // Evento para o campo "natjuridica_codigo"
    $('#natjuridica_codigo').change(function() {
        var codigo = $(this).val();
        $.get(filtrar_dados, { 'tipo': 'natjuridica', 'codigo': codigo }, function(data) {
            $('#natjuridica_descricao').val(data.valor);
        });
    });

    // Evento para o campo "ativ_principal_cod"
    $('#ativ_principal_cod').change(function() {
        var codigo = $(this).val();
        $.get(filtrar_dados, { 'tipo': 'ativ_principal', 'codigo': codigo }, function(data) {
            $('#ativ_principal_descricao').val(data.valor);
        });
    });

    // Evento para o campo "end_uf"
    $('#end_uf').change(function() {
        var uf = $(this).val();
        $.get(filtrar_dados, { 'tipo': 'end_uf', 'uf': uf }, function(data) {
            var municipios = data.municipios;
            var options = '<option value="">Selecione um município</option>';  // Opção padrão
            for (var i = 0; i < municipios.length; i++) {
                options += '<option value="' + municipios[i].id + '">' + municipios[i].municipio + '</option>';
            }
            $('#end_municipio').html(options);
        });
    });


});



$(document).ready(function(){
    // Filtrar
    $('#fornecedor_nome').keyup(function() {
        buscarAtualizarFornecedores();
    });

    
    //Filtrar
    $('#hierarquia, #cnpj_porte, #tipo_direito, #uf_fornecedor, #fornecedor_nome').change(function() {
        buscarAtualizarFornecedores();
    });
});

//Limpar Filtros
$('.limpar-filtro-fornecedores').on('click', function() {
    $('#hierarquia').val('');
    $('#cnpj_porte').val('');
    $('#tipo_direito').val('');
    $('#uf_fornecedor').val('');
    $('#fornecedor_nome').val('');
    buscarAtualizarFornecedores();
});

//Renderizar tabela
function buscarAtualizarFornecedores(page = 1) {
    var hierarquia = $('#hierarquia').val();
    var cnpj_porte = $('#cnpj_porte').val();
    var tipo_direito = $('#tipo_direito').val();
    var uf_fornecedor = $('#uf_fornecedor').val();
    var fornecedor_nome = $('#fornecedor_nome').val();

    var dataToSend = {
        'hierarquia': hierarquia,
        'cnpj_porte': cnpj_porte,
        'tipo_direito': tipo_direito,
        'uf_fornecedor': uf_fornecedor,
        'fornecedor': fornecedor_nome,
    };

    $.ajax({
        url: "/fornecedores/filtro/",
        data: { ...dataToSend, page: page },
        dataType: 'json',
        success: function(data) {
            recarregarTabelaFornecedores(data.data);
            $('#numeroFornecedores').text(data.total_fornecedores.toLocaleString('pt-BR').replace(/,/g, '.'));
            $('#currentPage').text(data.current_page);
            $('#nextPage').prop('disabled', !data.has_next);
            $('#previousPage').prop('disabled', !data.has_previous);
            currentPage = data.current_page;
        }
    });
}


function recarregarTabelaFornecedores(fornecedores) {
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    fornecedores.forEach(fornecedor => {
        var row = `
            <tr data-id="${ fornecedor.id }">
                
                <td class="col-cnpj">${ fornecedor.cnpj }</td>
                <td class="col-fornecedor">${ fornecedor.nome_fantasia }</td>
                <td class="col-hierarquia">${ capitalizeFirstLetter(fornecedor.hierarquia) }</td>
                <td class="col-porte">${ getPorteDisplay(fornecedor.porte) }</td>
                <td class="col-direito">${ capitalizeFirstLetter(fornecedor.tipo_direito) }</td>
                <td class="col-uf">${ fornecedor.end_uf }</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getPorteDisplay(porte) {
    var portes = {
        'mei': 'MEI',
        'me': 'ME',
        'epp': 'EPP',
        'medio_porte': 'Médio Porte',
        'grande_empresa': 'Grande Empresa',
        'demais': 'Demais',
    };
    return portes[porte] || porte;
}



//Salvar dados
document.getElementById('btnSaveFornecedor').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    let postURL = document.getElementById('fornecedorForm').getAttribute('data-post-url');
    let formData = new FormData(document.getElementById('fornecedorForm'));

    console.log(postURL)

    fetch(postURL, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
    
        if (data.data) {
            // Armazenar os dados no localStorage
            localStorage.setItem('temporaryFormData', JSON.stringify(data.data));
        }
        
        // Redirecione para a nova URL
        window.location.href = data.redirect_url;
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
