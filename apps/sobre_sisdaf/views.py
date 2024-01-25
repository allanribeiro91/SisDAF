from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from apps.sobre_sisdaf.models import VersoesSisdaf, RegistroPontoControle, Backlog
from datetime import datetime

@login_required
def sisdaf_ajuda(request):
    return render(request, 'sobre_sisdaf/ajuda.html')

@login_required
def sisdaf_banco_dados(request):
    return render(request, 'sobre_sisdaf/banco_dados.html')

@login_required
def sisdaf_sugestoes(request):
    return render(request, 'sobre_sisdaf/sugestoes.html')

@login_required
def sisdaf_versoes(request):
    tab_versoes = VersoesSisdaf.objects.all().filter(del_status=False).order_by('-versao')
    conteudo = {
        'tab_versoes': tab_versoes,
    }
    return render(request, 'sobre_sisdaf/versoes.html', conteudo)

@login_required
def sisdaf_pontos_controle(request):
    tab_pontos_controle = RegistroPontoControle.objects.all().filter(del_status=False).order_by('-data')
    conteudo = {
       'tab_pontos_controle': tab_pontos_controle,
    }
    return render(request, 'sobre_sisdaf/pontos_controle.html', conteudo)

@login_required
def sisdaf_backlog(request):
    tab_backlog = Backlog.objects.all().filter(del_status=False).order_by('-data_entrada')
    conteudo = {
       'tab_backlog': tab_backlog,
    }
    return render(request, 'sobre_sisdaf/backlog.html', conteudo)




#RELATÓRIOS
def relatorio_ponto_controle(request, id_ponto_controle=None):
    ponto_controle = RegistroPontoControle.objects.get(id=id_ponto_controle)
    
    #Log Relatório
    usuario_nome = request.user.usuario_relacionado.primeiro_ultimo_nome
    data_hora_atual = datetime.now()
    data_hora = data_hora_atual.strftime('%d/%m/%Y %H:%M:%S')
    
    conteudo = {
        'ponto_controle': ponto_controle,
        'usuario': usuario_nome,
        'data_hora': data_hora,
    }
    return render(request, 'sobre_sisdaf/relatorio_ponto_controle.html', conteudo)