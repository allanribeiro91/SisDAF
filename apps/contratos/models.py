from django.db import models
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from setup.choices import (STATUS_ARP, UNIDADE_DAF2, TIPO_COTA, 
                           MODALIDADE_AQUISICAO, LEI_LICITACAO, LOCAL_ENTREGA_PRODUTOS,
                           NOTAS_RECEBIDAS, NOTAS_STATUS, NOTAS_PAGAMENTOS)
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
                total += item.valor_total()
        return total

    def qtd_registrada_total_arp(self):
        total = 0
        itens = self.arp_item.all()  # Acessa todos os itens relacionados a esta ARP
        for item in itens:
            if not item.del_status:  # Se o item não estiver deletado
                total += item.qtd_registrada()
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

    def valor_total(self):
        if self.valor_unit_reequilibrio_bool:
            return self.valor_unit_reequilibrio * self.qtd_registrada
        else:
            return self.valor_unit_homologado * self.qtd_registrada

    def qtd_contratada(self):
        total = 0
        for objeto in self.arp_item_objeto.filter(del_status=False):
            total += objeto.qtd_contratada()
        return total


    def qtd_saldo(self):
        qtd_saldo = self.qtd_registrada - self.qtd_contratada()
        return qtd_saldo
    
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
        return self.parcela_objeto.aggregate(Sum('qtd_contratada'))['qtd_contratada__sum'] or 0

    def qtd_entregue(self):
        return 0

    def numero_parcelas(self):
        return 0

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

    def qtd_entregue(self):
        qtd_entregue = 0
        return qtd_entregue
    
    def qtd_a_entregar(self):
        qtd_a_entregar = self.qtd_contratada - self.qtd_entregue()
        return qtd_a_entregar

    def valor_unitario(self):
        return self.objeto.valor_unitario
    
    def data_ultima_entrega(self):
        data_ultima_entrega = '10/12/2023'
        return data_ultima_entrega

    def valor_total(self):
        return self.valor_unitario() * self.qtd_contratada

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

    #objeto
    objeto = models.ForeignKey(ContratosObjetos, on_delete=models.DO_NOTHING, related_name='entrega_objeto', null=False, blank=False)

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

    def __str__(self):
        return f"Entrega do contrato: {self.numero_parcela} - Contrato: {self.objeto.contrato.numero_contrato} - Produto: ({self.objeto.produto.produto}) - ID ({self.id})"