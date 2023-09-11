from django import forms
from apps.produtos.models import DenominacoesGenericas

class DenominacoesGenericasForm(forms.ModelForm):
    class Meta:
        model = DenominacoesGenericas
        exclude = ['del_status', 'del_data', 'del_cpf']
        labels = {
            'registro_data': 'Data do Registro',
            'usuario_registro': 'Responsável Registro',
            'ult_atual_data': 'Última Atualização',
            'usuario_atualizacao': 'Responsável Atualização',
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
            'registro_data': forms.DateInput(
                format='%d/%m/%Y',
                attrs={
                    'type': 'date',
                    'class':'form-control',
                    'readonly':'readonly'}),
            'usuario_registro': forms.TextInput(attrs={'class':'form-control', 'readonly':'readonly'}),
            'ult_atual_data': forms.DateInput(
                format='%d/%m/%Y',
                attrs={
                    'type': 'date',
                    'class':'form-control',
                    'readonly':'readonly'}),
            'usuario_atualizacao': forms.TextInput(attrs={'class':'form-control', 'readonly':'readonly'}),
            'denominacao': forms.TextInput(attrs={'class':'form-control'}),
            'tipo_produto': forms.Select(attrs={'class':'form-control'}),
            'unidade_basico': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_especializado': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_estrategico': forms.CheckboxInput(attrs={'class':'form-control'}),
            'unidade_farm_popular': forms.CheckboxInput(attrs={'class':'form-control'}),
            'hospitalar': forms.CheckboxInput(attrs={'class':'form-control'}),
            'observacoes_gerais': forms.Textarea(attrs={'class':'form-control'}),
        }

