from django.contrib import admin
from django.urls import path
from apps.mobile.views import (mobile_login,)

urlpatterns = [

    #MOBILE
    path('mobile/', mobile_login, name='mobile'),
    

]