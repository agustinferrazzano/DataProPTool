"""
WSGI config for DataProPTool project - Render deployment.
"""

import os
import sys

# Add current directory and backend to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')
sys.path.insert(0, current_dir)
sys.path.insert(0, backend_dir)

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')

# Import Django WSGI directly
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()