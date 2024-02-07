from django.contrib import admin
from django.urls import path
from apps.sobre_sisdaf.views import (sisdaf_ajuda, sisdaf_banco_dados, 
                                     sisdaf_sugestoes, sisdaf_versoes, sisdaf_pontos_controle,
                                     sisdaf_backlog, sisdaf_backlog_filtro, sisdaf_backlog_exportar,
                                     sisdaf_backlog_buscar_dados,
                                     relatorio_ponto_controle)

urlpatterns = [
    
    path('sobre-sisdaf/ajuda', sisdaf_ajuda, name='sisdaf_ajuda'),
    path('sobre-sisdaf/banco-dados', sisdaf_banco_dados, name='sisdaf_banco_dados'),
    path('sobre-sisdaf/sugestoes', sisdaf_sugestoes, name='sisdaf_sugestoes'),
    path('sobre-sisdaf/versoes', sisdaf_versoes, name='sisdaf_versoes'),
    path('sobre-sisdaf/pontos-de-controle', sisdaf_pontos_controle, name='sisdaf_pontos_controle'),
    
    #BACKLOG
    path('sobre-sisdaf/backlog', sisdaf_backlog, name='sisdaf_backlog'),
    path('sobre-sisdaf/backlog/filtro/', sisdaf_backlog_filtro, name='sisdaf_backlog_filtro'),
    path('sobre-sisdaf/backlog/exportar/', sisdaf_backlog_exportar, name='sisdaf_backlog_exportar'),
    path('sobre-sisdaf/backlog/buscardados/<int:id_backlog>/', sisdaf_backlog_buscar_dados, name='sisdaf_backlog_buscar_dados'),

    path('sobre-sisdaf/pontos-de-controle/relatorio/<int:id_ponto_controle>/', relatorio_ponto_controle, name='relatorio_ponto_controle'),
    
]