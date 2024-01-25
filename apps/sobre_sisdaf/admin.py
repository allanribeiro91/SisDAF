from django.contrib import admin
from apps.sobre_sisdaf.models import VersoesSisdaf, RegistroPontoControle, Backlog

class VersoesSisdafAdmin(admin.ModelAdmin):
    list_display = ('id', 'versao', 'status', 'data_versao', 'informacoes')
    list_display_links = ('id', 'versao', 'status', 'data_versao', 'informacoes')
    search_fields = ('versao', 'data_versao')
    ordering = ('versao',)
    list_per_page = 100

class RegistroPontoControleAdmin(admin.ModelAdmin):
    list_display = ('id', 'data', 'responsavel_registro', 'resumo')
    list_display_links = ('id', 'data', 'responsavel_registro', 'resumo')
    search_fields = ('responsavel_registro', )
    ordering = ('-data',)
    list_per_page = 100

class BacklogAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'data_entrada', 'data_entrega', 'tipo_item', 'item')
    list_display_links = ('id', 'status', 'data_entrada', 'data_entrega', 'tipo_item', 'item')
    ordering = ('-data_entrada',)
    list_per_page = 100

admin.site.register(VersoesSisdaf, VersoesSisdafAdmin)
admin.site.register(RegistroPontoControle, RegistroPontoControleAdmin)
admin.site.register(Backlog, BacklogAdmin)