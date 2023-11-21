from django.contrib import admin
from django.urls import path
from apps.consultores_tecnicos.views import consultores_tecnicos, consultor_contrato_ficha

urlpatterns = [
    path('consultores/', consultores_tecnicos, name='consultores_tecnicos'),
    path('consultores/contrato/ficha', consultor_contrato_ficha, name='consultor_contrato_ficha'),
]