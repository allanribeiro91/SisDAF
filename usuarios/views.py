from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from setup.choices import GENERO_SEXUAL, COR_PELE, VINCULO_MS, ORGAO_PUBLICO
from datetime import datetime
import pdb



@login_required
def meusdados(request):
    usuario = request.user.usuario_relacionado
    
    if request.method == 'POST':
        print("Editar meus dados")
        editar_meusdados(request, usuario)
        return redirect('meusdados')
    
    return render(request, 'usuarios/meusdados.html', {
        'usuario': usuario,
        'GENERO_SEXUAL': GENERO_SEXUAL,
        'COR_PELE': COR_PELE,
        'VINCULO_MS': VINCULO_MS,
        'ORGAO_PUBLICO': ORGAO_PUBLICO
    })


def editar_meusdados(request, usuario):
    #Dados Pessoais
    usuario.dp_nome_completo = request.POST.get('nome_completo')
    data_nascimento = request.POST.get('data_nascimento')
    if data_nascimento == "":
        usuario.dp_data_nascimento = None
    else:
        data_nascimento = datetime.strptime(data_nascimento, '%Y-%m-%d').date()
        usuario.dp_data_nascimento = data_nascimento
    usuario.dp_genero = request.POST.get('genero')
    usuario.dp_cor_pele = request.POST.get('cor_pele')
    
    #foto
    foto_usuario = request.FILES.get('foto_usuario')
    if foto_usuario:
        usuario.foto_usuario = foto_usuario
    else:
        usuario.foto_usuario = None

    #contato (ctt)
    usuario.ctt_ramal_ms = request.POST.get('ramal_ms')
    usuario.ctt_celular = request.POST.get('celular')
    usuario.ctt_email_ms = request.POST.get('email_institucional')
    usuario.ctt_email_pessoal = request.POST.get('email_pessoal')

    #redes sociais (rs)
    usuario.rs_linkedin = request.POST.get('linkendin')
    usuario.rs_lattes = request.POST.get('lattes')

    #vinculo com o Ministério da Saúde (vms)
    usuario.vms_vinculo = request.POST.get('tipo_vinculo')
    usuario.vms_orgao = request.POST.get('orgao_origem')
    usuario.vms_orgao_outro = request.POST.get('orgao_outro')

    #salvar
    usuario.save()
    messages.success(request, f"Dados atualizados com sucesso!")
    
    
