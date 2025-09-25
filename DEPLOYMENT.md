# 🏗️ Arquitectura de Despliegue - DataProPTool

## 🌐 **Arquitectura Híbrida (Opción A)**

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA HÍBRIDA                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 FRONTEND (GitHub Pages)          🔧 BACKEND (Render)   │
│  ├─ React + Vite                     ├─ Django REST API    │
│  ├─ Material-UI                      ├─ PostgreSQL DB      │
│  ├─ Static hosting                   ├─ Gunicorn server    │
│  └─ https://sh1zukku.github.io/      └─ dataproptool-      │
│     DataProPTool/                       backend.onrender.com│
│                                                             │
│                    🔄 COMUNICACIÓN                          │
│              Frontend ←→ Backend API                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 **URLs de la Aplicación**

### **Producción**
- **🌐 Aplicación Web**: https://sh1zukku.github.io/DataProPTool/
- **🔧 API Backend**: https://dataproptool-backend.onrender.com
- **❤️ Health Check**: https://dataproptool-backend.onrender.com/api/health/

### **Desarrollo Local**
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:8000 (Django dev server)

## ⚙️ **Variables de Entorno**

### **Frontend (GitHub Pages)**
```env
VITE_API_URL=https://dataproptool-backend.onrender.com
VITE_APP_ENV=production
```

### **Backend (Render.com)**
```env
DJANGO_SETTINGS_MODULE=backend.production_settings
DATABASE_URL=[Auto-generado por Render PostgreSQL]
DEBUG=False
```

## 🔄 **CI/CD Pipeline**

### **Frontend Pipeline** (`frontend-ci.yml`)
1. ✅ Tests (Vitest)
2. ✅ Linting (oxlint)  
3. ✅ Build (Vite)
4. ✅ Security audit (npm)
5. ✅ Deploy → GitHub Pages

### **Backend Pipeline** (`backend-ci.yml`)
1. ✅ Tests (pytest)
2. ✅ Database migrations (PostgreSQL)
3. ✅ Coverage analysis
4. ✅ Security audit (safety, pip-audit)

### **Integration Pipeline** (`fullstack-ci.yml`)
1. ✅ Full-stack integration tests
2. ✅ Backend + Frontend communication
3. ✅ Database + API validation

## 📊 **Ventajas de esta Arquitectura**

### ✅ **Rendimiento**
- Frontend estático → Carga ultra-rápida
- CDN global de GitHub → Baja latencia mundial
- Backend optimizado → Solo para API/datos

### ✅ **Escalabilidad**
- Frontend: Sin límites de tráfico (GitHub Pages)
- Backend: Escalable según demanda (Render)

### ✅ **Costo**
- Frontend: **Gratis** (GitHub Pages)
- Backend: **Gratis** hasta ciertos límites (Render)

### ✅ **Mantenimiento**
- Separación clara de responsabilidades
- Deploy independiente de cada componente
- Fácil debugging y monitoreo

## 🔒 **Seguridad**

### **CORS Configuration**
```python
CORS_ALLOWED_ORIGINS = [
    "https://sh1zukku.github.io",
]
CORS_ALLOW_CREDENTIALS = True
```

### **Django Security Headers**
```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

## 🛠️ **Troubleshooting**

### **Frontend no conecta con Backend**
1. Verificar que `VITE_API_URL` apunte a Render
2. Comprobar CORS en `production_settings.py`
3. Verificar que Render backend esté activo

### **Backend errors**
1. Revisar logs en Render Dashboard
2. Verificar DATABASE_URL en variables de entorno
3. Comprobar migraciones: `/api/health/`

## 📈 **Monitoreo**

### **Health Checks**
- **Frontend**: Automático via GitHub Pages
- **Backend**: `/api/health/` endpoint
- **Database**: Incluido en health check

### **Logs**
- **Frontend**: Browser DevTools
- **Backend**: Render Dashboard → Logs tab
- **CI/CD**: GitHub Actions logs