from django.contrib import admin
from django.urls import path
from apps.produtos.views import produtos

urlpatterns = [
    path('produtos/', produtos, name='produtos'),
]


