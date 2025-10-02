"""
WSGI config for DataProPTool project - Render deployment.
"""

import os
import sys

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.production_settings')

# Import the actual WSGI application from backend
from backend.wsgi import application