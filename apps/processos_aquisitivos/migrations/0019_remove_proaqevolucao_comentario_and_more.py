# Generated by Django 4.2.5 on 2023-12-27 18:10

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0008_alter_alocacao_unidade_and_more'),
        ('processos_aquisitivos', '0018_proaqitens_cmm_data_fim_proaqitens_cmm_data_inicio_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='proaqevolucao',
            name='comentario',
        ),
        migrations.RemoveField(
            model_name='proaqevolucao',
            name='data_fim',
        ),
        migrations.RemoveField(
            model_name='proaqevolucao',
            name='data_inicio',
        ),
        migrations.RemoveField(
            model_name='proaqevolucao',
            name='status',
        ),
        migrations.AddField(
            model_name='proaqevolucao',
            name='data_entrada',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='proaqevolucao',
            name='data_saida',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='proaqevolucao',
            name='fase_numero',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='proaqevolucao',
            name='observacoes_gerais',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='proaqevolucao',
            name='del_usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='proaq_evolucao_deletado', to='usuarios.usuario'),
        ),
        migrations.AlterField(
            model_name='proaqevolucao',
            name='fase',
            field=models.CharField(choices=[('', 'Não Informado'), ('fase1', 'Documentos Iniciais'), ('fase2', 'Tramitação Pré-Contratual'), ('fase3', 'Contratação'), ('fase4', 'Execução do Contrato'), ('fase5', 'Aditivo de Contrato'), ('fase6', 'Prestação de Contas'), ('fase7', 'Encerrado')], max_length=20),
        ),
        migrations.AlterField(
            model_name='proaqevolucao',
            name='usuario_atualizacao',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='proaq_evolucao_edicao', to='usuarios.usuario'),
        ),
        migrations.AlterField(
            model_name='proaqevolucao',
            name='usuario_registro',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='proaq_evolucao_registro', to='usuarios.usuario'),
        ),
    ]