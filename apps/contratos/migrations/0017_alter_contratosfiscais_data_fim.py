# Generated by Django 4.2.5 on 2023-12-18 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratos', '0016_contratosfiscais_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contratosfiscais',
            name='data_fim',
            field=models.CharField(blank=True, choices=[('', ''), ('apenas_almoxarifado', 'Almoxarifado'), ('apenas_ses', 'SES'), ('apenas_almoxarifado_ses', 'Almoxarifado e SES')], max_length=30, null=True),
        ),
    ]