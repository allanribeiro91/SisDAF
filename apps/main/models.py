from django.db import models
import re
from apps.usuarios.models import Usuario
from setup.choices import LOGS_ACAO, NIVEL_ALERTA, UNIDADE_DAF


class CustomLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='log_usuario')
    modulo = models.CharField(max_length=140, null=False, blank=False)
    model = models.CharField(max_length=60, null=False, blank=False, default='Não informado')
    model_id = models.IntegerField(null=False, blank=False, default=0)
    item_id = models.IntegerField(null=False, blank=False)
    item_descricao = models.CharField(max_length=140, null=False, blank=False)
    acao = models.CharField(max_length=40, choices=LOGS_ACAO, null=False, blank=False)
    observacoes = models.CharField(max_length=240, default='Sem observações.', null=False, blank=False)

    def observacoes_sem_cpf(self):
        # Esta expressão regular busca por padrões de CPF no formato ###.###.###-##
        cpf_pattern = r'\d{3}\.\d{3}\.\d{3}-\d{2}'
        # Substitui qualquer padrão encontrado por 'Usuário'
        observacao_limpa = re.sub(cpf_pattern, '', self.observacoes)
        return observacao_limpa
        

    def __str__(self):
        return f"{self.usuario} - {self.observacoes} em {self.timestamp}"

class UserAccessLog(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='acesso_usuario')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} acessou em {self.timestamp}"


class Alertas(models.Model):
    data_criacao = models.DateTimeField(auto_now_add=True)
    unidade_daf = models.CharField(max_length=50, choices=UNIDADE_DAF, null=False, blank=False)
    item = models.CharField(max_length=100, null=False, blank=False)
    nivel = models.CharField(max_length=50, choices=NIVEL_ALERTA, null=False, blank=False)
    mensagem = models.TextField(null=False, blank=False)
    status = models.BooleanField(default=True)
    data_desativacao = models.DateTimeField()