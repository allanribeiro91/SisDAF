# Generated by Django 4.2.5 on 2024-01-09 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0070_alter_fornecedores_hierarquia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('epp', 'EPP'), ('mei', 'MEI'), ('me', 'ME'), ('grande_empresa', 'Grande Empresa'), ('medio_porte', 'Médio Porte'), ('demais', 'Demais')], max_length=20),
        ),
    ]
