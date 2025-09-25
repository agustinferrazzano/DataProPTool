"""
WSGI config for DataProPTool project - Render deployment.
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')

application = get_wsgi_application()