from django.db import models
from django.contrib.auth.models import User
from setup.choices import GENERO_SEXUAL, COR_PELE, VINCULO_MS, ORGAO_PUBLICO

class Usuario(models.Model):
    #relacionamento
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='usuario_relacionado')
    
    #log
    data_registro = models.DateTimeField(auto_now_add=True)
    data_ultima_atualizacao = models.DateTimeField(auto_now=True)
    
    #dados pessoais (dp)
    dp_cpf = models.CharField(max_length=14, null=False, blank=False, unique=True)
    dp_nome_completo = models.CharField(max_length=100, null=False, blank=False)
    dp_data_nascimento = models.DateField(null=True, blank=True)
    dp_genero = models.CharField(max_length=15, choices=GENERO_SEXUAL, null=True, blank=True)
    dp_cor_pele = models.CharField(max_length=15, choices=COR_PELE, null=True, blank=True)

    #foto
    foto_usuario = models.ImageField(upload_to="fotos_usuarios/%Y/%m/%d/", blank=True)

    #contato (ctt)
    ctt_ramal_ms = models.CharField(max_length=4, null=True, blank=True)
    ctt_celular = models.CharField(max_length=17, null=True, blank=True)
    ctt_email_ms = models.EmailField(max_length=40, null=True, blank=True)
    ctt_email_pessoal = models.EmailField(max_length=40, null=True, blank=True)

    #redes sociais (rs)
    rs_linkedin = models.URLField(max_length=150, null=True, blank=True)
    rs_lattes = models.URLField(max_length=150, null=True, blank=True)

    #vinculo com o Ministério da Saúde (vms)
    vms_vinculo = models.CharField(max_length=20, choices=VINCULO_MS, null=True, blank=True)
    vms_orgao = models.CharField(max_length=120, choices=ORGAO_PUBLICO, null=True, blank=True)
    vms_orgao_outro = models.CharField(max_length=120, null=True, blank=True)

    #alocação atual
    aloc_unidade = models.CharField(max_length=20, null=True, blank=True)
    aloc_setor = models.CharField(max_length=60, null=True, blank=True)
    aloc_data_inicio = models.DateField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_cpf = models.CharField(max_length=14, null=True, blank=True)

    def __str__(self):
        return f"Usuário: {self.dp_nome_completo} ({self.dp_cpf})"
    
    def primeiro_ultimo_nome(self):
        partes_nome = self.dp_nome_completo.split()
        primeiro_nome = partes_nome[0]
        ultimo_nome = partes_nome[-1] if len(partes_nome) > 1 else ''
        return f"{primeiro_nome} {ultimo_nome}"
