from django.shortcuts import render

def mobile_login(request):
    return render(request, 'mobile/main/login.html')

def mobile_home(request):
    return render(request, 'mobile/main/aba_home.html')