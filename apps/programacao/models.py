from django.db import models
from apps.usuarios.models import Usuario
from apps.produtos.models import ProdutosFarmaceuticos
from django.utils import timezone
from setup.choices import (GENERO_SEXUAL, COR_PELE, ORIENTACAO_SEXUAL, 
                           VIA_ATENDIMENTO, FASE_TRATAMENTO, ORIGEM_DEMANDA_JUDICIAL,
                           LISTA_UFS_SIGLAS, STATUS_DISPENSACAO, CICLO_TRATAMENTO,
                           MEIO_SOLICITACAO_JUDICIAL,SIM_NAO, ORIGEM_DEMANDA_JUDICIAL_SOLICITACAO, UNIDADE_DAF3,
                           ANALISE_TECNICA_SOLICITACAO_JUDICIAL,TIPO_DISPONIBILIZACAO_SOLICITACAO_JUDICIAL)
from datetime import datetime


class ProgCEAFparametros(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='progceaf_paramento_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='progceaf_parametro_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados de identificacao
    data_parametro = models.DateTimeField(null=False, blank=False)
    ano = models.PositiveIntegerField(null=False, blank=False)
    trimestre = models.PositiveIntegerField(null=False, blank=False)
    fase = models.CharField(max_length=20, null=False, blank=False)
    ses = models.CharField(max_length=2, null=False, blank=False)
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='progceaf_parametro_produto', null=True, blank=True)

    #valores - ANEXO A
    anexoa_pacientes = models.FloatField(null=False, blank=False)
    anexoa_total_consumo_trimestre = models.FloatField(null=False, blank=False)
    anexoa_estoque = models.FloatField(null=False, blank=False)
    anexoa_demanda_ses = models.FloatField(null=False, blank=False)

    #valores - APAC
    apac_total_estimado = models.FloatField(null=False, blank=False)

    #valores - LISTA DE PACIENTES
    lispac_enviou = models.BooleanField(null=False, blank=False)
    lispac_pacientes_informados = models.FloatField(null=False, blank=False)
    lispac_pacientes_validados = models.FloatField(null=False, blank=False)
    lispac_total_pedido = models.FloatField(null=False, blank=False)
    lispac_total_autorizado = models.FloatField(null=False, blank=False)

    #valores - HÓRUS
    horus_considerar = models.BooleanField(null=False, blank=False)
    horus_recomendado = models.FloatField(null=False, blank=False)
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='progceaf_parametro_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)  # Obtenha o usuário atual e remova-o dos kwargs

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(ProgCEAFparametros, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def parametro_ativo(self):
        """
        Verifica se o parâmetro é o último encaminhado. Se sim, é ATIVO. Se não, é INATIVO.
        """
        pass

    def recomedacao_sisdaf_parametro(self):
        """
        Sugere o parâmetro a ser utilizado na programação.
        """
        pass
    
    def recomedacao_sisdaf_qtd(self):
        """
        Sugere a quantidade do produto a ser programado.
        """
        pass
    

    def __str__(self):
        return f"ID:{self.id}, Produto:{self.produto.produto}, Ano:{self.ano}, Trimestre:{self.trimestre}, SES:{self.ses}"


class ProgCEAFprogramacaoTrimestral(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='progceaf_programacao_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='progceaf_programacao_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #identificação da programação
    ano = models.PositiveIntegerField(null=False, blank=False)
    trimestre = models.PositiveIntegerField(null=False, blank=False)
    fase = models.CharField(max_length=20, null=False, blank=False)
    ses = models.CharField(max_length=2, null=False, blank=False)
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='ceafprog_programacao_produto', null=True, blank=True)
    fator_embalagem = models.PositiveIntegerField(null=False, blank=False)

    #parâmetro de aprovação
    parametro = models.CharField(max_length=20, null=False, blank=False)
    parametro_data = models.DateTimeField(null=False, blank=False)
    paramentro_qtd = models.FloatField(null=False, blank=False)

    #total aprovado
    aprovado_ajustado = models.FloatField(null=False, blank=False)
    aprovado_percentual_a_mais = models.DecimalField(max_digits=5, decimal_places=4, null=False, blank=False)
    aprovado_final = models.FloatField(null=False, blank=False)
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='ceafprog_programacao_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)  # Obtenha o usuário atual e remova-o dos kwargs

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(ProgCEAFprogramacaoTrimestral, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def __str__(self):
        return f"ID:{self.id}, Produto:{self.produto.produto}, Ano:{self.ano}, Trimestre:{self.trimestre}, Fase:{self.fase}, SES:{self.ses}"


