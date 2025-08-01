import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_data():
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    }


@pytest.fixture
def user(user_data):
    return User.objects.create_user(
        username=user_data['username'],
        email=user_data['email'],
        password=user_data['password'],
        first_name=user_data['first_name'],
        last_name=user_data['last_name']
    )


class TestUserRegistration:
    def test_user_registration_success(self, api_client, user_data):
        """Test successful user registration."""
        url = reverse('users:register')
        response = api_client.post(url, user_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.count() == 1
        assert User.objects.get().email == user_data['email']
    
    def test_user_registration_password_mismatch(self, api_client, user_data):
        """Test user registration with password mismatch."""
        user_data['password_confirm'] = 'wrongpass'
        url = reverse('users:register')
        response = api_client.post(url, user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data
    
    def test_user_registration_duplicate_email(self, api_client, user_data, user):
        """Test user registration with duplicate email."""
        url = reverse('users:register')
        response = api_client.post(url, user_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data


class TestUserLogin:
    def test_user_login_success(self, api_client, user):
        """Test successful user login."""
        url = reverse('users:login')
        data = {
            'email': user.email,
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert 'user' in response.data
    
    def test_user_login_invalid_credentials(self, api_client):
        """Test user login with invalid credentials."""
        url = reverse('users:login')
        data = {
            'email': 'wrong@example.com',
            'password': 'wrongpass'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'error' in response.data


class TestUserProfile:
    def test_get_user_profile(self, api_client, user):
        """Test getting user profile."""
        api_client.force_authenticate(user=user)
        url = reverse('users:profile')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email
    
    def test_update_user_profile(self, api_client, user):
        """Test updating user profile."""
        api_client.force_authenticate(user=user)
        url = reverse('users:profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name'
        }
        response = api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.first_name == 'Updated'
        assert user.last_name == 'Name' 