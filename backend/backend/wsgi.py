"""
WSGI config for backend project - REDIRECTED TO ROOT

This file now redirects to the root wsgi.py for Render deployment.
"""

import os
import sys

print("🔄 BACKEND WSGI: Redirecting to root wsgi.py")

# Add root directory to path
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, root_dir)

print(f"🔍 Root directory: {root_dir}")

try:
    # Import from root wsgi.py
    from wsgi import application
    print("✅ BACKEND WSGI: Successfully imported application from root")
except Exception as e:
    print(f"❌ BACKEND WSGI: Error importing from root: {e}")
    # Fallback to local configuration
    print("🔄 BACKEND WSGI: Using fallback configuration")
    from django.core.wsgi import get_wsgi_application
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')
    application = get_wsgi_application()
