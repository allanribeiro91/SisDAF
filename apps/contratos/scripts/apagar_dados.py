from apps.contratos.models import (ContratosParcelas, ContratosObjetos, 
                                   Contratos, ContratosArpsItens, ContratosArps, ContratosFiscais,
                                   ContratosEntregas, Empenhos, EmpenhosItens)

def run():
    # Apagar todos os registros
    ContratosFiscais.objects.all().delete()
    ContratosEntregas.objects.all().delete()
    EmpenhosItens.objects.all().delete()
    Empenhos.objects.all().delete()
    ContratosParcelas.objects.all().delete()
    ContratosObjetos.objects.all().delete()
    ContratosArpsItens.objects.all().delete()
    Contratos.objects.all().delete()
    ContratosArps.objects.all().delete()



#python manage.py runscript apps.contratos.scripts.apagar_dados