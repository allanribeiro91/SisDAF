from django.urls import path
from usuarios.views import meusdados

urlpatterns = [
    path('usuario/meusdados', meusdados, name='meusdados'),
]