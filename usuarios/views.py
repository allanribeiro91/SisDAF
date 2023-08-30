from django.shortcuts import render

def meusdados(request):
    return render(request, 'usuarios/meusdados.html')
