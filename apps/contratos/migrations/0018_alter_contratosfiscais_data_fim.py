# Generated by Django 4.2.5 on 2023-12-18 23:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contratos', '0017_alter_contratosfiscais_data_fim'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contratosfiscais',
            name='data_fim',
            field=models.DateField(blank=True, null=True),
        ),
    ]
