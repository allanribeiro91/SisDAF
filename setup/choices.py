#Choices
YES_NO = [
    (True, 'Sim'),
    (False, 'Não'),
]

COR_PELE = [
    ('branco', 'Branco'),
    ('preto', 'Preto'),
    ('pardo', 'Pardo'),
    ('amarelo', 'Amarelo'),
    ('vermelho', 'Vermelho'),
    ('outro', 'Outro'),
    ('nao_informado', 'Não Informado'),
]

ORIENTACAO_SEXUAL = [
    ('heterossexual', 'Heterossexual'),
    ('homossexual', 'Homossexual'),
    ('bissexual', 'Bissexual'),
    ('outro', 'Outro'),
    ('nao_informado', 'Não Informado'),
]

GENERO_SEXUAL = [
    ('masculino', 'Masculino'),
    ('feminino', 'Feminino'),
    ('outro', 'Outro'),
    ('nao_informado', 'Não Informado'),
]


ORGAO_PUBLICO = [
    ('min_saude', "Ministério da Saúde"),
    ('outro', "Outro"),
    ('nao_informado', 'Não Informado'),
]

TIPO_PRODUTO = [
    ('Insumo', "Insumo"),
    ('Medicamento', "Medicamento"),
    ('nao_informado', 'Não Informado'),
]

UNIDADE_DAF = [
    ('', 'Não Informado'),  # Opção vazia
    ('cgafb', "CGAFB"),
    ('cgafme', "CGAFME"),
    ('cgceaf', "CGCEAF"),
    ('cgfp', "CGFP"),
    ('cofisc', "COFISC"),
    ('gabinete', "GABINETE")
]   

UNIDADE_DAF2 = [
    ('cgafb', "CGAFB"),
    ('cgafme', "CGAFME"),
    ('cgceaf', "CGCEAF"),
    ('cgfp', "CGFP"),
    ('cofisc', "COFISC"),
    ('gabinete', "GABINETE"),
    ('nao_informado', 'Não Informado'),
]   

UNIDADE_DAF3 = [
    ('cgafb', "CGAFB"),
    ('cgafme', "CGAFME"),
    ('cgceaf', "CGCEAF"),
    ('cgfp', "CGFP"),
    ('cofisc', "COFISC"),
    ('gabinete', "GABINETE"),
    ('', 'Não Informado'),
]   

VINCULO_MS = [
    ('consultor', "Consultor Técnico"),
    ('servidor_federal', "Servidor Federal"),
    ('servidor_estadual', "Servidor Estadual"),
    ('servidor_municipal', "Servidor Municipal"),
    ('nao_informado', 'Não Informado'),
]

FORMA_FARMACEUTICA = [
    ('adesivo_transdermico', 'Adesivo Transdérmico'),
    ('capsula', 'Cápsula'),
    ('capsula_mole', 'Cápsula Mole'),
    ('comprimido', 'Comprimido'),
    ('comprimido_lib_prolongada', 'Comprimido de Liberação Prolongada'),
    ('comprimido_dispersivel', 'Comprimido Dispersível'),
    ('comprimido_mastigavel', 'Comprimido Mastigável'),
    ('gel', 'Gel'),
    ('goma_mascar', 'Goma de Mascar'),
    ('granulado_oral', 'Granulado Oral'),
    ('pastilha', 'Pastilha'),
    ('po_solucao_injetavel', 'Pó para Solução Injetável'),
    ('seringa_preenchida', 'Seringa Preenchida'),
    ('seringa_injetavel', 'Solução Injetável'),
    ('solucao_oral', 'Solução Oral'),
    ('suspensao_injetavel', 'Suspenção Injetável'),
    ('suspensao_oral', 'Suspensão Oral'),
    ('xarope', 'Xarope'),
    ('nao_informado', 'Não Informado'),
]

STATUS_INCORPORACAO = [
    ('incorporado', "Incorporado"),
    ('excluido', "Excluído"),
    ('nao_informado', 'Não Informado'),
]

CONCENTRACAO_TIPO = [
    ('mostrar_nome','Mostrar no nome'),
    ('mostrar_nao','Não mostrar'),
    ('nao_se_aplica','Não se aplica'),
    ('nao_informado', 'Não Informado'),
]

CLASSIFICACAO_AWARE = [
    ('acesso','Acesso'),
    ('alerta','Alerta'),
    ('reservado','Reservado'),
    ('nao_se_aplica','Não se aplica'),
    ('nao_informado', 'Não Informado'),
]

LOGS_ACAO = [
    ('create', "Create"),
    ('update', "Update"),
    ('delete', "Delete"),
]

MODALIDADE_AQUISICAO = [
    ('emergencial', "Emergencial"),
    ('inexigibilidade', "Inexigibilidade"),
    ('pregao_comarp', "Pregão Com ARP"),
    ('pregao_semarp', "Pregão Sem ARP"),
]

STATUS_PROAQ = [
    ('em_execucao', "Em Execução"),
    ('finalizado', "Finalizado"),
    ('suspenso', "Suspenso"),
    ('cancelado', "Cancelado"),
]

STATUS_ARP = [
    ('nao_publicado', "Não Publicado"),
    ('vigente', "Vigente"),
    ('encerrado', "Encerrado"),
    ('suspenso', "Suspenso"),
    ('cancelado', "Cancelado"),
    ('', 'Não Informado')
]

STATUS_SISDAF = [
    ('ativo', "Ativo"),
    ('inativo', "Inativo"),
    ('em_desenvolvimento', "Em Desenvolvimento"),
]

STATUS_FASE = [
    ('nao_executado', "Não Executado"),
    ('em_execucao', "Em Execução"),
    ('executado', "Executado"),
]

LEI_LICITACAO = [
    ('lei_8666', "Lei 8.666/93"),
    ('lei_14133', "Lei 14.133/21"),
    ('nao_informado', "Não Informado"),
]

CNPJ_HIERARQUIA = {
    ('matriz', 'Matriz'),
    ('filial', 'Filial'),
}

CNPJ_PORTE = {
    ('mei', 'MEI'),
    ('me', 'ME'),
    ('epp', 'EPP'),
    ('medio_porte', 'Médio Porte'),
    ('grande_empresa', 'Grande Empresa'),
    ('demais', 'Demais'),
}

TIPO_DIREITO = {
    ('privado', 'Privado'),
    ('público', 'Público'),
}

TIPO_COTA = [
    ('', 'Não Informado'),
    ('principal', 'Principal'),
    ('reservada', 'Reservada'),
    ('exclusiva', 'Exclusiva'),
    ('nao_se_aplica', 'Não Se Aplica'),
]

TIPO_CONTRATO = [
    ('', 'Não Informado'),
    ('ordinario', 'Ordinário'),
    ('nota_empenho', 'Nota de Empenho'),
]

FAQ_FORNECEDOR_TOPICO = [
    ('contrato', 'Contrato'),
    ('entrega_produto','Entrega de Produto Farmacêutico'),
    ('nota_fiscal','Nota Fiscal'),
    ('pregao','Pregão Eletrônico'),
    ('processo_incorporacao','Processo de Incorporação'),
    ('outro','Outro'),
]

FASES_EVOLUCAO_PROAQ = [
    ('', 'Não Informado'),
    ('fase1', 'Documentos Iniciais'),
    ('fase2', 'Tramitação Pré-Contratual'),
    ('fase3', 'Contratação'),
    ('fase4', 'Execução do Contrato'),
    ('fase5', 'Prestação de Contas'),
    ('fase6', 'Encerrado'),
]

CARGOS_FUNCOES = [
    ('representante_comercial','Representante Comercial'),
    ('assessor_tecnico', 'Assessor Técnico'),
    ('gerente','Gerente'),
    ('coordenador','Coordenador'),
    ('diretor','Diretor'),
    ('vice_presidente','Vice-Presidente'),
    ('presidente','Presidente'),
    ('outro','Outro'),
    ('nao_informado','Não Informado'),
]

TIPO_COMUNICACAO = [
    ('email','Email'),
    ('oficio','Ofício'),
    ('ligacao_telefonica','Ligação Telefônica'),
    ('whatsapp','Whatsapp'),
    ('carta', 'Carta'),
    ('outro','Outro'),
    ('nao_informado','Não Informado'),
]

STATUS_ENVIO_COMUNICACAO = [
    ('nao_enviado','Não Enviado'),
    ('enviado','Enviado'),
    ('nao_informado','Não Informado'),
]

LISTA_UFS_SIGLAS = [
    ('', ''),
    ('AC', 'AC'),
    ('AL', 'AL'),
    ('AM', 'AM'),
    ('AP', 'AP'),
    ('BA', 'BA'),
    ('CE', 'CE'),
    ('DF', 'DF'),
    ('ES', 'ES'),
    ('GO', 'GO'),
    ('MA', 'MA'),
    ('MG', 'MG'),
    ('MS', 'MS'),
    ('MT', 'MT'),
    ('PA', 'PA'),
    ('PB', 'PB'),
    ('PE', 'PE'),
    ('PI', 'PI'),
    ('PR', 'PR'),
    ('RJ', 'RJ'),
    ('RN', 'RN'),
    ('RO', 'RO'),
    ('RR', 'RR'),
    ('RS', 'RS'),
    ('SC', 'SC'),
    ('SE', 'SE'),
    ('SP', 'SP'),
    ('TO', 'TO'),
    
]

LISTA_TRIMESTRES = [
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
]

LISTA_ANOS = [
    (2022, 2022),
    (2023, 2023),
]

FONTES_CONTRATOS_CONSULTORES = [
    ('fiotec', 'FIOTEC'),
    ('opas', 'OPAS'),
    ('outro', 'Outro'),
    ('', 'Não Informado'),
]

STATUS_CONTRATOS_CONSULTORES = [
    ('em_elaboracao', 'Em elaboração'),
    ('em_analise', 'Em análise'),
    ('em_execucao', 'Em Execução'),
    ('finalizado', 'Finalizado'),
    ('suspenso', 'Suspenso'),
    ('cancelado', 'Cancelado'),
    ('', 'Não Informado'),
]

INSTRUMENTOS_JURIDICOS_CONSULTORES = [
    ('TC132', 'TC132'),
    ('', 'Não Informado'),
]

LOCAL_ENTREGA_PRODUTOS = [
    ('', ''),
    ('apenas_almoxarifado', 'Almoxarifado'),
    ('apenas_ses', 'SES'),
    ('apenas_almoxarifado_ses', 'Almoxarifado e SES'),
]

NOTAS_RECEBIDAS = [
    ('nao_informado', 'Não Informado'),
    ('nenhuma', 'Nenhuma'),
    ('parcial', 'Parcial'),
    ('todas', 'Todas'),
]

NOTAS_STATUS = [
    ('nao_informado', 'Não Informado'),
    ('nao_validadas', 'Não Validadas'),
    ('validadas', 'Validadas'),
]

NOTAS_PAGAMENTOS = [
    ('nao_informado', 'Não Informado'),
    ('nao_realizado', 'Não Realizado'),
    ('realizado', 'Realizado'),
]

NIVEL_ALERTA = [
    ('baixo', 'Baixo'),
    ('medio', 'Médio'),
    ('alto', 'Alto'),
]

STATUS_FISCAL_CONTRATO = [
    ('ativo', 'Ativo'),
    ('inativo', 'Inativo'),
]

STATUS_EMPENHO = [
    ('', 'Nâo Informado'),
    ('pre_empenho', 'Pré-Empenho'),
    ('empenhado', 'Empenhado'),
    ('cancelado', 'Cancelado'),
]

TIPO_LOCAL = [
    ('presencial', 'Presencial'),
    ('online', 'Online'),
    ('hibrido', 'Híbrido'),
]

STATUS_BACKLOG = [
    ('nao_iniciado', 'Não Iniciado'),
    ('em_desenvolvimento', 'Em desenvolvimento'),
    ('entregue', 'Entregue'),
    ('cancelado', 'Cancelado'),
]

TIPO_BACKLOG = [
    ('corretivo', 'Corretivo'),
    ('adaptativo', 'Adaptativo'),
    ('evolutivo', 'Evolutivo'),
]

FASE_TRATAMENTO = [
    ('ataque', 'Ataque'),
    ('inicial', 'Inicial'),
    ('manutencao', 'Manutenção'),
    ('nao_se_aplica', 'Não se aplica'),
    ('', 'Não Informado'),
]

VIA_ATENDIMENTO = [
    ('administrativo', 'Administrativo'),
    ('judicial', 'Judicial'),
    ('', 'Não Informado'),
]

ORIGEM_DEMANDA_JUDICIAL = [
    ('cgceaf', 'CGCEAF'),
    ('djud', 'DJUD'),
    ('nao_se_aplica', 'Não se Aplica'),
    ('', 'Não Informado'),
]

STATUS_DISPENSACAO = [
    ('em_analise', 'Em Análise'),
    ('enviado', 'Enviado'),
    ('consumido', 'Consumido'),
    ('cancelado', 'Cancelado'),
    ('', 'Não Informado'),
]

CICLO_TRATAMENTO = [
    ('nao_se_aplica', 'Não se aplica'),
    ('1', '1'),
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
    ('', 'Não Informado'),
]