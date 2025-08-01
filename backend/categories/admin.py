from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model."""
    
    list_display = ['name', 'user', 'color', 'created_at']
    list_filter = ['created_at', 'user']
    search_fields = ['name', 'description', 'user__username', 'user__email']
    ordering = ['name']
    
    fieldsets = (
        (None, {'fields': ('name', 'description', 'color', 'user')}),
        ('Datas', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ['created_at', 'updated_at'] 