"""
Django test settings for CI environment
Enhanced with comprehensive testing configuration
"""
import os
from .settings import *

# Test database
if 'DATABASE_URL' in os.environ:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(os.environ['DATABASE_URL'])
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Security settings for testing
SECRET_KEY = 'test-secret-key-only-for-testing'
DEBUG = False
ALLOWED_HOSTS = ['testserver', 'localhost', '127.0.0.1']

# Disable logging during tests
LOGGING_CONFIG = None

# Use fast password hasher for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Email backend for testing
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Disable CORS during testing
CORS_ALLOW_ALL_ORIGINS = True

# Cache configuration for testing
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Static files configuration for testing
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles_test')
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'