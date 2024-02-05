# Generated by Django 4.2.5 on 2024-02-01 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0087_alter_fornecedores_porte_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='hierarquia',
            field=models.CharField(blank=True, choices=[('filial', 'Filial'), ('matriz', 'Matriz')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('mei', 'MEI'), ('me', 'ME'), ('grande_empresa', 'Grande Empresa'), ('medio_porte', 'Médio Porte'), ('demais', 'Demais'), ('epp', 'EPP')], max_length=20),
        ),
    ]