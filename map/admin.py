from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Location, User

admin.site.register(Location)
admin.site.register(User, UserAdmin)
