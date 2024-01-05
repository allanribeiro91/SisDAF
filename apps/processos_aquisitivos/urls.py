from django.urls import path
from apps.processos_aquisitivos.views import (
    proaq, proaq_ficha, proaq_ficha_evolucao, proaq_filtro,
    proaq_dados_gerais_deletar, proaq_exportar, proaq_item_salvar, proaq_item_modal,
    proaq_item_deletar, proaq_evolucao_modal, proaq_evolucao_deletar, proaq_tramitacao_salvar, proaq_tramitacao_modal,
    proaq_tramitacao_deletar, proaq_relatorio_pdf
)

urlpatterns = [
    
    path('proaq/exportar/', proaq_exportar, name='proaq_exportar'),
    
    path('proaq/filtro/', proaq_filtro, name='proaq_filtro'),
    path('proaq/', proaq, name='proaq'),

    #PROAQ DADOS GERAIS
    path('proaq/ficha/novo/', proaq_ficha, name='novo_proaq'),
    path('proaq/ficha/dadosgerais/<int:proaq_id>/', proaq_ficha, name='proaq_ficha'),
    path('proaq/ficha/dadosgerais/deletar/<int:proaq_id>/', proaq_dados_gerais_deletar, name='proaq_dados_gerais_deletar'),

    #PROAQ ITEM
    path('proaq/ficha/item/novo/', proaq_item_salvar, name='novo_item_proaq'),
    path('proaq/ficha/item/<int:proaq_item_id>/', proaq_item_salvar, name='proaq_item_salvar'),
    path('proaq/buscar_item_proaq/<int:proaq_item_id>/', proaq_item_modal, name='proaq_item_modal'),
    path('proaq/ficha/item/deletar/<int:proaq_item_id>/', proaq_item_deletar, name='proaq_item_deletar'),

    #PROAQ EVOLUÇÃO
    path('proaq/ficha/evolucao/<int:proaq_evolucao_id>/', proaq_ficha_evolucao, name='proaq_ficha_evolucao'),
    path('proaq/ficha/evolucao/nova/', proaq_ficha_evolucao, name='proaq_ficha_evolucao_nova'),
    path('proaq/buscar_evolucao_proaq/<int:proaq_evolucao_id>/', proaq_evolucao_modal, name='proaq_evolucao_modal'),
    path('proaq/ficha/evolucao/deletar/<int:proaq_evolucao_id>/', proaq_evolucao_deletar, name='proaq_evolucao_deletar'),

    #PROAQ TRAMITACOES
    path('proaq/ficha/tramitacoes/salvar/<int:tramitacao_id>/', proaq_tramitacao_salvar, name='proaq_tramitacao_delete'),
    path('proaq/ficha/tramitacoes/nova/', proaq_tramitacao_salvar, name='nova_tramitacao'),
    path('proaq/buscar_tramitacao_proaq/<int:tramitacao_id>/', proaq_tramitacao_modal, name='proaq_tramitacao_modal'),
    path('proaq/ficha/tramitacoes/deletar/<int:tramitacao_id>/', proaq_tramitacao_deletar, name='proaq_tramitacao_deletar'),


    #PROAQ RELATÓRIOS
    path('proaq/relatorio/dadosgerais/<int:proaq_id>/', proaq_relatorio_pdf, name='proaq_relatorio_pdf')

]