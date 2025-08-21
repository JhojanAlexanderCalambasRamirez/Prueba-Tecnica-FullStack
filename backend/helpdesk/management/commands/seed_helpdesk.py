# Comando de Django personalizado para generar datos de ejemplo
# Se ejecuta con: python manage.py seed_helpdesk
# Su objetivo es poblar la base de datos con tickets y comentarios iniciales
# que sirven para probar rápidamente el backend y el frontend.

from django.core.management.base import BaseCommand
from helpdesk.models import Ticket, Comment


class Command(BaseCommand):
    # Descripción del comando, visible al ejecutar: python manage.py help
    help = "Crea tickets y comentarios de ejemplo"

    def handle(self, *args, **kwargs):
        # Limpiamos datos previos para evitar duplicados
        Comment.objects.all().delete()
        Ticket.objects.all().delete()

        # Creamos un ticket de prioridad alta con estado inicial 'nuevo'
        t1 = Ticket.objects.create(
            title="No puedo acceder al sistema",
            description="Pantalla en blanco al iniciar sesión.",
            priority=Ticket.Priority.HIGH,   # Enumeración definida en el modelo
            reporter_name="Laura0",
            reporter_email="laura0@gmail.com",
        )

        # Ticket de prioridad media (sugerencia de mejora)
        t2 = Ticket.objects.create(
            title="Mejora: exportar reportes a CSV",
            description="Agregar botón de exportación en pantalla de reportes.",
            priority=Ticket.Priority.MEDIUM,
            reporter_name="Carlos0",
            reporter_email="carlos0@gmail.com",
        )

        # Ticket de prioridad baja, ya en estado 'en_proceso'
        t3 = Ticket.objects.create(
            title="Bug en reporte mensual",
            description="Valores inconsistentes en totales.",
            priority=Ticket.Priority.LOW,
            reporter_name="Ana",
            status=Ticket.Status.IN_PROGRESS,
        )

        # Creamos comentarios asociados a tickets en lote para mayor eficiencia
        Comment.objects.bulk_create([
            Comment(ticket=t1, author="Soporte", text="Revisando logs del servidor."),
            Comment(ticket=t1, author="Laura", text="Sigue ocurriendo luego de reiniciar."),
            Comment(ticket=t3, author="Soporte", text="Bug reproducido, preparando fix."),
        ])

        # Mensaje de éxito en consola
        self.stdout.write(self.style.SUCCESS("Datos de ejemplo creados"))
