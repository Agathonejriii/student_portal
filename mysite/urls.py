from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def home(request):
    return HttpResponse("""
    <h1>Student Portal API</h1>
    <p>Welcome to Student Portal API</p>
    <ul>
        <li><a href="/admin/">Admin Panel</a></li>
        <li><a href="/api/">API</a></li>
        <li><a href="/api/token/">Get JWT Token</a></li>
    </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('students.urls')),
]