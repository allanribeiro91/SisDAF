from django.db import models
from apps.usuarios.models import Usuario
from setup.choices import STATUS_SISDAF, TIPO_LOCAL, STATUS_BACKLOG, TIPO_BACKLOG
from django.utils import timezone

class VersoesSisdaf(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='versao_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='versao_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #sobre a versao
    versao = models.TextField(max_length=15, null=False, blank=False)
    status = models.TextField(max_length=20, choices=STATUS_SISDAF, null=False, blank=False)
    data_versao = models.DateField(null=True, blank=True)
    informacoes = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='versao_deletada')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)  # Obtenha o usuário atual e remova-o dos kwargs

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(VersoesSisdaf, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()


class RegistroPontoControle(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ponto_controle_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ponto_controle_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #sobre a versao
    data = models.DateField(null=True, blank=True)
    horario_inicio = models.TimeField(null=True, blank=True)
    horario_fim = models.TimeField(null=True, blank=True)
    tipo_reuniao = models.CharField(max_length = 20, null=True, blank=True, choices=TIPO_LOCAL)
    local = models.TextField(null=True, blank=True)
    responsavel_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='ponto_controle_responsavel')
    participantes = models.TextField(null=True, blank=True)
    resumo = models.TextField(null=True, blank=True)
    pauta = models.TextField(null=True, blank=True)
    detalhes = models.TextField(null=True, blank=True)
    encaminhamentos = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='ponto_controle_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)  # Obtenha o usuário atual e remova-o dos kwargs

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(RegistroPontoControle, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def participantes_clear(self):
        clear = self.participantes.replace("<b>", '').replace("</b>", '')
        return clear

class Backlog(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='backlog_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='backlog_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #sobre a versao
    data_entrada = models.DateField(null=True, blank=True)
    data_entrega = models.DateField(null=True, blank=True)
    status = models.CharField(max_length = 20, null=True, blank=True, choices=STATUS_BACKLOG)
    tipo_item = models.CharField(max_length = 20, null=True, blank=True, choices=TIPO_BACKLOG)
    item = models.TextField(null=True, blank=True)
    detalhamento = models.TextField(null=True, blank=True)
    responsavel_realizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='backlog_responsavel')
    observacoes_gerais = models.TextField(null=True, blank=True)

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='backlog_deletado')

    def save(self, *args, **kwargs):
        user = kwargs.pop('current_user', None)  # Obtenha o usuário atual e remova-o dos kwargs

        # Se o objeto já tem um ID, então ele já existe no banco de dados
        if self.id:
            self.log_n_edicoes += 1
            if user:
                self.usuario_atualizacao = user
        else:
            if user:
                self.usuario_registro = user
                self.usuario_atualizacao = user
        super(Backlog, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def dias(self):
        # Define a data final como data_entrega ou a data atual se data_entrega for None
        data_final = self.data_entrega if self.data_entrega else timezone.now().date()

        # Verifica se a data_entrada está definida
        if self.data_entrada:
            # Calcula a diferença em dias
            diferenca = data_final - self.data_entrada
            return diferenca.days
        else:
            # Retorna None ou 0 ou alguma outra indicação de que a diferença não pode ser calculada
            return None
        
