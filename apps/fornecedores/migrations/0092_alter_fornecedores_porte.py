# Generated by Django 4.2.5 on 2024-02-16 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0091_alter_fornecedores_porte'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('demais', 'Demais'), ('epp', 'EPP'), ('me', 'ME'), ('medio_porte', 'Médio Porte'), ('grande_empresa', 'Grande Empresa'), ('mei', 'MEI')], max_length=20),
        ),
    ]
