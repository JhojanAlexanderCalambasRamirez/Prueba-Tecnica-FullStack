from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

# Health check: pequeña vista para comprobar que el servidor está corriendo
# Devuelve {"status": "ok"} al hacer GET en /health/
def health(_):
    return JsonResponse({"status": "ok"})

# Rutas principales del proyecto
urlpatterns = [
    # Panel de administración de Django
    path("admin/", admin.site.urls),

    # Ruta de verificación rápida (health check)
    # Útil para pruebas en despliegues o monitoreo.
    path("health/", health),

    # API principal
    # Todo lo que comience con /api/ se delega al archivo helpdesk/urls.py
    path("api/", include("helpdesk.urls")),
]
