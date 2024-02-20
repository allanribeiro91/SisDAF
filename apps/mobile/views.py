from django.shortcuts import render

def mobile_login(request):
    return render(request, 'mobile/abas/login.html')

def mobile_home(request):
    return render(request, 'mobile/abas/aba_home.html')

def mobile_modulos(request):
    return render(request, 'mobile/abas/aba_modulos.html')

def mobile_numeros(request):
    return render(request, 'mobile/abas/aba_numeros.html')

def mobile_opcoes(request):
    return render(request, 'mobile/abas/aba_opcoes.html')

def mobile_modulo_produtosdaf(request):
    nome_modulo = "Produtos Farmacêuticos DAF"

    conteudo = {
        'nome_modulo': nome_modulo,
    }

    return render(request, 'mobile/modulo_produtos_daf/produtos_daf.html', conteudo)