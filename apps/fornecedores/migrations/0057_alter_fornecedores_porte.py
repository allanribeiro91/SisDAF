# Generated by Django 4.2.5 on 2023-12-26 14:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0056_alter_fornecedores_porte'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('demais', 'Demais'), ('mei', 'MEI'), ('me', 'ME'), ('grande_empresa', 'Grande Empresa'), ('epp', 'EPP'), ('medio_porte', 'Médio Porte')], max_length=20),
        ),
    ]
