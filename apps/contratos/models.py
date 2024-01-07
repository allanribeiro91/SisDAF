from django.db import models
from django.db.models import Max
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from setup.choices import (STATUS_ARP, UNIDADE_DAF2, UNIDADE_DAF, TIPO_COTA, 
                           MODALIDADE_AQUISICAO, LEI_LICITACAO, LOCAL_ENTREGA_PRODUTOS,
                           NOTAS_RECEBIDAS, NOTAS_STATUS, NOTAS_PAGAMENTOS, STATUS_FISCAL_CONTRATO, STATUS_EMPENHO)
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum


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
    lei_licitacao = models.TextField(default="lei_8666", max_length=15, choices=LEI_LICITACAO, null=False, blank=False)
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

    def valor_total_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.valor_total_arp_item()
        return total

    def qtd_registrada_total_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.qtd_registrada
        return total

    def contratos(self):
        return self.arp_contrato.filter(del_status=False).count()

    def qtd_contratada_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.qtd_contratada()
        return total
    
    def saldo_qtd_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.qtd_saldo()
        return total
    
    def saldo_valor_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.valor_saldo()
        return total
    
    def saldo_arp_percentual(self):
        v_total_arp = self.valor_total_arp()
        v_contratado_arp = self.valor_contratado_arp()
        percentual = 1 - (v_contratado_arp / v_total_arp)
        return percentual

    def valor_contratado_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.valor_contratado()
        return total

    @property
    def data_vigencia(self):
        """Calcula a data de vigência como data_publicacao + 365 dias."""
        if self.data_publicacao:
            return self.data_publicacao + timedelta(days=365)
        return None

    @property
    def prazo_vigencia(self):
        """Calcula o prazo de vigência como data_vigencia - data atual."""
        if self.data_vigencia:
            return (self.data_vigencia - timezone.now().date()).days
        return None

    def __str__(self):
        return f"ARP: {self.numero_arp} - Denominação: ({self.denominacao}) - ID ({self.id})"

class ContratosArpsItens(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='arp_item_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='arp_item_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #identificacao do item
    arp = models.ForeignKey(ContratosArps, on_delete=models.DO_NOTHING, related_name='arp_item')
    numero_item = models.IntegerField(null=False, blank=False)
    tipo_cota = models.CharField(max_length=20, choices=TIPO_COTA, null=False, blank=False)
    empate_ficto = models.BooleanField(null=False, blank=False)
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='arp_item_produto')

    #precos e quantidades registradas na ata
    valor_unit_homologado = models.FloatField(null=False, blank=False)
    valor_unit_reequilibrio_bool = models.BooleanField(default=False)
    valor_unit_reequilibrio = models.FloatField(null=True, blank=True)
    qtd_registrada = models.FloatField(null=True, blank=True)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='arp_item_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(ContratosArpsItens, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def valor_total_arp_item(self):
        qtd_registrada = self.qtd_registrada if self.qtd_registrada else 0
        valor_homologado = self.valor_unit_homologado if self.valor_unit_homologado else 0
        if self.valor_unit_reequilibrio_bool:
            return self.valor_unit_reequilibrio * qtd_registrada
        else:
            return valor_homologado * qtd_registrada

    def qtd_contratada(self):
        total = 0
        for objeto in self.arp_item_objeto.filter(del_status=False):
            total += objeto.qtd_contratada()
        return total
    
    def valor_contratado(self):
        total = 0
        for objeto in self.arp_item_objeto.filter(del_status=False):
            total += objeto.valor_total()
        return total

    def contratos(self):
        return self.arp_item_objeto.filter(del_status=False).count()

    def qtd_saldo(self):
        qtd_saldo = self.qtd_registrada - self.qtd_contratada()
        return qtd_saldo
    
    def valor_saldo(self):
        valor_total = self.valor_total_arp_item()
        valor_contratado = self.valor_contratado()
        saldo = valor_total - valor_contratado
        return saldo

    
    def qtd_saldo_percentual(self):
        qtd_saldo_percentual = self.qtd_saldo() / self.qtd_registrada
        return qtd_saldo_percentual

    def valor_unitario(self):
        if self.valor_unit_reequilibrio_bool:
            return self.valor_unit_reequilibrio
        else:
            return self.valor_unit_homologado

    def __str__(self):
        return f"ARP: {self.arp.numero_arp} - Item: ({self.numero_item}) - Produto ({self.produto.produto})"

class Contratos(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados administrativos
    unidade_daf = models.TextField(max_length=15, choices=UNIDADE_DAF2, null=False, blank=False)
    numero_processo_sei = models.CharField(max_length=20, null=False, blank=False)
    numero_documento_sei = models.CharField(max_length=10, null=False, blank=False)
    modalidade_aquisicao = models.TextField(default="nao_informado", choices=MODALIDADE_AQUISICAO, null=False, blank=False)

    #contrato
    lei_licitacao = models.TextField(max_length=15, choices=LEI_LICITACAO, null=False, blank=False)
    numero_contrato = models.TextField(max_length=15, null=False, blank=False)
    status = models.CharField(default="nao_informado", max_length=20, choices=STATUS_ARP, null=False, blank=False)
    data_publicacao = models.DateField(null=True, blank=True)

    #ARP
    arp = models.ForeignKey(ContratosArps, on_delete=models.DO_NOTHING, related_name='arp_contrato', null=True, blank=True)

    #denominacao genérica
    denominacao = models.ForeignKey(DenominacoesGenericas, on_delete=models.DO_NOTHING, related_name='denominacao_contrato')

    #fornecedor
    fornecedor = models.ForeignKey(Fornecedores, on_delete=models.DO_NOTHING, related_name='fornecedor_contrato')
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='contrato_deletado')

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
        super(Contratos, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def valor_total(self):
        total = 0
        itens = self.contrato_objeto.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.valor_total()
        return total

    @property
    def data_vigencia(self):
        """Calcula a data de vigência como data_publicacao + 365 dias."""
        if self.data_publicacao:
            return self.data_publicacao + timedelta(days=365)
        return None

    @property
    def prazo_vigencia(self):
        """Calcula o prazo de vigência como data_vigencia - data atual."""
        if self.data_vigencia:
            return (self.data_vigencia - timezone.now().date()).days
        return None

    def fiscal_atual(self):
        fiscal_ativo = self.fiscal_contrato.filter(status='ativo', del_status=False).order_by('-data_inicio').first()
        if fiscal_ativo:
            return fiscal_ativo.fiscal_nome()
        return 'Fiscal Não Informado'

    def __str__(self):
        return f"Contrato: {self.numero_contrato} - Denominação: ({self.denominacao}) - ID ({self.id})"

class ContratosObjetos(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_objeto_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_objeto_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do objeto
    numero_item = models.IntegerField(null=False, blank=False)
    fator_embalagem = models.IntegerField(null=False, blank=False)
    valor_unitario = models.FloatField(null=False, blank=False)

    #Produto
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='produto_contrato_objeto', null=False, blank=False)

    #Contrato
    contrato = models.ForeignKey(Contratos, on_delete=models.DO_NOTHING, related_name='contrato_objeto', null=False, blank=False)

    #ARP Item
    arp_item = models.ForeignKey(ContratosArpsItens, on_delete=models.DO_NOTHING, related_name='arp_item_objeto', null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='contrato_objeto_deletado')

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
        super(ContratosObjetos, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def qtd_contratada(self):
        return self.parcela_objeto.filter(del_status=False).aggregate(Sum('qtd_contratada'))['qtd_contratada__sum'] or 0

    def qtd_doada_objeto(self):
        return self.parcela_objeto.filter(del_status=False).aggregate(Sum('qtd_doada'))['qtd_doada__sum'] or 0
    
    def qtd_total_objeto(self):
        qtd_total = self.qtd_contratada() + self.qtd_doada_objeto()
        return qtd_total

    def qtd_entregue(self):
        total_entregue = 0
        for parcela in self.parcela_objeto.filter(del_status=False):
            total_entregue += parcela.qtd_entregue()
        return total_entregue
    
    def qtd_a_entregar(self):
        qtd_a_entregar = self.qtd_total_objeto() - self.qtd_entregue()
        return qtd_a_entregar

    def numero_parcelas(self):
        return self.parcela_objeto.filter(del_status=False).count()
    
    def numero_parcelas_entregues(self):
        entregues = 0
        for parcela in self.parcela_objeto.filter(del_status=False):
            if parcela.parcela_entregue() == True:
                entregues += 1
        return entregues

    def numero_parcelas_atraso(self):
        contador_atrasos = 0
        for parcela in self.parcela_objeto.filter(del_status=False):
            if parcela.dias_atraso() > 0:
                contador_atrasos += 1
        return contador_atrasos
    
    def dias_atraso(self):
        total_dias_atraso = 0
        for parcela in self.parcela_objeto.filter(del_status=False):
            total_dias_atraso += parcela.dias_atraso()
        return total_dias_atraso

    def valor_total(self):
        return self.valor_unitario * self.qtd_contratada()

    def __str__(self):
        return f"Objeto do contrato: {self.numero_contrato} - Contrato: {self.contrato.numero_contrato} - Produto: ({self.produto.produto}) - ID ({self.id})"
    
class ContratosParcelas(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_parcela_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_parcela_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados da parcela
    numero_parcela = models.IntegerField(null=False, blank=False)
    qtd_contratada = models.IntegerField(null=False, blank=False)
    qtd_doada = models.IntegerField(null=False, blank=False, default=0)
    data_previsao_entrega = models.DateField(null=False, blank=False)

    #objeto
    objeto = models.ForeignKey(ContratosObjetos, on_delete=models.DO_NOTHING, related_name='parcela_objeto', null=False, blank=False)

    #contrato (para facilitar o filtro)
    contrato = models.ForeignKey(Contratos, on_delete=models.DO_NOTHING, related_name='parcela_contrato', null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='contrato_parcela_deletado')

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
        super(ContratosParcelas, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()

    def data_ultima_entrega(self):
        ultima_entrega_data = self.entrega_parcela.filter(del_status=False).aggregate(Max('data_entrega'))['data_entrega__max']
        return ultima_entrega_data if ultima_entrega_data is not None else None
    
    def dias_atraso(self):
        today = timezone.now().date()
        if self.data_ultima_entrega() is None or self.data_ultima_entrega() == "-":
            dias_atraso = today - self.data_previsao_entrega
            return max(dias_atraso.days, 0)  # Retorna 0 se dias_atraso for negativo
        else:
            dias_atraso = self.data_ultima_entrega() - self.data_previsao_entrega
            return max(dias_atraso.days, 0)  # Retorna a diferença em dias
    
    def numero_entregas_atraso(self):
        contador_atrasos = 0
        for entrega in self.entrega_parcela.filter(del_status=False):
            if entrega.dias_atraso() > 0:
                contador_atrasos += 1
        return contador_atrasos

    def qtd_total_parcela(self):
        qtd_total = self.qtd_contratada + self.qtd_doada
        return qtd_total

    def qtd_entregue(self):
        total_entregue = self.entrega_parcela.filter(del_status=False).aggregate(Sum('qtd_entregue'))['qtd_entregue__sum'] or 0
        return total_entregue 
    
    def qtd_a_entregar(self):
        qtd_a_entregar = self.qtd_total_parcela() - self.qtd_entregue()
        return qtd_a_entregar
    
    def parcela_entregue(self):
        qtd_a_entregar = self.qtd_a_entregar()
        if (qtd_a_entregar > 0):
            return True
        else:
            return False

    def numero_entregas(self):
        return self.entrega_parcela.filter(del_status=False).count()

    def valor_unitario(self):
        return self.objeto.valor_unitario

    def valor_total(self):
        return self.valor_unitario() * self.qtd_contratada
    
    def qtd_empenhada(self):
        # Soma a quantidade empenhada de todos os itens de empenho relacionados
        resultado = self.empenho_parcela.filter(del_status=False).aggregate(Sum('qtd_empenhado'))
        return resultado['qtd_empenhado__sum'] or 0
    
    def qtd_a_empenhar(self):
        quantidade = self.qtd_contratada - self.qtd_empenhada()
        return quantidade

    def valor_empenhado(self):
        # Soma o valor empenhado de todos os itens de empenho relacionados
        resultado = self.empenho_parcela.filter(del_status=False).aggregate(Sum('valor_empenhado'))
        return resultado['valor_empenhado__sum'] or 0

    def valor_a_empenhar(self):
        valor = self.valor_total() - self.valor_empenhado()
        return valor

    def empenho_percentual(self):
        percentual = self.valor_empenhado() / self.valor_total()
        return percentual

    def __str__(self):
        return f"Parcela do contrato: {self.numero_parcela} - Contrato: {self.objeto.contrato.numero_contrato} - Produto: ({self.objeto.produto.produto}) - ID ({self.id})"

class ContratosEntregas(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_entrega_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='contrato_entrega_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados da entrega
    numero_entrega = models.IntegerField(null=False, blank=False)
    qtd_entregue = models.IntegerField(null=False, blank=False)
    data_entrega = models.DateField(null=False, blank=False)
    local_entrega = models.CharField(max_length=30, choices=LOCAL_ENTREGA_PRODUTOS, null=False, blank=False)

    #notas fiscais
    notas_recebidas = models.CharField(max_length=20, choices=NOTAS_RECEBIDAS, null=False, blank=False)
    notas_status = models.CharField(max_length=20, choices=NOTAS_STATUS, null=False, blank=False)
    notas_pagamentos = models.CharField(max_length=20, choices=NOTAS_PAGAMENTOS, null=False, blank=False)

    #parcela
    parcela = models.ForeignKey(ContratosParcelas, on_delete=models.DO_NOTHING, related_name='entrega_parcela', null=False, blank=False)

    #contrato (para facilitar o filtro)
    contrato = models.ForeignKey(Contratos, on_delete=models.DO_NOTHING, default=1, related_name='entrega_contrato', null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='contrato_entrega_deletado')

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
        super(ContratosEntregas, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def previsao_entrega(self):
        return self.parcela.data_previsao_entrega
    
    def dias_atraso(self):
        dias_atraso = (self.data_entrega - self.previsao_entrega()).days
        return max(dias_atraso, 0)

    def __str__(self):
        return f"Entrega do contrato: {self.numero_parcela} - Contrato: {self.objeto.contrato.numero_contrato} - Produto: ({self.objeto.produto.produto}) - ID ({self.id})"

class ContratosFiscais(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='fiscal_contrato_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='fiscal_contrato_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados da entrega
    fiscal = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='fiscal_contrato_usuario', null=True, blank=True)
    fiscal_outro = models.CharField(max_length=100, null=False, blank=False)
    status = models.CharField(max_length=10, choices=STATUS_FISCAL_CONTRATO, null=False, blank=False)
    data_inicio = models.DateField(null=False, blank=False)
    data_fim = models.DateField(null=True, blank=True)

    #contrato
    contrato = models.ForeignKey(Contratos, on_delete=models.DO_NOTHING, default=1, related_name='fiscal_contrato', null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='fiscal_contrato_deletado')

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
        super(ContratosFiscais, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def fiscal_nome(self):
        if (self.fiscal_outro != ''):
            return self.fiscal_outro
        else:
            return self.fiscal.dp_nome_completo

    def __str__(self):
        return f"Fiscal do contrato: {self.fiscal_nome()}"

class Empenhos(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='empenho_usuario_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='empenho_usuario_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do empenho
    unidade_daf = models.CharField(max_length=15, choices=UNIDADE_DAF, null=False, blank=False)
    numero_empenho = models.CharField(max_length=20, null=False, blank=False)
    status = models.CharField(max_length=15, choices=STATUS_EMPENHO, null=False, blank=False)
    data_solicitacao = models.DateField(null=False, blank=False)
    data_empenho = models.DateField(null=True, blank=True)
    processo_sei = models.CharField(max_length=20, null=False, blank=False)
    documento_sei = models.CharField(max_length=15, null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='empenho_usuario_delete')

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
        super(Empenhos, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def dias_empenho(self):
        if self.data_empenho:
            dias = (self.data_empenho - self.data_solicitacao).days
            return dias
        else:
            return (timezone.now().date() - self.data_solicitacao).days

    def valor_total(self):
        return 1
    
    def parcelas(self):
        return 1
    
    def contratos(self):
        return 1

    def __str__(self):
        return f"Empenho: {self.numero_empenho()}"
    
class EmpenhosItens(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='empenho_item_usuario_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='empenho_item_usuario_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do empenho
    qtd_empenhado = models.FloatField(null=False, blank=False)
    valor_empenhado = models.FloatField(null=False, blank=False)
    
    #relacionamentos
    empenho = models.ForeignKey(Empenhos, on_delete=models.DO_NOTHING, default=1, related_name='empenho_item', null=False, blank=False)
    parcela = models.ForeignKey(ContratosParcelas, on_delete=models.DO_NOTHING, default=1, related_name='empenho_parcela', null=False, blank=False)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='empenho_item_usuario_delete')

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
        super(EmpenhosItens, self).save(*args, **kwargs)

    def soft_delete(self, user):
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def __str__(self):
        return f"Fiscal do contrato: {self.fiscal_nome()}"

