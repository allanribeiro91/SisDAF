from django.db import models
from apps.usuarios.models import Usuario
from apps.fornecedores.models import UF_Municipio
from apps.produtos.models import ProdutosFarmaceuticos
from django.utils import timezone
from setup.choices import (GENERO_SEXUAL, COR_PELE, ORIENTACAO_SEXUAL, 
                           VIA_ATENDIMENTO, FASE_TRATAMENTO, ORIGEM_DEMANDA_JUDICIAL,
                           LISTA_UFS_SIGLAS, STATUS_DISPENSACAO, CICLO_TRATAMENTO)
from datetime import datetime


class Pacientes(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='paciente_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='paciente_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados do paciente
    cns = models.CharField(max_length=18, null=False, blank=False)
    cpf = models.CharField(max_length=14, null=True, blank=True)
    nome = models.CharField(max_length=100, null=False, blank=False)
    data_nascimento = models.DateTimeField(null=True, blank=True)
    data_obito = models.DateTimeField(null=True, blank=True)
    sexo = models.CharField(max_length=20, choices=GENERO_SEXUAL, null=False, blank=False)
    cor_pele = models.CharField(max_length=20, choices=COR_PELE, null=False, blank=False)
    orientacao_sexual = models.CharField(max_length=20, choices=ORIENTACAO_SEXUAL, null=False, blank=False)

    #endereço
    naturalidade_cod_ibge = models.CharField(max_length=10, null=True, blank=True)
    
    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='paciente_deletado')

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
        super(Pacientes, self).save(*args, **kwargs)

    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def idade_paciente(self):
        """
        Calcula a idade do paciente com base na data de nascimento.
        """
        if not self.data_nascimento:
            return None  # Retornar None se a data de nascimento não estiver definida

        hoje = datetime.now()
        nascimento = self.data_nascimento
        idade = hoje.year - nascimento.year - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))

        return idade

    def paciente_obito(self):
        if self.data_obito:
            obito = 'Sim'
        else:
            obito = 'Não'
        return obito
    
    def paciente_uf(self):
        cod_ibge = self.naturalidade_cod_ibge
        if not cod_ibge:
            return None
        localidade = UF_Municipio.objects.filter(cod_ibge=cod_ibge).get()
        uf = localidade.uf_sigla
        return uf
    
    def paciente_municipio(self):
        cod_ibge = self.naturalidade_cod_ibge
        if not cod_ibge:
            return None
        localidade = UF_Municipio.objects.filter(cod_ibge=cod_ibge).get()
        municipio = localidade.municipio
        return municipio
    
    def paciente_naturalidade(self):
        if self.paciente_municipio() and self.paciente_uf():
            return f"{self.paciente_municipio()}-{self.paciente_uf()}"
        return None


    def paciente_idade(self):
        """
        Calcula a idade do paciente. Se o paciente faleceu, calcula a idade na data do óbito.
        """
        if not self.data_nascimento:
            return None  # Retornar None se a data de nascimento não estiver definida

        # Usar a data de óbito se disponível, caso contrário, usar a data atual
        data_referencia = self.data_obito if self.data_obito else datetime.now()

        # Calcula a diferença em anos
        idade = data_referencia.year - self.data_nascimento.year - ((data_referencia.month, data_referencia.day) < (self.data_nascimento.month, self.data_nascimento.day))

        return idade
    
    def paciente_produtos_recebidos(self):
        """
        Retorna uma string com todos os produtos farmacêuticos já recebidos pelo paciente, separados por vírgula.
        """
        dispensacoes = self.dispensacao_paciente.all().filter(del_status=False) 
        produtos_recebidos = set() 

        for dispensacao in dispensacoes:
            if dispensacao.produto and dispensacao.produto.produto:
                produtos_recebidos.add(dispensacao.produto.produto)

        if not produtos_recebidos: 
            return "NI"

        produtos_recebidos = sorted(produtos_recebidos)
        return ', '.join(produtos_recebidos)

    def paciente_via_atendimento(self):
        dispensacoes = self.dispensacao_paciente.all().filter(del_status=False) 
        vias_atendimentos = set() 

        for dispensacao in dispensacoes:
            if dispensacao.via_atendimento:
                vias_atendimentos.add(dispensacao.get_via_atendimento_display())

        if not vias_atendimentos: 
            return "NI"

        vias_atendimentos = sorted(vias_atendimentos)
        return ', '.join(vias_atendimentos)
    
    def paciente_ses_ufs(self):
        dispensacoes = self.dispensacao_paciente.all().filter(del_status=False) 
        ses_ufs = set() 

        for dispensacao in dispensacoes:
            if dispensacao.uf_solicitacao:
                ses_ufs.add(dispensacao.get_uf_solicitacao_display())

        if not ses_ufs: 
            return "NI"
        
        ses_ufs = sorted(ses_ufs)
        return ', '.join(ses_ufs)


    def __str__(self):
        return f"{self.nome} ({self.cns})"


class Dispensacoes(models.Model):
    #relacionamento
    usuario_registro = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='dispensacao_registro')
    usuario_atualizacao = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, related_name='dispensacao_edicao')
    
    #log
    registro_data = models.DateTimeField(auto_now_add=True)
    ult_atual_data = models.DateTimeField(auto_now=True)
    log_n_edicoes = models.IntegerField(default=1)

    #dados da dispensacao
    via_atendimento = models.CharField(max_length=20, choices=VIA_ATENDIMENTO, null=False, blank=False, default='administrativa')
    numero_processo_sei = models.CharField(max_length=20, null=True, blank=True)
    origem_demanda_judicial = models.CharField(max_length=20, choices=ORIGEM_DEMANDA_JUDICIAL, null=True, blank=True)
    uf_solicitacao = models.CharField(max_length=20, choices=LISTA_UFS_SIGLAS, null=True, blank=True)
    quantidade = models.IntegerField(null=False, blank=False, default=1)
    cid = models.CharField(max_length=10, blank=True, null=True)
    fase_tratamento = models.CharField(max_length=20, choices=FASE_TRATAMENTO, null=True, blank=True)
    ciclo = models.CharField(max_length=15, null=True, blank=True, choices=CICLO_TRATAMENTO)
    numero_pedido_sismat = models.CharField(max_length=15, null=True, blank=True)
    data_solicitacao = models.DateField(null=True, blank=True)
    data_envio = models.DateField(null=True, blank=True)
    data_entrega = models.DateField(null=True, blank=True)
    data_consumo = models.DateField(null=True, blank=True)
    comprovante_doc_sei = models.CharField(max_length=10, null=True, blank=True)
    local_aplicacao_cod_ibge = models.CharField(max_length=10, null=True, blank=True)
    local_aplicacao_unidade_saude = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_DISPENSACAO, null=False, blank=False, default='nao_informado')

    #produto
    produto = models.ForeignKey(ProdutosFarmaceuticos, on_delete=models.DO_NOTHING, related_name='dispensacao_produto', null=True, blank=True)

    #paciente
    paciente = models.ForeignKey(Pacientes, on_delete=models.DO_NOTHING, related_name='dispensacao_paciente', null=True, blank=True)

    #observações gerais
    observacoes_gerais = models.TextField(null=True, blank=True, default='Sem observações.')

    #delete (del)
    del_status = models.BooleanField(default=False)
    del_data = models.DateTimeField(null=True, blank=True)
    del_usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING, null=True, blank=True, related_name='dispensacao_deletado')

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
        super(Dispensacoes, self).save(*args, **kwargs)


    def soft_delete(self, user):
        """
        Realiza uma "deleção lógica" do registro.
        """
        self.del_status = True
        self.del_data = timezone.now()
        self.del_usuario = user
        self.save()
    
    def local_aplicacao_uf(self):
        cod_ibge = self.local_aplicacao_cod_ibge
        if not cod_ibge:
            return None
        localidade = UF_Municipio.objects.filter(cod_ibge=cod_ibge).get()
        uf = localidade.uf_sigla
        return uf
    
    def local_aplicacao_municipio(self):
        cod_ibge = self.local_aplicacao_cod_ibge
        if not cod_ibge:
            return None
        localidade = UF_Municipio.objects.filter(cod_ibge=cod_ibge).get()
        municipio = localidade.municipio
        return municipio
    
    def __str__(self):
        return f"{self.nome} ({self.cns})"

