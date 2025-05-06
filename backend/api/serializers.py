from django.contrib.auth.models import User
from rest_polymorphic.serializers import PolymorphicSerializer
from rest_framework import serializers
from .models import OrgProfile, Fuente, RepositorioSistema, SistemaInformacion, Control, ProcesoNegocio, Stakeholder, Departamento, DataProblem

# Serializer base para las fuentes
class FuenteBaseSerializer(serializers.ModelSerializer):
    tipo_fuente = serializers.SerializerMethodField()

    class Meta:
        model = Fuente
        fields = ['id', 'nombre', 'tipo', 'organizacion', 'tipo_fuente']

    def get_tipo_fuente(self, obj):
        return obj.__class__.__name__


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

# Serializer para RepositorioSistema
class RepositorioSistemaSerializer(FuenteBaseSerializer):
    class Meta:
        model = RepositorioSistema
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion']


# Serializer para SistemaInformacion
class SistemaInformacionSerializer(FuenteBaseSerializer):
    repositorio = RepositorioSistemaSimpleSerializer(many=True, read_only=True)
    repositorio_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=RepositorioSistema.objects.all(),
        write_only=True,
        source='repositorio'
    )

    class Meta:
        model = SistemaInformacion
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion', 'repositorio', 'repositorio_ids']


# Serializer para Control
class ControlSerializer(FuenteBaseSerializer):
    class Meta:
        model = Control
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion']


# Serializer para ProcesoNegocio
class ProcesoNegocioSerializer(FuenteBaseSerializer):
    sistema = SistemaInformacionSimpleSerializer(many=True, read_only=True)
    sistema_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=SistemaInformacion.objects.all(),
        write_only=True,
        source='sistema'
    )

    class Meta:
        model = ProcesoNegocio
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion', 'sistema', 'sistema_ids']


# Serializer para Stakeholder
class StakeholderSerializer(FuenteBaseSerializer):
    procesos = ProcesoNegocioSimpleSerializer(many=True, read_only=True)
    procesos_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProcesoNegocio.objects.all(),
        write_only=True,
        source='procesos'
    )

    class Meta:
        model = Stakeholder
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion_rol', 'procesos', 'procesos_ids']


# Serializer para Departamento
class DepartamentoSerializer(FuenteBaseSerializer):
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
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion', 'stakeholder', 'stakeholder_ids', 'procesos', 'procesos_ids']


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

class DataProblemSerializer(serializers.ModelSerializer):
    fuente_1 = serializers.PrimaryKeyRelatedField(queryset=Fuente.objects.all())
    fuente_2 = serializers.PrimaryKeyRelatedField(queryset=Fuente.objects.all(), allow_null=True)

    stakeholder = StakeholderSimpleSerializer(read_only=True)
    stakeholder_id = serializers.PrimaryKeyRelatedField(
        queryset=Stakeholder.objects.all(), write_only=True, source='stakeholder'
    )

    departamentos = DepartamentoSimpleSerializer(many=True, read_only=True)
    departamentos_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Departamento.objects.all(),
        write_only=True,
        source='departamentos'
    )

    procesos_negocio = ProcesoNegocioSimpleSerializer(many=True, read_only=True)
    procesos_negocio_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ProcesoNegocio.objects.all(),
        write_only=True,
        source='procesos_negocio'
    )

    class Meta:
        model = DataProblem
        fields = '__all__'
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['organizacion'] = self.context['request'].user.org_profile
        return super().create(validated_data)
