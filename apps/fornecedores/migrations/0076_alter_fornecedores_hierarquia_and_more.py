# Generated by Django 4.2.5 on 2024-01-12 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0075_alter_fornecedores_hierarquia_and_more'),
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
            field=models.CharField(choices=[('mei', 'MEI'), ('me', 'ME'), ('medio_porte', 'Médio Porte'), ('grande_empresa', 'Grande Empresa'), ('demais', 'Demais'), ('epp', 'EPP')], max_length=20),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='tipo_direito',
            field=models.CharField(choices=[('privado', 'Privado'), ('público', 'Público')], default='privado', max_length=10),
        ),
    ]
