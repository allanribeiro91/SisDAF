from django.db import models
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from setup.choices import STATUS_PROAQ, UNIDADE_DAF2, MODALIDADE_AQUISICAO, STATUS_FASE, TIPO_COTA, FASES_EVOLUCAO_PROAQ
from django.utils import timezone
from datetime import date
from django.db.models import Max


class ProaqDadosGerais(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados administrativos
    unidade_daf = models.TextField(max_length=15, choices=UNIDADE_DAF2, null=False, blank=False)
    modalidade_aquisicao = models.TextField(max_length=30, choices=MODALIDADE_AQUISICAO, null=False, blank=False)
    numero_processo_sei = models.TextField(max_length=20, null=False, blank=False)
    numero_etp = models.TextField(max_length=10, null=True, blank=True)
    status = models.CharField(default="nao_informado", max_length=20, choices=STATUS_PROAQ, null=False, blank=False)
    responsavel_tecnico = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_responsavel', null=True, blank=True)
    outro_responsavel = models.CharField(max_length=80, null=True, blank=True)

    #denominacao genérica
    denominacao = models.ForeignKey(DenominacoesGenericas, on_delete=models.DO_NOTHING, related_name='denominacao_proaq')
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='proaq_deletado')

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
        super(ProaqDadosGerais, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def get_status_label(self):
        return self.get_status_display()
    
    def get_unidade_daf_label(self):
        return self.get_unidade_daf_display()
    
    def get_modalidade_aquisicao_label(self):
        return self.get_modalidade_aquisicao_display()
    
    def get_usuario_nome(self):
        if self.responsavel_tecnico is None:
            return self.outro_responsavel
        else:
            return self.responsavel_tecnico.primeiro_ultimo_nome()

    def get_usuario_nome_completo(self):
        return self.responsavel_tecnico.dp_nome_completo
    
    def get_denominacao_nome(self):
        return self.denominacao.denominacao

    def fase_processo(self):
        # Filtra as evoluções relacionadas que não estão deletadas
        evolucoes = self.proaq_evolucao.filter(del_status=False)

        # Se não houver evoluções, retorna None ou algum valor padrão
        if not evolucoes.exists():
            return None, None  # Alterado para retornar também None para os dias

        # Encontra o maior número de fase
        max_fase_numero = evolucoes.aggregate(Max('fase_numero'))['fase_numero__max']

        # Obtém a instância de ProaqEvolucao com o maior número de fase
        evolucao = evolucoes.get(fase_numero=max_fase_numero)
        fase = f'F{max_fase_numero} - {evolucao.get_fase_display()}'

        # Calcula o total de dias para essa fase
        total_dias = evolucao.total_dias()

        # Retorna a representação legível da fase e o total de dias
        return fase, total_dias

    def total_itens(self):
        quantidade_itens = self.proaq_item.filter(del_status=False).count()
        return quantidade_itens

    def valor_total(self):
        # Filtra os itens relacionados que não estão deletados
        itens = self.proaq_item.filter(del_status=False)

        # Calcula a soma dos valores totais de cada item
        total = sum(item.valor_unitario_estimado * item.qtd_a_ser_contratada for item in itens)

        return total

    def responsavel_tecnico_proaq(self):
        if self.responsavel_tecnico:
            return self.responsavel_tecnico.primeiro_ultimo_nome()
        else:
            return self.outro_responsavel

    def __str__(self):
        return f"Processo Aquisitivo: {self.numero_processo_sei} - Denominacao: ({self.denominacao}) - ID ({self.id})"

class ProaqItens(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_item_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_item_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #item do processo aquisitivo
    numero_item = models.IntegerField(null=False, blank=False)
    tipo_cota = models.CharField(max_length=20, choices=TIPO_COTA, null=False, blank=False)
    cmm_data_inicio = models.DateField(null=False, blank=False, default=timezone.now)
    cmm_data_fim = models.DateField(null=False, blank=False, default=timezone.now)
    cmm_estimado = models.FloatField(null=False, blank=False)
    qtd_a_ser_contratada = models.FloatField(null=False, blank=False)
    valor_unitario_estimado = models.FloatField(null=False, blank=False)

    #proaq
    proaq = models.ForeignKey(ProaqDadosGerais, on_delete=models.DO_NOTHING, related_name='proaq_item')

    #produto
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='proaq_item_produto')

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='proaq_item_deletado')

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
        super(ProaqItens, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def cobertura_meses(self):
        meses = self.qtd_a_ser_contratada / self.cmm_estimado
        return meses
    
    def cobertura_dias(self):
        dias = self.cobertura_meses() * 30
        return dias

    def valor_total(self):
        total = self.valor_unitario_estimado * self.qtd_a_ser_contratada
        return total

class ProaqEvolucao(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_evolucao_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='proaq_evolucao_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #item do processo aquisitivo
    fase_numero = models.IntegerField(null=False, blank=False)
    fase = models.CharField(max_length=20, choices=FASES_EVOLUCAO_PROAQ, null=False, blank=False)
    data_entrada = models.DateField(null=False, blank=False, default=timezone.now)
    data_saida = models.DateField(null=True, blank=True, default=timezone.now)

    #proaq
    proaq = models.ForeignKey(ProaqDadosGerais, on_delete=models.DO_NOTHING, related_name='proaq_evolucao')

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='proaq_evolucao_deletado')

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
        super(ProaqEvolucao, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def total_dias(self):
        data_saida = self.data_saida if self.data_saida is not None else date.today()
        dias = data_saida - self.data_entrada
        return dias.days

class ProaqProdutosManager(models.Manager):
    def active(self):
        return self.filter(del_status=False)

class ProaqProdutos(models.Model):
    #relacionamento usuario
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_registro_proaqproduto')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_atualizacao_proaqproduto')

    #relacionamento produto
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='produto_proaq')

    # Relacionamento com ProaqDadosGerais
    proaq = models.ForeignKey(ProaqDadosGerais, on_delete=models.DO_NOTHING, related_name='proaq_produto')

    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='usuario_proaqproduto_deletado')

    def soft_delete(self, usuario_instance):
        """
        Realiza uma "deleção lógica" do registro.
        """
        if self.del_status:
            return  # Se já estiver deletado, simplesmente retorne e não faça nada
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = usuario_instance
        self.save()
    
    def reverse_soft_delete(self):
        """
        Reverte a "deleção lógica" do registro.
        """
        self.del_status = False
        self.del_data = None
        self.del_usuario = None
        self.save()

    def __str__(self):
        return f"Produto/Proaq: {self.produto} - Proaq ({self.proaq})"
    
    objects = ProaqProdutosManager()
 
class PROAQ_AREA_MS(models.Model):
    setor = models.CharField(max_length=40, null=False, blank=False)
    orgao_publico = models.BooleanField(null=False, blank=False)
    ministerio = models.CharField(max_length=100, null=True, blank=True)
    secretaria = models.CharField(max_length=100, null=True, blank=True)
    departamento = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.setor

class PROAQ_ETAPA(models.Model):
    etapa = models.CharField(max_length=200, null=False, blank=False)

class ProaqTramitacao(models.Model):
    #relacionamento usuario
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_registro_proaqtramitacao')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='usuario_atualizacao_proaqtramitacao')

    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #fase
    documento_sei = models.CharField(max_length=20, null=False, blank=False)
    etapa_processo = models.CharField(max_length=100, null=True, blank=True)
    etapa_processo_outro = models.CharField(max_length=100, null=True, blank=True)

    #datas
    data_entrada = models.DateField(null=True, blank=True)
    previsao_saida = models.DateField(null=True, blank=True)
    data_saida = models.DateField(null=True, blank=True)

    #observacoes
    observacoes = models.TextField(null=False, blank=False, default='Sem observações.')

    #Relacionamento com ProaqDadosGerais
    proaq = models.ForeignKey(ProaqDadosGerais, on_delete=models.DO_NOTHING, related_name='proaq_tramitacao')

    #Setor MS
    setor = models.ForeignKey(PROAQ_AREA_MS, on_delete=models.DO_NOTHING, related_name='proaq_tramitacao_setor')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='usuario_proaqtramitacao_deletado')

    def soft_delete(self, usuario_instance):
        """
        Realiza uma "deleção lógica" do registro.
        """
        if self.del_status:
            return  # Se já estiver deletado, simplesmente retorne e não faça nada
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = usuario_instance
        self.save()
    
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
        super(ProaqTramitacao, self).save(*args, **kwargs)

    def dias_tramitacao(self):
        """
        Calcula o número de dias desde a data de entrada até a data de saída ou até hoje,
        se a data de saída for None.
        """
        if self.data_entrada is None:
            return 0  # Retorna 0 se não houver data de entrada

        data_saida = self.data_saida if self.data_saida is not None else date.today()
        delta = data_saida - self.data_entrada
        return delta.days

    def etapa_tramitacao(self):
        # Verifica se etapa_processo não é None e é um número
        if self.etapa_processo is not None:
            try:
                etapa_id = int(self.etapa_processo)
                etapa_obj = PROAQ_ETAPA.objects.filter(id=etapa_id).first()
                if etapa_obj:
                    return etapa_obj.etapa
            except ValueError:
                # Se etapa_processo não é um número, ou se a etapa correspondente não foi encontrada
                pass

        # Se etapa_processo é None ou não encontrou a etapa, usa etapa_processo_outro
        return self.etapa_processo_outro

    def __str__(self):
        return f"Proaq ({self.proaq}) - Etapa ({self.etapa_processo})"