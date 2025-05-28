from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Q
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from .models import RepositorioSistema, AnalisisDataProblem, SistemaInformacion, HerramientadeAnalisis, Control, ProcesoNegocio, Stakeholder, Departamento, DataProblem, TecnicaIdentificacion, Grupo, DataStage, DataQuality
from .serializers import (
    RepositorioSistemaSerializer,
    SistemaInformacionSerializer,
    ControlSerializer,
    ProcesoNegocioSerializer,
    StakeholderSerializer,
    DepartamentoSerializer,
    DataProblemSerializer,
    GrupoSerializer,
    TecnicaIdentificacionSerializer,
    HerramientadeAnalisisSerializer,
    DataStageSerializer,
    DataQualitySerializer,
    AnalisisDataProblemSerializer
)


class DataProblemViewSet(viewsets.ModelViewSet):
    serializer_class = DataProblemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = DataProblem.objects.filter(organizacion=self.request.user.org_profile)
        # Si quieres optimizar, puedes usar select_related/prefetch_related
        if self.request.query_params.get("with_analisis") == "1":
            return qs.prefetch_related(
                "analisis__herramientas",
                "analisis__data_stages",
                "analisis__data_qualities"
            )
        return qs

class TecnicaIdentificacionViewSet(viewsets.ModelViewSet):
    serializer_class = TecnicaIdentificacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Técnicas públicas + técnicas del usuario autenticado
            return TecnicaIdentificacion.objects.filter(Q(es_publica=True) | Q(propietario=user))
        # Solo técnicas públicas para usuarios anónimos
        return TecnicaIdentificacion.objects.filter(es_publica=True)

class HerramientadeAnalisisViewSet(viewsets.ModelViewSet):
    serializer_class = HerramientadeAnalisisSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Herramientas públicas + herramientas del usuario autenticado
            return HerramientadeAnalisis.objects.filter(Q(es_publica=True) | Q(propietario=user))
        # Solo herramientas públicas para usuarios anónimos
        return HerramientadeAnalisis.objects.filter(es_publica=True)    

class TodasLasFuentesViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        # Lista de modelos y serializers
        fuentes = [
            (RepositorioSistema, RepositorioSistemaSerializer),
            (SistemaInformacion, SistemaInformacionSerializer),
            (Control, ControlSerializer),
            (ProcesoNegocio, ProcesoNegocioSerializer),
            (Stakeholder, StakeholderSerializer),
            (Departamento, DepartamentoSerializer),
        ]

        # Filtrar por organización del usuario autenticado
        data = []
        for model, serializer_class in fuentes:
            instances = model.objects.filter(organizacion=request.user.org_profile)
            serialized = serializer_class(instances, many=True)
            data.extend(serialized.data)

        return Response(data)


class RepositorioSistemaViewSet(viewsets.ModelViewSet):
    serializer_class = RepositorioSistemaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RepositorioSistema.objects.filter(organizacion=self.request.user.org_profile)


class SistemaInformacionViewSet(viewsets.ModelViewSet):
    serializer_class = SistemaInformacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SistemaInformacion.objects.filter(organizacion=self.request.user.org_profile)


class ControlViewSet(viewsets.ModelViewSet):
    serializer_class = ControlSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Control.objects.filter(organizacion=self.request.user.org_profile)


class ProcesoNegocioViewSet(viewsets.ModelViewSet):
    serializer_class = ProcesoNegocioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProcesoNegocio.objects.filter(organizacion=self.request.user.org_profile)


class StakeholderViewSet(viewsets.ModelViewSet):
    serializer_class = StakeholderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Stakeholder.objects.filter(organizacion=self.request.user.org_profile)


class DepartamentoViewSet(viewsets.ModelViewSet):
    serializer_class = DepartamentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Departamento.objects.filter(organizacion=self.request.user.org_profile)


class GrupoViewSet(viewsets.ModelViewSet):
    serializer_class = GrupoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra los grupos por la organización del usuario autenticado
        return Grupo.objects.filter(organizacion=self.request.user.org_profile)

class UserSerializerViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(org_profile=self.request.user.org_profile)

class RegisterUserView(APIView):
    permission_classes = []  # Permitir acceso sin autenticación
    
    def post(self, request):
        print("Datos recibidos:", request.data)  # Agrega este log
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("Errores de validación:", serializer.errors)  # Agrega este log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DataStageViewSet(viewsets.ModelViewSet):
    queryset = DataStage.objects.all()
    serializer_class = DataStageSerializer

class DataQualityViewSet(viewsets.ModelViewSet):
    queryset = DataQuality.objects.all()
    serializer_class = DataQualitySerializer

class AnalisisDataProblemViewSet(viewsets.ModelViewSet):
    queryset = AnalisisDataProblem.objects.all()
    serializer_class = AnalisisDataProblemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AnalisisDataProblem.objects.filter(
            data_problem__organizacion=self.request.user.org_profile
        )