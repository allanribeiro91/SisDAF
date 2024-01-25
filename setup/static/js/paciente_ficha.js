document.addEventListener("DOMContentLoaded", function () {
    
    //Máscaras
    $('#id_paciente_cns').mask('000 0000 0000 0000');
    $('#id_paciente_cpf').mask('000.000.000-00');
    $('#id_dispensacao_processo_sei').mask('00000.000000/0000-00');
    // $('#id_tramitacaoproaq_documento_sei').mask('000000')

    const cpf = document.getElementById('id_paciente_cpf')
    cpf.addEventListener('change', function(){
        var cpf_paciente = cpf.value.replace(/\D/g, '');
        var cpf_valido = validaCPF(cpf_paciente)
        
        if (cpf_valido == false){
            var mensagem = '<span style="font-weight: normal">CPF: ' + cpf.value + ' <b style="color: red">INVÁLIDO!</b></span>'
            sweetAlert(mensagem)
            cpf.value = ''
        }

    })

    const cns = document.getElementById('id_paciente_cns')
    cns.addEventListener('change', function(){
        var cns_paciente = cns.value.replace(/\s/g, '');
        
        var cns_valido = validaCNS(cns_paciente)

        if (cns_valido == false){
            var mensagem = '<span style="font-weight: normal">CNS: ' + cns.value + ' <b style="color: red">INVÁLIDO!</b></span>'
            sweetAlert(mensagem)
            cns.value = ''
        }

    })

    const paciente_uf = document.getElementById('id_paciente_uf')
    const paciente_municipio = document.getElementById('id_paciente_municipio')
    const paciente_cod_ibge = document.getElementById('id_paciente_cod_ibge')
    paciente_uf.addEventListener('change', function(){
        
        if (paciente_uf.value == ''){
            paciente_municipio.setAttribute('disabled', 'disabled')
            paciente_municipio.value = ''
            paciente_cod_ibge.value = ''
        } else {
            paciente_municipio.removeAttribute('disabled')
            paciente_cod_ibge.value = ''
            buscarMunicipios(paciente_uf.value, "#id_paciente_municipio")
        }
        
    })

    carregarNaturalidade(paciente_cod_ibge.value)
    function carregarNaturalidade(ibge){
        if (ibge){
            paciente_municipio.removeAttribute('disabled')
        }
    }

    function buscarMunicipios(uf, componente) {
        const url = `/buscar-municipios/${uf}/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                var municipios = data.municipios;
                var options = '<option value=""></option>';  // Opção padrão
                for (var i = 0; i < municipios.length; i++) {
                    options += '<option value="' + municipios[i].cod_ibge + '">' + municipios[i].municipio + '</option>';
                }
                $(componente).html(options);

            })
            .catch(error => console.error('Erro ao buscar dados do município:', error));
    }

    paciente_municipio.addEventListener('change', function(){
        paciente_cod_ibge.value = paciente_municipio.value
    })

    const data_nascimento = document.getElementById('id_paciente_data_nascimento')
    const paciente_idade = document.getElementById('id_paciente_idade')
    data_nascimento.addEventListener('change', function(){
        var idade = calcular_idade(data_nascimento.value)
        paciente_idade.value = idade + " anos"
    })

    const botao_salvar_paciente = document.getElementById('btnSalvarPaciente')
    botao_salvar_paciente.addEventListener('click', function(e){
        e.preventDefault();
        salvar_paciente();
    })

    function salvar_paciente(){
        const paciente_id = document.getElementById('id_paciente').value

        //Verificar preenchimento dos campos
        let preenchimento_incorreto = verificar_campos_paciente()
        if (preenchimento_incorreto === false) {
            return;
        }

        //Enviar para o servidor
            //definir o caminho
            if (paciente_id == '') {
                postURL = '/gestao_pacientes/paciente/novo/'
            } else
            {
                postURL = `/gestao_pacientes/paciente/${paciente_id}/`
            }

            //pegar os dados
            let formData = new FormData(document.getElementById('formPaciente'));
    
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
                let id_paciente = data.paciente_id;
                localStorage.setItem('pacienteSalvo', 'true');
                window.location.href = `/gestao_pacientes/paciente/${id_paciente}/`
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
    }

    function verificar_campos_paciente() {
    
        const campos = [
            { id: 'id_paciente_cns', mensagem: 'Informe o <b>CNS</b>!' },
            { id: 'id_paciente_nome', mensagem: 'Informe o <b>Nome do Paciente</b>!' },
        ];
        
        let mensagensErro = campos.reduce((mensagens, campo) => {
            const elemento = document.getElementById(campo.id);
            if (!elemento || elemento.value === '' || elemento.value == 0) {
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

    
    //DISPENSACOES
        //Inserir Nova Dispensação
        const botao_nova_dispensacao = document.getElementById('btnNovaDispensacao')
            const modal_dispensacao = new bootstrap.Modal(document.getElementById('pacienteDispensacaoModal'))
            botao_nova_dispensacao.addEventListener('click', function(){
                modal_dispensacao.show();
            })

        //Comportamentos do formulário
        const dispensacao_via_atendimento = document.getElementById('id_dispensacao_via_atendimento')
        const dispensacao_origem_demanda_judicial = document.getElementById('id_dispensacao_origem_demanda_judicial')
        dispensacao_via_atendimento.addEventListener('change', function(){
            if (dispensacao_via_atendimento.value == 'judicial'){
                dispensacao_origem_demanda_judicial.removeAttribute('disabled')
                dispensacao_origem_demanda_judicial.value = ''
            } else {
                dispensacao_origem_demanda_judicial.setAttribute('disabled', 'disabled')
                dispensacao_origem_demanda_judicial.value = 'nao_se_aplica'
            }
        })

        const dispensacao_quantidade = document.getElementById('id_dispensacao_quantidade')
        dispensacao_quantidade.addEventListener('input', function(){
            formatoQuantidade('id_dispensacao_quantidade')
        })

        const dispensacao_status = document.getElementById('id_dispensacao_status')
        const dispensacao_numero_pedido = document.getElementById('id_dispensacao_numero_pedido_sismat')
        const dispensacao_data_solicitacao = document.getElementById('id_dispensacao_data_solicitacao')
        const dispensacao_data_envio = document.getElementById('id_dispensacao_data_envio')
        const dispensacao_data_consumo = document.getElementById('id_dispensacao_data_consumo')

        dispensacao_status.addEventListener('change', function(){

            if (dispensacao_status.value == '' || dispensacao_status.value == 'em_analise') {
                dispensacao_numero_pedido.setAttribute('readonly', 'readonly')
                dispensacao_numero_pedido.value = ''

                dispensacao_data_envio.setAttribute('readonly', 'readonly')
                dispensacao_data_envio.value = ''

                dispensacao_data_consumo.setAttribute('readonly', 'readonly')
                dispensacao_data_consumo.value = ''

            } 

            if (dispensacao_status.value == 'enviado') {
                dispensacao_numero_pedido.removeAttribute('readonly')
                dispensacao_data_envio.removeAttribute('readonly')
            }

            if (dispensacao_status.value == 'consumido') {
                dispensacao_numero_pedido.removeAttribute('readonly')
                dispensacao_data_envio.removeAttribute('readonly')
                dispensacao_data_consumo.removeAttribute('readonly')
            }

        })

        dispensacao_data_envio.addEventListener('change', function(){
            var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data de Envio</b> não pode ser anterior à <b style="color:red">Data da Solicitação</b>!</span>' 
            analise_data('id_dispensacao_data_solicitacao', 'id_dispensacao_data_envio', mensagem)
        })

        dispensacao_data_consumo.addEventListener('change', function(){
            var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data do Consumo</b> não pode ser anterior à <b style="color:red">Data do Envio</b>!</span>' 
            analise_data('id_dispensacao_data_envio', 'id_dispensacao_data_consumo', mensagem)
        })

        function analise_data(data1, data2, mensagem) {
            var inputData1 = document.getElementById(data1);
            var inputData2 = document.getElementById(data2);
        
            if (inputData1 && inputData2) {
                var valorData1 = new Date(inputData1.value);
                var valorData2 = new Date(inputData2.value);
        
                if (valorData2 < valorData1) {
                    inputData2.value = '';
        
                    // Usando SweetAlert para mostrar a mensagem
                    sweetAlert(mensagem);
                }
            }
        }

        const dispensacao_uf = document.getElementById('id_dispensacao_uf')
        const dispensacao_municipio = document.getElementById('id_dispensacao_municipio')
        const dispensacao_cod_ibge = document.getElementById('id_dispensacao_local_aplicacao_cod_ibge')
        dispensacao_uf.addEventListener('change', function(){
            
            if (dispensacao_uf.value == ''){
                dispensacao_municipio.setAttribute('disabled', 'disabled')
                dispensacao_municipio.value = ''
                dispensacao_cod_ibge.value = ''
            } else {
                dispensacao_municipio.removeAttribute('disabled')
                dispensacao_cod_ibge.value = ''
                buscarMunicipios(dispensacao_uf.value, "#id_dispensacao_municipio")
            }
            
        })

        dispensacao_municipio.addEventListener('change', function(){
            dispensacao_cod_ibge.value = dispensacao_municipio.value
        })

        const dispensacao_produto = document.getElementById('id_dispensacao_produto')
        const dispensacao_produto_id = document.getElementById('id_dispensacao_produto_id')
        dispensacao_produto.addEventListener('change', function(){
            dispensacao_produto_id.value = dispensacao_produto.value
        })
        

        //Salvar Técnico
        const botao_salvar_dispensacao = document.getElementById('botaoSalvarDispensacao')
        botao_salvar_dispensacao.addEventListener('click', function(event){
            event.preventDefault();
            salvarDispensacao();
        })

        function salvarDispensacao() {
            const id_dispensacao = document.getElementById('dispensacao_id')

            //Verificar preenchimento dos campos
            let preenchimento_incorreto = verificar_campos_dispensacao()
            if (preenchimento_incorreto === false) {
                return;
            }
            
            //Enviar para o servidor
                //definir o caminho
                if (id_dispensacao.value == '') {
                    postURL = '/gestao_pacientes/paciente/dispensacao/salvar/novo/'
                } else
                {
                    postURL = `/gestao_pacientes/paciente/dispensacao/salvar/${id_dispensacao.value}/`
                }

                //pegar os dados
                let formData = new FormData(document.getElementById('dispensacaoPacienteForm'));
        
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
                        let tecnico_id = data.tecnico_id;
                        localStorage.setItem('tecnicoSalvo', 'true');
                        localStorage.setItem('tecnico_id', tecnico_id);
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
                
        }

        function verificar_campos_dispensacao() {
            const campos = [
                { id: 'id_dispensacao_via_atendimento', mensagem: 'Informe a <b>Via de Atendimento</b>!' },
                { id: 'id_dispensacao_uf_solicitacao', mensagem: 'Informe a <b>UF/SES</b>!' },
                { id: 'id_dispensacao_produto_id', mensagem: 'Selecione o <b>Produto Farmacêutico</b>!' },
                { id: 'id_dispensacao_quantidade', mensagem: 'Informe a <b>Quantidade Dispensada</b>!' },
                { id: 'id_dispensacao_status', mensagem: 'Informe o <b>Status do Pedido</b>!' },
                
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

});