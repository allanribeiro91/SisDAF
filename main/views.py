from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from main.forms import LoginForms, CadastroForms
from main.models import Usuario
from django.contrib.auth.models import User
from django.contrib import auth, messages
from django.contrib.auth.hashers import make_password
from django.db import transaction


def login(request):
    form = LoginForms()

    if request.method == 'POST':
        form = LoginForms(request.POST)

        if form.is_valid():
            cpf=form['cpf'].value()
            senha=form['senha'].value()

            usuario = auth.authenticate(
                request,
                username=cpf,
                password=senha
            )
        if usuario is not None:
            auth.login(request, usuario)
            messages.success(request, f"{cpf} logado com sucesso!")
            return redirect('home')
        else:
            messages.error(request, "Erro ao efetuar login")
            return redirect('login')


    return render(request, 'main/login.html', {'form': form})

@login_required
def home(request):
    usuario = request.user.usuario_relacionado
    return render(request, 'home.html', {'usuario': usuario})

def logout(request):
    auth.logout(request)
    messages.success(request, "Logout efetuado com sucesso!")
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
            
            #Verificar se as senhas são iguais
            if senha_1 != senha_2:
                messages.error(request, "Senhas não são iguais")
                return redirect("cadastro")
            
            #Verificar se o CPF já está cadastrado na base
            if User.objects.filter(username=cpf).exists():
                messages.error(request, "CPF já cadastrado")
                return redirect("cadastro")
            
            #senha criptografada
            hashed_password = make_password(senha_1)

            #outros campos
            nome_usuario=form.cleaned_data["nome_usuario"]
            email_ms=form.cleaned_data["email_ms"]
            email_pessoal=form.cleaned_data["email_pessoal"]
            celular=form.cleaned_data["celular"]
            setor_daf=form.cleaned_data["setor_daf"]

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
                )


            messages.success(request, "Usuário cadastrado com sucesso!")
            return redirect("login")

    return render(request, 'main/cadastro.html', {'form': form})


def home(request):
    return render(request, 'main/home.html')

def equipe_tecnica(request):
    return render(request, 'main/equipe_tecnica.html')

def produtos_daf(request):
    return render(request, 'main/produtos_daf.html')

def fornecedores(request):
    return render(request, 'main/fornecedores.html')

def unidades_saude(request):
    return render(request, 'main/unidades_saude.html')

def processos_aquisitivos(request):
    return render(request, 'main/processos_aquisitivos.html')

def contratos(request):
    return render(request, 'main/contratos.html')