from django.contrib import admin
from django.urls import path
from apps.mobile.views import (mobile_login, mobile_home, mobile_modulos,
                               mobile_numeros, mobile_opcoes,
                               mobile_modulo_produtosdaf)

urlpatterns = [

    #MOBILE
    path('mobile/', mobile_login, name='mobile'),
    path('mobile/home/', mobile_home, name='mobile_home'),
    path('mobile/modulos/', mobile_modulos, name='mobile_modulos'),
    path('mobile/numeros/', mobile_numeros, name='mobile_numeros'),
    path('mobile/opcoes/', mobile_opcoes, name='mobile_opcoes'),

    #MÓDULO PRODUTOS DAF
    path('mobile/modulos/produtosdaf/', mobile_modulo_produtosdaf, name='mobile_modulo_produtosdaf'),

]