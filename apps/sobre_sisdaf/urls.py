from django.contrib import admin
from django.urls import path
from apps.sobre_sisdaf.views import (sisdaf_ajuda, sisdaf_banco_dados, 
                                     sisdaf_sugestoes, sisdaf_versoes, sisdaf_pontos_controle,
                                     sisdaf_backlog,
                                     relatorio_ponto_controle)

urlpatterns = [
    
    path('sobre-sisdaf/ajuda', sisdaf_ajuda, name='sisdaf_ajuda'),
    path('sobre-sisdaf/banco-dados', sisdaf_banco_dados, name='sisdaf_banco_dados'),
    path('sobre-sisdaf/sugestoes', sisdaf_sugestoes, name='sisdaf_sugestoes'),
    path('sobre-sisdaf/versoes', sisdaf_versoes, name='sisdaf_versoes'),
    path('sobre-sisdaf/pontos-de-controle', sisdaf_pontos_controle, name='sisdaf_pontos_controle'),
    path('sobre-sisdaf/backlog', sisdaf_backlog, name='sisdaf_backlog'),

    path('sobre-sisdaf/pontos-de-controle/relatorio/<int:id_ponto_controle>/', relatorio_ponto_controle, name='relatorio_ponto_controle'),
    
]