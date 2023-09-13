from django.contrib import admin
from apps.produtos.models import DenominacoesGenericas

class ListandoDenominacoes(admin.ModelAdmin):
    list_display = ("tipo_produto", "denominacao", "unidade_basico", "unidade_especializado", "unidade_estrategico", "unidade_farm_popular", "hospitalar", "del_status")
    list_display_links = ("tipo_produto", "denominacao")
    list_filter = ("tipo_produto", "unidade_basico", "unidade_especializado", "unidade_estrategico", "unidade_farm_popular", "hospitalar")
    list_per_page = 100

admin.site.register(DenominacoesGenericas, ListandoDenominacoes)