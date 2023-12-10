from django import template
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def custom_number_format(value):
    # Substitui ponto por vírgula e vice-versa
    formatted_value = "{:,.2f}".format(value)
    return mark_safe(formatted_value.replace(',', 'X').replace('.', ',').replace('X', '.'))
