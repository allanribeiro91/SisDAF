# Generated by Django 4.2.5 on 2024-02-01 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestao_pacientes', '0008_dispensacoes_data_entrega'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dispensacoes',
            name='status',
            field=models.CharField(choices=[('em_analise', 'Em Análise'), ('enviado', 'Enviado'), ('entregue', 'Entregue'), ('consumido', 'Consumido'), ('cancelado', 'Cancelado'), ('', 'Não Informado')], default='nao_informado', max_length=20),
        ),
    ]