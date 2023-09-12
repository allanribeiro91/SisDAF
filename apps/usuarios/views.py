from django import forms
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from setup.choices import GENERO_SEXUAL, COR_PELE, VINCULO_MS, ORGAO_PUBLICO
from datetime import datetime
from apps.usuarios.forms import UsuarioForms
import pdb

@login_required
def meusdados(request):
    usuario = request.user.usuario_relacionado
    alocacao_ativa = usuario.alocacao_ativa()
    
    if request.method == 'POST':
<<<<<<< HEAD
        if editar_meusdados(request):
=======
        form = UsuarioForms(request.POST, request.FILES, instance=usuario)
        print(request.FILES)
        if editar_meusdados(request, form):
>>>>>>> d7527f12e93f2b264d596d3b2b420724cce871fb
            return redirect('meusdados')
    
    form = UsuarioForms(instance=usuario)
    return render(request, 'usuarios/meusdados.html', {
        'usuario': usuario,
        'form': form,
        'alocacao_ativa': alocacao_ativa,
        'GENERO_SEXUAL': GENERO_SEXUAL,
        'COR_PELE': COR_PELE,
        'VINCULO_MS': VINCULO_MS,
        'ORGAO_PUBLICO': ORGAO_PUBLICO
    })


@login_required
<<<<<<< HEAD
def editar_meusdados(request):
    usuario = request.user.usuario_relacionado
    print(usuario)
    if request.method == 'POST':
        usuario_form = UsuarioForms(request.POST, request.FILES, instance=usuario)

        if usuario_form.is_valid():
            usuario_form.save()
            messages.success(request, f"Dados atualizados com sucesso!")
            return True

        else:
            messages.error(request, "Formulário inválido")
            print(usuario_form.errors)
            return False
=======
def editar_meusdados(request, form):
    if form.is_valid():
        #salvar
        form.save()
        messages.success(request, f"Dados atualizados com sucesso!")
        return True
    else:
        print(form.errors)  # Imprime os erros para depuração
        messages.error(request, "Formulário inválido")
        return False
        
    
>>>>>>> d7527f12e93f2b264d596d3b2b420724cce871fb

