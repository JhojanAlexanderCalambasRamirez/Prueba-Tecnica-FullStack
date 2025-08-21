import os
from pathlib import Path

# BASE_DIR apunta a la carpeta raíz del proyecto (donde está manage.py)
BASE_DIR = Path(__file__).resolve().parent.parent

# Clave secreta (para firmar cookies, tokens, etc.)
# En producción se debe cargar desde variables de entorno.
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret-key")

# DEBUG: solo debe estar en True durante desarrollo.
# En producción usar siempre False.
DEBUG = os.getenv("DJANGO_DEBUG", "1") == "1"

# Hosts permitidos (por ahora todos para facilidad de desarrollo).
# En producción debe incluir solo el dominio o IP del servidor.
ALLOWED_HOSTS = ["*"]

# Aplicaciones instaladas
INSTALLED_APPS = [
    # Django apps base
    "django.contrib.admin",       # Panel de administración
    "django.contrib.auth",        # Sistema de usuarios y permisos
    "django.contrib.contenttypes",# Manejo de tipos de contenido
    "django.contrib.sessions",    # Sesiones en base de datos
    "django.contrib.messages",    # Mensajes temporales (flash)
    "django.contrib.staticfiles", # Manejo de archivos estáticos

    # Apps de terceros
    "corsheaders",                # Permite llamadas cross-origin (necesario para React)
    "rest_framework",             # Django REST Framework
    "django_filters",             # Filtros para API (ej: ?status=...&priority=...)

    # App local
    "helpdesk",                   # Nuestra app principal de tickets
]

# Configuración de Django REST Framework
REST_FRAMEWORK = {
    # Permite filtrar con django-filter
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    # Paginación por defecto
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

# Middlewares: se ejecutan en cada request en orden
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",          # Habilita CORS
    "django.middleware.security.SecurityMiddleware",  # Seguridad básica
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",      
    "django.middleware.csrf.CsrfViewMiddleware",      # Protección CSRF
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# CORS: permitir llamadas desde cualquier origen (solo desarrollo)
CORS_ALLOW_ALL_ORIGINS = True

# Enrutamiento principal del proyecto
ROOT_URLCONF = "core.urls"

# Configuración de templates (no se usan mucho en API, pero quedan listos)
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],  # Aquí podrías agregar directorios personalizados de templates
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Configuración WSGI (para despliegue en servidores tradicionales)
WSGI_APPLICATION = "core.wsgi.application"

# Base de datos (por ahora SQLite, suficiente para pruebas y desarrollo)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",  # Se guarda como archivo en la carpeta del proyecto "backend\db.sqlite3"
    }
}

# Validadores de contraseñas (desactivados para simplificar pruebas)
AUTH_PASSWORD_VALIDATORS = []

# Configuración de localización
LANGUAGE_CODE = "es-co"          # Idioma por defecto: Español (Colombia)
TIME_ZONE = "America/Bogota"     # Zona horaria: Colombia :D
USE_I18N = True                  # Habilitar internacionalización
USE_TZ = True                    # Usar zonas horarias con aware datetime

# Archivos estáticos (CSS, JS, imágenes)
STATIC_URL = "/static/"

# lave para IDs automáticos en los modelos
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
