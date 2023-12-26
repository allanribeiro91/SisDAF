from django.urls import path
from apps.processos_aquisitivos.views import (
    proaq, proaq_ficha, proaq_ficha_evolucao, proaq_ficha_tramitacoes, proaq_filtro, tramitacao_dados,
    proaq_dados_gerais_delete, proaq_usuarios_por_unidade, proaq_produtos_por_denominacao, 
    salvar_proaq_produto, proaq_exportar, proaq_tramitacao_delete, proaq_item_salvar, proaq_item_modal,
    proaq_item_deletar,
)

urlpatterns = [
    
    path('proaq/exportar/', proaq_exportar, name='proaq_exportar'),

    path('proaq/evolucao/salvar/', proaq_ficha_evolucao, name='proaq_evolucao_salvar'),

    path('proaq_produtos_relacionados/<int:proaq_id>/', salvar_proaq_produto, name='salvar_proaq_produto'),
    path('proaq_produtos_por_denominacao/<str:denominacao>/', proaq_produtos_por_denominacao, name='proaq_produtos_por_denominacao'),
    path('proaq_usuarios_por_unidade/<str:unidade>/', proaq_usuarios_por_unidade, name='proaq_usuarios_por_unidade'),
    
    
    
    path('proaq/ficha/tramitacoes/deletar/<int:tramitacao_id>/', proaq_tramitacao_delete, name='proaq_tramitacao_delete'),
    path('proaq/ficha/tramitacoes/<int:proaq_id>/', proaq_ficha_tramitacoes, name='proaq_ficha_tramitacoes'),
    path('proaq/ficha/tramitacoes/nova/', proaq_ficha_tramitacoes, name='nova_tramitacao'),
    path('proaq/tramitacao/<int:tramitacao_id>/dados/', tramitacao_dados, name='tramitacao_dados'),

    path('proaq/ficha/evolucao/<int:proaq_id>/', proaq_ficha_evolucao, name='proaq_ficha_evolucao'),
    path('proaq/ficha/evolucao/nova/', proaq_ficha_evolucao, name='proaq_ficha_evolucao_nova'),
    
    
    path('proaq/ficha/dadosgerais/deletar/<int:proaq_id>/', proaq_dados_gerais_delete, name='proaq_dados_gerais_delete'),
    path('proaq/filtro/', proaq_filtro, name='proaq_filtro'),
    path('proaq/', proaq, name='proaq'),

    #PROAQ DADOS GERAIS
    path('proaq/ficha/novo/', proaq_ficha, name='novo_proaq'),
    path('proaq/ficha/dadosgerais/<int:proaq_id>/', proaq_ficha, name='proaq_ficha'),

    #PROAQ ITEM
    path('proaq/ficha/item/novo/', proaq_item_salvar, name='novo_item_proaq'),
    path('proaq/ficha/item/<int:proaq_item_id>/', proaq_item_salvar, name='proaq_item_salvar'),
    path('proaq/buscar_item_proaq/<int:proaq_item_id>/', proaq_item_modal, name='proaq_item_modal'),
    path('proaq/ficha/item/deletar/<int:proaq_item_id>/', proaq_item_deletar, name='proaq_item_deletar'),

]