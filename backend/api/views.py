from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets
from .models import RepositorioSistema, SistemaInformacion, Control, ProcesoNegocio, Stakeholder, Departamento
from .serializers import (
    RepositorioSistemaSerializer,
    SistemaInformacionSerializer,
    ControlSerializer,
    ProcesoNegocioSerializer,
    StakeholderSerializer,
    DepartamentoSerializer
)

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