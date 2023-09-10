from django.contrib import admin
from django.urls import path
from apps.produtos.views import produtos, denominacoes, produtos_ficha, get_filtros_denominacoes, exportar_denominacoes

urlpatterns = [
    path('produtosdaf/produtos', produtos, name='produtos'),
    path('produtosdaf/denominacoes', denominacoes, name='denominacoes'),
    path('produtosdaf/denominacoes/filtro/', get_filtros_denominacoes, name='get_filtros_denominacoes'),
    path('produtosdaf/denominacoes/exportar/', exportar_denominacoes, name='exportar_denominacoes'),
    path('produtosdaf/<str:product_id>/', produtos_ficha, name='produtos_ficha'),
]


