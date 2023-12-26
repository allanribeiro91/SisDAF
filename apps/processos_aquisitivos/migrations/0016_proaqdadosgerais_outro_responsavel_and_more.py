# Generated by Django 4.2.5 on 2023-12-25 13:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0008_alter_alocacao_unidade_and_more'),
        ('processos_aquisitivos', '0015_proaqtramitacao'),
    ]

    operations = [
        migrations.AddField(
            model_name='proaqdadosgerais',
            name='outro_responsavel',
            field=models.CharField(blank=True, max_length=80, null=True),
        ),
        migrations.AlterField(
            model_name='proaqdadosgerais',
            name='responsavel_tecnico',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='proaq_responsavel', to='usuarios.usuario'),
        ),
    ]
