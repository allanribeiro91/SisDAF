from django.shortcuts import render, redirect
from django.core.paginator import Paginator, EmptyPage
from django.contrib.auth.decorators import login_required
from django.contrib import auth, messages
from django.contrib.auth.models import User
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.produtos.forms import DenominacoesGenericasForm, ProdutosFarmaceuticosForm
from setup.choices import TIPO_PRODUTO, FORMA_FARMACEUTICA, STATUS_INCORPORACAO, CONCENTRACAO_TIPO, YES_NO
from django.http import JsonResponse, HttpResponse
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from datetime import datetime
from io import BytesIO
import json

@login_required
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
def denominacoes_ficha(request, denominacao_id=None):

    if denominacao_id:
        try:
            denominacao = DenominacoesGenericas.objects.get(id=denominacao_id)
        except DenominacoesGenericas.DoesNotExist:
            messages.error(request, "Denominação não encontrada.")
            return redirect('denominacoes')
    else:
        denominacao = None  # Preparando para criar uma nova denominação

    if request.method == 'POST':
        if denominacao:
            denominacao_form = DenominacoesGenericasForm(request.POST, instance=denominacao)
        else:
            denominacao_form = DenominacoesGenericasForm(request.POST)

        #Conferir se denominação e tipo de produto foram preenchidos
        nome_denominacao = request.POST.get('denominacao')
        tipo_produto = request.POST.get('tipo_produto')
        if not nome_denominacao or not tipo_produto:
            messages.error(request, "O nome da denominação genérica e o tipo de produto são obrigatórios!")
            if denominacao:
                return redirect('denominacoes_ficha', denominacao_id=denominacao.id)
            else:
                return redirect('nova_denominacao')

        #Verificar se houve alteração no formulário
        if not denominacao_form.has_changed():
            messages.error(request, "Dados não foram salvos. Não houve mudanças.")
            if denominacao:
                return redirect('denominacoes_ficha', denominacao_id=denominacao.id)
            else:
                return redirect('nova_denominacao')

        if denominacao_form.is_valid():
            #Verificar se já existe a denominação na base [
            nome_denominacao = denominacao_form.cleaned_data.get('denominacao')
            denominacao_existente = DenominacoesGenericas.objects.filter(denominacao=nome_denominacao)
            
            #Se estivermos atualizando uma denominação existente, excluímos essa denominação da verificação
            if denominacao:
                denominacao_existente = denominacao_existente.exclude(id=denominacao.id)

            if denominacao_existente.exists():
                messages.error(request, "Já existe uma denominação com esse nome. Não foi possível salvar.")
                if denominacao:
                    return redirect('denominacoes_ficha', denominacao_id=denominacao.id)
                else:
                    return redirect('nova_denominacao')

            #Salvar a denominação
            denominacao = denominacao_form.save(commit=False)
            denominacao.save(current_user=request.user.usuario_relacionado)
            messages.success(request, f"Dados atualizados com sucesso!")
            
            #Retornar log
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'registro_data': denominacao.registro_data.strftime('%d/%m/%Y %H:%M:%S'),
                    'usuario_registro': denominacao.usuario_registro.dp_nome_completo,
                    'ult_atual_data': denominacao.ult_atual_data.strftime('%d/%m/%Y %H:%M:%S'),
                    'usuario_atualizacao': denominacao.usuario_atualizacao.dp_nome_completo,
                    'log_n_edicoes': denominacao.log_n_edicoes,
                })           
            
        else:
            messages.error(request, "Formulário inválido")
            print("Erro formulário denominação")
            print(denominacao_form.errors)

    form = DenominacoesGenericasForm(instance=denominacao)
    return render(request, 'produtos/denominacoes_ficha.html', {
        'denominacao': denominacao,
        'form': form,
        'TIPO_PRODUTO': TIPO_PRODUTO,
    })



@login_required
def delete_denominacao(request, denominacao_id):
    try:
        denominacao = DenominacoesGenericas.objects.get(id=denominacao_id)
        denominacao.soft_delete(request.user.usuario_relacionado)
        return JsonResponse({"message": "Denominação deletada com sucesso!"})
    except DenominacoesGenericas.DoesNotExist:
        messages.error(request, "Denominação não encontrada.")    
    return redirect('denominacoes')








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

    # if product_id:
    #     try:
    #         produto = ProdutosFarmaceuticos.objects.get(id=product_id)
    #     except ProdutosFarmaceuticos.DoesNotExist:
    #         messages.error(request, "Produto não encontrado.")
    #         return redirect('denominacoes')
    # else:
    #     produto = None  # Preparando para criar uma nova denominação

    denominacoes_genericas = DenominacoesGenericas.objects.values_list('id', 'denominacao')

    form = ProdutosFarmaceuticosForm(instance=None)
    return render(request, 'produtos/produtos_ficha.html', {
        'product_id': product_id,
        'form': form,
        'denominacoes_genericas': denominacoes_genericas,
        'TIPO_PRODUTO': TIPO_PRODUTO,
        'FORMA_FARMACEUTICA': FORMA_FARMACEUTICA, 
        'STATUS_INCORPORACAO': STATUS_INCORPORACAO,
        'CONCENTRACAO_TIPO': CONCENTRACAO_TIPO,
        'YES_NO': YES_NO,
    })


