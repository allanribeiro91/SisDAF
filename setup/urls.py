from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.main.urls')),
    path('', include('apps.usuarios.urls')),
    path('', include('apps.produtos.urls')),
    path('', include('apps.processos_aquisitivos.urls')),
    path('', include('apps.fornecedores.urls')),
    path('', include('apps.contratos.urls')),
    path('', include('apps.programacao.urls')),
    path('', include('apps.consultores_tecnicos.urls')),
    path('', include('apps.sobre_sisdaf.urls')),
    path('select2/', include('django_select2.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
