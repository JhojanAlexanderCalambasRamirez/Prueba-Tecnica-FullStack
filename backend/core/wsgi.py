import os
from django.core.wsgi import get_wsgi_application

# Indica qué configuración de Django debe usarse.
# En este caso, apunta al archivo settings.py de tu proyecto 'core'.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Crea la aplicación WSGI que será usada por el servidor.
# Es el punto de entrada para servidores compatibles con WSGI (Gunicorn, uWSGI, etc.).
application = get_wsgi_application()
