# Generated by Django 4.2.5 on 2024-01-09 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0068_alter_fornecedores_porte'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('mei', 'MEI'), ('epp', 'EPP'), ('demais', 'Demais'), ('me', 'ME'), ('medio_porte', 'Médio Porte'), ('grande_empresa', 'Grande Empresa')], max_length=20),
        ),
    ]