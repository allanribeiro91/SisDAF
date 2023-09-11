let currentPage = 1;

$(document).ready(function() {
    fetchAndRenderTableData();
});


//Limpar Filtros
$('.limpar-filtro').on('click', function() {
    $('#tipo_produto').val('');
    $('#denominacao').val('');
    $('#basico').prop('checked', false);
    $('#especializado').prop('checked', false);
    $('#estrategico').prop('checked', false);
    $('#farmacia_popular').prop('checked', false);
    $('#hospitalar').prop('checked', false);
    fetchAndRenderTableData();
});

//Filtrar
$('#tipo_produto, #denominacao').change(function() {
    fetchAndRenderTableData();
});

$('#basico, #especializado, #estrategico, #farmacia_popular, #hospitalar').change(function() {
    fetchAndRenderTableData();
});

function fetchAndRenderTableData(page = 1) {
    var selectedTipo = $('#tipo_produto').val();
    var denominacao = $('#denominacao').val();
    
    var dataToSend = {
        'tipo_produto': selectedTipo,
        'denominacao': denominacao,
    };
    
    if ($('#basico').prop('checked')) {
        dataToSend.basico = true;
    }
    if ($('#especializado').prop('checked')) {
        dataToSend.especializado = true;
    }
    if ($('#estrategico').prop('checked')) {
        dataToSend.estrategico = true;
    }
    if ($('#farmacia_popular').prop('checked')) {
        dataToSend.farmacia_popular = true;
    }
    if ($('#hospitalar').prop('checked')) {
        dataToSend.hospitalar = true;
    }

    $.ajax({
        url: "/produtosdaf/denominacoes/filtro/",
        data: { ...dataToSend, page: page },
        dataType: 'json',
        success: function(data) {
            updateTable(data.data);
            $('#numeroDenominacoes').text(data.numero_denominacoes.toLocaleString('pt-BR').replace(/,/g, '.'));
            $('#currentPage').text(data.current_page);
            $('#nextPage').prop('disabled', !data.has_next);
            $('#previousPage').prop('disabled', !data.has_previous);
            currentPage = data.current_page;
        }
    });
}

$('#nextPage').on('click', function() {
    fetchAndRenderTableData(currentPage + 1);
});

$('#previousPage').on('click', function() {
    fetchAndRenderTableData(currentPage - 1);
});

function updateTable(denominacoes) {
    var $tableBody = $('.table tbody');
    $tableBody.empty(); // Limpar as linhas existentes

    denominacoes.forEach(denominacao => {
        var row = `
            <tr data-id="${denominacao.id}">
                <td>${denominacao.id}</td>
                <td>${denominacao.tipo_produto}</td>
                <td>${denominacao.denominacao}</td>
                <td style="text-align: center;">${denominacao.unidade_basico ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${denominacao.unidade_especializado ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${denominacao.unidade_estrategico ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${denominacao.unidade_farm_popular ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
                <td style="text-align: center;">${denominacao.hospitalar ? '<span class="bold-blue">Sim</span>' : 'Não'}</td>
            </tr>
        `;
        $tableBody.append(row);
    });
}



document.querySelector('#exportarBtn').addEventListener('click', function() {
    // Coleta valores dos campos
    const tipo_produto = document.querySelector('#tipo_produto').value;
    const denominacao = document.querySelector('#denominacao').value;
    const basico = document.querySelector('#basico').checked;
    const especializado = document.querySelector('#especializado').checked;
    const estrategico = document.querySelector('#estrategico').checked;
    const farmacia_popular = document.querySelector('#farmacia_popular').checked;
    const hospitalar = document.querySelector('#hospitalar').checked;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Define dados a serem enviados
    const data = {
        tipo_produto: tipo_produto,
        denominacao: denominacao,
        basico: basico,
        especializado: especializado,
        estrategico: estrategico,
        farmacia_popular: farmacia_popular,
        hospitalar: hospitalar
    };

    // Envia solicitação AJAX para o servidor
    fetch('denominacoes/exportar/', {
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
        a.download = 'denominacoes_genericas.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


//Mudar de página
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('.table tbody tr');

    rows.forEach(row => {
        row.addEventListener('click', function() {
            const denominacaoId = this.getAttribute('data-id');
            window.location.href = `/produtosdaf/denominacoes/ficha/${denominacaoId}/`;
        });
    });
});
