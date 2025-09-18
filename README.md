# DataProPTool 🛠️

[![CI Pipeline](https://github.com/Sh1zukku/DataProPTool/actions/workflows/ci.yml/badge.svg)](https://github.com/Sh1zukku/DataProPTool/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Sh1zukku/DataProPTool/branch/master/graph/badge.svg)](https://codecov.io/gh/Sh1zukku/DataProPTool)
[![Python Version](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue)](https://www.python.org/downloads/)
[![Node Version](https://img.shields.io/badge/node-18.x%20%7C%2020.x-green)](https://nodejs.org/)
[![Django](https://img.shields.io/badge/django-5.2-darkgreen)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-19.0-blue)](https://reactjs.org/)

Una herramienta completa para la gestión y análisis de problemas de calidad de datos, desarrollada con Django REST Framework y React.

## 🚀 Características

- **Backend Django**: API REST robusta con autenticación JWT
- **Frontend React**: Interfaz moderna desarrollada con Vite y Material-UI
- **Base de datos**: Soporte para PostgreSQL y SQLite
- **Autenticación**: Sistema completo de usuarios con JWT
- **API documentada**: Endpoints RESTful bien documentados

## 🏗️ Arquitectura del Proyecto

```
DataProPTool/
├── backend/           # Django REST API
│   ├── api/          # Aplicación principal
│   ├── backend/      # Configuración del proyecto
│   └── manage.py     # Django management
├── frontend/         # React Application
│   ├── src/         # Código fuente
│   ├── public/      # Archivos públicos
│   └── dist/        # Build de producción
└── .github/         # GitHub Actions workflows
```

## 🛠️ Desarrollo Local

### Prerrequisitos

- Python 3.11 o 3.12
- Node.js 18.x o 20.x
- PostgreSQL (opcional, usa SQLite por defecto)

### Configuración del Backend

1. **Crear y activar el entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   DEBUG=True
   SECRET_KEY=tu-secret-key-aquí
   DATABASE_URL=sqlite:///db.sqlite3
   ```

4. **Ejecutar migraciones:**
   ```bash
   cd backend
   python manage.py migrate
   ```

5. **Crear superusuario (opcional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Iniciar servidor de desarrollo:**
   ```bash
   python manage.py runserver
   ```

### Configuración del Frontend

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test:ci
```

### Ejecutar todos los tests con cobertura

```bash
# Backend con coverage
cd backend
coverage run --source='.' manage.py test
coverage report

# Frontend linting y build
cd frontend
npm run lint
npm run build
```

## 🔧 Herramientas de Desarrollo

### Code Quality

- **Backend**: 
  - `flake8` para linting
  - `black` para formateo de código
  - `coverage` para cobertura de tests

- **Frontend**:
  - `ESLint` para linting
  - Configuración de Vite para builds optimizados

### Comandos útiles

```bash
# Formatear código Python
black backend/

# Linting Python
flake8 backend/

# Formatear y verificar código JavaScript
cd frontend
npm run lint:fix
```

## 🚀 CI/CD Pipeline

El proyecto utiliza GitHub Actions para:

- ✅ **Tests automatizados** en Python 3.11 y 3.12
- ✅ **Linting y formateo** del código
- ✅ **Build del frontend** en Node.js 18.x y 20.x
- ✅ **Análisis de seguridad** con Bandit y npm audit
- ✅ **Cobertura de código** con Codecov
- 🚀 **Despliegue automático** a staging y producción

### Estados del Pipeline

- `master/main` → Despliegue a producción
- `develop` → Despliegue a staging
- `feature/*` → Tests y validación

## 📝 API Documentation

La API REST está disponible en:
- **Desarrollo**: `http://localhost:8000/api/`
- **Documentación**: `http://localhost:8000/admin/` (Django Admin)

### Endpoints principales

- `/api/auth/` - Autenticación y registro
- `/api/data-problems/` - Gestión de problemas de datos
- `/api/organizations/` - Gestión de organizaciones

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código (flake8, black, eslint)
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Asegúrate de que el CI pipeline pase

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes algún problema o pregunta:

1. Revisa los [Issues](https://github.com/Sh1zukku/DataProPTool/issues) existentes
2. Crea un nuevo issue con detalles del problema
3. Proporciona logs y pasos para reproducir el error

## 🏆 Estado del Proyecto

- ✅ **MVP Completo**: Funcionalidad básica implementada
- 🔄 **En Desarrollo**: Mejoras continuas y nuevas características
- 🎯 **Próximas Características**: Ver [Roadmap](https://github.com/Sh1zukku/DataProPTool/projects)

---

Desarrollado con ❤️ por el equipo DataProPTool