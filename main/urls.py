from django.contrib import admin
from django.urls import path
from main.views import login, home, cadastro, equipe_tecnica, produtos_daf, fornecedores, unidades_saude, processos_aquisitivos, contratos

urlpatterns = [
    path('', login, name='login'),
    path('home/', home, name='home'),
    path('cadastro/', cadastro, name='cadastro'),
    path('equipe/', equipe_tecnica, name='equipe_tecnica'),
    path('produtos_daf/', produtos_daf, name='produtos_daf'),
    path('fornecedores/', fornecedores, name='fornecedores'),
    path('unidades_saude/', unidades_saude, name='unidades_saude'),
    path('processos_aquisitivos/', processos_aquisitivos, name='processos_aquisitivos'),
    path('contratos/', contratos, name='contratos'),
]