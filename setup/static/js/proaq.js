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
    
});