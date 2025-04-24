from django.contrib.auth.models import User
from rest_framework import serializers
from .models import OrgProfile

class OrgProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgProfile
        fields = ["nombre", "descripcion"]

class UserSerializer(serializers.ModelSerializer):
    org_profile = OrgProfileSerializer()  # Cambiado de OrgProfile a org_profile

    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "org_profile"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        profile_data = validated_data.pop('org_profile')  # Cambiado de OrgProfile a org_profile
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        OrgProfile.objects.create(
            user=user,
            nombre=profile_data.get("nombre", ''),
            descripcion=profile_data.get("descripcion", ''),
        )
        return user
