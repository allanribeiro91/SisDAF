# Generated by Django 4.2.5 on 2024-01-23 22:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gestao_pacientes', '0003_remove_dispensacoes_cns_remove_dispensacoes_cor_pele_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pacientes',
            name='naturalidade_municipio',
        ),
        migrations.RemoveField(
            model_name='pacientes',
            name='naturalidade_uf',
        ),
    ]
