from django.urls import path
from . import views

app_name = 'tasks'

urlpatterns = [
    path('', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('<int:pk>/toggle/', views.toggle_task_status, name='task-toggle'),
    path('my/', views.MyTasksView.as_view(), name='my-tasks'),
    path('shared/', views.SharedTasksView.as_view(), name='shared-tasks'),
] 