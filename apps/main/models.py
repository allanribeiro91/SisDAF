from django.db import models
import os
import re
from apps.usuarios.models import Usuario
from django.utils import timezone
from datetime import datetime
from setup.choices import (LOGS_ACAO, NIVEL_ALERTA, UNIDADE_DAF, STATUS_INFORME, 
                           ALCANCE_INFORME, IMAGENS_INFORME)


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

class Informes(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='informe_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='informe_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do informe
    titulo = models.CharField(max_length=120, null=False, blank=False)
    imagem_card = models.CharField(max_length=80, choices=IMAGENS_INFORME, null=False, blank=False)
    resumo = models.TextField(null=False, blank=False)
    descricao = models.TextField(null=False, blank=False)
    status = models.CharField(max_length=10, choices=STATUS_INFORME, null=False, blank=False)
    alcance = models.CharField(max_length=10, choices=ALCANCE_INFORME, null=False, blank=False)
    link_mais_informacoes = models.TextField(default='Não possui.', null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='informe_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(Informes, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def endereco_imagem(self):
        endereco = f'assets/ícones/{self.imagem_card}.svg'
        return endereco
    