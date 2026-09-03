from django.urls import path

from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, MeView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
]