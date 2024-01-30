from django.db import connection
from apps.gestao_pacientes.models import Pacientes, Dispensacoes

def run():
    # Apagar todos os registros
    Dispensacoes.objects.all().delete()
    Pacientes.objects.all().delete()

    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='gestao_pacientes_dispensacoes'")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='gestao_pacientes_pacientes'")
        

#python manage.py runscript apps.gestao_pacientes.scripts.apagar_dados