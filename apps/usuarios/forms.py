from django import forms
from apps.usuarios.models import Usuario

class UsuarioForms(forms.ModelForm):
    class Meta:
        model = Usuario
        exclude = ['data_registro', 'data_ultima_atualizacao', 'del_status', 'del_data', 'del_cpf']
        labels = {
            #dados pessoais
            'dp_cpf': 'CPF',
            'dp_nome_completo': 'Nome Completo',
            'dp_data_nascimento': 'Data de Nascimento',
            'dp_genero': 'Gênero',
            'dp_cor_pele': 'Cor da Pele',

            #foto
            'foto_usuario': 'Foto do Usuário',

            #contato (ctt)
            'ctt_ramal_ms': 'Ramal MS',
            'ctt_celular': 'Celular',
            'ctt_email_ms':'Email Institucional',
            'ctt_email_pessoal': 'Email Pessoal',

            #redes sociais (rs)
            'rs_linkedin': 'LinkedIn',
            'rs_lattes': 'Lattes',

            #vinculo com o Ministério da Saúde (vms)
            'vms_vinculo': 'Tipo de Vínculo',
            'vms_orgao': 'Órgão de Origem',
            'vms_orgao_outro': 'Outro',

            #alocação atual
            'aloc_unidade': 'Unidade DAF',
            'aloc_setor': 'Setor',
            'aloc_data_inicio': 'Data de Início',
        }

        widgets = {
            #dados pessoais
            'dp_cpf': forms.TextInput(attrs={'class':'form-control'}),
            'dp_nome_completo': forms.TextInput(attrs={'class':'form-control'}),
            'dp_data_nascimento': forms.DateInput(
                format='%d/%m/%Y',
                attrs={
                    'type': 'date',
                    'class':'form-control'}),
            'dp_genero': forms.Select(attrs={'class':'form-control'}),
            'dp_cor_pele': forms.Select(attrs={'class':'form-control'}),

            #foto
            'foto_usuario': forms.FileInput(attrs={'class':'form-control'}),

            #contato (ctt)
            'ctt_ramal_ms': forms.TextInput(attrs={'class':'form-control'}),
            'ctt_celular': forms.TextInput(attrs={'class':'form-control'}),
            'ctt_email_ms': forms.EmailInput(attrs={'class':'form-control'}),
            'ctt_email_pessoal': forms.EmailInput(attrs={'class':'form-control'}),

            #redes sociais (rs)
            'rs_linkedin': forms.URLInput(attrs={'class':'form-control'}),
            'rs_lattes': forms.URLInput(attrs={'class':'form-control'}),

            #vinculo com o Ministério da Saúde (vms)
            'vms_vinculo': forms.Select(attrs={'class':'form-control'}),
            'vms_orgao': forms.TextInput(attrs={'class':'form-control'}),
            'vms_orgao_outro': forms.TextInput(attrs={'class':'form-control'}),

            #alocação atual
            'aloc_unidade': forms.TextInput(attrs={'class':'form-control'}),
            'aloc_setor': forms.TextInput(attrs={'class':'form-control'}),
            'aloc_data_inicio': forms.DateInput(
                format='%d/%m/%Y',
                attrs={
                    'type': 'date',
                    'class':'form-control'}),
        }
    