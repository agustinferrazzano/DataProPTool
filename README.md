# DataProPTool 🛠️

[![CI Pipeline](https://github.com/agustinferrazzano/DataProPTool/actions/workflows/ci.yml/badge.svg)](https://github.com/agustinferrazzano/DataProPTool/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/agustinferrazzano/DataProPTool/branch/master/graph/badge.svg)](https://codecov.io/gh/agustinferrazzano/DataProPTool)
[![Python Version](https://img.shields.io/badge/python-3.11%20%7C%203.12-blue)](https://www.python.org/downloads/)
[![Node Version](https://img.shields.io/badge/node-18.x%20%7C%2020.x-green)](https://nodejs.org/)
[![Django](https://img.shields.io/badge/django-5.2-darkgreen)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-19.0-blue)](https://reactjs.org/)

Una herramienta completa para la gestión y análisis de problemas de calidad de datos, desarrollada con Django REST Framework y React.

## 📑 Tabla de Contenidos

- [⚡ Inicio Rápido](#-inicio-rápido)
- [🚀 Características](#-características)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🛠️ Desarrollo Local](#️-desarrollo-local)
- [🧪 Testing](#-testing)
- [🔧 Herramientas de Desarrollo](#-herramientas-de-desarrollo)
- [🚀 CI/CD Pipeline](#-cicd-pipeline)
- [📝 API Documentation](#-api-documentation)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)
- [🆘 Soporte](#-soporte)

## ⚡ Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/agustinferrazzano/DataProPTool.git
cd DataProPTool

# 2. Backend - Configurar y ejecutar
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 3. Frontend - En otra terminal
cd frontend
npm install
npm run dev

# 4. Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/api/
# Admin: http://localhost:8000/admin/
```

## 🚀 Características

- **Backend Django**: API REST robusta con autenticación JWT
- **Frontend React**: Interfaz moderna desarrollada con Vite y Material-UI
- **Base de datos**: Soporte para PostgreSQL (producción) y SQLite (desarrollo)
- **Autenticación**: Sistema completo de usuarios con JWT tokens
- **API documentada**: Endpoints RESTful bien documentados
- **16 Modelos de datos**: Arquitectura completa para gestión de calidad de datos
- **Testing**: Suite de tests para backend (pytest) y frontend (vitest)
- **CI/CD**: Pipeline automatizado con GitHub Actions
- **Despliegue**: Arquitectura híbrida (GitHub Pages + Render.com)

### 🎯 Funcionalidades Principales

#### 1. Gestión de Fuentes de Datos
- Repositorios de sistemas
- Sistemas de información
- Controles
- Procesos de negocio
- Agrupación jerárquica de fuentes

#### 2. Gestión Organizacional
- Perfiles de organización (`OrgProfile`)
- Stakeholders/Roles
- Departamentos
- Personas con roles asignados

#### 3. Identificación de Data Problems
- Registro y tracking de problemas de calidad de datos
- Técnicas de identificación y confirmación
- Vinculación con fuentes múltiples
- Agrupación de problemas relacionados
- Descripción de fuentes de identificación

#### 4. Análisis de Data Problems
- Herramientas de análisis configurables
- Etapas del ciclo de vida de datos (Data Stages)
- Dimensiones de calidad de datos (Data Quality)
- Análisis de causa raíz
- Relación many-to-many con múltiples dimensiones

#### 5. Evaluación y Clasificación
- Sistema de evaluación multi-evaluador
- Cálculo automático de promedios
- Matriz de clasificación configurable
- Funciones de agregación personalizables (promedio, máximo, mínimo, etc.)
- Resultados persistidos en JSON
- Priorización de problemas basada en criterios múltiples

## 🏗️ Arquitectura del Proyecto

```
DataProPTool/
├── backend/                    # Django REST API
│   ├── api/                   # Aplicación principal
│   │   ├── models.py         # Modelos de datos (16 modelos)
│   │   ├── views.py          # ViewSets de la API
│   │   ├── serializers.py    # Serializers de DRF
│   │   ├── urls.py           # Rutas de la API
│   │   └── migrations/       # 15 migraciones
│   ├── backend/              # Configuración del proyecto
│   │   ├── settings.py       # Configuración desarrollo
│   │   ├── production_settings.py  # Configuración producción
│   │   └── urls.py           # URLs principales
│   ├── db.sqlite3            # Base de datos SQLite (dev)
│   └── manage.py             # Django management
│
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas (24 páginas)
│   │   ├── styles/           # Estilos CSS
│   │   ├── api.js            # Cliente API con Axios
│   │   ├── constants.js      # Constantes globales
│   │   └── main.jsx          # Entry point
│   ├── public/               # Archivos estáticos
│   ├── dist/                 # Build de producción
│   ├── package.json          # Dependencias npm
│   └── vite.config.js        # Configuración Vite
│
├── requirements.txt           # Dependencias Python (producción)
├── requirements-dev.txt       # Dependencias Python (desarrollo)
├── pyproject.toml            # Configuración black/isort/coverage
├── pytest.ini                # Configuración pytest
├── docker-compose.yml        # Configuración Docker
├── Dockerfile                # Imagen Docker
├── DEPLOYMENT.md             # Guía de despliegue
└── .github/                  # GitHub Actions CI/CD
    └── workflows/
```

### 📦 Tecnologías utilizadas

**Backend:**
- Django 5.2 + Django REST Framework
- djangorestframework-simplejwt (autenticación JWT)
- psycopg2-binary (PostgreSQL adapter)
- django-cors-headers (manejo de CORS)
- gunicorn (servidor WSGI para producción)
- whitenoise (servir archivos estáticos)
- python-dotenv (variables de entorno)
- dj-database-url (configuración de BD)

**Frontend:**
- React 19.0 + React Router DOM 7.5
- Vite 6.3 (build tool ultrarrápido)
- Material-UI 7.1 (componentes UI)
- Axios 1.8 (cliente HTTP)
- jwt-decode (decodificación de tokens)
- React Select (selectores avanzados)
- Vitest 3.2 (testing framework)

**Desarrollo:**
- pytest + pytest-django (testing backend)
- black + flake8 + isort (code quality Python)
- oxlint (linting JavaScript/React)
- coverage + codecov (análisis de cobertura)

### 🗃️ Estructura de Base de Datos

**Relaciones principales:**

```
OrgProfile (1) ──── (*) Fuente
                    │
                    ├── RepositorioSistema
                    ├── SistemaInformacion ──── (*) RepositorioSistema
                    ├── Control
                    ├── ProcesoNegocio ──── (*) SistemaInformacion
                    ├── Stakeholder ──── (*) ProcesoNegocio
                    └── Departamento ──── (*) Stakeholder, ProcesoNegocio

OrgProfile (1) ──── (*) Person ──── (1) Stakeholder
OrgProfile (1) ──── (*) Grupo
OrgProfile (1) ──── (*) DataProblem ──── (1) Stakeholder
                                    │
                                    ├── (1) Fuente (identificación)
                                    ├── (1) Fuente (confirmación)
                                    ├── (1) TecnicaIdentificacion (identificación)
                                    ├── (1) TecnicaIdentificacion (confirmación)
                                    ├── (1) Grupo
                                    ├── (*) Departamento
                                    └── (*) ProcesoNegocio

DataProblem (1) ──── (1) AnalisisDataProblem ──── (*) HerramientadeAnalisis
                                              │
                                              ├── (*) DataStage
                                              └── (*) DataQuality

DataProblem (1) ──── (*) EvaluacionDataProblem ──── (1) Person

ClasificacionResult ──── (*) DataProblem
                    │
                    ├── (1) OrgProfile
                    └── (*) Stakeholder (roles evaluadores)
```

**Campos clave:**
- Todos los modelos relacionados con organización tienen FK a `OrgProfile`
- Herencia: `Fuente` es clase base para todos los tipos de fuentes
- `DataProblem` es el modelo central que conecta todo el flujo
- `ClasificacionResult` almacena matriz y resultados en JSONField

## 🛠️ Desarrollo Local

### Prerrequisitos

- **Python 3.11 o 3.12**
- **Node.js 18.x o 20.x**
- **pip** (gestor de paquetes de Python)
- **PostgreSQL 12+** (opcional para desarrollo, obligatorio para producción)

### Configuración del Backend

1. **Crear y activar el entorno virtual:**
   ```bash
   # Crear entorno virtual
   python -m venv venv
   
   # Activar entorno virtual
   # En Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # En Windows CMD:
   venv\Scripts\activate.bat
   # En Linux/Mac:
   source venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   # Dependencias de producción
   pip install -r requirements.txt
   
   # Dependencias de desarrollo (opcional)
   pip install -r requirements-dev.txt
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en el directorio `backend/` (junto a `manage.py`):
   ```env
   # Configuración básica
   DEBUG=True
   SECRET_KEY=django-insecure-tu-secret-key-de-desarrollo
   
   # Base de datos (SQLite para desarrollo)
   DATABASE_URL=sqlite:///db.sqlite3
   
   # O para PostgreSQL:
   # DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/dataproptool
   
   # JWT Token (opcional, usa valores por defecto si no se especifica)
   JWT_ACCESS_TOKEN_LIFETIME=30  # minutos
   JWT_REFRESH_TOKEN_LIFETIME=1440  # minutos (1 día)
   
   # CORS (para desarrollo local)
   CORS_ALLOW_ALL_ORIGINS=True
   CORS_ALLOW_CREDENTIALS=True
   ```

4. **Ejecutar migraciones:**
   ```bash
   cd backend
   python manage.py migrate
   ```

5. **Crear superusuario:**
   ```bash
   python manage.py createsuperuser
   ```
   Sigue las instrucciones para crear un usuario administrador.

6. **Iniciar servidor de desarrollo:**
   ```bash
   python manage.py runserver
   ```
   El servidor estará disponible en `http://localhost:8000/`

### Configuración del Frontend

1. **Navegar al directorio frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional):**
   Crea un archivo `.env` en el directorio `frontend/`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_APP_ENV=development
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173/`

### 🔄 Levantar el proyecto completo

**Opción 1: Dos terminales separadas**
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Opción 2: Docker Compose (próximamente)**
```bash
docker-compose up
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

Para ejecutar tests con cobertura (requiere `requirements-dev.txt`):
```bash
cd backend
pip install -r ../requirements-dev.txt
pytest --cov=api --cov-report=html
# O con coverage:
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
cd frontend

# Ejecutar tests una vez
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests con interfaz gráfica
npm run test:ui

# CI completo (lint + test + build)
npm run test:ci
```

## 🔧 Herramientas de Desarrollo

### Code Quality

- **Backend**: 
  - `pytest` para testing (requiere `requirements-dev.txt`)
  - `black` para formateo de código
  - `flake8` para linting
  - `isort` para ordenar imports
  - `bandit` para análisis de seguridad
  - Configurado en `pyproject.toml`

- **Frontend**:
  - `oxlint` para linting rápido
  - `vitest` para testing
  - Configuración de Vite para builds optimizados
  - Configurado en `oxlintrc.json`

### Dependencias de desarrollo

Para instalar herramientas de desarrollo:
```bash
pip install -r requirements-dev.txt
```

Esto incluye: pytest, black, flake8, isort, bandit, coverage, y más.

### Comandos útiles

```bash
# Backend - Formatear código Python (requiere requirements-dev.txt)
black backend/

# Backend - Linting Python
flake8 backend/

# Backend - Ordenar imports
isort backend/

# Backend - Análisis de seguridad
bandit -r backend/

# Frontend - Linting
cd frontend
npm run lint

# Frontend - Fix automático de lint
npm run lint:fix

# Frontend - Build de producción
npm run build
```

## 🚀 CI/CD Pipeline

El proyecto utiliza GitHub Actions para automatización completa:

### Workflows Configurados

**Backend Testing & Deployment:**
- ✅ Tests automatizados en Python 3.11 y 3.12
- ✅ Matrix testing con PostgreSQL y SQLite
- ✅ Ejecución de migraciones
- ✅ Análisis de cobertura con Codecov
- ✅ Security audit con `safety` y `pip-audit`
- ✅ Deploy automático a Render.com

**Frontend Testing & Deployment:**
- ✅ Tests con Vitest en Node.js 18.x y 20.x
- ✅ Linting con oxlint
- ✅ Build optimizado con Vite
- ✅ Security audit con `npm audit`
- ✅ Deploy automático a GitHub Pages

**Integration Tests:**
- ✅ Tests de integración frontend-backend
- ✅ Validación de comunicación API
- ✅ Health checks automatizados

### Estrategia de Branches

- `main/master` → Producción (deploy automático)
- `develop` → Staging/Development
- `feature/*` → Nuevas funcionalidades (tests + validación)
- `fix/*` → Correcciones de bugs
- `hotfix/*` → Correcciones urgentes en producción

### 🌐 Arquitectura de Despliegue

**Arquitectura Híbrida:**

```
┌─────────────────────────────────────────────────────┐
│     FRONTEND                    BACKEND              │
│  (GitHub Pages)              (Render.com)           │
│                                                      │
│  React + Vite      ←────→    Django REST API        │
│  Static files      HTTPS      PostgreSQL DB         │
│  CDN Global        JWT Auth   Gunicorn Server       │
│                                                      │
│  URL: gh.io/DataProPTool      dataproptool-backend  │
│                               .onrender.com          │
└─────────────────────────────────────────────────────┘
```

**Ventajas:**
- Frontend estático → Carga rápida + CDN global
- Backend escalable según demanda
- Costos optimizados (frontend gratis en GitHub Pages)
- Deploy independiente de cada componente
- Fácil debugging y rollback

**Configuración de Producción:**
- Backend: `backend/backend/production_settings.py`
- Frontend: Variables VITE en GitHub Actions
- CORS configurado para dominios específicos
- HTTPS obligatorio
- Whitenoise para servir archivos estáticos

Para más detalles, ver [DEPLOYMENT.md](DEPLOYMENT.md).

## 📝 API Documentation

La API REST está disponible en:
- **Desarrollo**: `http://localhost:8000/api/`
- **Producción**: `https://dataproptool-backend.onrender.com/api/`
- **Admin Panel**: `http://localhost:8000/admin/` (Django Admin)
- **Health Check**: `http://localhost:8000/api/health/`

### Autenticación JWT

1. **Obtener token:**
   ```bash
   curl -X POST http://localhost:8000/api/token/ \
     -H "Content-Type: application/json" \
     -d '{"username": "tu_usuario", "password": "tu_contraseña"}'
   ```

2. **Usar el token en requests:**
   ```bash
   curl http://localhost:8000/api/dataproblem/ \
     -H "Authorization: Bearer <tu-access-token>"
   ```

### Endpoints principales

#### Gestión de Fuentes de Datos
- `GET /api/repositorios/` - Repositorios de sistemas
- `GET /api/sistemas/` - Sistemas de información
- `GET /api/controles/` - Controles
- `GET /api/procesos/` - Procesos de negocio
- `GET /api/fuentes/` - Todas las fuentes

#### Gestión Organizacional
- `GET /api/stakeholders/` - Stakeholders/Roles
- `GET /api/departamentos/` - Departamentos
- `GET /api/personas/` - Personas de la organización
- `GET /api/grupos/` - Grupos de data problems

#### Data Problems
- `GET /api/dataproblem/` - Listar/crear problemas de datos
- `GET /api/dataproblem/{id}/` - Detalle de un problema
- `POST /api/dataproblem/` - Crear nuevo problema
- `PUT /api/dataproblem/{id}/` - Actualizar problema
- `DELETE /api/dataproblem/{id}/` - Eliminar problema

#### Análisis y Evaluación
- `GET /api/analisisdataproblem/` - Análisis de data problems
- `GET /api/evaluaciondataproblem/` - Evaluaciones
- `GET /api/clasificacion/` - Clasificaciones y priorizaciones
- `GET /api/herramientas/` - Herramientas de análisis
- `GET /api/tecnicas/` - Técnicas de identificación
- `GET /api/datastages/` - Etapas de datos
- `GET /api/dataquality/` - Dimensiones de calidad

#### Administración
- `GET /api/usuarios/` - Gestión de usuarios
- `GET /api/health/` - Health check del backend

> **Nota**: Todos los endpoints (excepto `/api/health/`) requieren autenticación JWT.

## 🤝 Contribución

### Flujo de trabajo

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución

#### Código
- **Backend**: Sigue PEP 8, usa `black` para formateo
- **Frontend**: Usa `oxlint` para verificar código
- Escribe código limpio y mantenible
- Comenta código complejo cuando sea necesario

#### Tests
- Agrega tests para nuevas funcionalidades
- Asegúrate de que todos los tests pasen antes del PR
- Mantén cobertura de código > 80%

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm run test:ci
```

#### Commits
Usa mensajes de commit descriptivos siguiendo convenciones:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan lógica)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplos:
```
feat: añadir endpoint para exportar data problems
fix: corregir cálculo de promedio en evaluaciones
docs: actualizar README con nuevos endpoints
```

#### Pull Requests
- Describe claramente los cambios realizados
- Referencia issues relacionados (#123)
- Asegúrate de que el CI pipeline pase
- Solicita revisión de código
- Responde a comentarios de revisión

### 📋 Modelos de Datos Principales

El proyecto gestiona los siguientes modelos principales:

**Organizacionales:**
- `OrgProfile` - Perfil de organización
- `Departamento` - Departamentos organizacionales
- `Stakeholder` - Roles de stakeholders
- `Person` - Personas con roles asignados
- `Grupo` - Agrupación de data problems

**Fuentes de Datos:**
- `Fuente` - Clase base para fuentes (abstract)
- `RepositorioSistema` - Repositorios de código
- `SistemaInformacion` - Sistemas informáticos
- `Control` - Controles de calidad/seguridad
- `ProcesoNegocio` - Procesos de negocio

**Gestión de Data Problems:**
- `DataProblem` - Problema de calidad de datos
- `TecnicaIdentificacion` - Técnicas para identificar problemas
- `HerramientadeAnalisis` - Herramientas de análisis
- `DataStage` - Etapas del ciclo de vida de datos
- `DataQuality` - Dimensiones de calidad de datos

**Análisis y Evaluación:**
- `AnalisisDataProblem` - Análisis de un data problem
- `EvaluacionDataProblem` - Evaluación por persona
- `ClasificacionResult` - Resultado de clasificación/priorización

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes algún problema o pregunta:

1. Revisa los [Issues](https://github.com/agustinferrazzano/DataProPTool/issues) existentes
2. Crea un nuevo issue con detalles del problema
3. Proporciona logs y pasos para reproducir el error

### 🔧 Troubleshooting

#### Error: "No module named 'corsheaders'"
```bash
pip install django-cors-headers
```

#### Error: "Unable to connect to database"
Revisa tu `DATABASE_URL` en el archivo `.env`. Para desarrollo usa SQLite:
```env
DATABASE_URL=sqlite:///db.sqlite3
```

#### Error: Frontend no conecta con Backend
1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Revisa la configuración CORS en `backend/backend/settings.py`
3. Asegúrate de que `VITE_API_URL` apunte a `http://localhost:8000`

#### Error: "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

#### Error: "jwt_decode is not defined"
Asegúrate de importar correctamente en el frontend:
```javascript
import { jwtDecode } from 'jwt-decode';
```

#### Migraciones desactualizadas
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 📊 URLs de Producción

- **Frontend**: https://agustinferrazzano.github.io/DataProPTool/
- **Backend API**: https://dataproptool-backend.onrender.com/api/
- **Health Check**: https://dataproptool-backend.onrender.com/api/health/

## 🏆 Estado del Proyecto

- ✅ **MVP Completo**: Funcionalidad básica implementada
- 🔄 **En Desarrollo**: Mejoras continuas y nuevas características
- 🎯 **Próximas Características**: Ver [Roadmap](https://github.com/agustinferrazzano/DataProPTool/projects)

---

Desarrollado con ❤️ por el equipo DataProPTool