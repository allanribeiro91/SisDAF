# Generated by Django 4.2.5 on 2023-12-19 00:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0008_alter_alocacao_unidade_and_more'),
        ('contratos', '0018_alter_contratosfiscais_data_fim'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contratosfiscais',
            name='fiscal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='fiscal_contrato_usuario', to='usuarios.usuario'),
        ),
    ]