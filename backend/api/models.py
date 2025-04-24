from django.db import models
from django.contrib.auth.models import User

class OrgProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="org_profile")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre
