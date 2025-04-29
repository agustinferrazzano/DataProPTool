from django.db import models
from django.contrib.auth.models import User

class OrgProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="org_profile")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Fuente(models.Model):
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    organizacion = models.ForeignKey(OrgProfile, on_delete=models.CASCADE, related_name='fuentes')

    def __str__(self):
        return self.nombre

class RepositorioSistema(Fuente):
    descripcion = models.TextField()

class SistemaInformacion(Fuente):
    descripcion = models.TextField()
    repositorio = models.ManyToManyField(RepositorioSistema, related_name='repositoriosdelsistema', blank=True)

class Control(Fuente):
    descripcion = models.TextField()

class ProcesoNegocio(Fuente):
    descripcion = models.TextField()
    sistema = models.ManyToManyField(SistemaInformacion, related_name='sistemasdelproceso', blank=True)

class Stakeholder(Fuente):
    descripcion_rol = models.TextField()
    procesos = models.ManyToManyField(ProcesoNegocio, related_name='procesosdelstakeholder', blank=True)

class Departamento(Fuente):
    descripcion = models.TextField()
    stakeholder = models.ManyToManyField(Stakeholder, related_name='stakeholdersdeldepartamento', blank=True)
    procesos = models.ManyToManyField(ProcesoNegocio, related_name='procesosdeldepartamento', blank=True)