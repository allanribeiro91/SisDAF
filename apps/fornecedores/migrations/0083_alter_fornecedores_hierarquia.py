# Generated by Django 4.2.5 on 2024-01-23 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0082_alter_fornecedores_hierarquia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='hierarquia',
            field=models.CharField(blank=True, choices=[('matriz', 'Matriz'), ('filial', 'Filial')], max_length=10, null=True),
        ),
    ]