from django.http import JsonResponse
from django.shortcuts import render

from .models import Location

def index(request):
    """Loads the single page with the map and the menu."""
    return render(request, "map/index.html")

def locations(request):
    """Returns all RES locations."""
    locations = Location.objects.all()
    return JsonResponse([location.serialise() for location in locations],
                        safe=False)

def sources(request):
    """Loads the page with sources."""
    return render(request, "map/sources.html")