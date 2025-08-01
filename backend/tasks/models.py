from django.db import models
from django.contrib.auth import get_user_model
from categories.models import Category

User = get_user_model()


class Task(models.Model):
    """Model for tasks."""
    
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Progresso'),
        ('completed', 'Concluída'),
        ('cancelled', 'Cancelada'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    is_completed = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Campos para compartilhamento
    shared_with = models.ManyToManyField(User, related_name='shared_tasks', blank=True)
    is_shared = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Atualizar is_completed baseado no status
        if self.status == 'completed':
            self.is_completed = True
            if not self.completed_at:
                from django.utils import timezone
                self.completed_at = timezone.now()
        else:
            self.is_completed = False
            self.completed_at = None
        
        # Atualizar is_shared baseado em shared_with
        self.is_shared = self.shared_with.exists()
        
        super().save(*args, **kwargs)
    
    @property
    def is_overdue(self):
        """Check if task is overdue."""
        if self.due_date and not self.is_completed:
            from django.utils import timezone
            return timezone.now() > self.due_date
        return False 