from django import forms
from django.core.exceptions import ValidationError
from apps.usuarios.models import Usuario, Alocacao

class UsuarioForms(forms.ModelForm):
    class Meta:
        model = Usuario
        exclude = ['user', 'data_registro', 'data_ultima_atualizacao', 'del_status', 'del_data', 'del_cpf']
        labels = {
            #dados pessoais
            'dp_cpf': 'CPF',
            'dp_nome_completo': 'Nome Completo',
            'dp_data_nascimento': 'Data de Nascimento',
            'dp_genero': 'Gênero Sexual',
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
            'vms_orgao': forms.Select(attrs={'class':'form-control'}),
            'vms_orgao_outro': forms.TextInput(attrs={'class':'form-control'}),

        }


class AlocacaoForm(forms.ModelForm):
    class Meta:
        model = Alocacao
        fields = ['unidade', 'setor', 'data_inicio', 'data_fim', 'is_ativo']

    def clean(self):
        cleaned_data = super().clean()
        is_ativo = cleaned_data.get('is_ativo')
        data_fim = cleaned_data.get('data_fim')
        usuario = self.instance.usuario

        # Verifica se já existe uma alocação ativa para o usuário
        if is_ativo:
            alocacoes_ativas = Alocacao.objects.filter(usuario=usuario, is_ativo=True).exclude(pk=self.instance.pk)
            if alocacoes_ativas.exists():
                raise ValidationError('Já existe uma alocação ativa para este usuário.')

        # Verifica se a data_fim está preenchida quando is_ativo é False
        if not is_ativo and data_fim is None:
            raise ValidationError('A data de fim é requerida quando a alocação não está ativa.')

        return cleaned_data

