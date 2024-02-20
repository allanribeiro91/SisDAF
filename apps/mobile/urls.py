from django.contrib import admin
from django.urls import path
from apps.mobile.views import (mobile_login, mobile_home)

urlpatterns = [

    #MOBILE
    path('mobile/', mobile_login, name='mobile'),
    path('mobile/home', mobile_home, name='mobile_home'),
    

]