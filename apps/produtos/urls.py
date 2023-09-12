from django.contrib import admin
from django.urls import path
from apps.produtos.views import produtos, produtos_ficha, denominacoes, denominacoes_ficha, get_filtros_denominacoes, exportar_denominacoes

urlpatterns = [
<<<<<<< HEAD
    path('produtosdaf/produtos/<str:product_id>/', produtos_ficha, name='produtos_ficha'),
    path('produtosdaf/produtos', produtos, name='produtos'),
    path('produtosdaf/denominacoes/ficha/<int:denominacao_id>/', denominacoes_ficha, name='denominacoes_ficha'),
    path('produtosdaf/denominacoes/filtro/', get_filtros_denominacoes, name='get_filtros_denominacoes'),
    path('produtosdaf/denominacoes/exportar/', exportar_denominacoes, name='exportar_denominacoes'),
    path('produtosdaf/denominacoes', denominacoes, name='denominacoes'),
=======
    path('produtosdaf/produtos', produtos, name='produtos'),
    path('produtosdaf/produtos/<str:product_id>/', produtos_ficha, name='produtos_ficha'),
    path('produtosdaf/denominacoes', denominacoes, name='denominacoes'),
    path('produtosdaf/denominacoes/ficha/<str:denominacao_id>/', denominacoes_ficha, name='denominacoes_ficha'),
    path('produtosdaf/denominacoes/filtro/', get_filtros_denominacoes, name='get_filtros_denominacoes'),
    path('produtosdaf/denominacoes/exportar/', exportar_denominacoes, name='exportar_denominacoes'),

>>>>>>> d7527f12e93f2b264d596d3b2b420724cce871fb
]


