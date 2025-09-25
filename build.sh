#!/usr/bin/env bash
# Build script for Render

set -o errexit  # exit on error

echo "🔧 Installing dependencies..."
cd backend
pip install -r ../requirements.txt

echo "🗄️ Running migrations..."
python manage.py migrate

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Build completed successfully!"