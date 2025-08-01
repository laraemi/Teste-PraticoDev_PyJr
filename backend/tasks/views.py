from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Task
from .serializers import TaskSerializer, TaskToggleSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """View for listing and creating tasks with filtering and search."""
    
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'is_completed', 'category', 'is_shared']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Retornar tarefas do usuário e tarefas compartilhadas com ele
        return Task.objects.filter(
            Q(user=user) | Q(shared_with=user)
        ).distinct()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating and deleting tasks."""
    
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Retornar tarefas do usuário e tarefas compartilhadas com ele
        return Task.objects.filter(
            Q(user=user) | Q(shared_with=user)
        ).distinct()


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_task_status(request, pk):
    """Toggle task completion status."""
    
    try:
        user = request.user
        task = Task.objects.get(
            Q(user=user) | Q(shared_with=user),
            pk=pk
        )
    except Task.DoesNotExist:
        return Response(
            {'error': 'Tarefa não encontrada.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = TaskToggleSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTasksView(generics.ListAPIView):
    """View for listing only user's own tasks."""
    
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'is_completed', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class SharedTasksView(generics.ListAPIView):
    """View for listing tasks shared with the user."""
    
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'is_completed', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Task.objects.filter(shared_with=self.request.user) 