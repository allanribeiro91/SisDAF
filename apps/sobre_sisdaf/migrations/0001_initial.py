# Generated by Django 4.2.5 on 2023-11-27 21:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '0007_alter_usuario_cad_unidade_daf_info'),
    ]

    operations = [
        migrations.CreateModel(
            name='VersoesSisdaf',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registro_data', models.DateTimeField(auto_now_add=True)),
                ('ult_atual_data', models.DateTimeField(auto_now=True)),
                ('log_n_edicoes', models.IntegerField(default=1)),
                ('versao', models.TextField(max_length=15)),
                ('status', models.TextField(choices=[('ativo', 'Ativo'), ('inativo', 'Inativo'), ('em_desenvolvimento', 'Em Desenvolvimento')], max_length=20)),
                ('data_versao', models.DateField(blank=True, null=True)),
                ('informacoes', models.TextField(blank=True, null=True)),
                ('del_status', models.BooleanField(default=False)),
                ('del_data', models.DateTimeField(blank=True, null=True)),
                ('del_usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='versao_deletada', to='usuarios.usuario')),
                ('usuario_atualizacao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='versao_edicao', to='usuarios.usuario')),
                ('usuario_registro', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='versao_registro', to='usuarios.usuario')),
            ],
        ),
    ]
