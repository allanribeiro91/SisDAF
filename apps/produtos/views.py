from django.shortcuts import render, redirect
from django.core.paginator import Paginator, EmptyPage
from django.contrib.auth.decorators import login_required
from django.contrib import auth, messages
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas
from setup.choices import TIPO_PRODUTO
from django.http import JsonResponse, HttpResponse
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from datetime import datetime
from io import BytesIO
import json

def produtos(request):
    return render(request, 'produtos/produtos.html')

@login_required
def denominacoes(request):
    denominacoes = DenominacoesGenericas.objects.filter(del_status=False)
    numero_denominacoes = denominacoes.count()
    context = {
        'denominacoes': denominacoes,
        'TIPO_PRODUTO': TIPO_PRODUTO,
        'numero_denominacoes': numero_denominacoes,
    }
    return render(request, 'produtos/denominacoes.html', context)

@login_required
def get_filtros_denominacoes(request):
    tipo_produto = request.GET.get('tipo_produto', None)
    denominacao = request.GET.get('denominacao', None)
    basico = request.GET.get('basico', None)
    especializado = request.GET.get('especializado', None)
    estrategico = request.GET.get('estrategico', None)
    farmacia_popular = request.GET.get('farmacia_popular', None)
    hospitalar = request.GET.get('hospitalar', None)

    filters = {}
    filters['del_status'] = False
    if tipo_produto:
        filters['tipo_produto'] = tipo_produto
    if denominacao:
        filters['denominacao__icontains'] = denominacao
    if basico:
        filters['unidade_basico'] = 1
    if especializado:
        filters['unidade_especializado'] = 1
    if estrategico:
        filters['unidade_estrategico'] = 1
    if farmacia_popular:
        filters['unidade_farm_popular'] = 1
    if hospitalar:
        filters['hospitalar'] = 1
    
    denominacoes = DenominacoesGenericas.objects.filter(**filters)
    numero_denominacoes = denominacoes.count()
    
    page = int(request.GET.get('page', 1))
    paginator = Paginator(denominacoes, 100)  # Mostra 100 denominações por página
    try:
        denominacoes_paginados = paginator.page(page)
    except EmptyPage:
        denominacoes_paginados = paginator.page(paginator.num_pages)

    data = list(denominacoes_paginados.object_list.values())

    return JsonResponse({
        'data': data,
        'numero_denominacoes': numero_denominacoes,
        'has_next': denominacoes_paginados.has_next(),
        'has_previous': denominacoes_paginados.has_previous(),
        'current_page': page
    })


@login_required
def exportar_denominacoes(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        tipo_produto = data.get('tipo_produto')
        denominacao = data.get('denominacao')
        basico = data.get('basico')
        especializado = data.get('especializado')
        estrategico = data.get('estrategico')
        farmacia_popular = data.get('farmacia_popular')
        hospitalar = data.get('hospitalar')
    
        filters = {}
        filters['del_status'] = False
        if tipo_produto:
            filters['tipo_produto'] = tipo_produto
        if denominacao:
            filters['denominacao__icontains'] = denominacao
        if basico:
            filters['unidade_basico'] = basico
        if especializado:
            filters['unidade_especializado'] = especializado
        if estrategico:
            filters['unidade_estrategico'] = estrategico
        if farmacia_popular:
            filters['unidade_farm_popular'] = farmacia_popular
        if hospitalar:
            filters['hospitalar'] = hospitalar
        

        denominacoes = DenominacoesGenericas.objects.filter(**filters)
        current_date_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Criar um workbook e adicionar uma planilha
        wb = Workbook()
        ws = wb.active
        ws.title = "denominacoes_genericas"

        headers = [
        'ID', 'Usuário Registro', 'Usuário Atualização', 'Data de Registro', 'Data da Última Atualização',
        'Denominação', 'Tipo de Produto', 'Unidade Básico', 'Unidade Especializado', 'Unidade Estratégico',
        'Unidade Farmácia Popular', 'Hospitalar', 'Observações Gerais', 'Data Exportação'
        ]

        for col_num, header in enumerate(headers, 1):
            col_letter = get_column_letter(col_num)
            ws['{}1'.format(col_letter)] = header
            ws.column_dimensions[col_letter].width = 15

        # Adicionar dados da tabela
        for row_num, denominacao in enumerate(denominacoes, 2):
            ws.cell(row=row_num, column=1, value=denominacao.id)
            ws.cell(row=row_num, column=2, value=str(denominacao.usuario_registro.primeiro_ultimo_nome()))
            ws.cell(row=row_num, column=3, value=str(denominacao.usuario_atualizacao.primeiro_ultimo_nome()))
            registro_data = denominacao.registro_data.replace(tzinfo=None)
            ult_atual_data = denominacao.ult_atual_data.replace(tzinfo=None)
            ws.cell(row=row_num, column=4, value=registro_data)
            ws.cell(row=row_num, column=5, value=ult_atual_data)
            ws.cell(row=row_num, column=6, value=denominacao.denominacao)
            ws.cell(row=row_num, column=7, value=denominacao.tipo_produto)
            ws.cell(row=row_num, column=8, value=denominacao.unidade_basico)
            ws.cell(row=row_num, column=9, value=denominacao.unidade_especializado)
            ws.cell(row=row_num, column=10, value=denominacao.unidade_estrategico)
            ws.cell(row=row_num, column=11, value=denominacao.unidade_farm_popular)
            ws.cell(row=row_num, column=12, value=denominacao.hospitalar)
            ws.cell(row=row_num, column=13, value=denominacao.observacoes_gerais)
            ws.cell(row=row_num, column=14, value=current_date_str)
        
        output = BytesIO()
        wb.save(output)
        output.seek(0)  # Reposition to the start of the stream

        # Configurar a resposta
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="exportar_denominacoes.xlsx"'
        response.write(output.getvalue())
        return response


def produtos_ficha(request, product_id):
    return render(request, 'produtos/produtos_ficha.html', {'product_id': product_id})