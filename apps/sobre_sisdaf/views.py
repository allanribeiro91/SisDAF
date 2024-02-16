from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from apps.sobre_sisdaf.models import VersoesSisdaf, RegistroPontoControle, Backlog
from apps.main.models import CustomLog
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from django.core.paginator import Paginator, EmptyPage
from openpyxl import Workbook
from django.utils.timezone import localtime

@login_required
def sisdaf_ajuda(request):
    return render(request, 'sobre_sisdaf/ajuda.html')

@login_required
def sisdaf_banco_dados(request):
    return render(request, 'sobre_sisdaf/banco_dados.html')

@login_required
def sisdaf_sugestoes(request):
    return render(request, 'sobre_sisdaf/sugestoes.html')

@login_required
def sisdaf_versoes(request):
    tab_versoes = VersoesSisdaf.objects.all().filter(del_status=False).order_by('-versao')
    conteudo = {
        'tab_versoes': tab_versoes,
    }
    return render(request, 'sobre_sisdaf/versoes.html', conteudo)

@login_required
def sisdaf_pontos_controle(request):
    tab_pontos_controle = RegistroPontoControle.objects.all().filter(del_status=False).order_by('-data')
    conteudo = {
       'tab_pontos_controle': tab_pontos_controle,
    }
    return render(request, 'sobre_sisdaf/pontos_controle.html', conteudo)


#BACKLOG
@login_required
def sisdaf_backlog(request):
    tab_backlog = Backlog.objects.all().filter(del_status=False).order_by('-id')
    conteudo = {
       'tab_backlog': tab_backlog,
    }
    return render(request, 'sobre_sisdaf/backlog.html', conteudo)

@login_required
def sisdaf_backlog_buscar_dados(request, id_backlog):
    backlog = Backlog.objects.get(id=id_backlog)

    responsavel_registro = backlog.usuario_registro.primeiro_ultimo_nome()
    responsavel_atualizacao = backlog.usuario_atualizacao.primeiro_ultimo_nome()
    dias = backlog.dias()
    data_registro_formatada = backlog.registro_data.strftime('%d/%m/%Y %H:%M:%S')
    data_atualizacao_formatada = backlog.ult_atual_data.strftime('%d/%m/%Y %H:%M:%S')

    backlog_dados = {
        'id': backlog.id,
        'data_registro': data_registro_formatada,
        'responsavel_registro': responsavel_registro,
        'ultima_atualizacao': data_atualizacao_formatada,
        'responsavel_ultima_atualizacao': responsavel_atualizacao,
        'log_n_edicoes': backlog.log_n_edicoes,
        'status': backlog.get_status_display(),
        'tipo_item': backlog.get_tipo_item_display(),
        'data_entrada': backlog.data_entrada.strftime('%d/%m/%Y') if backlog.data_entrada else '-',
        'data_entrega': backlog.data_entrega.strftime('%d/%m/%Y') if backlog.data_entrega else '-',
        'dias': dias,
        'responsavel': backlog.responsavel_realizacao.primeiro_ultimo_nome() if backlog.responsavel_realizacao else 'Não informado',
        'item': backlog.item,
        'detalhamento': backlog.detalhamento,
        'observacoes_gerais': backlog.observacoes_gerais if backlog.observacoes_gerais else 'Sem observações.',
        
    }
    print(backlog_dados)

    return JsonResponse({'backlog': backlog_dados})

@login_required
def sisdaf_backlog_filtro(request):
    tipo_item = request.GET.get('tipo_item', None)
    status = request.GET.get('status', None)
    
    filters = {'del_status': False}
    if tipo_item:
        filters['tipo_item'] = tipo_item
    if status:
        filters['status'] = status
    
    #Filtragem inicial
    backlogs = Backlog.objects.filter(**filters).order_by('id')
    total_backlogs = backlogs.count()

    page = int(request.GET.get('page', 1))
    paginator = Paginator(backlogs, 100)
    try:
        backlogs_paginados = paginator.page(page)
    except EmptyPage:
        backlogs_paginados = paginator.page(paginator.num_pages)
    
    data = []
    for item in backlogs_paginados.object_list:
        item_dict = {
            'id': item.id,
            'tipo_item': item.tipo_item,
            'status': item.status,
            'responsavel': item.responsavel_realizacao.primeiro_ultimo_nome(),
            'data_entrada': item.data_entrada,
            'data_entrega': item.data_entrega,
            'dias': item.dias(),
            'item': item.item,
        }
        data.append(item_dict)
    
    return JsonResponse({
        'data': data,
        'total_backlogs': total_backlogs,
        'has_next': backlogs_paginados.has_next(),
        'has_previous': backlogs_paginados.has_previous(),
        'current_page': page
    })

@login_required
def sisdaf_backlog_exportar(request):
    
    if request.method == 'POST':
        tipo_item = request.GET.get('tipo_item', None)
        status = request.GET.get('status', None)
        
        filters = {'del_status': False}
        if tipo_item:
            filters['tipo_item'] = tipo_item
        if status:
            filters['status'] = status
        
        #Filtro
        backlogs = Backlog.objects.filter(**filters).order_by('id')

        data_exportacao = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Cria o workbook e adiciona as abas
        wb = Workbook()
        sheet = wb.active  # Use um nome diferente aqui, como 'sheet'
        sheet.title = "Pacientes"

        # Escreve os cabeçalhos na planilha
        sheet.append([
            'ID Backlo', 'Data Registro', 'Responsável Registro', 'Últ. Atualização', 'Responsável Últ. Atualização', 'N Edições',
            'Tipo de Item', 'Status', 'Data Entrada', 'Data Entrega', 'Responsável',
            'Item', 'Detalhamento',
            'Observacoes Gerais', 'Data Exportação'
        ])

        # No loop onde você está adicionando as linhas à planilha
        for backlog in backlogs:
            # Converte 'registro_data' e 'ult_atual_data' para o fuso horário local e remove tzinfo
            registro_data = localtime(backlog.registro_data).replace(tzinfo=None)
            ult_atual_data = localtime(backlog.ult_atual_data).replace(tzinfo=None)
            
            # Agora 'registro_data' e 'ult_atual_data' não têm tzinfo e podem ser escritos no Excel
            sheet.append([
                backlog.id,
                registro_data.strftime('%Y-%m-%d %H:%M:%S'),  # Formata como string, se necessário
                str(backlog.usuario_registro.primeiro_ultimo_nome()),
                ult_atual_data.strftime('%Y-%m-%d %H:%M:%S'),  # Formata como string, se necessário
                str(backlog.usuario_atualizacao.primeiro_ultimo_nome()), backlog.log_n_edicoes,
                
                backlog.get_tipo_item_display(), backlog.get_status_display(),
                backlog.data_entrada, backlog.data_entrega, backlog.responsavel_realizacao.primeiro_ultimo_nome(),
                backlog.item, backlog.detalhamento,
                
                backlog.observacoes_gerais, data_exportacao
            ])
            
        
        # Registrar a ação no CustomLog
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="Sobre o SisDAF_Backlogs",
            model='Backlog',
            model_id=0,
            item_id=0,
            item_descricao="Exportação da lista de Backlogs.",
            acao="Exportação",
            observacoes=f"Usuário {request.user.username} exportou dados de Backlogs em {current_date_str}."
        )
        log_entry.save()

        # Salva o workbook em um arquivo Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=proaq.xlsx'
        wb.save(response)
        
        return response
    


#RELATÓRIOS
def relatorio_ponto_controle(request, id_ponto_controle=None):
    ponto_controle = RegistroPontoControle.objects.get(id=id_ponto_controle)
    
    #Log Relatório
    usuario_nome = request.user.usuario_relacionado.primeiro_ultimo_nome
    data_hora_atual = datetime.now()
    data_hora = data_hora_atual.strftime('%d/%m/%Y %H:%M:%S')
    
    conteudo = {
        'ponto_controle': ponto_controle,
        'usuario': usuario_nome,
        'data_hora': data_hora,
    }
    return render(request, 'sobre_sisdaf/relatorio_ponto_controle.html', conteudo)