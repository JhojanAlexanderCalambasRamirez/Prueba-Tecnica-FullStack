from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .models import Ticket, Comment
from .serializers import TicketSerializer, CommentSerializer, TransitionSerializer


class TicketViewSet(viewsets.ModelViewSet):

    # ViewSet principal para gestionar Tickets (CRUD completo).
    # - list / create / retrieve / update / partial_update / destroy
    # - Filtros por 'status' y 'priority', y búsqueda por 'title'
    # - Acciones personalizadas:
    #   POST /tickets/{id}/transition/  (cambio de estado con validación de reglas)
    #   POST /tickets/{id}/comments/    (añadir comentario al ticket)

    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    # No hay auth real en la prueba técnica; se permite acceso público.
    permission_classes = [permissions.AllowAny]

    # Habilita filtros y búsqueda con DRF + django-filter.
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["status", "priority"]  # /tickets/?status=en_proceso&priority=alta
    search_fields = ["title"]                  # /tickets/?search=login

    @action(detail=True, methods=["post"], url_path="transition")
    def transition(self, request, pk=None):

        # Cambia el estado del ticket siguiendo las reglas del flujo.
        # Entrada (JSON): {"next_status": "<nuevo|en_proceso|resuelto|cerrado>"}
        # - Reglas validadas en TransitionSerializer (serializers.py)
        # - Respuestas:
        #   200 OK: transición aplicada, devuelve el ticket actualizado
        #   400 BAD REQUEST: transición inválida (mensaje explicativo)

        ticket = self.get_object()  # 404 si no existe
        # Inyectamos el ticket en el contexto del serializer para validar reglas
        ser = TransitionSerializer(data=request.data, context={"ticket": ticket})
        ser.is_valid(raise_exception=True)  # 400 si no cumple reglas/choices

        # Aplicar la transición ya validada
        ticket.status = ser.validated_data["next_status"]
        ticket.save(update_fields=["status", "updated_at"])  # persistimos cambios

        # Devolvemos el ticket completo (incluye comentarios) para que el frontend
        # pueda refrescar su estado sin otra llamada.
        return Response(TicketSerializer(ticket).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="comments")
    def add_comment(self, request, pk=None):

        #Agrega un comentario al ticket.
        # - Entrada (JSON): {"author": "Nombre", "text": "Contenido"}
        #  * 'author' opcional -> por defecto "anon"
        #  * 'text' requerido (el serializer validará si está vacío)
        # - Respuestas:
        #   201 CREATED: comentario creado
        #   400 BAD REQUEST: datos inválidos

        ticket = self.get_object()  # 404 si no existe

        # Sanitizamos y formamos el payload explícitamente para no depender
        # de campos extra que pueda enviar el cliente.
        payload = {
            "ticket": ticket.id,
            "author": request.data.get("author") or "anon",
            "text": (request.data.get("text") or "").strip(),
        }

        cser = CommentSerializer(data=payload)
        cser.is_valid(raise_exception=True)  # 400 si 'text' vacío u otros errores
        cser.save()  # crea Comment(ticket=ticket, ...)

        # Devolvemos el comentario creado con su 'id' y 'created_at'
        return Response(cser.data, status=status.HTTP_201_CREATED)


class CommentViewSet(
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):

    # ViewSet de solo lista y eliminación para Comentarios.
    # - GET    /comments/?ticket={id}    (lista por ticket (o todos si no se filtra))
    # - DELETE /comments/{id}/           (borrar comentario puntual)
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):

        # Permite filtrar por 'ticket' usando query params.
        # Ejemplos:
        # - /comments/                (todos)
        # - /comments/?ticket=1       (solo del ticket 1)
        qs = Comment.objects.all()
        ticket_id = self.request.query_params.get("ticket")
        if ticket_id:
            qs = qs.filter(ticket_id=ticket_id)
        return qs
