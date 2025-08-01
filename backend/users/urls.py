from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.UserCreateView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
] 