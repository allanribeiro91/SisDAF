from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.paginator import Paginator, EmptyPage
from django.contrib import auth, messages
from apps.main.models import CustomLog
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from apps.contratos.models import ContratosArps
from apps.contratos.forms import ContratosArpsForm
from setup.choices import UNIDADE_DAF2, MODALIDADE_AQUISICAO, STATUS_ARP, YES_NO, TIPO_COTA
from django.http import JsonResponse, HttpResponse
from datetime import datetime
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from datetime import datetime
from io import BytesIO
import json

#CONTRATOS
def contratos(request):
    return render(request, 'contratos/contratos.html')

def contrato_ficha(request):
    return render(request, 'contratos/contrato_ficha.html')




#ARPs
def arps(request):
    tab_arps = ContratosArps.objects.all().order_by('-data_publicacao')
    denominacoes = DenominacoesGenericas.objects.values_list('id', 'denominacao')
    fornecedores = Fornecedores.objects.values_list('nome_fantasia', flat=True).distinct().order_by('nome_fantasia')
    unidades_daf = [item for item in UNIDADE_DAF2 if item[0] != 'nao_informado']
    conteudo = {
        'lista_status': STATUS_ARP,
        'lista_unidadesdaf': unidades_daf,
        'lista_denominacoes': denominacoes,
        'lista_fornecedores': fornecedores,
        'tab_arps': tab_arps,
    }
    return render(request, 'contratos/arps.html', conteudo)

def arp_ficha(request, arp_id=None):
    if arp_id:
        try:
            arp = ContratosArps.objects.get(id=arp_id)
        except ContratosArps.DoesNotExist:
            messages.error(request, "ARP não encontrada.")
            return redirect('arps')
    else:
        arp = None
    
    #salvar
    if request.method == 'POST':
        #Carregar formulário
        if arp:
            arp_form = ContratosArpsForm(request.POST, instance=arp)
            nova_arp = False
        else:
            arp_form = ContratosArpsForm(request.POST)
            nova_arp = True

        #Conferir campos obrigatórios
        fields = [
            ('unidade_daf', "A Unidade DAF é obrigatória!"),
            ('numero_processo_sei', "Número do Processo SEI é obrigatório!"),
            ('numero_documento_sei', "Número do Documento SEI obrigatório!"),
            ('numero_arp', "Número do Documento SEI obrigatório!"),
            ('status', "Status da ARP é obrigatório!"),
            ('denominacao', "A Denominação Genérica é obrigatória!"),
        ]
        for field_name, error_message in fields:
            valor = request.POST.get(field_name)
            if valor == "Não informado" or valor == None or valor == '':
                messages.error(request, error_message)
                if arp:
                    return JsonResponse({
                        'redirect_url': reverse('arp_ficha', args=[arp.id]),
                    })
                else:
                    return JsonResponse({
                        'redirect_url': reverse('arp_nova'),
                        'data': request.POST,
                    })

        #Verificar se houve alteração no formulário
        if not arp_form.has_changed():
            messages.error(request, "Dados não foram salvos. Não houve mudanças.")
            if arp:
                return JsonResponse({
                    'redirect_url': reverse('arp_ficha', args=[arp.id]),
                })
            else:
                #return redirect('fornecedor_novo')
                return JsonResponse({
                    'redirect_url': reverse('arp_nova'),
                })

        #Passar o objeto Denominação Genérica
        denominacao_id = request.POST.get('denominacao')
        denominacao_instance = DenominacoesGenericas.objects.get(id=denominacao_id)
        arp_form.instance.denominacao = denominacao_instance

        #Passar o objeto Fornecedor
        fornecedor_id = request.POST.get('fornecedor')
        print('Fornecedor ID: ', fornecedor_id)
        fornecedor_instance =  Fornecedores.objects.get(id=fornecedor_id)
        arp_form.instance.fornecedor = fornecedor_instance
        print('Fornecedor: ', arp_form.instance.fornecedor.id)
        print(arp_form)
        
        #salvar
        if arp_form.is_valid():
            #Salvar o produto
            arp = arp_form.save(commit=False)
            arp.save(current_user=request.user.usuario_relacionado)
            if nova_arp:
                messages.success(request, "Nova ARP registrada com sucesso!")
            else:
                messages.success(request, "Dados atualizados com sucesso!")
            
            # Registrar a ação no CustomLog
            current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
            log_entry = CustomLog(
                usuario=request.user.usuario_relacionado,
                modulo="Contratos_ARPs",
                item_id=0,
                item_descricao="Salvar edição de ARP.",
                acao="Salvar",
                #observacoes=f"Usuário {request.user.username} salvou a ARP (ID {arp.id}, Número: {arp.topico}, Denominação: {arp.denominacao.denominacao}, Fornecedor: {arp.fornecedor.nome_fantasia}) em {current_date_str}."
                observacoes=f"Usuário {request.user.username} salvou a ARP (ID {arp.id}, Número: {arp.numero_arp}, Denominação: {arp.denominacao.denominacao}) em {current_date_str}."
            )
            log_entry.save()

            #Retornar
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'redirect_url': reverse('arp_ficha', args=[arp.id]),
                })
        else:
            messages.error(request, "Formulário inválido")
            print("Erro formulário ARP")
            print(arp_form.errors)
    
    #Form
    if arp:
            form = ContratosArpsForm(instance=arp)
    else:
        form = ContratosArpsForm()
            
    return render(request, 'contratos/arp_ficha.html', {
        'YES_NO': YES_NO,
        'TIPO_COTA': TIPO_COTA,
        'form': form,
        'arp': arp,
    })

def arp_buscar_produtos(request, denominacao=None):
    produtos = ProdutosFarmaceuticos.get_produtos_por_denominacao(denominacao)
    return JsonResponse(produtos, safe=False)

def arp_filtrar(request):
    status_arp = request.GET.get('status_arp', None)
    unidade_daf = request.GET.get('unidade_daf', None)
    denominacao = request.GET.get('denominacao', None)
    fornecedor = request.GET.get('fornecedor', None)

    filters = {}
    filters['del_status'] = False
    if status_arp:
        filters['status'] = status_arp
    if unidade_daf:
        filters['unidade_daf'] = unidade_daf
    if denominacao:
        filters['denominacao_id'] = denominacao
    if fornecedor:
        filters['fornecedor__nome_fantasia__icontains'] = fornecedor
    
    tab_arps = ContratosArps.objects.filter(**filters).order_by('-data_publicacao')
    total_arps = tab_arps.count()

    page = int(request.GET.get('page', 1))
    paginator = Paginator(tab_arps, 100)  # Mostra 100 faqs por página
    try:
        arp_paginados = paginator.page(page)
    except EmptyPage:
        arp_paginados = paginator.page(paginator.num_pages)

    data = []
    for arp in arp_paginados.object_list:
        print('Denominacao :', arp.denominacao.denominacao),
        arp_data = {
            'id': arp.id,
            'status': arp.status,
            'unidade_daf': arp.unidade_daf,
            'numero_processo_sei': arp.numero_processo_sei,
            'numero_documento_sei': arp.numero_documento_sei,
            'data_publicacao': arp.data_publicacao.strftime('%d/%m/%Y') if arp.data_publicacao else '',
            'denominacao': arp.denominacao.denominacao,
            
            'fornecedor': arp.fornecedor.nome_fantasia
        }
        data.append(arp_data)

    return JsonResponse({
        'data': data,
        'total_arps': total_arps,
        'has_next': arp_paginados.has_next(),
        'has_previous': arp_paginados.has_previous(),
        'current_page': page
    })

def arp_exportar(request):
    print("Exportar ARPs")
    
    if request.method == 'POST':
        data = json.loads(request.body)
        status_arp = data.get('status_arp')
        unidade_daf = data.get('unidade_daf')
        denominacao = data.get('denominacao')
        fornecedor = data.get('fornecedor')

        filters = {}
        filters['del_status'] = False
        if status_arp:
            filters['status'] = status_arp
        if unidade_daf:
            filters['unidade_daf'] = unidade_daf
        if denominacao:
            filters['denominacao_id'] = denominacao
        if fornecedor:
            filters['fornecedor__nome_fantasia__icontains'] = fornecedor
        
        arps = ContratosArps.objects.filter(**filters)
        current_date_str = datetime.now().strftime('%d/%m/%Y %H:%M:%S')

        # Criar um workbook e adicionar uma planilha
        wb = Workbook()
        ws = wb.active
        ws.title = "arps"

        headers = [
        'ID', 'Usuário Registro', 'Usuário Atualização', 'Data de Registro', 'Data da Última Atualização', 'N Edições', 
        'Unidade DAF', 'Processo SEI', 'Documento SEI', 'ARP', 'Status', 'Data Publicacao',
        'Denominacao', 'Fornecedor',
        'Observações Gerais', 'Data Exportação'
        ]

        for col_num, header in enumerate(headers, 1):
            col_letter = get_column_letter(col_num)
            ws['{}1'.format(col_letter)] = header
            ws.column_dimensions[col_letter].width = 20

        # Adicionar dados da tabela
        for row_num, arp in enumerate(arps, 2):
            registro_data = arp.registro_data.replace(tzinfo=None)
            ult_atual_data = arp.ult_atual_data.replace(tzinfo=None)
            data_publicacao = arp.data_publicacao
            if data_publicacao:
                data_publicacao.strftime('%d/%m/%Y')
            denominacao = str(arp.denominacao)
            fornecedor = str(arp.fornecedor)

            ws.cell(row=row_num, column=1, value=arp.id)
            ws.cell(row=row_num, column=2, value=str(arp.usuario_registro.primeiro_ultimo_nome()))
            ws.cell(row=row_num, column=3, value=str(arp.usuario_atualizacao.primeiro_ultimo_nome()))
            ws.cell(row=row_num, column=4, value=registro_data)
            ws.cell(row=row_num, column=5, value=ult_atual_data)
            ws.cell(row=row_num, column=6, value=arp.log_n_edicoes)
            ws.cell(row=row_num, column=7, value=arp.unidade_daf)
            ws.cell(row=row_num, column=8, value=arp.numero_processo_sei)
            ws.cell(row=row_num, column=9, value=arp.numero_documento_sei)
            ws.cell(row=row_num, column=10, value=arp.numero_arp)
            ws.cell(row=row_num, column=11, value=arp.status)
            ws.cell(row=row_num, column=12, value=data_publicacao)
            ws.cell(row=row_num, column=13, value=denominacao)
            ws.cell(row=row_num, column=14, value=fornecedor)
            ws.cell(row=row_num, column=15, value=arp.observacoes_gerais)
            ws.cell(row=row_num, column=16, value=current_date_str)
        
        output = BytesIO()
        wb.save(output)
        output.seek(0)  # Reposition to the start of the stream

        # Registrar a ação no CustomLog
        log_entry = CustomLog(
            usuario=request.user.usuario_relacionado,
            modulo="Contratos_ARPs",
            item_id=0,
            item_descricao="Exportação da lista de ARPs",
            acao="Exportação",
            observacoes=f"Usuário {request.user.username} exportou lista de ARPs em {current_date_str}."
        )
        log_entry.save()

        # Configurar a resposta
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="exportar_fornecedores.xlsx"'
        response.write(output.getvalue())
        return response