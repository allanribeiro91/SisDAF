# Generated by Django 4.2.5 on 2024-01-24 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0084_alter_fornecedores_porte'),
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
            field=models.CharField(choices=[('medio_porte', 'Médio Porte'), ('mei', 'MEI'), ('grande_empresa', 'Grande Empresa'), ('epp', 'EPP'), ('me', 'ME'), ('demais', 'Demais')], max_length=20),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='tipo_direito',
            field=models.CharField(choices=[('privado', 'Privado'), ('público', 'Público')], default='privado', max_length=10),
        ),
    ]