from django.db import models
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from setup.choices import STATUS_ARP, UNIDADE_DAF2, MODALIDADE_AQUISICAO, STATUS_FASE
from django.utils import timezone

class ContratosArps(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='arp_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='arp_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados administrativos
    unidade_daf = models.TextField(max_length=15, choices=UNIDADE_DAF2, null=False, blank=False)
    numero_processo_sei = models.TextField(max_length=20, null=False, blank=False)
    numero_documento_sei = models.TextField(max_length=10, null=False, blank=False)
    numero_arp = models.TextField(max_length=15, null=False, blank=False)
    status = models.CharField(default="nao_informado", max_length=20, choices=STATUS_ARP, null=False, blank=False)
    data_publicacao = models.DateField(null=True, blank=True)

    #denominacao genérica
    denominacao = models.ForeignKey(DenominacoesGenericas, on_delete=models.DO_NOTHING, related_name='denominacao_arp')

    #fornecedor
    fornecedor = models.ForeignKey(Fornecedores, on_delete=models.DO_NOTHING, related_name='fornecedor_arp')
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='arp_deletado')

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
        super(ContratosArps, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def __str__(self):
        return f"ARP: {self.numero_arp} - Denominação: ({self.denominacao}) - ID ({self.id})"