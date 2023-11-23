from django.contrib import admin
from django.urls import path
from apps.contratos.views import contratos, arps, contrato_ficha, arp_ficha, arp_buscar_produtos, arp_filtrar, arp_exportar, arp_delete
from apps.contratos.views import arp_item_ficha

urlpatterns = [
    path('contratos/contrato/ficha/novo/', contrato_ficha, name='contrato_novo'),
    path('contratos/contratos/', contratos, name='contratos'),
    
    #ATAS DE REGISTRO DE PREÇOS (ARPs)
    path('contratos/arp/exportar/', arp_exportar, name='arp_exportar'),
    path('contratos/arp/filtrar/', arp_filtrar, name='arp_filtrar'),
    path('contratos/arp/buscarprodutos/<str:denominacao>/', arp_buscar_produtos, name='arp_buscar_produtos'),
    path('contratos/arp/ficha/<int:arp_id>/', arp_ficha, name='arp_ficha'),
    path('contratos/arp/ficha/nova/', arp_ficha, name='arp_nova'),
    path('contratos/arp/deletar/<int:arp_id>/', arp_delete, name='arp_delete'),
    path('contratos/arps/', arps, name='arps'),

    #ITENS DA ATA DE REGISTRO DE PREÇOS
    path('contratos/arp/item/ficha/<int:arp_item_id>/', arp_item_ficha, name='arp_item_ficha'),
    path('contratos/arp/item/ficha/novo/', arp_item_ficha, name='arp_item_novo'),
]