from django import forms
from apps.fornecedores.models import Fornecedores, Fornecedores_Faq
from setup.choices import CNPJ_HIERARQUIA, CNPJ_PORTE, TIPO_DIREITO

class FornecedoresForm(forms.ModelForm):    
    cnpj = forms.CharField(required=True, widget=forms.TextInput(attrs={'class':'form-control'}))
    hierarquia = forms.ChoiceField(required=False, choices=CNPJ_HIERARQUIA, widget=forms.Select(attrs={'class':'form-control'}))
    porte = forms.ChoiceField(choices=CNPJ_PORTE, required=True, widget=forms.Select(attrs={'class':'form-control'}))
    tipo_direito = forms.ChoiceField(choices=TIPO_DIREITO, widget=forms.Select(attrs={'class':'form-control'}))
    data_abertura = forms.DateField(required=False, widget=forms.DateInput(attrs={'type':'date', 'class':'form-control'}))
    natjuridica_codigo = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    natjuridica_descricao = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    razao_social = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))
    nome_fantasia = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    ativ_principal_cod = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    ativ_principal_descricao = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    end_cep = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    end_uf = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))
    end_municipio = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    end_logradouro = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    end_numero = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    end_bairro = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    observacoes_gerais = forms.CharField(required=False, widget=forms.Textarea(attrs={'class':'form-control'}))
    
    class Meta:
        model = Fornecedores
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']
        labels = {
            'cnpj': 'CNPJ',
            'hierarquia': 'Hierarquia',
            'porte': 'Porte',
            'tipo_direito': 'Tipo de Direito',
            'data_abertura': 'Data de Abertura',
            'natjuridica_codigo': 'Cód. Nat. Jurídica',
            'natjuridica_descricao': 'Natureza Jurídica',
            'razao_social': 'Razão Social',
            'nome_fantasia': 'Nome Fantasia',
            'ativ_principal_cod': 'Cód. Ativ. Principal',
            'ativ_principal_descricao': 'Atividade Principal',
            'end_cep': 'CEP',
            'end_uf': 'UF',
            'end_municipio': 'Município',
            'end_logradouro': 'Logradouro',
            'end_numero': 'Número',
            'end_bairro': 'Bairro',
            'observacoes_gerais': 'Observações gerais',
        }
    
    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        
        if not observacoes:
            return "Sem observações."
        
        return observacoes

class FornecedoresFaqForm(forms.ModelForm):
    topico = forms.CharField(required=True, widget=forms.TextInput(attrs={'class':'form-control'}))
    topico_outro = forms.CharField(required=False, widget=forms.TextInput(attrs={'class':'form-control'}))
    contexto = forms.CharField(required=True, widget=forms.Textarea(attrs={'class':'form-control'}))
    resposta = forms.CharField(required=True, widget=forms.Textarea(attrs={'class':'form-control'}))
    
    #observações gerais
    observacoes_gerais = forms.CharField(required=False, widget=forms.Textarea(attrs={'class':'form-control'}))

    class Meta:
        model = Fornecedores_Faq
        exclude = ['usuario_registro', 'usuario_atualizacao', 'log_n_edicoes', 'del_status', 'del_data', 'del_usuario']
        labels = {
            'topico': 'Tópico',
            'topico_outro': 'Hierarquia',
            'contexto': 'Porte',
            'resposta': 'Tipo de Direito',
            'observacoes_gerais': 'Observações gerais',
        }

    def clean_observacoes_gerais(self):
        observacoes = self.cleaned_data.get('observacoes_gerais')
        
        if not observacoes:
            return "Sem observações."
        
        return observacoes