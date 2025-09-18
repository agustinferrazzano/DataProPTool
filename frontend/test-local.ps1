# Scripts de desarrollo local para testing

# Script para ejecutar todos los tests
Write-Host "🧪 Ejecutando todos los tests del frontend..." -ForegroundColor Green
Set-Location frontend

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🔍 Ejecutando linting..." -ForegroundColor Yellow
npm run lint

Write-Host "🧪 Ejecutando tests unitarios..." -ForegroundColor Yellow
npm run test

Write-Host "📊 Generando coverage report..." -ForegroundColor Yellow
npm run test:coverage

Write-Host "🏗️ Verificando build..." -ForegroundColor Yellow
npm run build

Write-Host "✅ ¡Todos los tests completados!" -ForegroundColor Green
Write-Host "📊 Coverage report generado en ./coverage/index.html" -ForegroundColor Cyan