from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task
from categories.serializers import CategorySerializer

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user serializer for task sharing."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""
    
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    shared_with = UserMinimalSerializer(many=True, read_only=True)
    shared_with_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'priority', 'status', 'is_completed', 'due_date', 'created_at',
            'updated_at', 'completed_at', 'shared_with', 'shared_with_ids',
            'is_shared', 'is_overdue'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at', 'is_shared']
    
    def create(self, validated_data):
        shared_with_ids = validated_data.pop('shared_with_ids', [])
        category_id = validated_data.pop('category_id', None)
        
        # Definir o usuário atual como criador
        validated_data['user'] = self.context['request'].user
        
        # Definir categoria se fornecida
        if category_id:
            from categories.models import Category
            try:
                category = Category.objects.get(id=category_id, user=self.context['request'].user)
                validated_data['category'] = category
            except Category.DoesNotExist:
                raise serializers.ValidationError("Categoria não encontrada.")
        
        task = Task.objects.create(**validated_data)
        
        # Adicionar usuários compartilhados
        if shared_with_ids:
            shared_users = User.objects.filter(id__in=shared_with_ids)
            task.shared_with.set(shared_users)
        
        return task
    
    def update(self, instance, validated_data):
        shared_with_ids = validated_data.pop('shared_with_ids', None)
        category_id = validated_data.pop('category_id', None)
        
        # Atualizar categoria se fornecida
        if category_id is not None:
            if category_id:
                from categories.models import Category
                try:
                    category = Category.objects.get(id=category_id, user=self.context['request'].user)
                    validated_data['category'] = category
                except Category.DoesNotExist:
                    raise serializers.ValidationError("Categoria não encontrada.")
            else:
                validated_data['category'] = None
        
        # Atualizar usuários compartilhados se fornecido
        if shared_with_ids is not None:
            shared_users = User.objects.filter(id__in=shared_with_ids)
            instance.shared_with.set(shared_users)
        
        return super().update(instance, validated_data)


class TaskToggleSerializer(serializers.ModelSerializer):
    """Serializer for toggling task completion status."""
    
    class Meta:
        model = Task
        fields = ['id', 'is_completed', 'status', 'completed_at']
        read_only_fields = ['id', 'completed_at']
    
    def update(self, instance, validated_data):
        # Alternar status de conclusão
        if instance.is_completed:
            instance.status = 'pending'
        else:
            instance.status = 'completed'
        
        return super().update(instance, validated_data) 