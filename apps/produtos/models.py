from django.db import models
from apps.usuarios.models import Usuario
from setup.choices import TIPO_PRODUTO

class DenominacoesGenericas(models.Model):
     # relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='denominacoes_registradas')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='denominacoes_editadas')
    
    # log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #denominação genérica
    denominacao = models.CharField(max_length=140, null=False, blank=False)
    tipo_produto = models.CharField(max_length=15, choices=TIPO_PRODUTO, null=True, blank=True)

    #unidades do DAF que a denominação genérica é utilizada
    unidade_basico = models.BooleanField(default=False, null=False, blank=False, db_index=True)
    unidade_especializado = models.BooleanField(default=False, null=False, blank=False, db_index=True)
    unidade_estrategico = models.BooleanField(default=False, null=False, blank=False, db_index=True)
    unidade_farm_popular = models.BooleanField(default=False, null=False, blank=False, db_index=True)
    hospitalar = models.BooleanField(default=False, null=False, blank=False, db_index=True)
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

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
        super(DenominacoesGenericas, self).save(*args, **kwargs)

    def __str__(self):
        return f"Denominação Genérica: {self.denominacao} - ID ({self.id})"
