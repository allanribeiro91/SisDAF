from django.db import models
from apps.usuarios.models import Usuario
from setup.choices import TIPO_PRODUTO, FORMA_FARMACEUTICA, STATUS_INCORPORACAO, CONCENTRACAO_TIPO, CLASSIFICACAO_AWARE
from django.utils import timezone

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
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='denominacoes_deletadas')

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


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def __str__(self):
        return f"Denominação Genérica: {self.denominacao} - ID ({self.id})"


class ProdutosFarmaceuticos(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_registro_produto')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_atualizacao_produto')
    denominacao = models.ForeignKey(DenominacoesGenericas, on_delete=models.DO_NOTHING, related_name='denominacao_produto')

    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do produto farmacêutico
    produto = models.CharField(max_length=240, null=False, blank=False)
    concentracao_tipo = models.CharField(max_length=20, choices=CONCENTRACAO_TIPO, null=False, blank=False)
    concentracao = models.CharField(max_length=120, null=False, blank=False)
    forma_farmaceutica = models.CharField(max_length=60, choices=FORMA_FARMACEUTICA, null=False, blank=False)
    oncologico = models.BooleanField(default=False, null=False, blank=False)
    biologico = models.BooleanField(default=False, null=False, blank=False)
    aware = models.CharField(max_length=20, choices=CLASSIFICACAO_AWARE, null=False, blank=False)
    
    #incorporacao SUS
    incorp_status = models.CharField(max_length=20, choices=STATUS_INCORPORACAO, null=False, blank=False)
    incorp_data = models.DateField(null=True, blank=True)
    incorp_portaria = models.CharField(max_length=30, null=False, blank=False)
    incorp_link = models.URLField(max_length=100, null=False, blank=False)
    exclusao_data = models.DateField(null=True, blank=True)
    exclusao_portaria = models.CharField(max_length=30, null=False, blank=False)
    exclusao_link = models.URLField(max_length=100, null=False, blank=False)

    #pactuacao
    comp_basico = models.BooleanField(default=False, null=False, blank=False)
    comp_especializado = models.BooleanField(default=False, null=False, blank=False)
    comp_estrategico = models.BooleanField(default=False, null=False, blank=False)
    comp_basico_programa = models.CharField(max_length=60, null=True, blank=False)
    comp_especializado_grupo = models.CharField(max_length=60, null=True, blank=False)
    comp_estrategico_programa = models.CharField(max_length=60, null=True, blank=False)

    #outros
    disp_farmacia_popular = models.BooleanField(default=False, null=False, blank=False)
    hospitalar = models.BooleanField(default=False, null=False, blank=False)
    
    #outros sistemas
    sigtap_possui = models.BooleanField(default=False, null=False, blank=False)
    sigtap_codigo = models.CharField(max_length=10, null=True, blank=False)
    sigtap_nome = models.CharField(max_length=60, null=True, blank=False)
    sismat_possui = models.BooleanField(default=False, null=False, blank=False)
    sismat_codigo = models.CharField(max_length=10, null=True, blank=False)
    sismat_nome = models.CharField(max_length=60, null=True, blank=False)
    catmat_possui = models.BooleanField(default=False, null=False, blank=False)
    catmat_codigo = models.CharField(max_length=10, null=True, blank=False)
    catmat_nome = models.CharField(max_length=60, null=True, blank=False)
    obm_possui = models.BooleanField(default=False, null=False, blank=False)
    obm_codigo = models.CharField(max_length=10, null=True, blank=False)
    obm_nome = models.CharField(max_length=60, null=True, blank=False)
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='usuario_produto_deletado')

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

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def __str__(self):
        return f"Produto Farmacêutico: {self.produto} - ID ({self.id})"


class TagProdutos(models.Model):
    tag = models.CharField(max_length=255, unique=True)


#python manage.py runscript apps.produtos.scripts.import_tag_produtos