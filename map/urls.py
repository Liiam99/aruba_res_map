from django.urls import path
from django.urls.resolvers import URLPattern

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("sources", views.sources, name="sources"),
    path("help", views.help, name="help"),

    # API Routes
    path("locations", views.locations, name="locations")
]
