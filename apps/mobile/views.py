from django.shortcuts import render

def mobile_login(request):
    
    return render(request, 'mobile/main/login.html')
