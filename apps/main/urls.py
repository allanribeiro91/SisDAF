from django.contrib import admin
from django.urls import path
from apps.main.views import login, logout, home, cadastro, fornecedores, unidades_saude, processos_aquisitivos, contratos

urlpatterns = [
    path('', login, name='login'),
    path('logout', logout, name='logout'),
    path('home/', home, name='home'),
    path('cadastro/', cadastro, name='cadastro'),
    path('fornecedores/', fornecedores, name='fornecedores'),
    path('unidades_saude/', unidades_saude, name='unidades_saude'),
    path('processos_aquisitivos/', processos_aquisitivos, name='processos_aquisitivos'),
    path('contratos/', contratos, name='contratos'),
]