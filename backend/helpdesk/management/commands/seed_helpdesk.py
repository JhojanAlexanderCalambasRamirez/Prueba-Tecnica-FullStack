# Comando de Django personalizado para generar datos de ejemplo
# Se ejecuta con: python manage.py seed_helpdesk
# Su objetivo es poblar la base de datos con tickets y comentarios iniciales
# que sirven para probar rápidamente el backend y el frontend.

from django.core.management.base import BaseCommand
from helpdesk.models import Ticket, Comment


class Command(BaseCommand):
    help = "Crea tickets y comentarios de ejemplo para pruebas del sistema"

    def handle(self, *args, **kwargs):
        # Limpiar datos previos
        Comment.objects.all().delete()
        Ticket.objects.all().delete()

        # Ticket nuevo - Alta prioridad
        t1 = Ticket.objects.create(
            title="Error crítico: sistema no responde",
            description="Al iniciar sesión, el sistema queda congelado.",
            priority=Ticket.Priority.HIGH,
            reporter_name="María López",
            reporter_email="maria@example.com",
            status=Ticket.Status.NEW,
        )

        # Ticket en_proceso - Media prioridad
        t2 = Ticket.objects.create(
            title="Problema con envío de correos",
            description="Los correos de notificación no se están enviando.",
            priority=Ticket.Priority.MEDIUM,
            reporter_name="Luis Torres",
            reporter_email="luis@example.com",
            status=Ticket.Status.IN_PROGRESS,
        )

        # Ticket resuelto - Baja prioridad
        t3 = Ticket.objects.create(
            title="Sugerencia: agregar modo oscuro",
            description="Sería útil tener una opción de tema oscuro en el panel.",
            priority=Ticket.Priority.LOW,
            reporter_name="Andrea Ruiz",
            reporter_email="andrea@example.com",
            status=Ticket.Status.RESOLVED,
        )

        # Ticket cerrado - Media prioridad
        t4 = Ticket.objects.create(
            title="Solicitud de cambio de contraseña",
            description="El usuario necesita resetear su contraseña por olvido.",
            priority=Ticket.Priority.MEDIUM,
            reporter_name="Carlos Gómez",
            reporter_email="carlos@example.com",
            status=Ticket.Status.CLOSED,
        )

        # Comentarios relacionados
        Comment.objects.bulk_create([
            Comment(ticket=t1, author="Soporte", text="Estamos revisando el comportamiento reportado."),
            Comment(ticket=t1, author="María", text="Gracias. Sigue ocurriendo después de borrar caché."),
            Comment(ticket=t2, author="Soporte", text="Identificado el problema en el SMTP. Ajustando configuración."),
            Comment(ticket=t3, author="Diseño UX", text="Será evaluado para el próximo ciclo de mejoras."),
            Comment(ticket=t4, author="Carlos", text="Ya pude acceder, gracias."),
        ])

        self.stdout.write(self.style.SUCCESS("Datos de ejemplo creados correctamente"))
