from django.shortcuts import render
from main.forms import LoginForms, CadastroForms

def login(request):
    form = LoginForms()
    return render(request, 'main/login.html', {'form': form})

def cadastro(request):
    form = CadastroForms()
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