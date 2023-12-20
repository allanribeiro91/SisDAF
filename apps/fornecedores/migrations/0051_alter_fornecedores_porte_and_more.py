# Generated by Django 4.2.5 on 2023-12-20 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0050_alter_fornecedores_hierarquia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fornecedores',
            name='porte',
            field=models.CharField(choices=[('medio_porte', 'Médio Porte'), ('mei', 'MEI'), ('me', 'ME'), ('demais', 'Demais'), ('grande_empresa', 'Grande Empresa'), ('epp', 'EPP')], max_length=20),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='tipo_direito',
            field=models.CharField(choices=[('público', 'Público'), ('privado', 'Privado')], default='privado', max_length=10),
        ),
    ]
