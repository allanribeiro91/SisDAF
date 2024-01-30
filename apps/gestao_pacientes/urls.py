from django.contrib import admin
from django.urls import path
from apps.gestao_pacientes.views import (gestao_pacientes, paciente_ficha,
                                         dispensacao_modal, dispensacao_salvar, dispensacao_deletar,
                                         paciente_ficha_relatorio, paciente_deletar,
                                         gestao_pacientes_filtro)

urlpatterns = [

    #GESTAO DE PACIENTES
    path('gestao_pacientes/', gestao_pacientes, name='pacientes'),
    path('gestao_pacientes/filtro/', gestao_pacientes_filtro, name='gestao_pacientes_filtro'),

    #PACIENTE
    path('gestao_pacientes/paciente/novo/', paciente_ficha, name='paciente_novo'),
    path('gestao_pacientes/paciente/<int:id_paciente>/', paciente_ficha, name='paciente_ficha'),
    path('gestao_pacientes/paciente/deletar/<int:id_paciente>/', paciente_deletar, name='paciente_deletar'),

    #DISPENSACAO
    path('gestao_pacientes/paciente/dispensacao/<int:dispensacao_id>/dados/', dispensacao_modal, name='dispensacao_modal'),
    path('gestao_pacientes/paciente/dispensacao/salvar/novo/', dispensacao_salvar, name='dispensacao_salvar_novo'),
    path('gestao_pacientes/paciente/dispensacao/salvar/<int:dispensacao_id>/', dispensacao_salvar, name='dispensacao_salvar'),
    path('gestao_pacientes/paciente/dispensacao/deletar/<int:dispensacao_id>/', dispensacao_deletar, name='dispensacao_deletar'),

    #RELATÓRIOS
    path('gestao_pacientes/paciente/relatorio/<int:id_paciente>/', paciente_ficha_relatorio, name='paciente_ficha_relatorio'),

]