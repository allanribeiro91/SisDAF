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
    ('', '--- Selecione ---'),  # Opção vazia
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
    ('publicado', "Publicado"),
    ('cancelado', "Cancelado"),
]

STATUS_FASE = [
    ('nao_executado', "Não Executado"),
    ('em_execucao', "Em Execução"),
    ('executado', "Executado"),
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
    ('principal', 'Principal'),
    ('reservada', 'Reservada'),
]

FAQ_FORNECEDOR_TOPICO = [
    ('contrato', 'Contrato'),
    ('entrega_produto','Entrega de Produto Farmacêutico'),
    ('nota_fiscal','Nota Fiscal'),
    ('pregao','Pregão Eletrônico'),
    ('processo_incorporacao','Processo de Incorporação'),
    ('outro','Outro'),
]