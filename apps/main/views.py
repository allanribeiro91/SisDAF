from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from apps.main.forms import LoginForms, CadastroForms
from apps.usuarios.models import Usuario
from apps.produtos.models import DenominacoesGenericas, ProdutosFarmaceuticos
from apps.contratos.models import Contratos, ContratosArps
from apps.fornecedores.models import UF_Municipio
from django.http import JsonResponse
from apps.main.models import CustomLog, Informes
from apps.fornecedores.models import Fornecedores
from apps.processos_aquisitivos.models import ProaqDadosGerais
from apps.main.models import UserAccessLog
from django.contrib.auth.models import User
from django.contrib import auth, messages
from django.contrib.auth.hashers import make_password
from django.db import transaction
from setup.choices import UNIDADE_DAF2
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
                
                # REGISTRAR O LOGIN
                log_entry = UserAccessLog(usuario=usuario.usuario_relacionado)
                log_entry.save()

                return redirect('home')
        
        # Se qualquer uma das verificações falhar, setar o valor inicial de 'cpf' e renderizar novamente
        form.fields['cpf'].initial = cpf
        return render(request, 'main/login.html', {'form': form})

    return render(request, 'main/login.html', {'form': form})

@login_required
def home(request):
    tot_denominacaoes = DenominacoesGenericas.objects.filter(del_status=False).count()
    tot_produtos = ProdutosFarmaceuticos.objects.filter(del_status=False).count()
    tot_fornecedores = Fornecedores.objects.filter(del_status=0).count()
    tot_proaqs = ProaqDadosGerais.objects.filter(del_status=False).count()
    tot_arps = ContratosArps.objects.filter(del_status=False).count()
    tot_contratos = Contratos.objects.filter(del_status=False).count()
    usuario = request.user.usuario_relacionado
    
    # Obter a alocação ativa do usuário
    alocacao_ativa = usuario.alocacao.filter(is_ativo=True).first()
    if alocacao_ativa:
        unidade_daf_codigo = alocacao_ativa.unidade
        unidade_daf = dict(UNIDADE_DAF2).get(unidade_daf_codigo, 'Não Informado')
    else:
        unidade_daf = 'Não Informado'  # Ou algum valor padrão, se apropriado

    tab_informes = Informes.objects.filter(del_status=False, status='ativo')
    
    # tab_logs = CustomLog.objects.all().order_by('-timestamp')[:50]
    conteudo ={
        'usuario': usuario,
        'tot_denominacoes': tot_denominacaoes,
        'tot_produtos': tot_produtos,
        'tot_fornecedores': tot_fornecedores,
        'tot_proaqs': tot_proaqs,
        'tot_arps': tot_arps,
        'tot_contratos': tot_contratos,
        'unidade_daf': unidade_daf,
        # 'tab_logs': tab_logs,
        'tab_informes': tab_informes,
    }
    return render(request, 'main/home.html', conteudo)

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


def buscar_municipio(request, uf=None):
    lista_municipios = UF_Municipio.objects.filter(uf_sigla=uf).values_list('municipio', flat=True).order_by('municipio')
    municipios = list(lista_municipios.values('cod_ibge', 'municipio'))
    return JsonResponse({'municipios': municipios})