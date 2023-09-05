from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import auth, messages


def produtos(request):
    return render(request, 'produtos/produtos.html')
