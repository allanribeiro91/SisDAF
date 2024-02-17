document.addEventListener('DOMContentLoaded', function() {
    
    const inserir_unidade_daf = document.getElementById('inserir_unidade_daf')
    const inserir_mod_aquisicao = document.getElementById('inserir_mod_aquisicao')
    const inserir_denominacao_generica = document.getElementById('inserir_denominacao_generica')

    inserir_unidade_daf.addEventListener('change', function(){
        if (inserir_unidade_daf.value != ''){

            inserir_mod_aquisicao.value == ''
            inserir_mod_aquisicao.removeAttribute('disabled')

            buscarDenominacoes(inserir_unidade_daf.value)

        } else {
            inserir_mod_aquisicao.value == ''
            inserir_mod_aquisicao.setAttribute('disabled', 'disabled')

            inserir_denominacao_generica.value == ''
            inserir_denominacao_generica.setAttribute('disabled', 'disabled')
        }
    })

    inserir_mod_aquisicao.addEventListener('change', function(){
        if (inserir_mod_aquisicao.value != ''){

            inserir_denominacao_generica.value == ''
            inserir_denominacao_generica.removeAttribute('disabled')

            buscarDenominacoes(inserir_unidade_daf.value)

        } else {

            inserir_denominacao_generica.value == ''
            inserir_denominacao_generica.setAttribute('disabled', 'disabled')
        }
    })

    function buscarDenominacoes(unidadeDaf) {
        const url = `/produtosdaf/buscardenominacoes/${unidadeDaf}/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                inserir_denominacao_generica.innerHTML = '<option value=""></option>';

                data.denominacoes_list.forEach(denominacao => {
                    const option = document.createElement('option');
                    option.value = denominacao.id;
                    option.textContent = denominacao.denominacao + " (ID: " + denominacao.id + ")";
                    inserir_denominacao_generica.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar Denominações:', error));
    }
    
    
    const btnInserirProaq = document.getElementById('btnInserirProaq')
    btnInserirProaq.addEventListener('click', function() {
        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_preenchimento_campos()
        if (preenchimento_incorreto === false) {
            return;
        }

        //armazenar no localStorage
            //Unidade Daf
            var selectedText = inserir_unidade_daf.options[inserir_unidade_daf.selectedIndex].text;
            localStorage.setItem('localstorage_unidadeDaf_value', (inserir_unidade_daf.value))
            localStorage.setItem('localstorage_unidadeDaf_text', selectedText)

            //Modalidade de Aquisição
            selectedText = inserir_mod_aquisicao.options[inserir_mod_aquisicao.selectedIndex].text;
            localStorage.setItem('localstorage_modalidadeAquisicao_value', (inserir_mod_aquisicao.value))
            localStorage.setItem('localstorage_modalidadeAquisicao_text', selectedText)           

            //Denominação Genérica
            selectedText = inserir_denominacao_generica.options[inserir_denominacao_generica.selectedIndex].text;
            localStorage.setItem('localstorage_denominacao_value', (inserir_denominacao_generica.value))
            localStorage.setItem('localstorage_denominacao_text', selectedText)

        //ir para a página
        window.location.href = '/proaq/ficha/novo/'

    })


    function verificar_preenchimento_campos() {
        const campos = [
            { id: 'inserir_unidade_daf', mensagem: 'Informe a <b>Unidade DAF</b>!' },
            { id: 'inserir_mod_aquisicao', mensagem: 'Informe a <b>Modalidade de Aquisição</b>!' },
            { id: 'inserir_denominacao_generica', mensagem: 'Informe a <b>Denominação Genérica</b>!' },
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


    // Mudar de página com delegação de eventos
    $('#tabProcessosAquisitivos tbody').on('click', 'tr', function() {
        const proaqId = $(this).attr('data-id').toString();
        window.location.href = `/proaq/ficha/dadosgerais/${proaqId}/`;
    });


    //Filtrar
    $('#status_proaq, #unidade_daf, #fase_evolucao, #modalidade_aquisicao, #denominacao').change(function() {
        filtrarTabelaProaq();
    });

    //Renderizar tabela
    function filtrarTabelaProaq(page = 1) {
        var status = $('#status_proaq').val();
        var unidadeDAF = $('#unidade_daf').val();
        var faseEvolucao = $('#fase_evolucao').val();
        var modalidadeAquisicao = $('#modalidade_aquisicao').val();
        var denominacao_id = $('#denominacao').val();

        var dataToSend = {
            'status': status,
            'unidadeDAF': unidadeDAF,
            'faseEvolucao': faseEvolucao,
            'modalidadeAquisicao': modalidadeAquisicao,
            'denominacao_id': denominacao_id
        };

        $.ajax({
            url: "/proaq/filtro/",
            data: { ...dataToSend, page: page },
            dataType: 'json',
            success: function(data) {
                recarregarTabela(data.data);
                $('#numeroProcessos').text(data.total_processos.toLocaleString('pt-BR').replace(/,/g, '.'));
                $('#currentPage').text(data.current_page);
                $('#nextPage').prop('disabled', !data.has_next);
                $('#previousPage').prop('disabled', !data.has_previous);
                currentPage = data.current_page;
            }
        });
    }

    //Atualizar tabela
    function recarregarTabela(proaqs) {
        console.log('recarregarTabela')
        var $tableBody = $('.table tbody');
        $tableBody.empty(); // Limpar as linhas existentes

        proaqs.forEach(proaq => {
            var class_bolinha = ''
            if (proaq.get_status_label == 'Em Execução'){
                class_bolinha = 'bolinha bolinha-vigente'
            }
            if (proaq.get_status_label == 'Suspenso'){
                class_bolinha = 'bolinha bolinha-suspenso'
            }
            if (proaq.get_status_label == 'Finalizado'){
                class_bolinha = 'bolinha bolinha-encerrado'
            }
            if (proaq.get_status_label == 'Cancelado'){
                class_bolinha = 'bolinha bolinha-cancelado'
            }
            
            var row = `
                <tr data-id="${proaq.id}">
                    <td class="col-id">${proaq.id}</td>
                    <td class="col-texto6">
                        <span class="${class_bolinha}"></span>${proaq.get_status_label}
                    </td>
                    <td class="col-texto6">${proaq.get_unidade_daf_label}</td>
                    <td class="col-texto12">${proaq.fase_processo}</td>
                    <td class="col-texto4" style="text-align: center !important;">${proaq.fase_dias}</td>
                    <td class="col-texto10">${proaq.get_modalidade_aquisicao_label}</td>
                    <td class="col-texto10">${proaq.numero_processo_sei}</td>
                    <td class="col-texto6">${proaq.numero_etp}</td>
                    <td class="col-texto20">${proaq.get_denominacao_nome}</td>
                    <td class="col-texto6">${proaq.get_usuario_nome}</td>
                    <td class="col-valor5">${proaq.total_itens}</td>
                    <td class="col-valor10">${proaq.valor_total.toLocaleString('pt-BR')}</td>
                </tr>
            `;
            $tableBody.append(row);
        });
    }

    //Limpar Filtros
    $('#limpar_filtros').on('click', function() {
        $('#status_proaq').val('');
        $('#unidade_daf').val('');
        $('#fase_evolucao').val('');
        $('#modalidade_aquisicao').val('');
        $('#denominacao').val('');
        filtrarTabelaProaq();
    });


    //Exportar dados
$('#exportarProaqs').on('click', function() {
    // Coleta valores dos campos
    const status_proaq = document.querySelector('#status_proaq').value;
    const unidade_daf = document.querySelector('#unidade_daf').value;
    const fase_evolucao = document.querySelector('#fase_evolucao').value;
    const modalidade_aquisicao = document.querySelector('#modalidade_aquisicao').value;
    const denominacao = document.querySelector('#denominacao').value;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Define dados a serem enviados
    const data = {
        status_proaq: status_proaq,
        unidade_daf: unidade_daf,
        fase_evolucao: fase_evolucao,
        modalidade_aquisicao: modalidade_aquisicao,
        denominacao: denominacao,
    };

    console.log('Exportar Processos Aquisitivos')

    // Envia solicitação AJAX para o servidor
    fetch('exportar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(response => response.blob())
    .then(blob => {
        // Inicia o download do arquivo
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = 'processos_aquisitivos.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
    
});