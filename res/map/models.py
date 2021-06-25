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
    overview = models.TextField(blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)

    economic_ranking = models.IntegerField()
    efficiency_ranking = models.IntegerField()
    environmental_ranking = models.IntegerField()
    social_ranking = models.IntegerField()

    economic_description = models.TextField(blank=True)
    efficiency_description = models.TextField(blank=True)
    environmental_description = models.TextField(blank=True)
    social_description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name}, {self.longitude, self.latitude}"

    def serialise(self):
        return {
            "name": self.name,
            "coords": (self.longitude, self.latitude),
            "image": self.image,
            "rankings": {
                "economic": self.economic_ranking,
                "efficiency": self.efficiency_ranking,
                "environmental": self.environmental_ranking,
                "social": self.social_ranking,
            },
            "descriptions": {
                "overview": self.overview,
                "economic": self.economic_description,
                "efficiency": self.efficiency_description,
                "environmental": self.environmental_description,
                "social": self.social_description
            }
        }
