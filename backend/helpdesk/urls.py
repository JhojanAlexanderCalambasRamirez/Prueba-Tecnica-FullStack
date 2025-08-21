from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet

# DefaultRouter

# DRF provee un router que genera automáticamente
# las rutas estándar (list, create, retrieve, update, delete)
# para los ViewSets registrados.
router = DefaultRouter()


# Tickets
# - GET    /tickets/        (lista de tickets)
# - POST   /tickets/        (crear nuevo ticket)
# - GET    /tickets/{id}/   (detalle de un ticket)
# - PUT    /tickets/{id}/   (actualizar ticket)
# - PATCH  /tickets/{id}/   (actualizar parcial)
# - DELETE /tickets/{id}/   (eliminar ticket)
# + /tickets/{id}/transition/ (acción personalizada en el ViewSet)

router.register(r"tickets", TicketViewSet, basename="tickets")

# Comments
# - GET    /comments/        (lista de comentarios)
# - POST   /comments/        (crear comentario)
# - GET    /comments/{id}/   (detalle de un comentario)
# - PUT    /comments/{id}/   (actualizar comentario)
# - PATCH  /comments/{id}/   (actualizar parcial)
# - DELETE /comments/{id}/   (eliminar comentario)

router.register(r"comments", CommentViewSet, basename="comments")

# URL Patterns:

# Incluimos todas las rutas generadas por el router.
# Esto conecta las rutas de tickets y comments con la API.
urlpatterns = [
    path("", include(router.urls)),
]
