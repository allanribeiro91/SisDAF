# Generated by Django 4.2.5 on 2023-11-17 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('produtos', '0017_alter_produtosfarmaceuticos_concentracao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produtosfarmaceuticos',
            name='concentracao',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='produtosfarmaceuticos',
            name='produto',
            field=models.TextField(),
        ),
    ]
