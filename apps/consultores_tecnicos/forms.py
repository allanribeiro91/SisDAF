from django import forms
from apps.usuarios.models import Usuario
from setup.choices import FONTES_CONTRATOS_CONSULTORES, STATUS_CONTRATOS_CONSULTORES
from apps.consultores_tecnicos.models import ConsultoresContratos

class ConsultoresContratosForm(forms.ModelForm):
    status = forms.ChoiceField(
    choices=STATUS_CONTRATOS_CONSULTORES,
    widget=forms.Select(attrs={
        'class': 'form-select',
        'id': 'consultor_contrato_status',
    }),
    initial='',
    label='Status',
    required=True,
    )

    fonte = forms.ChoiceField(
        choices=FONTES_CONTRATOS_CONSULTORES,
        widget=forms.Select(attrs={
            'class': 'form-select',
            'id': 'consultor_contrato_fonte',
        }),
        initial='',
        label='Fonte',
    )
    instrumento_juridico = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            
        }),
        # label='Instrumento Jurídico',
        required=False,
    )
    n_contrato = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
        }),
        label='Nº Contrato',
    )
    data_assinatura = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        label='Data de Assinatura',
        required=False,
    )
    vigencia = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
        }),
        label='Vigência',
        required=False,
    )
    objeto = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
        }),
        label='Objeto',
        required=False,
    )
    metodologia = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
        }),
        label='Metodologia',
        required=False,
    )
    link_tr = forms.URLField(
        widget=forms.URLInput(attrs={
            'class': 'form-control',
        }),
        label='Link TR',
        required=False,
    )
    link_contrato = forms.URLField(
        widget=forms.URLInput(attrs={
            'class': 'form-control',
        }),
        label='Link do Contrato',
        required=False,
    )
    observacoes_gerais = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
        }),
        label='Observações Gerais',
        required=False,
    )

    class Meta:
        model = ConsultoresContratos
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'registro_data', 'ult_atual_data']

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        return observacoes or "Sem observações."
