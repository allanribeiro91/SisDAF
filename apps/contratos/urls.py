from django.contrib import admin
from django.urls import path
from apps.contratos.views import (
    contratos, arps, contrato_ficha, arp_ficha, arp_buscar_produtos, arp_filtrar, arp_exportar, arp_delete,
    arp_item_ficha, arp_item_formulario, arp_item_delete,
    buscar_arps, arp_buscar_dados_sei, buscar_contrato, contrato_delete, buscar_arps_itens, vincular_itens_arp,
    contrato_objeto_modal, contrato_objeto_salvar, contrato_objeto_delete, buscar_objeto, contrato_parcela_salvar,
    contrato_parcela_modal
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
    
    #OBJETO DO CONTRATO
    path('contratos/contrato/objeto/<int:id_objeto>/dados/', contrato_objeto_modal, name='contrato_objeto_modal'),
    path('contratos/contrato/objeto/salvar/<int:id_objeto>/', contrato_objeto_salvar, name='contrato_objeto_salvar'),
    path('contratos/contrato/objeto/salvar/novo/', contrato_objeto_salvar, name='contrato_objeto_salvar'),
    path('contratos/contrato/objeto/deletar/<int:id_objeto>/', contrato_objeto_delete, name='contrato_objeto_delete'),
    path('contratos/buscar_objeto/<int:id_objeto>/', buscar_objeto, name='buscar_objeto'),

    #PARCELAS DO CONTRATO
    path('contratos/contrato/parcela/<int:id_parcela>/dados/', contrato_parcela_modal, name='contrato_parcela_modal'),
    path('contratos/contrato/parcela/salvar/<int:id_parcela>/', contrato_parcela_salvar, name='contrato_parcela_salvar'),
    path('contratos/contrato/parcela/salvar/novo/', contrato_parcela_salvar, name='contrato_parcela_salvar'),
]