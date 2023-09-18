from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from apps.main.forms import LoginForms, CadastroForms
from apps.usuarios.models import Usuario
from django.contrib.auth.models import User
from django.contrib import auth, messages
from django.contrib.auth.hashers import make_password
from django.db import transaction
from setup.funcoes import valida_cpf


def login(request):
    form = LoginForms(request.POST or None)
    
    if request.method == 'POST' and form.is_valid():
        cpf = form.cleaned_data['cpf']
        senha = form.cleaned_data['senha']

        usuario = auth.authenticate(request, username=cpf, password=senha)
        
        if not usuario:
            messages.error(request, "Usuário ou senha inválido!")
        else:
            usuario_validacao = usuario.usuario_relacionado
            
            #Verificações
            if not usuario_validacao.usuario_is_ativo:
                messages.error(request, "Usuário Inativado!")
            elif usuario_validacao.del_status:
                messages.error(request, "Usuário ou senha inválido!")
            elif not usuario_validacao.alocacao_ativa():
                messages.error(request, "Cadastro Em Análise!")
            else:
                # Todas as verificações passaram, então podemos logar o usuário
                auth.login(request, usuario)
                messages.info(request, f"{cpf} logado com sucesso!")
                return redirect('home')
        
        # Se qualquer uma das verificações falhar, setar o valor inicial de 'cpf' e renderizar novamente
        form.fields['cpf'].initial = cpf
        return render(request, 'main/login.html', {'form': form})

    return render(request, 'main/login.html', {'form': form})


@login_required
def home(request):
    usuario = request.user.usuario_relacionado
    return render(request, 'home.html', {'usuario': usuario})

def logout(request):
    auth.logout(request)
    messages.info(request, "Logout efetuado com sucesso!")
    return redirect('login')

def cadastro(request):
    form = CadastroForms()

    if request.method == 'POST':
        form = CadastroForms(request.POST)

        #Validações
        if form.is_valid():
            senha_1 = form.cleaned_data["senha_1"]
            senha_2 = form.cleaned_data["senha_2"]
            cpf = form.cleaned_data["cpf"]
            
            erro = False  # Variável para rastrear se ocorreu algum erro
            
            #Verificar se as senhas são iguais
            if senha_1 != senha_2:
                messages.error(request, "Senhas não são iguais")
                erro = True
            
            #Verificar o CPF
            if not valida_cpf(cpf):
                messages.error(request, "Não é possível cadastrar usuário com CPF inválido!")
                erro = True

            #Verificar se o CPF já está cadastrado na base
            if User.objects.filter(username=cpf).exists():
                messages.error(request, "CPF já cadastrado")
                erro = True
            
            if erro:
                return render(request, 'main/cadastro.html', {'form': form})
            
            #senha criptografada
            hashed_password = make_password(senha_1)

            #outros campos
            nome_usuario=form.cleaned_data["nome_usuario"]
            email_ms=form.cleaned_data["email_ms"]
            email_pessoal=form.cleaned_data["email_pessoal"]
            celular=form.cleaned_data["celular"]
            unidade_daf=form.cleaned_data["unidade_daf"]

            with transaction.atomic():
                #tabela auth_user
                auth_usuario = User.objects.create(
                    username=cpf,
                    email=email_pessoal,
                    password=hashed_password
                )

                #tabela main_usuario
                Usuario.objects.create(
                    user=auth_usuario,
                    dp_cpf=cpf,
                    dp_nome_completo=nome_usuario,
                    ctt_celular=celular,
                    ctt_email_ms=email_ms,
                    ctt_email_pessoal=email_pessoal,
                    cad_unidade_daf_info=unidade_daf,
                )

            return redirect("cadastro_confirmacao")

    return render(request, 'main/cadastro.html', {'form': form})


def cadastro_confirmacao(request):
    return render(request, 'main/cadastro_confirmacao.html')


def home(request):
    return render(request, 'main/home.html')

def equipe_tecnica(request):
    return render(request, 'main/equipe_tecnica.html')

def fornecedores(request):
    return render(request, 'main/fornecedores.html')

def unidades_saude(request):
    return render(request, 'main/unidades_saude.html')

def processos_aquisitivos(request):
    return render(request, 'main/processos_aquisitivos.html')

def contratos(request):
    return render(request, 'main/contratos.html')