import openpyxl
from django.utils import timezone
from apps.gestao_pacientes.models import Pacientes
import datetime

def import_from_excel(file_path):
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active

    for row in sheet.iter_rows(min_row=2, values_only=True): 
        pacientes = Pacientes()
        # usuario
        pacientes.id = row[0]
        pacientes.usuario_registro_id = 1
        pacientes.usuario_atualizacao_id = 1
        # log
        pacientes.registro_data = timezone.now()
        pacientes.ult_atual_data = timezone.now()
        pacientes.log_n_edicoes = 1
        # dados do paciente
        pacientes.cns = row[6]
        pacientes.cpf = row[7]
        pacientes.nome = row[8]
        # Tratar data de nascimento e óbito
        if row[9] is not None and isinstance(row[9], datetime.datetime):
            pacientes.data_nascimento = timezone.make_aware(row[9])
        if row[10] is not None and isinstance(row[10], datetime.datetime):
            pacientes.data_obito = timezone.make_aware(row[10])
        pacientes.sexo = row[11]
        pacientes.cor_pele = row[12]
        pacientes.orientacao_sexual = row[13]
        # endereço
        pacientes.naturalidade_cod_ibge = row[14]
        # observações gerais
        pacientes.observacoes_gerais = row[15]
        # delete (del)
        pacientes.del_status = 0

        # salvar
        pacientes.save()

def run():
    # Caminho do arquivo que você quer importar
    file_path = 'dados/gestaopacientes_pacientes.xlsx'
    import_from_excel(file_path)


#python manage.py runscript apps.gestao_pacientes.scripts.import_pacientes