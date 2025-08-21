import os
from django.core.asgi import get_asgi_application

# Configura la variable de entorno para que Django sepa
# dónde encontrar el archivo de configuración principal.
# (en este caso "core.settings")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Crea la aplicación ASGI que servirá como punto de entrada
# cuando se despliegue el proyecto en un servidor asíncrono.
# Ejemplo: uvicorn backend.core.asgi:application
application = get_asgi_application()
