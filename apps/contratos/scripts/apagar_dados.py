from apps.contratos.models import ContratosParcelas, ContratosObjetos

def run():
    # Apagar todos os registros
    ContratosParcelas.objects.all().delete()
    ContratosObjetos.objects.all().delete()


#python manage.py runscript apps.contratos.scripts.apagar_dados