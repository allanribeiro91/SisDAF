# Generated by Django 4.2.5 on 2023-12-01 14:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0032_alter_fornecedores_porte'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('me', 'ME'), ('mei', 'MEI'), ('grande_empresa', 'Grande Empresa'), ('medio_porte', 'Médio Porte'), ('epp', 'EPP'), ('demais', 'Demais')], max_length=20),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='tipo_direito',
            field=models.CharField(choices=[('privado', 'Privado'), ('público', 'Público')], default='privado', max_length=10),
        ),
    ]
