from django.shortcuts import render
from django.http import QueryDict
from apps.gestao_pacientes.models import Pacientes, Dispensacoes
from apps.gestao_pacientes.forms import PacientesForm, DispensacoesForm
from apps.fornecedores.models import UF_Municipio
from apps.main.models import CustomLog
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from django.utils import timezone

def gestao_pacientes(request):

    tab_pacientes = Pacientes.objects.all()
    conteudo = {
        'tab_pacientes': tab_pacientes,
    }

    return render(request, 'gestao_pacientes/gestao_pacientes.html', conteudo)


#PACIENTE
def paciente_ficha(request, id_paciente=None):

    if id_paciente:
        paciente = Pacientes.objects.get(id=id_paciente)
        form_paciente = PacientesForm(instance=paciente)
    else:
        paciente = None
        form_paciente = PacientesForm()
    
    #salvar
    if request.method == 'POST':
        #Carregar formulário
        if paciente:
            paciente_form = PacientesForm(request.POST, instance=paciente)
            novo_paciente = False
        else:
            paciente_form = PacientesForm(request.POST)
            novo_paciente = True
        
        #Verificar se houve alteração no formulário
        if not paciente_form.has_changed():
            return JsonResponse({
                    'retorno': 'Não houve mudanças'
                })
        
        #salvar
        if paciente_form.is_valid():
            #Salvar o produto
            paciente = paciente_form.save(commit=False)
            paciente.save(current_user=request.user.usuario_relacionado)
            # Registrar a ação no CustomLog
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            observacoes = (
                f"Usuário {request.user.username} salvou o Paciente {paciente.nome}"
                f"(ID {paciente.id}, CNS: {paciente.cns}) "
                f"em {current_date_str}."
            )
            
            log_entry = CustomLog(
                usuario=request.user.usuario_relacionado,
                modulo="Gestao_Pacientes",
                model='Pacientes',
                model_id=paciente.id,
                item_id=0,
                item_descricao="Salvar edição de Paciente.",
                acao="Salvar",
                observacoes=observacoes
            )
            log_entry.save()
            
            #Retornar
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'retorno': 'Salvo',
                    'novo': novo_paciente,
                    'paciente_id': paciente.id,
                })
        else:
            print("Erro formulário Paciente.")
            print(paciente_form.errors)
            return JsonResponse({
                    'retorno': 'Erro ao salvar'
                })

    lista_ufs = UF_Municipio.objects.values_list('uf_sigla', flat=True).distinct().order_by('uf_sigla')
    lista_municipios = None
    if paciente:
        uf = paciente.paciente_uf()
        lista_municipios = UF_Municipio.objects.filter(uf_sigla=uf).values_list('cod_ibge', 'municipio').order_by('municipio')

    form_dispensacao = DispensacoesForm()

    conteudo = {
        'paciente': paciente,
        'form_paciente': form_paciente,
        'form_dispensacao': form_dispensacao,
        'lista_ufs': lista_ufs,
        'municipios': lista_municipios,
    }

    return render(request, 'gestao_pacientes/paciente_ficha.html', conteudo)


#DISPENSACAO
def dispensacao_salvar(request, dispensacao_id=None):
    if dispensacao_id:
        dispensacao = Dispensacoes.objects.get(id=dispensacao_id)
    else:
        dispensacao = None
    
    #salvar
    if request.method == 'POST':
        #Carregar formulário
        if dispensacao:
            dispensacao_form = DispensacoesForm(request.POST, instance=dispensacao)
            nova_dispensacao = False
        else:
            dispensacao_form = DispensacoesForm(request.POST)
            nova_dispensacao = True

        #Verificar se houve alteração no formulário
        if not dispensacao_form.has_changed():
            return JsonResponse({
                    'retorno': 'Não houve mudanças'
                })

        #Fazer uma cópia mutável do request.POST
        modificacoes_post = QueryDict(request.POST.urlencode(), mutable=True)
        ############
        ############
        ############
        ############
        ############
        ############
        #Instanciar a URT
        urt_id = request.POST.get('id_urt_tecnico')
        urt_instance = URTs.objects.get(id=urt_id)

        #Atualizar os valores no mutable_post
        modificacoes_post['urt'] = urt_instance

        #Criar o formulário com os dados atualizados
        tecnico_form = TecnicoURTForm(modificacoes_post, instance=tecnico_form.instance)

        #salvar
        if tecnico_form.is_valid():
            #Salvar o produto
            tecnico = tecnico_form.save(commit=False)
            tecnico.save(current_user=request.user.usuario_relacionado)

            # Registrar a ação no CustomLog
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            log_entry = CustomLog(
                usuario=request.user.usuario_relacionado,
                modulo="URTs_Tecnicos",
                model='TecnicoURT',
                model_id=tecnico.id,
                item_id=0,
                item_descricao="Salvar edição de dados do Técnico da URT.",
                acao="Salvar",
                observacoes=f"Usuário {request.user.username} salvou dados do Técnico da URT (ID {tecnico.id}, CPF: {tecnico.cpf}, CNPJ: {tecnico.cnpj}, Técnico: {tecnico.tecnico}, URT: {tecnico.urt}) em {current_date_str}."
            )
            log_entry.save()

            #Retornar
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'retorno': 'Salvo',
                    'novo': novo_tecnico,
                    'tecnico_id': tecnico.id,
                })
        else:
            print("Erro formulário Técnico da URT.")
            print(tecnico_form.errors)
            return JsonResponse({
                    'retorno': 'Erro ao salvar'
                })

def dispensacao_modal(request, dispensacao_id=None):
    try:
        item = TecnicoURT.objects.get(id=tecnico_id)
        data = {
            #log
            'id': item.id,
            'log_data_registro': item.registro_data.strftime('%d/%m/%Y %H:%M:%S') if item.registro_data else '',
            'log_responsavel_registro': str(item.usuario_atualizacao.nome_completo),
            'lot_ult_atualizacao': item.ult_atual_data.strftime('%d/%m/%Y %H:%M:%S') if item.ult_atual_data else '',
            'log_responsavel_atualizacao': str(item.usuario_atualizacao.nome_completo),
            'log_edicoes': item.log_n_edicoes,
            
            #contrato
            'status_contrato': item.status_contrato,
            'numero_contrato': item.numero_contrato,
            'data_inicio': item.data_inicio,
            'data_fim': item.data_fim,

            #dados da empresa
            'cnpj': item.cnpj,
            'razao_social': item.razao_social,
            'nome_fantasia': item.nome_fantasia,

            #dados do técnico
            'cpf': item.cpf,
            'tecnico': item.tecnico,
            'formacao_tecnica': item.formacao_tecnica,
            'celular': item.celular,
            'email': item.email,

            #observações
            'observacoes': item.observacoes_gerais,

            #campos ocultos
            'urt_id': item.urt.id,

        }
        return JsonResponse(data)
    except URTespecieAnimal.DoesNotExist:
        return JsonResponse({'error': 'Técnico não encontrado'}, status=404)

def dispensacao_deletar(request, dispensacao_id=None):   
    try:
        item = TecnicoURT.objects.get(id=tecnico_id)
        item.soft_delete(request.user.usuario_relacionado)

        # Registrar a ação no CustomLog
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="URTs_Técnicos",
            model='TecnicoURT',
            model_id=item.id,
            item_id=0,
            item_descricao="Deleção de Técnico da URT.",
            acao="Deletar",
            observacoes=f"Usuário {request.user.username} deletou dados do Técnico da URT (ID {item.id}, CPF: {item.cpf}, CNPJ: {item.cnpj}, Técnico: {item.tecnico}, URT: {item.urt}) em {current_date_str}."
            )
        log_entry.save()

        return JsonResponse({
            "message": "Técnico da URT deletado com sucesso!"
            })
    except URTespecieVegetal.DoesNotExist:
        return JsonResponse({
            "message": "Técnico da URT não encontrado."
            })


