from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin for Task model."""
    
    list_display = ['title', 'user', 'category', 'priority', 'status', 'is_completed', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'is_completed', 'category', 'created_at', 'user']
    search_fields = ['title', 'description', 'user__username', 'user__email']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {'fields': ('title', 'description', 'user', 'category')}),
        ('Status e Prioridade', {'fields': ('priority', 'status', 'is_completed')}),
        ('Datas', {'fields': ('due_date', 'created_at', 'updated_at', 'completed_at')}),
        ('Compartilhamento', {'fields': ('shared_with', 'is_shared')}),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'completed_at', 'is_shared']
    filter_horizontal = ['shared_with'] 