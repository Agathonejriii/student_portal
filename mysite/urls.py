"""
mysite URL Configuration - Serving React Frontend + Django Backend
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from django.conf.urls.static import static
from django.views.static import serve as static_serve
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Simple homepage view
def home(request):
    return HttpResponse("""
    <h1>Student Portal API</h1>
    <p>Welcome to the Student Portal API</p>
    <ul>
        <li><a href="/admin/">Admin Panel</a></li>
        <li><a href="/api/">API</a></li>
        <li><a href="/api/token/">Get JWT Token</a></li>
        <li><a href="/api/accounts/">Accounts API</a></li>
        <li><a href="/api/students/">Students API</a></li>
    </ul>
    """)

urlpatterns = [
    path('', home, name='home'),  # Simple homepage
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('students.urls')),
]

# Serve static files
urlpatterns += [
    path('static/<path:path>', serve, {'document_root': settings.STATIC_ROOT}),
]