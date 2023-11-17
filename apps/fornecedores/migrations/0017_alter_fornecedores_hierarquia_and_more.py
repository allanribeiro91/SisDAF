# Generated by Django 4.2.5 on 2023-11-14 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fornecedores', '0016_alter_fornecedores_hierarquia_and_more'),
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
            field=models.CharField(choices=[('demais', 'Demais'), ('grande_empresa', 'Grande Empresa'), ('epp', 'EPP'), ('me', 'ME'), ('medio_porte', 'Médio Porte'), ('mei', 'MEI')], max_length=20),
        ),
        migrations.AlterField(
            model_name='fornecedores',
            name='tipo_direito',
            field=models.CharField(choices=[('público', 'Público'), ('privado', 'Privado')], default='privado', max_length=10),
        ),
    ]