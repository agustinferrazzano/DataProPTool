from django.contrib.auth.models import User
from rest_framework import serializers
from .models import OrgProfile, Fuente, RepositorioSistema, SistemaInformacion, Control, ProcesoNegocio, Stakeholder, Departamento, DataProblem, TecnicaIdentificacion, Grupo

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

    def create(self, validated_data):
        return super().create(validated_data)


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

    def create(self, validated_data):
        return super().create(validated_data)


# Serializer para Control
class ControlSerializer(FuenteBaseSerializer):
    class Meta:
        model = Control
        fields = FuenteBaseSerializer.Meta.fields + ['descripcion']

    def create(self, validated_data):
        return super().create(validated_data)

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

    def create(self, validated_data):
        return super().create(validated_data)


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

    def create(self, validated_data):
        return super().create(validated_data)


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

    def create(self, validated_data):
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

class TecnicaIdentificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TecnicaIdentificacion
        fields = '__all__'
        read_only_fields = ['propietario']

    def create(self, validated_data):
        validated_data['propietario'] = self.context['request'].user
        return super().create(validated_data)
    
class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = ['id', 'nombre', 'organizacion']
        read_only_fields = ['organizacion']

    def create(self, validated_data):
        validated_data['propietario'] = self.context['request'].user.org_profile
        return super().create(validated_data)


class DataProblemSerializer(serializers.ModelSerializer):
    fuente_identificacion = FuenteBaseSerializer(read_only=True)
    fuente_identificacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Fuente.objects.all(),
        write_only=True,
        source='fuente_identificacion'
    )

    tecnica_identificacion = TecnicaIdentificacionSerializer(read_only=True)
    tecnica_identificacion_id = serializers.PrimaryKeyRelatedField(
        queryset=TecnicaIdentificacion.objects.all(),
        write_only=True,
        source='tecnica_identificacion',
    )

    fuente_confirmacion = FuenteBaseSerializer(read_only=True)
    fuente_confirmacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Fuente.objects.all(),
        write_only=True,
        source='fuente_confirmacion',
        allow_null=True
    )

    tecnica_confirmacion = TecnicaIdentificacionSerializer(read_only=True)
    tecnica_confirmacion_id = serializers.PrimaryKeyRelatedField(
        queryset=TecnicaIdentificacion.objects.all(),
        write_only=True,
        source='tecnica_confirmacion',
        allow_null=True,
        required=False
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

    stakeholder = StakeholderSimpleSerializer(read_only=True)
    stakeholder_id = serializers.PrimaryKeyRelatedField(
        queryset=Stakeholder.objects.all(),
        write_only=True,
        source='stakeholder'
    )

    grupo = GrupoSerializer(read_only=True)
    grupo_id = serializers.PrimaryKeyRelatedField(
        queryset=Grupo.objects.all(),
        write_only=True,
        source='Grupo',
        required=False,
        allow_null=True,
    )

    class Meta:
        model = DataProblem
        fields = [
            'id', 'nombre', 'descripcion', 'descripcion_fuente',
            'fuente_identificacion', 'fuente_identificacion_id',
            'tecnica_identificacion', 'tecnica_identificacion_id',
            'fuente_confirmacion', 'fuente_confirmacion_id',
            'tecnica_confirmacion', 'tecnica_confirmacion_id',
            'stakeholder', 'stakeholder_id',
            'departamentos', 'departamentos_ids',
            'procesos_negocio', 'procesos_negocio_ids',
            'grupo', 'grupo_id', 'organizacion'
        ]

    def create(self, validated_data):
        return super().create(validated_data)

