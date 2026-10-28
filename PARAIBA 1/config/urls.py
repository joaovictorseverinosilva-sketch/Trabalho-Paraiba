from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
import os

static_root = settings.STATICFILES_DIRS[0] if getattr(settings, 'STATICFILES_DIRS', None) else os.path.join(settings.BASE_DIR, 'extrator', 'static')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('extrator.urls')),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': static_root}),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
