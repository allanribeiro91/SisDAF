from django.db import models
from apps.usuarios.models import Usuario
from setup.choices import LOGS_ACAO


class CustomLog(models.Model):
    """
    Modelo para registrar atividades personalizadas na aplicação.
    Cada entrada representa uma ação realizada por um usuário em um determinado módulo.
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='log_usuario')
    modulo = models.CharField(max_length=140, null=False, blank=False)
    model = models.CharField(max_length=60, null=False, blank=False, default='Não informado')
    model_id = models.IntegerField(null=False, blank=False, default=0)
    item_id = models.IntegerField(null=False, blank=False)
    item_descricao = models.CharField(max_length=140, null=False, blank=False)
    acao = models.CharField(max_length=40, choices=LOGS_ACAO, null=False, blank=False)
    observacoes = models.CharField(max_length=240, default='Sem observações.', null=False, blank=False)

    def __str__(self):
        return f"{self.usuario} - {self.observacoes} em {self.timestamp}"

class UserAccessLog(models.Model):
    """
    Modelo para registrar cada vez que um usuário acessa a aplicação.
    Cada entrada representa um acesso único de um usuário.
    """
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='acesso_usuario')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} acessou em {self.timestamp}"