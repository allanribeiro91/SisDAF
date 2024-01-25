from django import forms
from django_select2.forms import Select2Widget
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.fornecedores.models import Fornecedores
from apps.contratos.models import (ContratosArps, ContratosArpsItens, Contratos,
                                   ContratosObjetos, ContratosParcelas, ContratosEntregas, ContratosFiscais,
                                   Empenhos, EmpenhosItens)
from setup.choices import (STATUS_ARP, UNIDADE_DAF, UNIDADE_DAF3, TIPO_COTA, YES_NO, 
                           MODALIDADE_AQUISICAO, LEI_LICITACAO, LOCAL_ENTREGA_PRODUTOS,
                           NOTAS_RECEBIDAS, NOTAS_STATUS, NOTAS_PAGAMENTOS, STATUS_FISCAL_CONTRATO,
                           STATUS_EMPENHO, TIPO_CONTRATO)

UNIDADE_DAF = [item for item in UNIDADE_DAF if item[0] not in ['cofisc', 'gabinete']]

class ContratosArpsForm(forms.ModelForm):
    unidade_daf = forms.ChoiceField(
        choices=UNIDADE_DAF,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'arp_unidade_daf',
        }),
        label='Unidade DAF',
        initial='',
        required=True,
    )
    lei_licitacao = forms.ChoiceField(
        choices=LEI_LICITACAO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'arp_lei_licitacao'
        }),
        label='Lei de Licitação',
        initial='nao_informado',
        required=True,
    )
    numero_processo_sei = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control', 
            'id': 'arp_processo_sei', 
            'name': 'numero_processo_sei',
            'style': 'width: 180px !important;'
        }),
        label='Nº Processo SEI',
        required=True,
    )
    numero_documento_sei = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'arp_documento_sei',
            'style': 'width: 180px !important;'
        }),
        label='Documento SEI',
        required=True,
    )
    numero_arp = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'arp_numero_arp',
            'style': 'width: 180px !important;'
        }),
        label='Nº da ARP',
        required=True,
    )
    status = forms.ChoiceField(
        choices=STATUS_ARP,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'arp_status'
        }),
        label='Status',
        initial='',
        required=True,
    )
    data_publicacao = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Data Publicação'
    )
    denominacao = forms.ModelChoiceField(
        queryset=DenominacoesGenericas.objects.all().order_by('denominacao'),
        widget=Select2Widget(attrs={
            'class': 'form-select', 
            'id': 'arp_denominacao',
            'disabled': True, 
        }),
        label='Denominação Genérica',
        empty_label='Selecione uma denominação genérica',
        required=False,
    )
    fornecedor = forms.ModelChoiceField(
        queryset=Fornecedores.objects.all().order_by('nome_fantasia'),
        widget=Select2Widget(attrs={
            'class': 'form-select', 
            'id': 'cnpj_fornecedor', 
        }),
        label='Fornecedor',
        empty_label='Selecione um CNPJ',
        required=False,
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 10px; height: 120px;',
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosArps
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosArpsItensForm(forms.ModelForm):
    arp = forms.ModelChoiceField(
        queryset=ContratosArps.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-select',
            'id': 'arp',
        }),
        label='ARP',
        required=True,
    )
    numero_item = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'arp_n_item',
            'style': 'width: 100px'
        }),
        label='Nº do Item',
        min_value=1,
        max_value=20,
        required=True,
    )
    tipo_cota = forms.ChoiceField(
        choices=[('', '')] + TIPO_COTA,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'arp_tipo_cota',
            'style': 'width: 150px'
        }),
        label='Tipo de Cota',
        initial='',
        required=True,
    )
    empate_ficto = forms.ChoiceField(
        choices=[('', '')] + YES_NO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'arp_empate_ficto',
            'style': 'width: 150px',
        }),
        label='Empate Ficto',
        initial='',
        required=True,
    )
    produto = forms.ModelChoiceField(
        queryset=ProdutosFarmaceuticos.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-select',
            'id': 'arp_produto_farmaceutico',
        }),
        label='Produto Farmacêutico',
        required=True,
    )
    valor_unit_homologado = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'arp_valor_unitario',
            'style': 'text-align: right'
        }),
        label='Valor Unit. Homologado',
        required=True,
    )
    valor_unit_reequilibrio_bool = forms.BooleanField(
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input',
            'id': 'arp_valor_reequilibrio_check',
        }),
        label='Reequilíbrio de Valor Unitário',
        required=False,
    )
    valor_unit_reequilibrio = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'arp_valor_reequilibrio',
            'style': 'text-align: right',
            'readonly': 'true'
        }),
        label='Valor Unit. Reequilíbrio',
        required=False,
    )
    qtd_registrada = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'arp_qtd_registrada',
            'style': 'text-align: right',
        }),
        label='Quantidade Registrada',
        required=False,
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 10px; height: 80px;',
            'id': 'arp_observacoes_gerais'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosArpsItens
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosForm(forms.ModelForm):
    unidade_daf = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'ct_unidade_daf',
            'name': 'unidade_daf',
            'readonly': 'readonly',
            'style': 'width: 150px',
            'type': 'hidden',
        }),
        label='Unidade DAF',
        initial='',
        required=True,
    )
    lei_licitacao = forms.ChoiceField(
        choices=LEI_LICITACAO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'ct_lei_licitacao',
        }),
        label='Lei de Licitação',
        initial='nao_informado',
        required=True,
    )
    modalidade_aquisicao = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'ct_modalidade_aquisicao',
            'readonly': 'readonly',
            'type': 'hidden',
        }),
        label='Modalidade de Aquisição',
        initial='',
    )
    numero_processo_sei = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control full-width', 
            'id': 'ct_processo_sei', 
            'name': 'numero_processo_sei',
            
        }),
        label='Nº Processo SEI',
        required=True,
    )
    numero_documento_sei = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'ct_documento_sei',
            'style': 'width: 150px !important;'
        }),
        label='Documento SEI',
        required=True,
    )
    numero_contrato = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'ct_numero_contrato',
            'name': 'numero_contrato',
            'style': 'width: 150px !important;'
        }),
        label='Nº do Contrato',
        required=True,
    )
    tipo_contrato = forms.ChoiceField(
        choices=TIPO_CONTRATO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'ct_tipo_contrato'
        }),
        label='Tipo de Contrato',
        initial='',
        required=True,
    )
    status = forms.ChoiceField(
        choices=STATUS_ARP,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'ct_status'
        }),
        label='Status',
        initial='',
        required=True,
    )
    data_publicacao = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Data Publicação'
    )
    arp = forms.ModelChoiceField(
        queryset=ContratosArps.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'ct_arp',
            'readonly': 'readonly',
            'type': 'hidden',
            'name': 'arp',
        }),
        label='Nº da ARP',
        initial='',
        required=False,
    )
    denominacao = forms.ModelChoiceField(
        queryset=DenominacoesGenericas.objects.all().order_by('denominacao'),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'ct_denominacao',
            'readonly': 'readonly',
            'type': 'hidden',
        }),
        label='Denominação Genérica',
        initial='',
    )
    fornecedor = forms.ModelChoiceField(
        queryset=Fornecedores.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'ct_fornecedor',
            'readonly': 'readonly',
            'type': 'hidden',
        }),
        label='Fornecedor',
        initial='',
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 10px; height: 120px;',
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = Contratos
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosObjetosForm(forms.ModelForm):
    numero_item = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'ctobjeto_numero_item',
        }),
        required=True,
        label='Item',
        min_value=1,
        max_value=20,
    )
    fator_embalagem = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'ctobjeto_fator_embalagem',
            'style': 'text-align: right;',
        }),
        required=True,
        label='Fator Embalagem'
    )
    valor_unitario = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'ctobjeto_valor_unitario',
            'style': 'text-align: right;',
        }),
        required=True,
        label='Valor Unitário'
    )
    produto = forms.ModelChoiceField(
        queryset=ProdutosFarmaceuticos.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'ctobjeto_produto',
        }),
        label='Produto Farmacêutico',
        initial='',
        required=True,
    )
    contrato = forms.ModelChoiceField(
        queryset=Contratos.objects.all().order_by('numero_contrato'),
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'ctobjeto_contrato',
        }),
        label='Contrato',
        initial='',
        required=True,
    )
    arp_item = forms.ModelChoiceField(
        queryset=ContratosArpsItens.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Item ARP',
        initial='',
        required=False,
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'ctobjeto_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosObjetos
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosParcelasForm(forms.ModelForm):
    numero_parcela = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'id_numero_parcela',
        }),
        required=True,
        label='Parcela',
        min_value=1,
        max_value=10,
    )
    qtd_contratada = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_parcela_qtd_contratada',
            'style': 'text-align: right',
        }),
        label='Qtd Contratada',
        required=False,
    )
    qtd_doada = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_parcela_qtd_doada',
            'style': 'text-align: right',
        }),
        label='Qtd Doada',
        required=False,
    )
    data_previsao_entrega = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Previsão de Entrega'
    )
    objeto = forms.ModelChoiceField(
        queryset=ContratosObjetos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Objeto',
        initial='',
        required=True,
    )
    contrato = forms.ModelChoiceField(
        queryset=Contratos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Contrato',
        initial='',
        required=True,
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 100px;',
            'id': 'id_parcela_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosParcelas
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosEntregasForm(forms.ModelForm):
    #dados da entrega
    numero_entrega = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'id_entrega_numero_entrega',
        }),
        min_value=1,
        max_value=30,
        required=True,
        label='Nº da Entrega',
    )
    qtd_entregue = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_entrega_qtd_entregue',
            'style': 'text-align: right',
        }),
        label='Qtd Entregue',
        required=True,
    )
    data_entrega = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'id': 'id_entrega_data_entrega',
            'type': 'date',
        }),
        required=True,
        label='Data de Entrega'
    )
    local_entrega = forms.ChoiceField(
        choices=LOCAL_ENTREGA_PRODUTOS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_entrega_local_entrega'
        }),
        label='Local da Entrega',
        initial='',
        required=True,
    )
    #notas fiscais
    notas_recebidas = forms.ChoiceField(
        choices=NOTAS_RECEBIDAS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_entrega_notas_recebidas'
        }),
        label='Notas Recebidas',
        initial='nao_informado',
        required=False,
    )
    notas_status = forms.ChoiceField(
        choices=NOTAS_STATUS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_entrega_notas_status'
        }),
        label='Status das Notas',
        initial='nao_informado',
        required=False,
    )
    notas_pagamentos = forms.ChoiceField(
        choices=NOTAS_PAGAMENTOS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_entrega_notas_pagamentos'
        }),
        label='Pagamentos das Notas',
        initial='nao_informado',
        required=False,
    )
    #relacionamentos
    parcela = forms.ModelChoiceField(
        queryset=ContratosParcelas.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Parcela',
        initial='',
        required=True,
    )
    contrato = forms.ModelChoiceField(
        queryset=Contratos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Contrato',
        initial='',
        required=True,
    )
    #observacoes gerais
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'id_entrega_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosEntregas
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ContratosFiscaisForm(forms.ModelForm):
    #dados do fiscal
    fiscal = forms.ModelChoiceField(
        queryset=Usuario.objects.filter(vms_vinculo__in=['servidor_federal', 'servidor_estadual', 'servidor_municipal']),
        widget=forms.Select(attrs={
            'class': 'form-control',
            'id': 'id_fiscal',
        }),
        label='Fiscal',
        initial='',
        required=False,
    )
    fiscal_outro = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_fiscal_outro',
            'readonly': 'readonly',
        }),
        label='Outro',
        required=False,
    )
    documento_sei = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_fiscal_documento_sei',
            'style': 'width: 160px !important;'
        }),
        label='Doc SEI - Nomeação',
        required=True,
    )
    status = forms.ChoiceField(
        choices=STATUS_FISCAL_CONTRATO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'id_fiscal_status',
            'style': 'width: 120px'
        }),
        initial='ativo',
        label='Status',
        required=True,
    )
    data_inicio = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        required=True,
        label='Data de Início'
    )
    data_fim = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Data Fim'
    )
    #contrato
    contrato = forms.ModelChoiceField(
        queryset=Contratos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Contrato',
        initial='',
        required=True,
    )
    #observacoes gerais
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'id_fiscal_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = ContratosFiscais
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class EmpenhoForm(forms.ModelForm):
    #dados do fiscal
    unidade_daf = forms.ChoiceField(
        choices=UNIDADE_DAF3,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'empenho_unidade_daf',
        }),
        label='Unidade DAF',
        initial='',
        required=True,
    )
    numero_empenho = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'empenho_numero',
            'style': 'width: 180px !important;'
        }),
        label='Nº do Empenho',
        required=False,
    )
    status = forms.ChoiceField(
        choices=STATUS_EMPENHO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'empenho_status',
        }),
        initial='',
        label='Status',
        required=True,
    )
    data_solicitacao = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        required=True,
        label='Data da Solicitação'
    )
    data_empenho = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        required=False,
        label='Data do Empenho'
    )
    processo_sei = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control', 
            'id': 'empenho_processo_sei', 
            'style': 'width: 180px !important;'
        }),
        label='Nº Processo SEI',
        required=True,
    )
    documento_sei = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'empenho_documento_sei',
            'style': 'width: 180px !important;'
        }),
        label='Documento SEI',
        required=False,
    )

    #observacoes gerais
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'empenho_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = Empenhos
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class EmpenhosItensForm(forms.ModelForm):
    #valor empenhado
    qtd_empenhado = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'itemEmpenho_qtdEmpenho',
            'style': 'width: 180px !important; text-align: right;'
        }),
        label='Qtd Empenhada',
        required=False,
    )
    valor_empenhado = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'itemEmpenho_valorEmpenho',
            'style': 'width: 180px !important; text-align: right;'
        }),
        label='Valor Empenhado',
        required=False,
    )
    #observacoes gerais
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'itemEmpenho_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )
    #contratos parcelas
    empenho = forms.ModelChoiceField(
        queryset=Empenhos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Empenho',
        initial='',
        required=True,
    )
    parcela = forms.ModelChoiceField(
        queryset=ContratosParcelas.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Parcela',
        initial='',
        required=True,
    )

    class Meta:
        model = EmpenhosItens
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."