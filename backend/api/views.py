from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Elimina esta línea si no necesitas NoteSerializer
# from .serializers import NoteSerializer

# Create your views here.
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