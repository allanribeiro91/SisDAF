$(document).ready(function() {  


    function checkStatusAndToggleFields(counter) {
        var status = $("#f" + counter + "_status").val();
        var isDisabled = (!status || status === "nao_executado");
        var statusExecutado = status === "executado";
        var statusEmExecucao = status === "em_execucao";
        
        $("#f" + counter + "_data_inicio, #f" + counter + "_data_fim, #f" + counter + "_comentario").prop("disabled", isDisabled);
    
        // Se o status for "Não Executado", desabilitar e definir como "Não Executado" as fases subsequentes
        if (isDisabled) {
            for (var i = parseInt(counter) + 1; i <= 7; i++) {
                $("#f" + i + "_status").val("nao_executado").prop("disabled", true).trigger("change");
            }
        }
        
        if (statusExecutado) {
            var nextCounter = parseInt(counter) + 1;
            if (nextCounter <= 7) {
                $("#f" + nextCounter + "_status").prop("disabled", false);
            }
        }

        if (statusEmExecucao) {
            var nextCounter = parseInt(counter) + 1;
            if (nextCounter <= 7) {
                $("#f" + nextCounter + "_status").val("nao_executado").prop("disabled", true).trigger("change");
            }
        }
    }
    
    for (var i = 1; i <= 7; i++) {
        checkStatusAndToggleFields(i);
    }
    
    $("[id$=_status]").change(function() {
        var counter = this.id.match(/\d+/)[0];
        checkStatusAndToggleFields(counter);
    });

    $(document).on('change', '#f1_data_inicio', function() {
        console.log("f1_data_inicio mudou para: " + $(this).val());
    });
    
    // Adicionando um ouvinte de evento para os campos de data de fim
    $("[id$=_data_fim]").change(function() {
        var counter = this.id.match(/\d+/)[0];  // Extrair o número da ID do elemento
        var dataInicioElement = $("#f" + counter + "_data_inicio");
        var dataInicio = $("#f" + counter + "_data_inicio").val();
        var dataFim = $(this).val();
    
        // // Se for f1, ignorar a validação
        // if(counter === "1") {
        //     return;
        // }

        console.log("Elemento Data Início (f" + counter + "):", dataInicioElement.length > 0 ? "Existe" : "Não Existe");  // Debug
        console.log("Data Início (f" + counter + "):", dataInicioElement.val());  // Debug

        if (!dataInicio) {
            alert("Por favor, preencha a data de início primeiro.");
            $(this).val("");  // Limpar o campo de data de fim
        } else if (dataFim < dataInicio) {
            alert("A data de fim não pode ser menor que a data de início.");
            $(this).val("");  // Limpar o campo de data de fim
        }
    });

    $("[id$=_data_inicio]").change(function() {
        var counter = this.id.match(/\d+/)[0];  // Extrair o número da ID do elemento
        
        // Se for f1, ignorar a validação
        if(counter === "1" ) {
            return;
        }
    
        var dataInicio = $(this).val();
        var dataFimFaseAnterior = $("#f" + (parseInt(counter) - 1) + "_data_fim").val();
    
        console.log("Data Início (f" + counter + "):", dataInicio);  // Debug
        console.log("Data Fim Fase Anterior (f" + (parseInt(counter) - 1) + "):", dataFimFaseAnterior);  // Debug
    
        if (!dataFimFaseAnterior) {
            alert("Por favor, preencha a data de fim da fase anterior primeiro.");
            $(this).val("");  // Limpar o campo de data de início
        } else if (dataInicio < dataFimFaseAnterior) {
            alert("A data de início da fase " + counter + " não pode ser menor que a data de fim da fase " + (parseInt(counter) - 1) + ".");
            $(this).val("");  // Limpar o campo de data de início
        }
    });
    
});



document.getElementById('btnSaveProaqEvolucao').addEventListener('click', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    
    let idProaq = document.getElementById('id_proaq').value;

    if(idProaq==''){
        alert('Salve primeiro os dados gerais do processo aquisitivo.')
        return
    }

    let postURL = document.getElementById('evolucaoForm').getAttribute('data-post-url');
    
    console.log('Salvar Evolução')

    // Dados das fases
    let dadosFases = {};

    for(let i = 1; i <= 7; i++) {
        let status = document.getElementById(`f${i}_status`).value;
        
        if(status !== "em_execucao" && status !== "executado") {
            break;
        }

        let dataInicio = document.getElementById(`f${i}_data_inicio`).value;
        let dataFim = document.getElementById(`f${i}_data_fim`).value;
        let comentario = document.getElementById(`f${i}_comentario`).value;


        // Adicionar ao objeto geral
        dadosFases['fase' + i] = {
            status: status,
            dataInicio: dataInicio,
            dataFim: dataFim,
            comentario: comentario
        };        
    }

    // Aqui você pode combinar os dados das fases como quiser
    let formData = new FormData();
    formData.append('fasesData', JSON.stringify(dadosFases));

    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    
    // Adicionar o id_proaq ao formData
    formData.append('id_proaq', idProaq);

    // Pegar o token CSRF do cookie
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(postURL, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Aqui você pode tratar a resposta do servidor
        console.log(data);
        window.location.href = data.redirect_url;
    })
    .catch((error) => {
        console.log(error);
    });
});






