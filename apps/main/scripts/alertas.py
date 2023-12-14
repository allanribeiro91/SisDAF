from datetime import timedelta
from django.utils import timezone
from apps.contratos.models import ContratosArps
from apps.main.models import Alertas

# LIMPAR OS ALERTAS
def limpar_alertas():
    Alertas.objects.filter(status=True).update(status=False, data_desativacao=timezone.now())

#ALERTAS ARP
def arp_prazo_vigencia():
    arps = ContratosArps.objects.all()
    for arp in arps:
        if arp.prazo_vigencia is not None:
            if arp.prazo_vigencia < 30:
                nivel = 'alto'
            elif arp.prazo_vigencia < 60:
                nivel = 'medio'
            elif arp.prazo_vigencia < 90:
                nivel = 'baixo'
            else:
                continue
            Alertas.objects.create(
                unidade_daf=arp.unidade_daf,
                item='ARP',
                nivel=nivel,
                mensagem=f'A ARP {arp.numero_arp} está com prazo de vigência para encerrar em {arp.prazo_vigencia} dias.'
            )


#Rotina de atualização dos alertas
limpar_alertas()
arp_prazo_vigencia()