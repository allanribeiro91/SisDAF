from django.contrib import admin
from main.models import Usuario


class ListandoUsuario(admin.ModelAdmin):
    list_display = ("dp_cpf", "dp_nome_completo", "ctt_celular", "vms_vinculo", "aloc_unidade", "del_status")
    list_display_links = ("dp_cpf", "dp_nome_completo")
    search_fields = ("dp_cpf", "dp_nome_completo")
    list_filter = ("aloc_unidade", )
    list_per_page = 100

admin.site.register(Usuario, ListandoUsuario)
