# Importamos las herramientas necesarias del panel de administración de Django
from django.contrib import admin

# Importamos los modelos que queremos administrar desde el panel admin
from .models import Ticket, Comment


# Registramos el modelo Ticket en el panel admin usando un decorador
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):

    # Configuración del modelo Ticket dentro del panel de administración de Django,
    # Permite personalizar cómo se muestran y gestionan los Tickets.

    # Columnas que se muestran en la vista de lista de Tickets
    list_display = ("id", "title", "priority", "status", "reporter_name", "created_at")

    # Filtros rápidos en la barra lateral (por prioridad, estado y fecha de creación)
    list_filter = ("priority", "status", "created_at")

    # Campos por los que se puede buscar en el panel admin
    search_fields = ("title", "description", "reporter_name", "reporter_email")

    # Orden por defecto de los registros (Tickets más recientes primero)
    ordering = ("-created_at",)


# Registramos el modelo Comment en el panel admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    
    # Configuración del modelo Comment dentro del panel de administración de Django.
    # Permite visualizar y gestionar comentarios de los Tickets.
    
    # Columnas visibles en la lista de Comentarios
    list_display = ("id", "ticket", "author", "created_at")

    # Filtros rápidos en la barra lateral (por fecha y autor del comentario)
    list_filter = ("created_at", "author")

    # Campos por los que se puede buscar comentarios
    search_fields = ("text", "author")

    # Orden por defecto de los comentarios (más recientes primero)
    ordering = ("-created_at",)
