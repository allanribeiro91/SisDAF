# Generated by Django 4.2.5 on 2023-09-17 22:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0007_alter_usuario_cad_unidade_daf_info'),
        ('produtos', '0013_produtostags'),
    ]

    operations = [
        migrations.AddField(
            model_name='produtostags',
            name='del_data',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='produtostags',
            name='del_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='produtostags',
            name='del_usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='usuario_produtotag_deletado', to='usuarios.usuario'),
        ),
    ]
