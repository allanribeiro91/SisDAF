from django.contrib import admin
from django.urls import path
from apps.produtos.views import produtos, produtos_ficha, denominacoes, denominacoes_ficha, get_filtros_denominacoes, exportar_denominacoes

urlpatterns = [
    path('produtosdaf/produtos', produtos, name='produtos'),
    path('produtosdaf/produtos/<str:product_id>/', produtos_ficha, name='produtos_ficha'),
    path('produtosdaf/denominacoes', denominacoes, name='denominacoes'),
    path('produtosdaf/denominacoes/ficha/<str:denominacao_id>/', denominacoes_ficha, name='denominacoes_ficha'),
    path('produtosdaf/denominacoes/filtro/', get_filtros_denominacoes, name='get_filtros_denominacoes'),
    path('produtosdaf/denominacoes/exportar/', exportar_denominacoes, name='exportar_denominacoes'),

]


