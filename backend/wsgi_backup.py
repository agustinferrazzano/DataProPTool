"""
Backup WSGI - Redirects to root wsgi.py
"""

import os
import sys

# Add parent directory to path to find root wsgi.py
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

print("🔄 BACKUP WSGI: Redirecting to root wsgi.py")

# Import from root wsgi.py
from wsgi import application

print("✅ BACKUP WSGI: Successfully imported application")