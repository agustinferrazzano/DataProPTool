"""
WSGI config for DataProPTool project - Render deployment.
"""

import os
import sys

print("🔍 WSGI DEBUG: Starting wsgi.py")
print(f"🔍 Current working directory: {os.getcwd()}")
print(f"🔍 __file__ location: {__file__}")

# Add current directory and backend to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')

print(f"🔍 Adding to sys.path: {current_dir}")
print(f"🔍 Adding to sys.path: {backend_dir}")

sys.path.insert(0, current_dir)
sys.path.insert(0, backend_dir)

# Show the path for debugging
print(f"🔍 Current sys.path: {sys.path[:5]}")  # Show first 5 paths

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')
print(f"🔍 DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

# List files in current directory
print(f"🔍 Files in current dir: {os.listdir('.')}")
if os.path.exists('backend'):
    print(f"🔍 Files in backend dir: {os.listdir('backend')}")

try:
    # Import Django WSGI directly
    from django.core.wsgi import get_wsgi_application
    print("✅ Successfully imported get_wsgi_application")
    application = get_wsgi_application()
    print("✅ Successfully created WSGI application")
except Exception as e:
    print(f"❌ Error creating WSGI application: {e}")
    raise