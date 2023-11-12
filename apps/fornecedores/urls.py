from django.contrib import admin
from django.urls import path
from apps.fornecedores.views import fornecedores, fornecedores_filtro, fornecedores_exportar, fornecedor_ficha, fornecedor_ficha_filtrar_dados, fornecedor_delete
from apps.fornecedores.views import fornecedores_faq, fornecedor_faq_ficha, fornecedor_faq_filtrar_dados

urlpatterns = [
    path('fornecedores/ficha/deletar/<int:fornecedor_id>/', fornecedor_delete, name='fornecedor_delete'),
    path('fornecedores/ficha/filtrar_dados', fornecedor_ficha_filtrar_dados, name='fornecedor_ficha_filtrar_dados'),
    path('fornecedores/ficha/<int:fornecedor_id>/', fornecedor_ficha, name='fornecedor_ficha'),
    path('fornecedores/exportar/', fornecedores_exportar, name='fornecedores_exportar'),
    path('fornecedores/ficha/novo/', fornecedor_ficha, name='fornecedor_novo'),
    path('fornecedores/filtro/', fornecedores_filtro, name='fornecedores_filtro'),
    

    path('fornecedores/faq/filtrar_dados/', fornecedor_faq_filtrar_dados, name='fornecedor_faq_filtrar_dados'),
    path('fornecedores/faq/ficha/<int:faq_id>/', fornecedor_faq_ficha, name='fornecedor_faq_ficha'),
    path('fornecedores/faq/novo/', fornecedor_faq_ficha, name='fornecedor_faq_novo'),
    path('fornecedores/faq/', fornecedores_faq, name='fornecedores_faq'),
    
    path('fornecedores/', fornecedores, name='fornecedores'),
]