# Generated by Django 4.2.5 on 2024-01-22 23:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('usuarios', '0008_alter_alocacao_unidade_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pacientes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registro_data', models.DateTimeField(auto_now_add=True)),
                ('ult_atual_data', models.DateTimeField(auto_now=True)),
                ('log_n_edicoes', models.IntegerField(default=1)),
                ('cns', models.CharField(max_length=15)),
                ('cpf', models.CharField(blank=True, max_length=11, null=True)),
                ('nome', models.CharField(max_length=100)),
                ('data_nascimento', models.DateTimeField(blank=True, null=True)),
                ('data_obito', models.DateTimeField(blank=True, null=True)),
                ('sexo', models.CharField(choices=[('masculino', 'Masculino'), ('feminino', 'Feminino'), ('outro', 'Outro'), ('nao_informado', 'Não Informado')], max_length=20)),
                ('cor_pele', models.CharField(choices=[('branco', 'Branco'), ('preto', 'Preto'), ('pardo', 'Pardo'), ('amarelo', 'Amarelo'), ('vermelho', 'Vermelho'), ('outro', 'Outro'), ('nao_informado', 'Não Informado')], max_length=20)),
                ('orientacao_sexual', models.CharField(choices=[('heterossexual', 'Heterossexual'), ('homossexual', 'Homossexual'), ('bissexual', 'Bissexual'), ('outro', 'Outro'), ('nao_informado', 'Não Informado')], max_length=20)),
                ('naturalidade_cod_ibge', models.CharField(blank=True, max_length=10, null=True)),
                ('naturalidade_municipio', models.CharField(blank=True, max_length=100, null=True)),
                ('naturalidade_uf', models.CharField(choices=[('AC', 'AC'), ('AL', 'AL'), ('AM', 'AM'), ('AP', 'AP'), ('BA', 'BA'), ('CE', 'CE'), ('DF', 'DF'), ('ES', 'ES'), ('GO', 'GO'), ('MA', 'MA'), ('MG', 'MG'), ('MS', 'MS'), ('MT', 'MT'), ('PA', 'PA'), ('PB', 'PB'), ('PE', 'PE'), ('PI', 'PI'), ('PR', 'PR'), ('RJ', 'RJ'), ('RN', 'RN'), ('RO', 'RO'), ('RR', 'RR'), ('RS', 'RS'), ('SC', 'SC'), ('SE', 'SE'), ('SP', 'SP'), ('TO', 'TO')], max_length=2)),
                ('observacoes_gerais', models.TextField(blank=True, default='Sem observações.', null=True)),
                ('del_status', models.BooleanField(default=False)),
                ('del_data', models.DateTimeField(blank=True, null=True)),
                ('del_usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='paciente_deletado', to='usuarios.usuario')),
                ('usuario_atualizacao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='paciente_edicao', to='usuarios.usuario')),
                ('usuario_registro', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='paciente_registro', to='usuarios.usuario')),
            ],
        ),
    ]
