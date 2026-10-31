"""Views."""

from collections import defaultdict

from django.contrib.auth.decorators import login_required, permission_required
from django.http import JsonResponse
from django.shortcuts import render
from eve_sde.models import ItemType

from cmShoppingList import app_settings
from cmShoppingList.models import ItemEquivalence


@login_required
@permission_required("cmShoppingList.basic_access")
def index(request):
    """Render index view."""
    context = {
        'CM_VERSION': app_settings.CM_VERSION,
        'HEADER_MESSAGE': app_settings.HEADER_MESSAGE
    }
    return render(request, "cmShoppingList/index.html", context)

@login_required
@permission_required("cmShoppingList.basic_access")
def get_market_types(request):
    items = [
        {"id": item_id, "name": name}
        for item_id, name in ItemType.objects.filter(
            published=True, market_group__isnull=False
        ).values_list("id", "name_en")
    ]
    return JsonResponse(items, safe=False)

@login_required
@permission_required("cmShoppingList.basic_access")
def get_item_equivalences(request):
    """Return item equivalences as dict mapping original_item_id to list of equivalent_item_ids."""
    equivalences = ItemEquivalence.objects.all().values('original_item_id', 'equivalent_item_id')

    result = defaultdict(list)
    for eq in equivalences:
        result[eq['original_item_id']].append(eq['equivalent_item_id'])

    return JsonResponse(dict(result), safe=False)




