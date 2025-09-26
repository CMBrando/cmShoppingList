"""Views."""

from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render
from django.http import JsonResponse

from cmShoppingList import app_settings

from .models import MarketType

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
    items = list(MarketType.objects.all().values())
    return JsonResponse(items, safe=False)




