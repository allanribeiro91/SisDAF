from django.contrib import admin
from django.urls import path
from apps.consultores_tecnicos.views import consultores_tecnicos, consultor_contrato_ficha, consultor_contrato_produtos

urlpatterns = [
    
    path('consultores/', consultores_tecnicos, name='consultores_tecnicos'),
    
    #CONTRATOS
    path('consultores/contrato/ficha/dadosgerais/', consultor_contrato_ficha, name='consultor_contrato_ficha'),
    path('consultores/contrato/ficha/produtos/', consultor_contrato_produtos, name='consultor_contrato_produtos'),
]