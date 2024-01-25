from django.contrib import admin
from django.urls import path
from apps.contratos.views import (
    contratos, arps, contrato_ficha, arp_ficha, arp_buscar_produtos, arp_filtrar, arp_exportar, arp_delete,
    arp_item_ficha, arp_item_formulario, arp_item_delete,
    buscar_arps, arp_buscar_dados_sei, buscar_contrato, contrato_delete, buscar_arps_itens, vincular_itens_arp,
    contrato_objeto_modal, contrato_objeto_salvar, contrato_objeto_delete, buscar_objeto, contrato_parcela_salvar,
    contrato_parcela_modal, contrato_dados_arp, buscar_parcela, contrato_entrega_salvar, contrato_entrega_modal,
    contrato_entrega_delete, contrato_parcela_delete, contrato_anotacoes, contrato_fiscal_salvar,
    contrato_fiscal_modal, empenhos, empenho_ficha, teds, buscar_parcelas, contratos_relatorios_arp,
    item_empenho_salvar, item_empenho_modal, item_empenho_deletar, contrato_fiscal_delete, empenho_deletar,
    contratos_relatorios_empenho, contratos_relatorios_contrato
)


urlpatterns = [
    
    #ATAS DE REGISTRO DE PREÇOS (ARPs)
    path('contratos/arp/buscardadossei/<int:id_arp>/', arp_buscar_dados_sei, name='arp_buscar_dados_sei'),
    path('contratos/arp/exportar/', arp_exportar, name='arp_exportar'),
    path('contratos/arp/filtrar/', arp_filtrar, name='arp_filtrar'),
    path('contratos/arp/buscarprodutos/<str:denominacao>/', arp_buscar_produtos, name='arp_buscar_produtos'),
    path('contratos/arp/ficha/<int:arp_id>/', arp_ficha, name='arp_ficha'),
    path('contratos/arp/ficha/nova/', arp_ficha, name='arp_nova'),
    path('contratos/arp/deletar/<int:arp_id>/', arp_delete, name='arp_delete'),
    path('contratos/arps/', arps, name='arps'),

    #ITENS DA ATA DE REGISTRO DE PREÇOS
    path('contratos/arp/item/<int:arp_item_id>/dados/', arp_item_formulario, name='arp_item_formulario'),
    path('contratos/arp/item/ficha/<int:arp_item_id>/', arp_item_ficha, name='arp_item_ficha'),
    path('contratos/arp/item/ficha/novo/', arp_item_ficha, name='arp_item_novo'),
    path('contratos/arp/item/deletar/<int:arp_item_id>/', arp_item_delete, name='arp_item_delete'),
    
    #CONTRATOS
    path('contratos/contrato/ficha/<int:id_contrato>/', contrato_ficha, name='contrato_ficha'),
    path('contratos/contrato/ficha/novo/', contrato_ficha, name='contrato_novo'),
    path('contratos/contrato/deletar/<int:id_contrato>/', contrato_delete, name='contrato_delete'),
    path('contratos/contratos/', contratos, name='contratos'),
    path('contratos/buscararps/<str:unidade_daf>/', buscar_arps, name='buscar_arps'),
    path('contratos/buscararpsitens/<int:id_arp>/', buscar_arps_itens, name='buscar_arps_itens'),
    path('contratos/buscarcontrato/<int:id_contrato>/', buscar_contrato, name='buscar_contrato'),
    path('contratos/vincularitensarp/<int:id_arp>-<int:id_contrato>/', vincular_itens_arp, name='vincular_itens_arp'),
    path('contratos/ficha-arp/<int:id_arp>/', contrato_dados_arp, name='contrato_dados_arp'),
    
    #CONTRATOS/OBJETO
    path('contratos/contrato/objeto/<int:id_objeto>/dados/', contrato_objeto_modal, name='contrato_objeto_modal'),
    path('contratos/contrato/objeto/salvar/<int:id_objeto>/', contrato_objeto_salvar, name='contrato_objeto_salvar'),
    path('contratos/contrato/objeto/salvar/novo/', contrato_objeto_salvar, name='contrato_objeto_salvar'),
    path('contratos/contrato/objeto/deletar/<int:id_objeto>/', contrato_objeto_delete, name='contrato_objeto_delete'),
    path('contratos/buscar_objeto/<int:id_objeto>/', buscar_objeto, name='buscar_objeto'),

    #CONTRATOS/PARCELAS
    path('contratos/contrato/parcela/<int:id_parcela>/dados/', contrato_parcela_modal, name='contrato_parcela_modal'),
    path('contratos/contrato/parcela/deletar/<int:id_parcela>/', contrato_parcela_delete, name='contrato_parcela_delete'),
    path('contratos/contrato/parcela/salvar/<int:id_parcela>/', contrato_parcela_salvar, name='contrato_parcela_salvar'),
    path('contratos/contrato/parcela/salvar/novo/', contrato_parcela_salvar, name='contrato_parcela_salvar_novo'),
    path('contratos/buscar_parcela/<int:id_parcela>/', buscar_parcela, name='buscar_parcela'),
    path('contratos/buscar_parcelas/<int:id_contrato>/', buscar_parcelas, name='buscar_parcelas'),

    #CONTRATOS/ENTREGAS
    path('contratos/contrato/entrega/<int:id_entrega>/dados/', contrato_entrega_modal, name='contrato_entrega_modal'),
    path('contratos/contrato/entrega/deletar/<int:id_entrega>/', contrato_entrega_delete, name='contrato_entrega_delete'),
    path('contratos/contrato/entrega/salvar/<int:id_entrega>/', contrato_entrega_salvar, name='contrato_entrega_salvar'),
    path('contratos/contrato/entrega/salvar/novo/', contrato_entrega_salvar, name='contrato_parcela_entrega_novo'),

    #CONTRATOS/FISCAIS
    path('contratos/contrato/fiscal/<int:id_fiscal>/dados/', contrato_fiscal_modal, name='contrato_fiscal_modal'),
    path('contratos/contrato/fiscal/deletar/<int:id_fiscal>/', contrato_fiscal_delete, name='contrato_fiscal_delete'),
    path('contratos/contrato/fiscal/salvar/novo/', contrato_fiscal_salvar, name='contrato_fiscal_salvar'),
    path('contratos/contrato/fiscal/salvar/<int:id_fiscal>/', contrato_fiscal_salvar, name='contrato_fiscal_salvar'),

    #ANOTACOES
    path('contratos/contrato/anotacoes/<int:id_contrato>/', contrato_anotacoes, name='contrato_anotacoes'),

    #EMPENHOS
    path('contratos/empenhos/', empenhos, name='empenhos'),
    path('contratos/empenhos/novo', empenho_ficha, name='empenho_novo'),
    path('contratos/empenhos/ficha/<int:id_empenho>/', empenho_ficha, name='empenho_ficha'),
    path('contratos/empenhos/ficha/novo/', empenho_ficha, name='empenho_salvar_novo'),
    path('contratos/empenho/deletar/<int:id_empenho>/', empenho_deletar, name='empenho_deletar'),

    #ITEM EMPENHO
    path('contratos/empenho/item/<int:item_empenho_id>/dados/', item_empenho_modal, name='item_empenho_modal'),
    path('contratos/empenho/item/salvar/<int:item_empenho_id>/', item_empenho_salvar, name='item_empenho_salvar'),
    path('contratos/empenho/item/novo/', item_empenho_salvar, name='item_empenho_salvar_novo'),
    path('contratos/empenho/item/deletar/<int:item_empenho_id>/', item_empenho_deletar, name='item_empenho_deletar'),

    #TEDs
    path('contratos/teds/', teds, name='teds'),

    #RELATÓRIOS
    path('contratos/relatorio/arp/<int:arp_id>/', contratos_relatorios_arp, name='contratos_relatorios_arp'),
    path('contratos/relatorio/empenho/<int:empenho_id>/', contratos_relatorios_empenho, name='contratos_relatorios_empenho'),
    path('contratos/relatorio/contrato/<int:contrato_id>/', contratos_relatorios_contrato, name='contratos_relatorios_contrato')

]