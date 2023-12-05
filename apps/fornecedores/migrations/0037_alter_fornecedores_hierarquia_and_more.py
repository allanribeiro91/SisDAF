# Generated by Django 4.2.5 on 2023-12-05 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0036_alter_fornecedores_hierarquia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='hierarquia',
            field=models.CharField(blank=True, choices=[('matriz', 'Matriz'), ('filial', 'Filial')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('medio_porte', 'Médio Porte'), ('demais', 'Demais'), ('grande_empresa', 'Grande Empresa'), ('mei', 'MEI'), ('epp', 'EPP'), ('me', 'ME')], max_length=20),
        ),
    ]
