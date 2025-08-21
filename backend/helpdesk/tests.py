from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Ticket

# TicketAPITest:

# Este test case usa la base de datos de prueba de Django
# (se crea y destruye automáticamente por cada ejecución).
# Usamos APIClient de DRF para simular requests HTTP.

class TicketAPITest(TestCase):
    def setUp(self):

        # Configuración inicial para cada test:
        # - Se crea un cliente API (self.client) para enviar requests.
        # - Se inserta un Ticket de prueba en la BD para validaciones posteriores.

        self.client = APIClient()
        self.ticket = Ticket.objects.create(
            title="Error de prueba",
            description="Pantalla azul",
            priority=Ticket.Priority.HIGH,
            reporter_name="Tester0",
            reporter_email="tester0@gmail.com",
        )

    # Test: creación de ticket

    def test_create_ticket(self):

        # Valida que la API permite crear un nuevo ticket:
        # - POST /api/tickets/
        # - Se espera un 201 (CREATED).
        # - La cantidad de tickets en la BD debe aumentar en +1.

        data = {
            "title": "Nuevo ticket",
            "description": "Descripción del ticket",
            "priority": "media",
            "reporter_name": "Juan0",
            "reporter_email": "juan0@gmail.com",
        }
        r = self.client.post("/api/tickets/", data, format="json")
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 2)

    # Test: transición válida
    def test_valid_transition(self):

        # Valida que la transición de estado siga las reglas de negocio.
        # Caso: nuevo, en_proceso es válido.
        # - POST /api/tickets/{id}/transition/ con {"next_status": "en_proceso"}.
        # - Se espera un 200 (OK).
        # - Luego de refrescar el objeto desde BD, el estado debe ser 'en_proceso'.

        r = self.client.post(
            f"/api/tickets/{self.ticket.id}/transition/",
            {"next_status": "en_proceso"},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.status, Ticket.Status.IN_PROGRESS)

    # Test: transición inválida
    def test_invalid_transition(self):

        # Valida que la API bloquee transiciones no permitidas.
        # Caso: nuevo, resuelto es inválido.
        # - POST /api/tickets/{id}/transition/ con {"next_status": "resuelto"}.
        # - Se espera un 400 (BAD REQUEST).

        r = self.client.post(
            f"/api/tickets/{self.ticket.id}/transition/",
            {"next_status": "resuelto"},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
