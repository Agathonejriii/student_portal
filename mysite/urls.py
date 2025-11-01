"""
mysite URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Simple homepage - NO REDIRECTS
def home(request):
    return HttpResponse("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Student Portal API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            ul { list-style: none; padding: 0; }
            li { margin: 15px 0; }
            a { display: block; padding: 12px; background: #007bff; color: white; 
                 text-decoration: none; border-radius: 5px; text-align: center; }
            a:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h1>Student Portal API</h1>
        <p>✅ Deployment Successful!</p>
        <ul>
            <li><a href="/admin/">Admin Panel</a></li>
            <li><a href="/api/">API</a></li>
            <li><a href="/api/token/">Get JWT Token</a></li>
            <li><a href="/api/accounts/">Accounts API</a></li>
            <li><a href="/api/students/">Students API</a></li>
        </ul>
    </body>
    </html>
    """, content_type="text/html")

urlpatterns = [
    path('', home, name='home'),  # Direct response, NO redirect
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('students.urls')),
]

# NO CATCH-ALL PATTERNS!
# NO TemplateView AS_VIEW!
# NO REDIRECTS!