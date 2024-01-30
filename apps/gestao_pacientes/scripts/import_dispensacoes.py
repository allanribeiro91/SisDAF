import openpyxl
from django.utils import timezone
from apps.gestao_pacientes.models import Dispensacoes, Pacientes
from apps.produtos.models import ProdutosFarmaceuticos
import datetime

def import_from_excel(file_path):
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active

    produto = ProdutosFarmaceuticos.objects.get(id=73)

    for row in sheet.iter_rows(min_row=2, values_only=True): 
        dispensacoes = Dispensacoes()

        paciente = Pacientes.objects.get(id=row[24])

        #usuario
        dispensacoes.id = row[0]
        dispensacoes.usuario_registro_id = 1
        dispensacoes.usuario_atualizacao_id = 1
        #log
        dispensacoes.registro_data = timezone.now()
        dispensacoes.ult_atual_data = timezone.now()
        dispensacoes.log_n_edicoes = 1
        #dados da dispensação
        dispensacoes.via_atendimento = row[6]
        dispensacoes.numero_processo_sei = row[7]
        dispensacoes.origem_demanda_judicial = row[8]
        dispensacoes.uf_solicitacao = row[9]
        dispensacoes.quantidade = row[10]
        dispensacoes.cid = row[11]
        dispensacoes.fase_tratamento = row[12]
        dispensacoes.ciclo = row[13]
        dispensacoes.numero_pedido_sismat = row[14]
        dispensacoes.data_solicitacao = row[15]
        dispensacoes.data_envio = row[16]
        dispensacoes.data_entrega = row[17]
        dispensacoes.data_consumo = row[18]
        dispensacoes.comprovante_doc_sei = row[19]
        dispensacoes.local_aplicacao_cod_ibge = row[20]
        dispensacoes.local_aplicacao_unidade_saude = row[21]
        dispensacoes.status = row[22]
        #produto
        dispensacoes.produto = produto
        #paciente
        dispensacoes.paciente = paciente
        # observações gerais
        dispensacoes.observacoes_gerais = row[25]
        # delete (del)
        dispensacoes.del_status = 0

        # salvar
        dispensacoes.save()

def run():
    # Caminho do arquivo que você quer importar
    file_path = 'dados/gestaopacientes_dispensacoes.xlsx'
    import_from_excel(file_path)


#python manage.py runscript apps.gestao_pacientes.scripts.import_dispensacoes