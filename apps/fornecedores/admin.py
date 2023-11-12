from django.contrib import admin
from apps.fornecedores.models import Fornecedores

class FornecedoresAdmin(admin.ModelAdmin):
    list_display = ('id', 'cnpj', 'nome_fantasia', 'tipo_direito', 'hierarquia', 'porte', 'end_uf', 'end_municipio', 'del_status')
    list_display_links = ("id","cnpj", "nome_fantasia")
    search_fields = ('cnpj', 'nome_fantasia')
    ordering = ('nome_fantasia',)
    list_filter = ('tipo_direito', 'hierarquia', 'porte', 'end_uf')
    list_per_page = 100

admin.site.register(Fornecedores, FornecedoresAdmin)

