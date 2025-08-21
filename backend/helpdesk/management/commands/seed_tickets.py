# Importamos la clase base para crear comandos personalizados en Django.
# Estos comandos se ejecutan con: python manage.py <nombre_comando>
from django.core.management.base import BaseCommand


# Definimos la clase que representa nuestro comando personalizado.
# Django detecta automáticamente la clase `Command` y la asocia con el nombre del archivo.
class Command(BaseCommand):
    # Texto de ayuda que se muestra al ejecutar: python manage.py help <nombre_comando>
    help = "Crea datos de ejemplo para tickets (implementa según tus modelos)."

    # Método principal que se ejecuta cuando corres el comando.
    # Aquí deberías escribir la lógica que crea registros de ejemplo en la base de datos.
    def handle(self, *args, **options):
        # Mensaje de salida en consola. Por ahora es solo un placeholder.
        # self.style.SUCCESS agrega color verde para indicar éxito.
        self.stdout.write(self.style.SUCCESS(
            "Seed de tickets: implementa según tus modelos."
        ))
