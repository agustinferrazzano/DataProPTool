from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RepositorioSistemaViewSet,
    SistemaInformacionViewSet,
    ControlViewSet,
    ProcesoNegocioViewSet,
    StakeholderViewSet,
    DepartamentoViewSet,
)


router = DefaultRouter()
router.register(r'repositorios', RepositorioSistemaViewSet, basename='repositorios')
router.register(r'sistemas', SistemaInformacionViewSet, basename='sistemas')
router.register(r'controles', ControlViewSet, basename='controles')
router.register(r'procesos', ProcesoNegocioViewSet, basename='procesos')
router.register(r'stakeholders', StakeholderViewSet, basename='stakeholders')
router.register(r'departamentos', DepartamentoViewSet, basename='departamentos')

urlpatterns = [
    path('', include(router.urls)),
]