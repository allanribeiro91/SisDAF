# Generated by Django 4.2.5 on 2024-01-12 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sobre_sisdaf', '0007_backlog_responsavel_realizacao'),
    ]

    operations = [
        migrations.AddField(
            model_name='backlog',
            name='observacoes_gerais',
            field=models.TextField(blank=True, null=True),
        ),
    ]
