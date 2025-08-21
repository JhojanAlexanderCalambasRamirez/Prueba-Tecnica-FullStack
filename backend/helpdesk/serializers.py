from rest_framework import serializers
from .models import Ticket, Comment

# Reglas de negocio: TRANSICIONES DE ESTADO

# Diseño declarativo: centralizamos el flujo permitido en un único
# diccionario para hacerlo legible y fácil de mantener.

VALID_TRANSITIONS = {
    Ticket.Status.NEW: {Ticket.Status.IN_PROGRESS},
    Ticket.Status.IN_PROGRESS: {Ticket.Status.NEW, Ticket.Status.RESOLVED},
    Ticket.Status.RESOLVED: {Ticket.Status.CLOSED},
    Ticket.Status.CLOSED: set(),
}

# CommentSerializer:

# Responsabilidad: convertir Comment ↔ JSON.
# - Expuesto cuando listamos comentarios o los embebemos en un Ticket.
# - id/created_at son solo lectura para preservar integridad temporal.
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "ticket", "author", "text", "created_at"]
        read_only_fields = ["id", "created_at"]


# TicketSerializer:

# Responsabilidad: convertir Ticket ↔ JSON.
# - Incluye comentarios embebidos (solo lectura) para reducir
#   llamadas del frontend y facilitar la construcción de la UI
#   (detalle de ticket con historial).
# - id/created_at/updated_at: solo lectura para evitar manipulación
#   desde el cliente y mantener la auditoría.

class TicketSerializer(serializers.ModelSerializer):
    # Relación inversa: ticket.comments.all()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "reporter_name",
            "reporter_email",
            "status",
            "created_at",
            "updated_at",
            "comments",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# TransitionSerializer:

# Responsabilidad: validar y procesar cambios de estado.
# - Separa la lógica de transición del CRUD de Ticket, favoreciendo
#   cohesión y mantenibilidad.
# - Antes de aplicar, valida contra VALID_TRANSITIONS para asegurar
#   que no se "salten" pasos del flujo.
# - Si no es válido, responde 400 con un mensaje claro y accionable.
class TransitionSerializer(serializers.Serializer):
    # `next_status` restringido a los choices de Ticket.Status
    next_status = serializers.ChoiceField(choices=Ticket.Status.choices)

    def validate(self, attrs):
        # El ticket actual se inyecta en el contexto desde la vista.
        ticket = self.context["ticket"]
        nxt = attrs["next_status"]

        # Regla de negocio: ¿la transición solicitada está permitida
        # desde el estado actual del ticket?
        if nxt not in VALID_TRANSITIONS[ticket.status]:
            # Mensaje explícito para DX/UX: explica el porqué del 400
            raise serializers.ValidationError(
                {"detail": f"Transición inválida: {ticket.status} → {nxt}"}
            )
        return attrs
