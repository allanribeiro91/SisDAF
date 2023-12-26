from django import forms
from django.core.exceptions import ValidationError
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.processos_aquisitivos.models import ProaqDadosGerais, ProaqItens, ProaqEvolucao, ProaqTramitacao
from setup.choices import STATUS_PROAQ, UNIDADE_DAF2, STATUS_FASE, TIPO_COTA

class DenominacaoModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.get_denominacao_nome()

class UsuarioChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.dp_nome_completo

class ProaqDadosGeraisForm(forms.ModelForm):    
    unidade_daf = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaq_unidade_daf',
            'readonly': 'readonly',
            'style': 'width: 150px',
            'type': 'hidden',
        }),
        label='Unidade DAF',
        initial='',
        required=True,
    )
    modalidade_aquisicao = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaq_modalidade_aquisicao',
            'readonly': 'readonly',
            'type': 'hidden',
        }),
        label='Modalidade de Aquisição',
        initial='',
    )
    numero_processo_sei = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaq_numero_processo_sei',
        }),
        label='Nº do Processo SEI',
        required=True,
        initial='',
    )
    numero_etp = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaq_numero_etp',
        }),
        label='Nº ETP',
        initial='',
    )
    status = forms.ChoiceField(
        choices=STATUS_PROAQ, 
        required=True,
        widget=forms.Select(attrs={
            'class':'form-select',
            'id': 'id_proaq_status'
        }),
        label='Status'
    )
    outro_responsavel = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaq_outro_responsavel',
            'readonly': 'readonly'
        }),
        label='Outro Responsável',
        required=False,
        initial='',
    )
    #relacionamentos
    responsavel_tecnico = UsuarioChoiceField(
        queryset=Usuario.objects.all(),
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'id_proaq_responsavel_tecnico'
        })
    )
    denominacao = DenominacaoModelChoiceField(
        queryset=DenominacoesGenericas.objects.filter(del_status=False),
        required=True,
        widget=forms.Select(attrs={
            'class':'form-control',
            'id': 'id_proaq_denominacao',
            'type': 'hidden',
        }),
        empty_label="Não Informado"
    )
    #observações gerais
    observacoes_gerais = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class':'form-control'
        })
    )
    class Meta:
        model = ProaqDadosGerais
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']  
    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ProaqItensForm(forms.ModelForm):    
    numero_item = forms.IntegerField(
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'id': 'id_proaqitem_numero_item',
        }),
        label='Nº do Item',
        initial='',
        required=True,
    )
    tipo_cota = forms.ChoiceField(
        choices=TIPO_COTA, 
        required=True,
        widget=forms.Select(attrs={
            'class':'form-select',
            'id': 'id_proaqitem_tipo_cota',
        }),
        label='Tipo de Cota',
        initial=''
    )
    cmm_data_inicio = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'id': 'id_proaqitem_cmm_data_inicio',
        }),
        required=True,
        label='CMM - Início'
    )
    cmm_data_fim = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'id': 'id_proaqitem_cmm_data_fim',
        }),
        required=True,
        label='CMM - Fim'
    )
    cmm_estimado = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaqitem_cmm_estimado',
            'style': 'text-align: right',
        }),
        label='CMM de Referência',
        initial='',
        required=True,
    )
    qtd_a_ser_contratada = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaqitem_qtd_a_ser_contratada',
            'style': 'text-align: right',
        }),
        label='Qtd a ser Adquirida',
        initial='',
        required=True,
    )    
    valor_unitario_estimado = forms.FloatField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'id_proaqitem_valor_unitario',
            'style': 'text-align: right',
        }),
        label='Valor Unitário R$ Estimado',
        initial='',
        required=True,
    )
    #relacionamentos
    proaq = forms.ModelChoiceField(
        queryset=ProaqDadosGerais.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Processo Aquisitivo',
        initial='',
        required=True,
    )
    produto = forms.ModelChoiceField(
        queryset=ProdutosFarmaceuticos.objects.all(),
        widget=forms.Select(attrs={
            'class': 'form-control',
        }),
        label='Produto Farmacêutico',
        initial='',
        required=True,
    )
    #observações gerais
    observacoes_gerais = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class':'form-control',
            'rows': 1,
            'style': 'padding-top: 30px; height: 80px;',
            'id': 'id_proaqitem_observacoes'
        })
    )
    class Meta:
        model = ProaqItens
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']
    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."

class ProaqEvolucaoForm(forms.ModelForm):
    proaq = forms.ModelChoiceField(
        queryset=ProaqDadosGerais.objects.all(), 
        required=True, 
        widget=forms.Select(attrs={'class':'form-control'}),
        label='Proaq'
    )
    fase = forms.IntegerField(
        required=True, 
        widget=forms.NumberInput(attrs={'class':'form-control'}),
        label='Fase'
    )
    status = forms.ChoiceField(
        choices=STATUS_FASE, 
        required=True, 
        widget=forms.Select(attrs={'class':'form-control'}),
        label='Status'
    )
    data_inicio = forms.DateField(
        required=False, 
        widget=forms.DateInput(attrs={'class':'form-control', 'type':'date'}),
        label='Data de Início'
    )
    data_fim = forms.DateField(
        required=False, 
        widget=forms.DateInput(attrs={'class':'form-control', 'type':'date'}),
        label='Data Fim'
    )
    comentario = forms.CharField(
        required=False, 
        widget=forms.Textarea(attrs={'class':'form-control'}),
        label='Comentário'
    )
    
    class Meta:
        model = ProaqEvolucao
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario',]
        labels = {
            'proaq': 'proaq',
            'fase': 'Fase',
            'status': 'Status',
            'data_inicio': 'Data de Início',
            'data_fim': 'Data Fim',
            'comentario': 'Comentário',
        }
    
    def clean(self):
        cleaned_data = super().clean()
        data_inicio = cleaned_data.get("data_inicio")
        data_fim = cleaned_data.get("data_fim")
        comentario = cleaned_data.get("comentario")
        
        #Validação de data
        if data_inicio and data_fim and data_inicio > data_fim:
            raise ValidationError("A data de início não pode ser posterior à data de fim.")
        
        # Ajuste para o campo comentario
        if comentario in [None, '']:
            cleaned_data['comentario'] = "Sem comentários."
        
        return cleaned_data


class ProaqTramitacaoForm(forms.ModelForm):
    proaq = forms.ModelChoiceField(
        queryset=ProaqDadosGerais.objects.all(), 
        required=True, 
        widget=forms.Select(attrs={'class':'form-control'}),
        label='Proaq'
    )
    documento_sei = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class':'form-control'}),
        label='Documento SEI',
        max_length=20,
    )
    setor = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class':'form-control'}),
        label='Setor',
        max_length=50,
    )
    etapa_processo = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class':'form-control'}),
        label='Etapa do Processo',
        max_length=100,
    )
    data_entrada = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'class':'form-control'}),
        label='Data de Entrada'
    )
    previsao_saida = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'class':'form-control'}),
        label='Previsão de Saída'
    )
    data_saida = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={'class':'form-control'}),
        label='Data de Saída'
    )
    observacoes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class':'form-control'}),
        label='Observações'
    )

    class Meta:
        model = ProaqTramitacao
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario',]
        labels = {
            'usuario_registro': 'Usuário Registro',
            'usuario_atualizacao': 'Usuário Atualização',
            'proaq': 'ID PROAQ',
            'documento_sei': 'Documento SEI',
            'setor': 'Setor',
            'etapa_processo': 'Etapa do Processo',
            'data_entrada': 'Data de Entrada',
            'previsao_saida': 'Previsão de Saída',
            'data_saida': 'Data de Saída',
            'observacoes': 'Observações',
            'del_usuario': 'Usuário Deletado',
        }