from django.contrib.auth.models import User
from rest_framework import serializers
from .models import OrgProfile, Fuente, RepositorioSistema, SistemaInformacion, Control, ProcesoNegocio, Stakeholder, Departamento


# --- Serializers simples para relaciones nested ---

class RepositorioSistemaSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositorioSistema
        fields = ['id', 'nombre']

class SistemaInformacionSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SistemaInformacion
        fields = ['id', 'nombre']

class ProcesoNegocioSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcesoNegocio
        fields = ['id', 'nombre']

class StakeholderSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stakeholder
        fields = ['id', 'nombre']

class DepartamentoSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'nombre']

# --- Serializers principales con organizacion automática ---

class RepositorioSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositorioSistema
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)

class SistemaInformacionSerializer(serializers.ModelSerializer):
    repositorio = RepositorioSistemaSimpleSerializer(many=True, read_only=True)
    repositorio_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=RepositorioSistema.objects.all(),
        write_only=True,
        source='repositorio'
    )

    class Meta:
        model = SistemaInformacion
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)

class ControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Control
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)

class ProcesoNegocioSerializer(serializers.ModelSerializer):
    sistema = SistemaInformacionSimpleSerializer(many=True, read_only=True)
    sistema_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=SistemaInformacion.objects.all(),
        write_only=True,
        source='sistema'
    )

    class Meta:
        model = ProcesoNegocio
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)

class StakeholderSerializer(serializers.ModelSerializer):
    procesos = ProcesoNegocioSimpleSerializer(many=True, read_only=True)
    procesos_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProcesoNegocio.objects.all(),
        write_only=True,
        source='procesos'
    )

    class Meta:
        model = Stakeholder
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)

class DepartamentoSerializer(serializers.ModelSerializer):
    stakeholder = StakeholderSimpleSerializer(many=True, read_only=True)
    stakeholder_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Stakeholder.objects.all(),
        write_only=True,
        source='stakeholder'
    )
    procesos = ProcesoNegocioSimpleSerializer(many=True, read_only=True)
    procesos_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProcesoNegocio.objects.all(),
        write_only=True,
        source='procesos'
    )

    class Meta:
        model = Departamento
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)


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
