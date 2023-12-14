# Generated by Django 4.2.5 on 2023-11-28 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratos', '0005_contratos_modalidade_aquisicao_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='contratos',
            name='lei_licitacao',
            field=models.TextField(choices=[('lei_8666', 'Lei 8.666/93'), ('lei_14133', 'Lei 14.133/21'), ('nao_informado', 'Não Informado')], default='lei_8666', max_length=15),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='contratosarps',
            name='lei_licitacao',
            field=models.TextField(choices=[('lei_8666', 'Lei 8.666/93'), ('lei_14133', 'Lei 14.133/21'), ('nao_informado', 'Não Informado')], default='lei_8666', max_length=15),
        ),
    ]