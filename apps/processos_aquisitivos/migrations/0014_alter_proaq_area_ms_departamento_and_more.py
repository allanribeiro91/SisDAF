# Generated by Django 4.2.5 on 2023-10-20 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('processos_aquisitivos', '0013_proaq_area_ms_proaq_etapa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proaq_area_ms',
            name='departamento',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='proaq_area_ms',
            name='ministerio',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='proaq_area_ms',
            name='secretaria',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]