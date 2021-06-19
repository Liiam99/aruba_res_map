from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Location(models.Model):
    """PLACEHOLDER

    PLACEHOLDER.
    """
    name = models.CharField(max_length=100)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.longitude, self.latitude}"

    def serialise(self):
        return {
            "name": self.name,
            "coords": (self.longitude, self.latitude),
            "description": self.description,
            "image": self.image
        }
