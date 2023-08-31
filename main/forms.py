from django import forms

class LoginForms(forms.Form):
    cpf=forms.CharField(
        label="CPF",
        required=True,
        max_length=14,
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite o seu CPF",
                "id": "cpf"
            }
        )
    )
    senha=forms.CharField(
        label="Senha",
        required=True,
        max_length=50,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite a sua senha"
            }
        )
    )

class CadastroForms(forms.Form):
    SETOR_DAF = [
    ('', '--- Selecione ---'),  # Opção vazia
    ('cgafb', "CGAFB"),
    ('cgafme', "CGAFME"),
    ('cgceaf', "CGCEAF"),
    ('cgfp', "CGFP"),
    ('cofisc', "COFISC"),
    ('gabinete', "GABINETE")
    ]    
    
    cpf=forms.CharField(
        label="CPF",
        required=True,
        max_length=14,
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite o seu CPF",
                "id": "cpf"
            }
        )
    )
    nome_usuario=forms.CharField(
        label="Nome Completo",
        required=True,
        min_length=10,
        max_length=50, 
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite o seu nome completo",
            }
        )
    )
    email_ms=forms.EmailField(
        label="Email MS",
        required=True,
        min_length=10,
        max_length=50, 
        widget=forms.EmailInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite o seu email no Ministério da Saúde",
                "id": "email_ms"
            }
        )
    )
    email_pessoal=forms.EmailField(
        label="Email Pessoal",
        required=True,
        min_length=10,
        max_length=50, 
        widget=forms.EmailInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite o seu email pessoal",
            }
        )
    )
    celular=forms.CharField(
        label="Celular",
        required=True,
        min_length=16, 
        max_length=16, 
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "id": "celular"
            }
        )
    )
    setor_daf=forms.ChoiceField(
        label="Setor do DAF",
        required=True,
        choices=SETOR_DAF,
        widget=forms.Select(
            attrs={
                "class": "form-control",
                "value": "none"
            }
        ),
        initial='',
    )
    senha_1=forms.CharField(
        label="Senha",
        required=True,
        min_length=6,
        max_length=50,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite a senha",
                "autocomplete": "new-password"
            }
        )
    )
    senha_2=forms.CharField(
        label="Confirme a Senha",
        required=True,
        min_length=6,
        max_length=50,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Digite a senha novamente",
                "autocomplete": "new-password"
            }
        )
    )
