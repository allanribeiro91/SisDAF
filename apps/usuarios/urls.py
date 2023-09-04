from django.urls import path
from apps.usuarios.views import meusdados

urlpatterns = [
    path('usuario/meusdados', meusdados, name='meusdados'),
]