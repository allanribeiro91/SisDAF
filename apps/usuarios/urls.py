from django.urls import path
from apps.usuarios.views import meusdados

urlpatterns = [
<<<<<<< HEAD
    path('usuario/meusdados/', meusdados, name='meusdados'),
=======
    path('usuario/meusdados', meusdados, name='meusdados'),
>>>>>>> d7527f12e93f2b264d596d3b2b420724cce871fb
]