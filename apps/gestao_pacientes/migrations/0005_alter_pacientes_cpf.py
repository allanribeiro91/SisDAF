# Generated by Django 4.2.5 on 2024-01-23 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestao_pacientes', '0004_remove_pacientes_naturalidade_municipio_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pacientes',
            name='cpf',
            field=models.CharField(blank=True, max_length=14, null=True),
        ),
    ]
