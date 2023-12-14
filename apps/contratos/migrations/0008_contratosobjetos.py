# Generated by Django 4.2.5 on 2023-12-05 00:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0008_alter_alocacao_unidade_and_more'),
        ('produtos', '0020_produtoconsumomedio_aprovado_total'),
        ('contratos', '0007_alter_contratos_arp'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContratosObjetos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registro_data', models.DateTimeField(auto_now_add=True)),
                ('ult_atual_data', models.DateTimeField(auto_now=True)),
                ('log_n_edicoes', models.IntegerField(default=1)),
                ('numero_item', models.IntegerField()),
                ('fator_embalagem', models.IntegerField()),
                ('qtd_contratada', models.FloatField()),
                ('valor_unitario', models.FloatField()),
                ('observacoes_gerais', models.TextField(blank=True, null=True)),
                ('del_status', models.BooleanField(default=False)),
                ('del_data', models.DateTimeField(blank=True, null=True)),
                ('contrato', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='contrato_objeto', to='contratos.contratos')),
                ('del_usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='contrato_objeto_deletado', to='usuarios.usuario')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='produto_contrato_objeto', to='produtos.produtosfarmaceuticos')),
                ('usuario_atualizacao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='contrato_objeto_edicao', to='usuarios.usuario')),
                ('usuario_registro', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='contrato_objeto_registro', to='usuarios.usuario')),
            ],
        ),
    ]