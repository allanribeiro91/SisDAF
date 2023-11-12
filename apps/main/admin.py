from django.contrib import admin
from apps.main.models import CustomLog, UserAccessLog

class CustomLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'formatted_timestamp', 'get_cpf', 'get_nome', 'get_unidade', 'get_setor', 'modulo', 'acao', 'item_id', 'item_descricao')
    list_filter = ('timestamp', 'usuario', 'modulo', 'acao')
    search_fields = ('usuario__user__username', 'modulo', 'acao', 'item_descricao')
    ordering = ('-timestamp',)

    def formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%d/%m/%Y %H:%M:%S')
    formatted_timestamp.short_description = 'Data/Hora'

    def get_cpf(self, obj):
        return obj.usuario.dp_cpf
    get_cpf.short_description = 'CPF'

    def get_nome(self, obj):
        return obj.usuario.dp_nome_completo
    get_nome.short_description = 'Nome'

    def get_unidade(self, obj):
        alocacao = obj.usuario.alocacao_ativa()
        return alocacao.unidade if alocacao else '-'
    get_unidade.short_description = 'Unidade'

    def get_setor(self, obj):
        alocacao = obj.usuario.alocacao_ativa()
        return alocacao.setor if alocacao else '-'
    get_setor.short_description = 'Setor'

class UserAccessLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_cpf', 'get_nome', 'get_unidade', 'get_setor', 'formatted_timestamp')
    list_filter = ('timestamp', 'usuario')
    search_fields = ('usuario__user__username',)
    ordering = ('-timestamp',)

    def formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%d/%m/%Y %H:%M:%S')
    formatted_timestamp.short_description = 'Data/Hora'

    def get_cpf(self, obj):
        return obj.usuario.dp_cpf
    get_cpf.short_description = 'CPF'

    def get_nome(self, obj):
        return obj.usuario.dp_nome_completo
    get_nome.short_description = 'Nome'

    def get_unidade(self, obj):
        alocacao = obj.usuario.alocacao_ativa()
        return alocacao.unidade if alocacao else '-'
    get_unidade.short_description = 'Unidade'

    def get_setor(self, obj):
        alocacao = obj.usuario.alocacao_ativa()
        return alocacao.setor if alocacao else '-'
    get_setor.short_description = 'Setor'

admin.site.register(CustomLog, CustomLogAdmin)
admin.site.register(UserAccessLog, UserAccessLogAdmin)
