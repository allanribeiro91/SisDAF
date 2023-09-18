# Generated by Django 4.2.5 on 2023-09-12 23:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0007_alter_usuario_cad_unidade_daf_info'),
        ('produtos', '0004_alter_denominacoesgenericas_tipo_produto'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='denominacoesgenericas',
            name='del_cpf',
        ),
        migrations.AddField(
            model_name='denominacoesgenericas',
            name='del_usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='denominacoes_deletadas', to='usuarios.usuario'),
        ),
    ]
