# Generated by Django 4.2.5 on 2023-11-23 00:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '0007_alter_usuario_cad_unidade_daf_info'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConsultoresContratos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registro_data', models.DateTimeField(auto_now_add=True)),
                ('ult_atual_data', models.DateTimeField(auto_now=True)),
                ('log_n_edicoes', models.IntegerField(default=1)),
                ('status', models.CharField(choices=[('em_elaboracao', 'Em elaboração'), ('em_analise', 'Em análise'), ('em_execucao', 'Em Execução'), ('finalizado', 'Finalizado'), ('suspenso', 'Suspenso'), ('cancelado', 'Cancelado'), ('', 'Não Informado')], max_length=20)),
                ('fonte', models.CharField(choices=[('fiotec', 'FIOTEC'), ('opas', 'OPAS'), ('outro', 'Outro'), ('', 'Não Informado')], max_length=20)),
                ('instrumento_juridico', models.CharField(choices=[('TC132', 'TC132'), ('', 'Não Informado')], max_length=20)),
                ('n_contrato', models.CharField(max_length=20)),
                ('data_assinatura', models.DateField(blank=True, null=True)),
                ('vigencia', models.DateField(blank=True, null=True)),
                ('objeto', models.TextField(blank=True, default='Não Informado', null=True)),
                ('metodologia', models.TextField(blank=True, default='Não Informado', null=True)),
                ('link_tr', models.URLField(blank=True, null=True)),
                ('link_contrato', models.URLField(blank=True, null=True)),
                ('observacoes_gerais', models.TextField(blank=True, default='Sem observações.', null=True)),
                ('usuario_atualizacao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultor_contrato_edicao', to='usuarios.usuario')),
                ('usuario_registro', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultor_contrato_registro', to='usuarios.usuario')),
            ],
        ),
    ]