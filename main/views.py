from django.shortcuts import render, redirect
from main.forms import LoginForms, CadastroForms
from django.contrib.auth.models import User

def login(request):
    form = LoginForms()
    return render(request, 'main/login.html', {'form': form})

def cadastro(request):
    form = CadastroForms()

    if request.method == 'POST':
        form = CadastroForms(request.POST)

        if form.is_valid():
            if form["senha_1"].value != form["senha_2"].value():
                return redirect("cadastro")
        
        #Campos do formulário
        cpf=form["cpf"].value()
        nome_usuario=form["nome_usuario"].value()
        email_ms=form["email_ms"].value()
        email_pessoal=form["email_pessoal"].value()
        celular=form["celular"].value()
        setor_daf=form["setor_daf"].value()
        senha=form["senha_1"].value()

        

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