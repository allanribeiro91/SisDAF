from django.contrib import admin
from django.urls import path
from apps.contratos.views import contratos, arps, contrato_ficha, arp_ficha, arp_buscar_produtos

urlpatterns = [
    path('contratos/contrato/ficha/novo/', contrato_ficha, name='contrato_novo'),
    path('contratos/contratos/', contratos, name='contratos'),
    

    path('contratos/arp/buscarprodutos/<str:denominacao>/', arp_buscar_produtos, name='arp_buscar_produtos'),
    path('contratos/arp/ficha/nova/', arp_ficha, name='arp_nova'),
    path('contratos/arps/', arps, name='arps'),
]