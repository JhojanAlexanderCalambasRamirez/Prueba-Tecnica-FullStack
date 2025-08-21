# Importamos la clase base AppConfig, que permite configurar metadatos de la app
from django.apps import AppConfig


class HelpdeskConfig(AppConfig):
    # Configuración principal de la aplicación 'helpdesk'.
    # Django crea automáticamente un objeto de configuración para cada aplicación.
    # Aquí definimos cómo se comporta la app en el proyecto.

    # Tipo de clave primaria por defecto para los modelos
    # Usamos BigAutoField (entero grande autoincremental), recomendado en Django 3.2+
    default_auto_field = "django.db.models.BigAutoField"

    # Nombre de la app: debe coincidir con el nombre de la carpeta de la app
    name = "helpdesk"
