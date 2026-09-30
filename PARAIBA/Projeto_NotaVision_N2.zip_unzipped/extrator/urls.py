from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('login.html', views.login_page, name='login_html'),
    path('sistema/', views.index, name='index'),
    path('extrair/', views.extrair_dados, name='extrair_dados'),
    path('api/extract', views.extrair_dados, name='api_extract_v2'),
    path('api/status', views.api_status, name='api_status'),
]
