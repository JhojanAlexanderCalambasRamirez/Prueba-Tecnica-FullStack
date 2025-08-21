INSTALLED_APPS = [

    # Apps principales de Django (core framework)
    "django.contrib.admin",          # Panel de administración
    "django.contrib.auth",           # Sistema de autenticación de usuarios y permisos
    "django.contrib.contenttypes",   # Manejo de tipos de contenido (para permisos genéricos)
    "django.contrib.sessions",       # Soporte para sesiones en la DB
    "django.contrib.messages",       # Sistema de mensajes temporales (ej: notificaciones flash)
    "django.contrib.staticfiles",    # Gestión de archivos estáticos (CSS, JS, imágenes)

    # Aplicaciones de terceros (instaladas con pip o pip3)
    "corsheaders",                   # Permitir CORS (necesario para conectar React con Django API)
    "rest_framework",                # Django REST Framework (API robusta y serialización)
    "django_filters",                # Soporte de filtros avanzados en queries de la API

    # App local de tu proyecto
    "helpdesk",                      # Nuestra app principal para tickets y comentarios
]
