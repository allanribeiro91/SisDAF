from apps.contratos.models import ContratosParcelas, ContratosObjetos, Contratos, ContratosArpsItens, ContratosArps, ContratosEntregas

def run():
    # Apagar todos os registros
    ContratosEntregas.objects.all().delete()
    #ContratosParcelas.objects.all().delete()
    # ContratosObjetos.objects.all().delete()
    # Contratos.objects.all().delete()
    # ContratosArpsItens.objects.all().delete()
    # ContratosArps.objects.all().delete()


#python manage.py runscript apps.contratos.scripts.apagar_dados