from django.shortcuts import render
from apps.consultores_tecnicos.forms import ConsultoresContratosForm

# Create your views here.
def consultores_tecnicos(request):
    return render(request, 'consultores_tecnicos/consultores_contratos.html')

def consultor_contrato_ficha(request, id_contrato=None):
    form = ConsultoresContratosForm()
    conteudo = {
        'form': form,
    }
    return render(request, 'consultores_tecnicos/consultor_contrato_ficha.html', conteudo)