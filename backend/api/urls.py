from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RepositorioSistemaViewSet,
    SistemaInformacionViewSet,
    ControlViewSet,
    ProcesoNegocioViewSet,
    StakeholderViewSet,
    DepartamentoViewSet,
    DataProblemViewSet,
    TodasLasFuentesViewSet,
    GrupoViewSet,
    TecnicaIdentificacionViewSet,
    UserSerializerViewSet,
    HerramientadeAnalisisViewSet,
    DataStageViewSet,
    DataQualityViewSet,
    AnalisisDataProblemViewSet,
    PersonViewSet,
    EvaluacionDataProblemViewSet,
    ClasificacionResultViewSet,
    health_check,
)


router = DefaultRouter()
router.register(r'repositorios', RepositorioSistemaViewSet, basename='repositorios')
router.register(r'sistemas', SistemaInformacionViewSet, basename='sistemas')
router.register(r'controles', ControlViewSet, basename='controles')
router.register(r'procesos', ProcesoNegocioViewSet, basename='procesos')
router.register(r'stakeholders', StakeholderViewSet, basename='stakeholders')
router.register(r'departamentos', DepartamentoViewSet, basename='departamentos')
router.register(r'dataproblem', DataProblemViewSet, basename='dataproblem')
router.register(r'fuentes', TodasLasFuentesViewSet, basename='fuentes')
router.register(r'grupos', GrupoViewSet, basename='grupos')
router.register(r'tecnicas', TecnicaIdentificacionViewSet, basename='tecnicas')
router.register(r'usuarios', UserSerializerViewSet, basename='usuarios')
router.register(r'herramientas', HerramientadeAnalisisViewSet, basename='herramientas')
router.register(r"datastages", DataStageViewSet)
router.register(r"dataquality", DataQualityViewSet)
router.register(r"analisisdataproblem", AnalisisDataProblemViewSet, basename="analisisdataproblem")
router.register(r"personas", PersonViewSet, basename="personas")
router.register(r"evaluaciondataproblem", EvaluacionDataProblemViewSet, basename="evaluaciondataproblem")
router.register(r"clasificacion", ClasificacionResultViewSet, basename="clasificacion")


urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health_check'),
]