from django.contrib import admin
from django.urls import path
from apps.produtos.views import produtos, produtos_ficha, denominacoes, denominacoes_ficha, get_filtros_denominacoes, exportar_denominacoes, delete_denominacao

urlpatterns = [
    path('produtosdaf/produtos/<str:product_id>/', produtos_ficha, name='produtos_ficha'),
    path('produtosdaf/produtos', produtos, name='produtos'),
    path('produtosdaf/denominacoes/ficha/novo/', denominacoes_ficha, name='nova_denominacao'),
    path('produtosdaf/denominacoes/ficha/<int:denominacao_id>/', denominacoes_ficha, name='denominacoes_ficha'),
    path('produtosdaf/denominacoes/deletar/<int:denominacao_id>/', delete_denominacao, name='delete_denominacao'),
    path('produtosdaf/denominacoes/filtro/', get_filtros_denominacoes, name='get_filtros_denominacoes'),
    path('produtosdaf/denominacoes/exportar/', exportar_denominacoes, name='exportar_denominacoes'),
    path('produtosdaf/denominacoes', denominacoes, name='denominacoes'),
]