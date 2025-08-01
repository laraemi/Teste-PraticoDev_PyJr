import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from tasks.models import Task
from categories.models import Category

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def category(user):
    return Category.objects.create(
        name='Test Category',
        description='Test Description',
        user=user
    )


@pytest.fixture
def task(user, category):
    return Task.objects.create(
        title='Test Task',
        description='Test Description',
        user=user,
        category=category,
        priority='medium',
        status='pending'
    )


class TestTaskCRUD:
    def test_create_task(self, api_client, user, category):
        """Test creating a task."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-list-create')
        data = {
            'title': 'New Task',
            'description': 'New Description',
            'category_id': category.id,
            'priority': 'high',
            'status': 'pending'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.count() == 1
        assert Task.objects.get().title == 'New Task'
    
    def test_list_tasks(self, api_client, user, task):
        """Test listing tasks."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-list-create')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == task.title
    
    def test_get_task_detail(self, api_client, user, task):
        """Test getting task detail."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-detail', kwargs={'pk': task.pk})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == task.title
    
    def test_update_task(self, api_client, user, task):
        """Test updating a task."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-detail', kwargs={'pk': task.pk})
        data = {
            'title': 'Updated Task',
            'description': 'Updated Description'
        }
        response = api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert task.title == 'Updated Task'
    
    def test_delete_task(self, api_client, user, task):
        """Test deleting a task."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-detail', kwargs={'pk': task.pk})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Task.objects.count() == 0


class TestTaskToggle:
    def test_toggle_task_to_completed(self, api_client, user, task):
        """Test toggling task to completed."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-toggle', kwargs={'pk': task.pk})
        response = api_client.patch(url, {})
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert task.is_completed is True
        assert task.status == 'completed'
    
    def test_toggle_task_to_pending(self, api_client, user, task):
        """Test toggling task to pending."""
        task.status = 'completed'
        task.is_completed = True
        task.save()
        
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-toggle', kwargs={'pk': task.pk})
        response = api_client.patch(url, {})
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert task.is_completed is False
        assert task.status == 'pending'


class TestTaskFiltering:
    def test_filter_tasks_by_status(self, api_client, user, task):
        """Test filtering tasks by status."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-list-create')
        response = api_client.get(url, {'status': 'pending'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_search_tasks(self, api_client, user, task):
        """Test searching tasks."""
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-list-create')
        response = api_client.get(url, {'search': 'Test'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1


class TestTaskSharing:
    def test_share_task_with_user(self, api_client, user, task):
        """Test sharing a task with another user."""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        
        api_client.force_authenticate(user=user)
        url = reverse('tasks:task-detail', kwargs={'pk': task.pk})
        data = {
            'shared_with_ids': [other_user.id]
        }
        response = api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        task.refresh_from_db()
        assert other_user in task.shared_with.all()
        assert task.is_shared is True
    
    def test_shared_task_visible_to_shared_user(self, api_client, user, task):
        """Test that shared task is visible to shared user."""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        task.shared_with.add(other_user)
        
        api_client.force_authenticate(user=other_user)
        url = reverse('tasks:task-list-create')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == task.title 