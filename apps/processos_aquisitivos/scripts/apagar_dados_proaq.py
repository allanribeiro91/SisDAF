from apps.processos_aquisitivos.models import (PROAQ_ETAPA, ProaqDadosGerais, ProaqProdutos, 
                                               ProaqProdutosManager, ProaqEvolucao, ProaqTramitacao,
                                               ProaqItens)

def run():
    # Apagar todos os registros
    #PROAQ_ETAPA.objects.all().delete()
    #ProaqEvolucao.objects.all().delete()
    #ProaqTramitacao.objects.all().delete()
    #ProaqProdutos.objects.all().delete()
    ProaqItens.objects.all().delete()
    #ProaqDadosGerais.objects.all().delete()

#python manage.py runscript apps.processos_aquisitivos.scripts.apagar_dados_proaq