from django.contrib import admin
from django.urls import path
from apps.gestao_pacientes.views import (gestao_pacientes, paciente_ficha,
                                         dispensacao_modal, dispensacao_salvar, dispensacao_deletar)

urlpatterns = [

    #GESTAO DE PACIENTES
    path('gestao_pacientes/', gestao_pacientes, name='pacientes'),

    #PACIENTE
    path('gestao_pacientes/paciente/novo/', paciente_ficha, name='paciente_novo'),
    path('gestao_pacientes/paciente/<int:id_paciente>/', paciente_ficha, name='paciente_ficha'),

    #DISPENSACAO
    path('gestao_pacientes/paciente/dispensacao/<int:dispensacao_id>/dados/', dispensacao_modal, name='dispensacao_modal'),
    path('gestao_pacientes/paciente/dispensacao/salvar/novo/', dispensacao_salvar, name='dispensacao_salvar_novo'),
    path('gestao_pacientes/paciente/dispensacao/salvar/<int:dispensacao_id>/', dispensacao_salvar, name='dispensacao_salvar'),
    path('gestao_pacientes/paciente/dispensacao/deletar/<int:dispensacao_id>/', dispensacao_deletar, name='dispensacao_deletar'),

]