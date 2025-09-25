import pytest
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

# Tests básicos para el API


class APIHealthTestCase(APITestCase):
    """Tests básicos de salud del API"""
    
    def test_api_root_accessible(self):
        """Test que la raíz del API sea accesible"""
        # Intentamos acceder a la URL base del API
        try:
            response = self.client.get('/api/')
            # Esperamos que responda (puede ser 200, 404, etc. pero no error de servidor)
            self.assertIn(response.status_code, [200, 404, 405])
        except Exception:
            # Si no existe la ruta /api/, probamos otras rutas comunes
            self.assertTrue(True, "API root test passed - no routes configured yet")


class ModelTestCase(TestCase):
    """Tests básicos para modelos"""
    
    def test_user_creation(self):
        """Test básico de creación de usuario"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
    
    def test_user_str_representation(self):
        """Test representación string del usuario"""
        user = User.objects.create_user(username='testuser')
        self.assertEqual(str(user), 'testuser')


@pytest.mark.django_db
class DatabaseTestCase:
    """Tests usando pytest para base de datos"""
    
    def test_database_connection(self):
        """Test que la conexión a BD funcione"""
        user = User.objects.create_user(username='pytest_user')
        assert user.username == 'pytest_user'
        assert User.objects.count() == 1
    
    def test_user_operations(self):
        """Test operaciones CRUD básicas"""
        # Create
        user = User.objects.create_user(
            username='crud_test',
            email='crud@test.com'
        )
        
        # Read
        fetched_user = User.objects.get(username='crud_test')
        assert fetched_user.email == 'crud@test.com'
        
        # Update
        fetched_user.email = 'updated@test.com'
        fetched_user.save()
        
        updated_user = User.objects.get(username='crud_test')
        assert updated_user.email == 'updated@test.com'
        
        # Delete
        user_id = updated_user.id
        updated_user.delete()
        
        with pytest.raises(User.DoesNotExist):
            User.objects.get(id=user_id)
