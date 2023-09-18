from django import template

register = template.Library()

@register.filter
def join_tags(tags_list):
    return "; ".join(tag['tag'] for tag in tags_list)

