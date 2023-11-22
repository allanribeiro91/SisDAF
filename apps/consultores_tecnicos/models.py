from django.db import models
from apps.usuarios.models import Usuario
from setup.choices import FONTES_CONTRATOS_CONSULTORES, STATUS_CONTRATOS_CONSULTORES, INSTRUMENTOS_JURIDICOS_CONSULTORES
from django.utils import timezone

class ConsultoresContratos(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='consultor_contrato_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='consultor_contrato_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #status
    status = models.CharField(max_length=20, choices=STATUS_CONTRATOS_CONSULTORES, null=False, blank=False)

    #dados administrativos
    fonte = models.CharField(max_length=20, choices=FONTES_CONTRATOS_CONSULTORES, null=False, blank=False)
    instrumento_juridico = models.CharField(max_length=20, choices=INSTRUMENTOS_JURIDICOS_CONSULTORES, null=False, blank=False)
    n_contrato = models.CharField(max_length=20, null=False, blank=False)
    data_assinatura = models.DateField(null=True, blank=True)
    vigencia = models.DateField(null=True, blank=True)

    #dados tecnicos
    objeto = models.TextField(null=True, blank=True, default='Não Informado')
    metodologia = models.TextField(null=True, blank=True, default='Não Informado')

    #link
    link_tr = models.URLField(null=True, blank=True)
    link_contrato = models.URLField(null=True, blank=True)

    #observacoes
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')
