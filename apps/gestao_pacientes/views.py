from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import QueryDict
from django.core.paginator import Paginator, EmptyPage
from apps.produtos.models import ProdutosFarmaceuticos
from apps.gestao_pacientes.models import Pacientes, Dispensacoes
from apps.gestao_pacientes.forms import PacientesForm, DispensacoesForm
from apps.fornecedores.models import UF_Municipio
from apps.main.models import CustomLog
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from openpyxl import Workbook
from django.utils.timezone import localtime
import json
from django.utils import timezone
from setup.choices import GENERO_SEXUAL, LISTA_UFS_SIGLAS, VIA_ATENDIMENTO

@login_required
def gestao_pacientes(request):
    tab_pacientes = Pacientes.objects.all().filter(del_status=False)
    lista_produtos = ProdutosFarmaceuticos.objects.all().filter(del_status=False).values_list('id', 'produto')
    conteudo = {
        'tab_pacientes': tab_pacientes,
        'lista_sexo': GENERO_SEXUAL,
        'lista_ses': LISTA_UFS_SIGLAS,
        'lista_via_atendimento': VIA_ATENDIMENTO,
        'lista_produtos': lista_produtos,
    }
    return render(request, 'gestao_pacientes/gestao_pacientes.html', conteudo)

@login_required
def gestao_pacientes_filtro(request):
    obito = request.GET.get('obito', None)
    cns = request.GET.get('cns', None)
    paciente = request.GET.get('paciente', None)
    sexo = request.GET.get('sexo', None)
    produto = request.GET.get('produto', None)
    via_atendimento = request.GET.get('via_atendimento', None)
    ses = request.GET.get('ses', None)
    
    filters = {'del_status': False}
    if cns:
        filters['cns__icontains'] = cns
    if paciente:
        filters['nome__icontains'] = paciente
    if sexo:
        filters['sexo'] = sexo
    
    #Filtragem inicial
    pacientes = Pacientes.objects.filter(**filters).order_by('nome')

    #Filtrar Óbito
    if obito:
        pacientes = [paciente for paciente in pacientes if paciente.paciente_obito() == obito]

    #Filtrar Produtos Recebidos
    if produto:
        print('Produto: ', produto)
        pacientes = [paciente for paciente in pacientes if produto.lower() in paciente.paciente_produtos_recebidos().lower()]

    #Filtrar Via de Atendimento
    if via_atendimento:
        print('Via de Atendimento: ', via_atendimento)
        pacientes = [paciente for paciente in pacientes if via_atendimento.lower() in paciente.paciente_via_atendimento().lower()]

    #Filtrar SES/UF
    if ses:
        pacientes = [paciente for paciente in pacientes if ses.lower() in paciente.paciente_ses_ufs().lower()]

    # Aqui 'pacientes' agora contém a lista de objetos após todas as filtragens
    # Se precisar da contagem total após a filtragem
    total_pacientes = len(pacientes)


    page = int(request.GET.get('page', 1))
    paginator = Paginator(pacientes, 100)
    try:
        pacientes_paginados = paginator.page(page)
    except EmptyPage:
        pacientes_paginados = paginator.page(paginator.num_pages)
    
    data = []
    for paciente in pacientes_paginados.object_list:
        paciente_dict = {
            'id': paciente.id,
            'nome': paciente.nome,
            'cns': paciente.cns,
            'cpf': paciente.cpf,
            'sexo': paciente.get_sexo_display(),
            'paciente_obito': paciente.paciente_obito(),  
            'paciente_idade': paciente.paciente_idade() if paciente.paciente_idade() is not None else "-",
            'paciente_produtos_recebidos': paciente.paciente_produtos_recebidos(),  
            'paciente_via_atendimento': paciente.paciente_via_atendimento(),  
            'paciente_ses_ufs': paciente.paciente_ses_ufs(),  
        }
        data.append(paciente_dict)
    
    return JsonResponse({
        'data': data,
        'total_pacientes': total_pacientes,
        'has_next': pacientes_paginados.has_next(),
        'has_previous': pacientes_paginados.has_previous(),
        'current_page': page
    })

@login_required
def gestao_pacientes_exportar(request):
    
    if request.method == 'POST':
        data = json.loads(request.body)
        obito = data.get('obito', None)
        cns = data.get('cns', None)
        paciente = data.get('paciente', None)
        sexo = data.get('sexo', None)
        produto = data.get('produto', None)
        via_atendimento = data.get('via_atendimento', None)
        ses = data.get('ses', None)
        
        filters = {'del_status': False}
        if cns:
            filters['cns__icontains'] = cns
        if paciente:
            filters['nome__icontains'] = paciente
        if sexo:
            filters['sexo'] = sexo
        
        #Filtragem inicial
        pacientes = Pacientes.objects.filter(**filters).order_by('nome')

        #Filtrar Óbito
        if obito:
            pacientes = [paciente for paciente in pacientes if paciente.paciente_obito() == obito]

        #Filtrar Produtos Recebidos
        if produto:
            pacientes = [paciente for paciente in pacientes if produto.lower() in paciente.paciente_produtos_recebidos().lower()]

        #Filtrar Via de Atendimento
        if via_atendimento:
            pacientes = [paciente for paciente in pacientes if via_atendimento.lower() in paciente.paciente_via_atendimento().lower()]

        #Filtrar SES/UF
        if ses:
            pacientes = [paciente for paciente in pacientes if ses.lower() in paciente.paciente_ses_ufs().lower()]

        data_exportacao = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Antes de criar o workbook, guarde a lista de pacientes em uma variável separada
        lista_pacientes = pacientes

        # Cria o workbook e adiciona as abas
        wb = Workbook()
        sheet = wb.active  # Use um nome diferente aqui, como 'sheet'
        sheet.title = "Pacientes"

        # Escreve os cabeçalhos na planilha
        sheet.append([
            'ID Paciente', 'Data Registro', 'Responsável Registro', 'Últ. Atualização', 'Responsável Últ. Atualização', 'N Edições',
            'CNS', 'CPF', 'Nome do Paciente', 'Data de Nascimento', 'Data de Óbito',
            'Sexo', 'Cor da Pele', 'Orientação Sexual', 
            'COD_IBGE', 'UF', 'Município',
            'Observacoes Gerais', 'Data Exportação'
        ])

        # No loop onde você está adicionando as linhas à planilha
        for paciente in lista_pacientes:
            # Converte 'registro_data' e 'ult_atual_data' para o fuso horário local e remove tzinfo
            registro_data = localtime(paciente.registro_data).replace(tzinfo=None)
            ult_atual_data = localtime(paciente.ult_atual_data).replace(tzinfo=None)
            
            # Agora 'registro_data' e 'ult_atual_data' não têm tzinfo e podem ser escritos no Excel
            sheet.append([
                paciente.id,
                registro_data.strftime('%Y-%m-%d %H:%M:%S'),  # Formata como string, se necessário
                str(paciente.usuario_registro.primeiro_ultimo_nome()),
                ult_atual_data.strftime('%Y-%m-%d %H:%M:%S'),  # Formata como string, se necessário
                str(paciente.usuario_atualizacao.primeiro_ultimo_nome()), paciente.log_n_edicoes,
                
                paciente.cns, paciente.cpf, paciente.nome, paciente.data_nascimento.date() if paciente.data_nascimento else '', paciente.data_obito.date() if paciente.data_obito else '',
                paciente.get_sexo_display(), paciente.get_cor_pele_display(), paciente.get_orientacao_sexual_display(),
                paciente.naturalidade_cod_ibge, paciente.paciente_uf(), paciente.paciente_municipio(),
                
                paciente.observacoes_gerais, data_exportacao
            ])
            
        
        # Registrar a ação no CustomLog
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="Controle Especial_Gestao de Pacientes",
            model='Pacientes',
            model_id=0,
            item_id=0,
            item_descricao="Exportação da lista de pacientes.",
            acao="Exportação",
            observacoes=f"Usuário {request.user.username} exportou dados de Pacientes em {current_date_str}."
        )
        log_entry.save()

        # Salva o workbook em um arquivo Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=proaq.xlsx'
        wb.save(response)
        
        return response
    

#PACIENTE
@login_required
def paciente_ficha(request, id_paciente=None):

    if id_paciente:
        paciente = Pacientes.objects.get(id=id_paciente)
        form_paciente = PacientesForm(instance=paciente)
        tab_dispensacoes = Dispensacoes.objects.filter(del_status=False, paciente=id_paciente).order_by('data_solicitacao')
    else:
        paciente = None
        form_paciente = PacientesForm()
        tab_dispensacoes = None
    
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
                modulo="Controle Especial_Gestao de Pacientes_Paciente",
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
        'tab_dispensacoes': tab_dispensacoes,
        'lista_ufs': lista_ufs,
        'municipios': lista_municipios,
    }

    return render(request, 'gestao_pacientes/paciente_ficha.html', conteudo)

@login_required
def paciente_deletar(request, id_paciente=None):   
    try:
        item = Pacientes.objects.get(id=id_paciente)
        item.soft_delete(request.user.usuario_relacionado)

        # Registrar a ação no CustomLog
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="Controle Especial_Gestao de Pacientes_Paciente",
            model='Paciente',
            model_id=item.id,
            item_id=0,
            item_descricao="Deleção de Paciente (Controle Especial).",
            acao="Deletar",
            observacoes=f"Usuário {request.user.username} deletou o Paciente {item.nome} (ID {item.id}, CNS: {item.cns}) em {current_date_str}."
            )
        log_entry.save()

        return JsonResponse({
            "message": "Paciente deletado com sucesso!"
            })
    except Dispensacoes.DoesNotExist:
        return JsonResponse({
            "message": "Paciente não encontrado."
            })


#DISPENSACAO
@login_required
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

        #Quantidade
        quantidade_str = request.POST.get('quantidade')
        quantidade_float = float(quantidade_str)

        #Instanciar a URT
        paciente_id = request.POST.get('id_dispensacao_paciente')
        paciente_instance = Pacientes.objects.get(id=paciente_id)

        #Atualizar os valores no mutable_post
        modificacoes_post['quantidade'] = quantidade_float
        modificacoes_post['paciente'] = paciente_instance

        #Criar o formulário com os dados atualizados
        dispensacao_form = DispensacoesForm(modificacoes_post, instance=dispensacao_form.instance)

        #salvar
        if dispensacao_form.is_valid():
            #Salvar o produto
            dispensacao = dispensacao_form.save(commit=False)
            dispensacao.save(current_user=request.user.usuario_relacionado)

            # Registrar a ação no CustomLog
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            log_entry = CustomLog(
                usuario=request.user.usuario_relacionado,
                modulo="Controle Especial_Gestão de Pacientes_Dispensações",
                model='Dispensacoes',
                model_id=dispensacao.id,
                item_id=0,
                item_descricao="Salvar edição de Dispensação de Medicamentos (Controle Especial).",
                acao="Salvar",
                observacoes=f"Usuário {request.user.username} salvou dados da Dispensação de Medicamento (ID {dispensacao.id}, Produto: {dispensacao.produto.produto}, Quantidade: {dispensacao.quantidade}, Paciente: {dispensacao.paciente.nome}, ID Paciente: {dispensacao.paciente.id}) em {current_date_str}."
            )
            log_entry.save()

            #Retornar
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'retorno': 'Salvo',
                    'novo': nova_dispensacao,
                    'dispensacao_id': dispensacao.id,
                })
        else:
            print("Erro formulário Dispensação de Medicamento (Controle Especial).")
            print(dispensacao_form.errors)
            return JsonResponse({
                    'retorno': 'Erro ao salvar'
                })

@login_required
def dispensacao_modal(request, dispensacao_id=None):
    try:
        item = Dispensacoes.objects.get(id=dispensacao_id)
        data = {
            #log
            'id': item.id,
            'log_data_registro': item.registro_data.strftime('%d/%m/%Y %H:%M:%S') if item.registro_data else '',
            'log_responsavel_registro': str(item.usuario_atualizacao.dp_nome_completo),
            'lot_ult_atualizacao': item.ult_atual_data.strftime('%d/%m/%Y %H:%M:%S') if item.ult_atual_data else '',
            'log_responsavel_atualizacao': str(item.usuario_atualizacao.dp_nome_completo),
            'log_edicoes': item.log_n_edicoes,
            
            #dados administrativos
            'via_atendimento': item.via_atendimento,
            'origem_demanda_judicial': item.origem_demanda_judicial,
            'numero_processo_sei': item.numero_processo_sei,
            'uf_solicitacao': item.uf_solicitacao,

            #produto
            'id_produto': item.produto.id,
            'quantidade': item.quantidade,
            
            #tratamento
            'cid': item.cid,
            'fase_tratamento': item.fase_tratamento,
            'ciclo': item.ciclo,

            #pedido
            'status': item.status,
            'numero_pedido_sismat': item.numero_pedido_sismat,
            'data_solicitacao': item.data_solicitacao,
            'data_envio': item.data_envio,
            'data_entrega': item.data_entrega,
            'data_consumo': item.data_consumo,

            #aplicação
            'comprovante_doc_sei': item.comprovante_doc_sei,
            'local_aplicacao_uf': item.local_aplicacao_uf(),
            'local_aplicacao_cod_ibge': item.local_aplicacao_cod_ibge,
            'local_aplicacao_unidade_saude': item.local_aplicacao_unidade_saude,

            #observações
            'observacoes': item.observacoes_gerais,

            #campos ocultos
            'paciente_id': item.paciente.id,

        }
        return JsonResponse(data)
    except Dispensacoes.DoesNotExist:
        return JsonResponse({'error': 'Dispensação não encontrada'}, status=404)

@login_required
def dispensacao_deletar(request, dispensacao_id=None):   
    try:
        item = Dispensacoes.objects.get(id=dispensacao_id)
        item.soft_delete(request.user.usuario_relacionado)

        # Registrar a ação no CustomLog
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="Controle Especial_Gestão de Pacientes_Dispensações",
            model='Dispensacoes',
            model_id=item.id,
            item_id=0,
            item_descricao="Deleção de Dispensação de Medicamento (Controle Especial).",
            acao="Deletar",
            observacoes=f"Usuário {request.user.username} deletou dados da Dispensação de Medicamento (ID {item.id}, Produto: {item.produto.produto}, Quantidade: {item.quantidade}, Paciente: {item.paciente.nome}, ID Paciente: {item.paciente.id}) em {current_date_str}."
            )
        log_entry.save()

        return JsonResponse({
            "message": "Dispensação de Medicamento deletado com sucesso!"
            })
    except Dispensacoes.DoesNotExist:
        return JsonResponse({
            "message": "Dispensação de Medicamento não encontrada."
            })


#RELATÓRIOS
@login_required
def paciente_ficha_relatorio(request, id_paciente=None):
    paciente = Pacientes.objects.get(id=id_paciente)
    tab_dispensacoes = Dispensacoes.objects.filter(del_status=False, paciente=id_paciente)
    
    #Log Relatório
    usuario_nome = request.user.usuario_relacionado.primeiro_ultimo_nome
    data_hora_atual = datetime.now()
    data_hora = data_hora_atual.strftime('%d/%m/%Y %H:%M:%S')
    
    conteudo = {
        'paciente': paciente,
        'tab_dispensacoes': tab_dispensacoes,
        'usuario': usuario_nome,
        'data_hora': data_hora,
    }
    return render(request, 'gestao_pacientes/paciente_ficha_relatorio.html', conteudo)

