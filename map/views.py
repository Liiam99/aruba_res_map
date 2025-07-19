from django.http import JsonResponse
from django.shortcuts import render

from .models import Location


def index(request):
    """Loads main page containing a MapBox map and the weight sliders."""
    return render(request, "map/index.html")


def locations(request):
    """Returns all the potential locations for RES in the database."""
    locations = Location.objects.all()
    return JsonResponse([location.serialise() for location in locations], safe=False)


def help(request):
    """Loads the help page where the site's functions are explained."""
    return render(request, "map/help.html")


def sources(request):
    """Loads the page where all sources are listed per discipline."""
    return render(request, "map/sources.html")
