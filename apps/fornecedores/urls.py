from django.contrib import admin
from django.urls import path
from apps.fornecedores.views import fornecedores, fornecedores_filtro, fornecedores_exportar, fornecedor_ficha, fornecedor_ficha_filtrar_dados, fornecedor_delete
from apps.fornecedores.views import fornecedores_faq, fornecedor_faq_ficha, fornecedor_faq_filtrar_dados, fornecedor_faq_delete, fornecedores_faq_exportar
from apps.fornecedores.views import fornecedor_representante_delete, fornecedores_representante_exportar, fornecedores_representantes, representante_dados

urlpatterns = [

    #FAQ
    path('fornecedores/faq/ficha/deletar/<int:faq_id>/', fornecedor_faq_delete, name='fornecedor_faq_delete'),
    path('fornecedores/faq/filtrar_dados/', fornecedor_faq_filtrar_dados, name='fornecedor_faq_filtrar_dados'),
    path('fornecedores/faq/ficha/<int:faq_id>/', fornecedor_faq_ficha, name='fornecedor_faq_ficha'),
    path('fornecedores/faq/exportar/', fornecedores_faq_exportar, name='fornecedores_faq_exportar'),
    path('fornecedores/faq/novo/', fornecedor_faq_ficha, name='fornecedor_faq_novo'),
    path('fornecedores/faq/', fornecedores_faq, name='fornecedores_faq'),

    #REPRESENTANTES DO FORNECEDOR
    path('fornecedores/representantes/deletar/<int:representante_id>/', fornecedor_representante_delete, name='fornecedor_representante_delete'),
    path('fornecedores/representantes/<int:id_fornecedor>/', fornecedores_representantes, name='fornecedores_representantes'),
    path('fornecedores/representantes/exportar/', fornecedores_representante_exportar, name='fornecedores_representante_exportar'),
    # path('fornecedores/representantes/novo/', fornecedores_representantes, name='fornecedor_representante_novo'),
    path('fornecedores/representantes/<int:representante_id>/dados/', representante_dados, name='representante_dados'),
    
    #DADOS DO FORNECEDOR
    path('fornecedores/ficha/deletar/<int:fornecedor_id>/', fornecedor_delete, name='fornecedor_delete'),
    path('fornecedores/ficha/filtrar_dados', fornecedor_ficha_filtrar_dados, name='fornecedor_ficha_filtrar_dados'),
    path('fornecedores/ficha/<int:fornecedor_id>/', fornecedor_ficha, name='fornecedor_ficha'),
    path('fornecedores/exportar/', fornecedores_exportar, name='fornecedores_exportar'),
    path('fornecedores/ficha/novo/', fornecedor_ficha, name='fornecedor_novo'),
    path('fornecedores/filtro/', fornecedores_filtro, name='fornecedores_filtro'),
    path('fornecedores/', fornecedores, name='fornecedores'),

]