# Generated by Django 4.2.5 on 2023-09-14 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produtos', '0006_produtosfarmaceuticos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produtosfarmaceuticos',
            name='concentracao_tipo',
            field=models.CharField(choices=[('mostrar_nao', 'Não mostrar'), ('nao_informado', 'Não Informado'), ('mostrar_nome', 'Mostrar'), ('nao_se_aplica', 'Não se aplica')], max_length=20),
        ),
        migrations.AlterField(
            model_name='produtosfarmaceuticos',
            name='forma_farmaceutica',
            field=models.CharField(choices=[('solucao_oral', 'Solução Oral'), ('capsula', 'Cápsula'), ('capsula_mole', 'Cápsula Mole'), ('granulado_oral', 'Granulado Oral'), ('pastilha', 'Pastilha'), ('po_solucao_injetavel', 'Pó para Solução Injetável'), ('comprimido_mastigavel', 'Comprimido Mastigável'), ('comprimido_dispersivel', 'Comprimido Dispersível'), ('comprimido_lib_prolongada', 'Comprimido de Liberação Prolongada'), ('seringa_preenchida', 'Seringa Preenchida'), ('goma_mascar', 'Goma de Mascar'), ('nao_informado', 'Não Informado'), ('xarope', 'Xarope'), ('seringa_injetavel', 'Solução Injetável'), ('comprimido', 'Comprimido'), ('suspensao_injetavel', 'Suspenção Injetável'), ('suspensao_oral', 'Suspensão Oral'), ('gel', 'Gel'), ('adesivo_transdermico', 'Adesivo Transdérmico')], max_length=60),
        ),
        migrations.AlterField(
            model_name='produtosfarmaceuticos',
            name='incorp_status',
            field=models.CharField(choices=[('nao_informado', 'Não Informado'), ('incorporado', 'Incorporado'), ('excluido', 'Excluído')], max_length=20),
        ),
    ]