# Generated by Django 4.2.5 on 2023-12-26 18:27

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('processos_aquisitivos', '0017_proaqitens'),
    ]

    operations = [
        migrations.AddField(
            model_name='proaqitens',
            name='cmm_data_fim',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='proaqitens',
            name='cmm_data_inicio',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='proaqitens',
            name='tipo_cota',
            field=models.CharField(choices=[('', 'Não Informado'), ('principal', 'Principal'), ('reservada', 'Reservada'), ('nao_se_aplica', 'Não Se Aplica')], max_length=20),
        ),
    ]