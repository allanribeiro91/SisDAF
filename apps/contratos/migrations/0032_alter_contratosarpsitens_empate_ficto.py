# Generated by Django 4.2.5 on 2024-02-16 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratos', '0031_alter_contratos_tipo_contrato_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contratosarpsitens',
            name='empate_ficto',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]