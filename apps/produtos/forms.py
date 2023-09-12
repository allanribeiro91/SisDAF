from django import forms
from apps.produtos.models import DenominacoesGenericas

class DenominacoesGenericasForm(forms.ModelForm):    
    class Meta:
        model = DenominacoesGenericas
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_cpf']
        labels = {
            'denominacao': 'Denominação Genérica',
            'tipo_produto': 'Tipo de Produto',
            'unidade_basico': 'Básico',
            'unidade_especializado': 'Especializado',
            'unidade_estrategico': 'Estratégico',
            'unidade_farm_popular': 'Farmácia Popular',
            'hospitalar': 'Hospitalar',
            'observacoes_gerais': 'Observações',
        }
        widgets = {
            'denominacao': forms.TextInput(attrs={'class':'form-control'}),
            'tipo_produto': forms.Select(attrs={'class':'form-control'}),
            'unidade_basico': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_especializado': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_estrategico': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_farm_popular': forms.CheckboxInput(attrs={'class':'form-control'}),
            'hospitalar': forms.CheckboxInput(attrs={'class':'form-control'}),
            'observacoes_gerais': forms.Textarea(attrs={'class':'form-control'}),
        }

