from django.contrib import admin
from apps.usuarios.models import Usuario, Alocacao
from apps.usuarios.forms import AlocacaoForm
from django.core.exceptions import ValidationError

class ListandoUsuario(admin.ModelAdmin):
    list_display = ("dp_cpf", "dp_nome_completo", "ctt_celular", "vms_vinculo", "alocacao_ativa", "del_status")
    list_display_links = ("dp_cpf", "dp_nome_completo")
    search_fields = ("dp_cpf", "dp_nome_completo")
    list_filter = ("vms_vinculo", )
    list_per_page = 100

class ListandoAlocacao(admin.ModelAdmin):
    list_display = ("usuario", "cad_unidade_daf_info", "unidade", "setor", "data_inicio", "data_fim", "is_ativo")
    list_display_links = ("usuario", "unidade")
    search_fields = ("usuario__dp_nome_completo", "unidade", "setor")
    list_filter = ("is_ativo", "unidade")
    list_per_page = 100
    
    def cad_unidade_daf_info(self, obj):
        return obj.usuario.cad_unidade_daf_info
    cad_unidade_daf_info.short_description = 'Unidade Info Cadastro'

admin.site.register(Usuario, ListandoUsuario)
admin.site.register(Alocacao, ListandoAlocacao)
