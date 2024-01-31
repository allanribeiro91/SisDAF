# Generated by Django 4.2.5 on 2024-01-25 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gestao_pacientes', '0006_dispensacoes_ciclo_dispensacoes_cid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dispensacoes',
            name='ciclo',
            field=models.CharField(blank=True, choices=[('nao_se_aplica', 'Não se aplica'), ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8'), ('9', '9'), ('10', '10'), ('', 'Não Informado')], max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='dispensacoes',
            name='origem_demanda_judicial',
            field=models.CharField(blank=True, choices=[('cgceaf', 'CGCEAF'), ('djud', 'DJUD'), ('nao_se_aplica', 'Não se Aplica'), ('', 'Não Informado')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='dispensacoes',
            name='uf_solicitacao',
            field=models.CharField(blank=True, choices=[('', ''), ('AC', 'AC'), ('AL', 'AL'), ('AM', 'AM'), ('AP', 'AP'), ('BA', 'BA'), ('CE', 'CE'), ('DF', 'DF'), ('ES', 'ES'), ('GO', 'GO'), ('MA', 'MA'), ('MG', 'MG'), ('MS', 'MS'), ('MT', 'MT'), ('PA', 'PA'), ('PB', 'PB'), ('PE', 'PE'), ('PI', 'PI'), ('PR', 'PR'), ('RJ', 'RJ'), ('RN', 'RN'), ('RO', 'RO'), ('RR', 'RR'), ('RS', 'RS'), ('SC', 'SC'), ('SE', 'SE'), ('SP', 'SP'), ('TO', 'TO')], max_length=20, null=True),
        ),
    ]