from django import forms
from apps.usuarios.models import Usuario
from apps.produtos.models import ProdutosFarmaceuticos
from django_select2.forms import Select2Widget
from apps.gestao_pacientes.models import Pacientes, Dispensacoes, Atendimento_Judicial
from setup.choices import (GENERO_SEXUAL, COR_PELE, ORIENTACAO_SEXUAL, 
                           VIA_ATENDIMENTO, FASE_TRATAMENTO, ORIGEM_DEMANDA_JUDICIAL,
                           LISTA_UFS_SIGLAS, STATUS_DISPENSACAO, CICLO_TRATAMENTO,
                           ORIGEM_DEMANDA_JUDICIAL_SOLICITACAO)

class PacientesForm(forms.ModelForm):
    #dados do paciente
    cns = forms.CharField(
        max_length=18,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_paciente_cns',
        }),
        label='CNS',
        initial='',
        required=True,
    )
    cpf = forms.CharField(
        max_length=14,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_paciente_cpf',
        }),
        label='CPF',
        initial='',
        required=False,
    )
    nome = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_paciente_nome',
        }),
        label='Nome',
        initial='',
        required=True,
    )
    data_nascimento = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Data Nascimento'
    )
    data_obito = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
        label='Data Óbito'
    )
    sexo = forms.ChoiceField(
        choices=GENERO_SEXUAL,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_paciente_sexo'
        }),
        label='Sexo',
        initial='nao_informado',
        required=False,
    )
    cor_pele = forms.ChoiceField(
        choices=COR_PELE,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_paciente_cor_pele'
        }),
        label='Cor da Pele',
        initial='nao_informado',
        required=False,
    )
    orientacao_sexual = forms.ChoiceField(
        choices=ORIENTACAO_SEXUAL,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_paciente_orientacao_sexual'
        }),
        label='Orientação Sexual',
        initial='nao_informado',
        required=False,
    )
    #naturalidade
    naturalidade_cod_ibge = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_paciente_cod_ibge',
            'readonly': 'readonly',
        }),
        label='Cód. IBGE',
        initial='',
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
        model = Pacientes
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."


class DispensacoesForm(forms.ModelForm):
    #dados da dispensacao
    via_atendimento = forms.ChoiceField(
        choices=VIA_ATENDIMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_via_atendimento'
        }),
        label='Via de Atendimento',
        initial='',
        required=True,
    )
    origem_demanda_judicial = forms.ChoiceField(
        choices=ORIGEM_DEMANDA_JUDICIAL,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_origem_demanda_judicial',
            'disabled': 'disabled',
        }),
        label='Origem Demanda',
        initial='nao_se_aplica',
        required=False,
    )
    numero_processo_sei = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control full-width', 
            'id': 'id_dispensacao_processo_sei', 
        }),
        label='Nº Processo SEI',
        required=False,
    )
    uf_solicitacao = forms.ChoiceField(
        choices=LISTA_UFS_SIGLAS,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_uf_solicitacao'
        }),
        label='SES/UF - Solicitação',
        initial='',
        required=False,
    )
    quantidade = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_quantidade',
            'style': 'text-align: right',
        }),
        label='Qtd Dispensada',
        required=True,
    )
    #produto
    produto = forms.ModelChoiceField(
        queryset=ProdutosFarmaceuticos.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_produto',
        }),
        label='Produto Farmacêutico',
        initial='',
        required=True,
    )
    #tratamento
    cid = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_cid',
        }),
        label='CID',
        initial='',
        required=False,
    )
    fase_tratamento = forms.ChoiceField(
        choices=FASE_TRATAMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_fase_tratamento'
        }),
        label='Fase do Tratamento',
        initial='',
        required=False,
    )
    ciclo = forms.ChoiceField(
        choices=CICLO_TRATAMENTO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_ciclo'
        }),
        label='Ciclo',
        initial='',
        required=False,
    )
    #pedido
    status = forms.ChoiceField(
        choices=STATUS_DISPENSACAO,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id':'id_dispensacao_status'
        }),
        label='Status',
        initial='',
        required=True,
    )
    numero_pedido_sismat = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_numero_pedido_sismat',
            'readonly': 'readonly'
        }),
        label='Nº Pedido SISMAT',
        initial='',
        required=False,
    )
    data_solicitacao = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
    )
    data_envio = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
    )
    data_entrega = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
    )
    data_consumo = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        required=False,
    )
    #aplicação
    comprovante_doc_sei = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_comprovante_doc_sei',
        }),
        label='Comprovante (Doc SEI)',
        initial='',
        required=False,
    )
    local_aplicacao_cod_ibge = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_local_aplicacao_cod_ibge',
            'readonly': 'readonly',
        }),
        label='Cód. IBGE',
        initial='',
        required=False,
    )
    local_aplicacao_unidade_saude = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_local_aplicacao_unidade_saude',
        }),
        label='Local Aplicação (Unidade de Saúde)',
        initial='',
        required=False,
    )
    #paciente
    paciente = forms.ModelChoiceField(
        queryset=Pacientes.objects.all(),
        widget=Select2Widget(attrs={
            'class': 'form-control',
            'id': 'id_dispensacao_paciente',
        }),
        label='Paciente',
        initial='',
        required=True,
    )
    #observacoes gerais
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control auto-expand',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'id_dispensacao_observacoes'
            }),
        required=False,
        label='Observações Gerais'
    )

    class Meta:
        model = Dispensacoes
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

