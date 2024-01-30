document.addEventListener("DOMContentLoaded", function () {
    
    //Verificar se há mensagem de salvamento com sucesso
    if (localStorage.getItem('pacienteSalvo') === 'true') {
        sweetAlert('Dados do Paciente salvos com sucesso!', 'success', 'top-end');
        localStorage.removeItem('pacienteSalvo');
    }
    if (localStorage.getItem('dispensacaoSalva') === 'true') {
        sweetAlert('Dispensação salva com sucesso!', 'success', 'top-end');
        let idDispensacao = localStorage.getItem('dispensacao_id');
        localStorage.removeItem('dispensacaoSalva');
        if (idDispensacao) {
            localStorage.removeItem('dispensacao_id');
            openModalDispensacao(idDispensacao)
        }
    }

    //Máscaras
    $('#id_paciente_cns').mask('000 0000 0000 0000');
    $('#id_paciente_cpf').mask('000.000.000-00');
    $('#id_dispensacao_processo_sei').mask('00000.000000/0000-00');
    $('#id_dispensacao_comprovante_doc_sei').mask('000000')
    $('#id_dispensacao_cid').mask('Z00.0', {
        translation: {
            'Z': { pattern: /[A-Za-z]/, optional: true }, // Aceita letras maiúsculas e minúsculas
            '0': { pattern: /\d/ } // Aceita dígitos numéricos
        },
        onKeyPress: function(value, event, currentField, options) {
            $(currentField).val(value.toUpperCase()); // Transforma letras em maiúsculas
        }
    });
    
    

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
    const data_obito = document.getElementById('id_paciente_data_obito')
    const paciente_idade = document.getElementById('id_paciente_idade')
    data_nascimento.addEventListener('change', function(){
        
        var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data de Óbito</b> não pode ser anterior à <b style="color:red">Data de Nascimento</b>!</span>' 
        var coerencia_datas = analisar_coerencia_datas('id_paciente_data_nascimento', 'id_paciente_data_obito', mensagem)
        if (coerencia_datas == false){
            data_nascimento.value = ''
            return
        }
        
        var idade = calcular_idade(data_nascimento.value, data_obito.value)
        
        paciente_idade.value = idade + " anos"
    })

    data_obito.addEventListener('change', function(){
        
        var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data de Óbito</b> não pode ser anterior à <b style="color:red">Data de Nascimento</b>!</span>' 
        var coerencia_datas = analisar_coerencia_datas('id_paciente_data_nascimento', 'id_paciente_data_obito', mensagem)
        if (coerencia_datas == false){
            data_obito.value = ''
            return
        }
        
        var idade = calcular_idade(data_nascimento.value, data_obito.value)
        
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

    //Deletar Paciente
    const botao_deletar_paciente = document.getElementById('btnDeletarPaciente')
    botao_deletar_paciente.addEventListener('click', function() {
        var id_paciente = document.getElementById('id_paciente').value

        if (id_paciente == ''){
            window.location.href = '/gestao_pacientes/'
            return
        }

        //parâmetros para deletar
        const mensagem = "Deletar Paciente."
        const url_delete = "/gestao_pacientes/paciente/deletar/" + id_paciente + "/"

        const url_apos_delete = '/gestao_pacientes/';
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        //chamar sweetAlert
        sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
    })

    
    //DISPENSACOES
        //Inserir Nova Dispensação
        const botao_nova_dispensacao = document.getElementById('btnNovaDispensacao')
            const modal_dispensacao = new bootstrap.Modal(document.getElementById('pacienteDispensacaoModal'))
            botao_nova_dispensacao.addEventListener('click', function(){
                
                limparDadosDispensacao();

                const id_dispensacao_paciente = document.getElementById('id_dispensacao_paciente')
                id_dispensacao_paciente.value = document.getElementById('id_paciente').value

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

                dispensacao_data_consumo.setAttribute('readonly', 'readonly')
                dispensacao_data_consumo.value = ''
            }

            if (dispensacao_status.value == 'consumido') {
                dispensacao_numero_pedido.removeAttribute('readonly')
                dispensacao_data_envio.removeAttribute('readonly')
                dispensacao_data_consumo.removeAttribute('readonly')
            }

        })

        dispensacao_data_envio.addEventListener('change', function(){
            var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data de Envio</b> não pode ser anterior à <b style="color:red">Data da Solicitação</b>!</span>' 
            analisar_coerencia_datas('id_dispensacao_data_solicitacao', 'id_dispensacao_data_envio', mensagem)
        })

        dispensacao_data_consumo.addEventListener('change', function(){
            var mensagem = '<span style="font-weight:normal">A <b style="color:red">Data do Consumo</b> não pode ser anterior à <b style="color:red">Data do Envio</b>!</span>' 
            analisar_coerencia_datas('id_dispensacao_data_envio', 'id_dispensacao_data_consumo', mensagem)
        })

        

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
                        let dispensacao_id = data.dispensacao_id;
                        localStorage.setItem('dispensacaoSalva', 'true');
                        localStorage.setItem('dispensacao_id', dispensacao_id);
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
                { id: 'id_dispensacao_data_solicitacao', mensagem: 'Informe a <b>Data da Solicitação</b>!' },
                
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

        //Abrir modal do técnico
        function openModalDispensacao(id_dispensacao) {
            fetch(`/gestao_pacientes/paciente/dispensacao/${id_dispensacao}/dados`)
            
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do Dispensação.');
                    }
                    return response.json();
                })
                .then(data => {
                    // Atualizar os campos do formulário no modal com os dados recebidos
                    var event = new Event('change');

                    //log
                    $('#dispensacao_id').val(data.id);
                    $('#dispensacao_log_data_registro').val(data.log_data_registro);
                    $('#dispensacao_log_responsavel_registro').val(data.log_responsavel_registro);
                    $('#dispensacao_log_ult_atualizacao').val(data.lot_ult_atualizacao);
                    $('#dispensacao_log_responsavel_atualizacao').val(data.log_responsavel_atualizacao);
                    $('#dispensacao_log_edicoes').val(data.log_edicoes);

                    //dados administrativos
                    $('#id_dispensacao_via_atendimento').val(data.via_atendimento);
                    $('#id_dispensacao_origem_demanda_judicial').val(data.origem_demanda_judicial);
                    $('#id_dispensacao_processo_sei').val(data.numero_processo_sei);
                    $('#id_dispensacao_uf_solicitacao').val(data.uf_solicitacao);

                    //produto
                    $('#id_dispensacao_produto_id').val(data.id_produto);
                    $('#id_dispensacao_produto').val(data.id_produto);
                    $('#id_dispensacao_quantidade').val(data.quantidade);
                    
                    //tratamento
                    $('#id_dispensacao_cid').val(data.cid);
                    $('#id_dispensacao_fase_tratamento').val(data.fase_tratamento);
                    $('#id_dispensacao_ciclo').val(data.ciclo);

                    //pedido
                    $('#id_dispensacao_status').val(data.status);
                    $('#id_dispensacao_numero_pedido_sismat').val(data.numero_pedido_sismat);
                    $('#id_dispensacao_data_solicitacao').val(data.data_solicitacao);
                    $('#id_dispensacao_data_envio').val(data.data_envio);
                    $('#id_dispensacao_data_consumo').val(data.data_consumo);

                    //aplicação
                    $('#id_dispensacao_comprovante_doc_sei').val(data.comprovante_doc_sei);
                    $('#id_dispensacao_uf').val(data.local_aplicacao_uf);
                    if(data.local_aplicacao_cod_ibge){
                        dispensacao_municipio.removeAttribute('disabled')
                    }
                    $('#id_dispensacao_local_aplicacao_cod_ibge').val(data.local_aplicacao_cod_ibge);
                    $('#id_dispensacao_municipio').val(data.local_aplicacao_cod_ibge);
                    $('#id_dispensacao_local_aplicacao_unidade_saude').val(data.local_aplicacao_unidade_saude);

                    //observações
                    $('#id_dispensacao_observacoes_gerais').val(data.observacoes);

                    //campos ocultos
                    $('#id_dispensacao_paciente').val(data.paciente_id);

                    // Abrir o modal
                    modal_dispensacao.show();

                    //Acionar o evento
                    dispensacao_status.dispatchEvent(event);
                    dispensacao_via_atendimento.dispatchEvent(event);
                    
                })
                .catch(error => {
                    console.log(error);
                });
        }

        const tabela_dispensacoes = document.getElementById('tabDispensacoes');
        tabela_dispensacoes.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'TD') {
            const row = target.closest('tr');
            const item = row.dataset.id;
            
            openModalDispensacao(item);
        }
        });

        //Deletar Dispensação
        const botao_deletar_dispensacao = document.getElementById('btnDeletarDispensacao')
        botao_deletar_dispensacao.addEventListener('click', function() {
            var id_dispensacao = document.getElementById('dispensacao_id').value

            if (id_dispensacao == ''){
                modal_dispensacao.hide();
                limparDadosDispensacao();
                return
            }

            //parâmetros para deletar
            const mensagem = "Deletar Dispensação de Medicamento."
            const url_delete = "/gestao_pacientes/paciente/dispensacao/deletar/" + id_dispensacao + "/"

            const url_apos_delete = window.location.href;
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            //chamar sweetAlert
            sweetAlertDelete(mensagem, url_delete, csrfToken, url_apos_delete)
        })

        //Limpar dados do modal Dispensações
        function limparDadosDispensacao() {
            var campos = [
                //Logs
                'dispensacao_id', 'dispensacao_log_data_registro', 'dispensacao_log_responsavel_registro', 
                'dispensacao_log_ult_atualizacao', 'dispensacao_log_responsavel_atualizacao', 'dispensacao_log_edicoes',

                //Dados Administrativos
                'id_dispensacao_via_atendimento', 'id_dispensacao_origem_demanda_judicial',
                'id_dispensacao_processo_sei', 'id_dispensacao_uf_solicitacao',

                //Produto
                'id_dispensacao_produto_id', 'id_dispensacao_produto', 'id_dispensacao_quantidade',
                
                //Tratamento
                'id_dispensacao_cid', 'id_dispensacao_fase_tratamento', 'id_dispensacao_ciclo',

                //Pedido
                'id_dispensacao_status', 'id_dispensacao_numero_pedido_sismat', 'id_dispensacao_data_solicitacao',
                'id_dispensacao_data_envio', 'id_dispensacao_data_consumo',

                //Aplicação
                'id_dispensacao_comprovante_doc_sei', 'id_dispensacao_local_aplicacao_cod_ibge', 'id_dispensacao_uf',
                'id_dispensacao_municipio', 'id_dispensacao_local_aplicacao_unidade_saude',

                //Observações
                'id_dispensacao_observacoes',

                //Campos ocultos
                'id_dispensacao_paciente'

            ];
        
            campos.forEach(function(campo) {
                document.getElementById(campo).value = '';
            });

        }

        //Relatório Ficha do Paciente
        const botao_ficha_paciente = document.getElementById('btnPacienteRelatorio')
        botao_ficha_paciente.addEventListener('click', function(){

            const id_paciente = document.getElementById('id_paciente').value

            if (id_paciente == '') {
                sweetAlert('Não há dados!', 'warning')
                return
            }

            var width = 1000;
            var height = 700;
            var left = (window.screen.width / 2) - (width / 2);
            var top = (window.screen.height / 2) - (height / 2);
            
            var url = '/gestao_pacientes/paciente/relatorio/' + id_paciente + '/';

            window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
        })

});