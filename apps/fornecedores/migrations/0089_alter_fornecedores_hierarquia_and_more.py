# Generated by Django 4.2.5 on 2024-02-05 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0088_alter_fornecedores_hierarquia_and_more'),
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
            field=models.CharField(choices=[('me', 'ME'), ('medio_porte', 'Médio Porte'), ('mei', 'MEI'), ('epp', 'EPP'), ('demais', 'Demais'), ('grande_empresa', 'Grande Empresa')], max_length=20),
        ),
    ]