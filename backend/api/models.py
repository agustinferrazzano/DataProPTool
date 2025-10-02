from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg

class OrgProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="org_profile")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class TecnicaIdentificacion(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    es_publica = models.BooleanField(default=False)
    propietario = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tecnicas_identificacion'
    )
    def __str__(self):
        return self.titulo

class HerramientadeAnalisis(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    es_publica = models.BooleanField(default=False)
    propietario = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='herramientas_analisis'
    )
    def __str__(self):
        return self.titulo

class Fuente(models.Model):
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=255)
    organizacion = models.ForeignKey(OrgProfile, on_delete=models.CASCADE, related_name='fuentes')

    def __str__(self):
        return self.nombre

class Grupo(models.Model):
    nombre = models.CharField(max_length=255)
    organizacion = models.ForeignKey(OrgProfile, on_delete=models.CASCADE, related_name='grupos')

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

class DataProblem(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    descripcion_fuente = models.TextField()

    fuente_identificacion = models.ForeignKey(Fuente, on_delete=models.CASCADE,null=True, related_name='dataproblems_fuente1')
    tecnica_identificacion = models.ForeignKey(TecnicaIdentificacion,null=True, on_delete=models.CASCADE, related_name='dataproblems_tecnica')
    fuente_confirmacion = models.ForeignKey(Fuente, on_delete=models.SET_NULL, null=True, related_name='dataproblems_fuente2')
    tecnica_confirmacion = models.ForeignKey(TecnicaIdentificacion, on_delete=models.SET_NULL, null=True, related_name='dataproblems_tecnica2')
    Grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, related_name='dataproblems_grupos')
    organizacion = models.ForeignKey(OrgProfile, on_delete=models.CASCADE)
    stakeholder = models.ForeignKey(Stakeholder, on_delete=models.CASCADE)

    departamentos = models.ManyToManyField(Departamento)
    procesos_negocio = models.ManyToManyField(ProcesoNegocio)

    def __str__(self):
        return self.nombre

class DataStage(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.titulo

class DataQuality(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.titulo

class Person(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    organizacion = models.ForeignKey(OrgProfile, on_delete=models.CASCADE, related_name='personas')
    rol= models.ForeignKey(Stakeholder, on_delete=models.CASCADE, related_name='personas')

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class AnalisisDataProblem(models.Model):
    data_problem = models.OneToOneField(
        DataProblem, on_delete=models.CASCADE, related_name="analisis"
    )
    herramientas = models.ManyToManyField(
        HerramientadeAnalisis, related_name="analisis_dataproblems", blank=True
    )
    data_stages = models.ManyToManyField(
        DataStage, related_name="analisis_dataproblems", blank=True
    )
    data_qualities = models.ManyToManyField(
        DataQuality, related_name="analisis_dataproblems", blank=True
    )
    causa_raiz = models.TextField()

    def __str__(self):
        return f"Análisis de {self.data_problem.nombre}"
    
class EvaluacionDataProblem(models.Model):
    data_problem = models.ForeignKey(
        DataProblem, on_delete=models.CASCADE, related_name="evaluacion"
    )
    evaluador = models.ForeignKey(
        Person, on_delete=models.SET_NULL, null=True, related_name="evaluaciones"
    )
    fecha_evaluacion = models.DateField(auto_now_add=True)
    nota = models.IntegerField()

    def __str__(self):
        return f"Evaluación de {self.data_problem.nombre}"

    @staticmethod
    def promedio_notas(data_problem_id):
        return EvaluacionDataProblem.objects.filter(data_problem_id=data_problem_id).aggregate(promedio=Avg('nota'))['promedio']