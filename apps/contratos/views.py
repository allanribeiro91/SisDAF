from django.shortcuts import render
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from setup.choices import UNIDADE_DAF2, MODALIDADE_AQUISICAO, STATUS_ARP, YES_NO, TIPO_COTA
from django.http import JsonResponse, HttpResponse

def contratos(request):
    return render(request, 'contratos/contratos.html')

def contrato_ficha(request):
    return render(request, 'contratos/contrato_ficha.html')



def arps(request):
    return render(request, 'contratos/arps.html')

def arp_ficha(request):
    denominacoes_genericas = DenominacoesGenericas.objects.filter(del_status=False).values_list('id', 'denominacao')
    fornecedores = Fornecedores.objects.filter(del_status=False).values_list('id', 'cnpj', 'nome_fantasia', 'hierarquia', 'porte', 'tipo_direito').order_by('cnpj')
    lista_fornecedores = Fornecedores.objects.filter(del_status=False).values_list('cnpj')

    return render(request, 'contratos/arp_ficha.html', {
        'UNIDADE_DAF': UNIDADE_DAF2,
        'MODALIDADE_AQUISICAO': MODALIDADE_AQUISICAO,
        'STATUS_ARP': STATUS_ARP,
        'YES_NO': YES_NO,
        'TIPO_COTA': TIPO_COTA,
        'denominacoes_genericas': denominacoes_genericas,
        'fornecedores': fornecedores,
        'lista_fornecedores': lista_fornecedores,
    })

def arp_buscar_produtos(request, denominacao=None):
    produtos = ProdutosFarmaceuticos.get_produtos_por_denominacao(denominacao)
    return JsonResponse(produtos, safe=False)