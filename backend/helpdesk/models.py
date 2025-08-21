from django.db import models

class Ticket(models.Model):
    # Modelo principal que representa un ticket de soporte.
    # Cada ticket tiene información básica (título, descripción, prioridad, solicitante)
    # y un ciclo de vida controlado mediante estados.

    # Definición de prioridades como opciones (baja, media, alta)
    class Priority(models.TextChoices):
        LOW = "baja", "Baja"
        MEDIUM = "media", "Media"
        HIGH = "alta", "Alta"

    # Definición de estados del ticket con flujo controlado
    class Status(models.TextChoices):
        NEW = "nuevo", "Nuevo"
        IN_PROGRESS = "en_proceso", "En Proceso"
        RESOLVED = "resuelto", "Resuelto"
        CLOSED = "cerrado", "Cerrado"

    # Campos principales del ticket
    title = models.CharField(max_length=150)             # Título breve del ticket
    description = models.TextField()                    # Descripción detallada del problema
    priority = models.CharField(                        # Nivel de prioridad
        max_length=10,
        choices=Priority.choices,                       # Usa las opciones definidas en Priority
        default=Priority.MEDIUM                         # Por defecto "media"
    )
    reporter_name = models.CharField(max_length=120)    # Nombre de quien reporta el ticket
    reporter_email = models.EmailField(                 # Correo opcional del reportante
        blank=True, null=True
    )
    status = models.CharField(                          # Estado actual del ticket
        max_length=15,
        choices=Status.choices,                         # Usa las opciones de Status
        default=Status.NEW                              # Por defecto "nuevo"
    )

    # Fechas automáticas
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    updated_at = models.DateTimeField(auto_now=True)      # Fecha de última actualización

    class Meta:
        # Ordenar tickets de más recientes a más antiguos por defecto
        ordering = ["-created_at"]

    def __str__(self):
        # Representación legible del ticket en el admin/django shell
        return f"[{self.status}] {self.title}"


class Comment(models.Model):
    # Modelo que representa un comentario asociado a un ticket.
    # Sirve para mantener un historial de comunicación dentro del ticket.
  

    # Relación con Ticket: si se elimina un ticket, se eliminan sus comentarios
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name="comments"  # Permite acceder a comentarios desde ticket.comments.all()
    )
    author = models.CharField(max_length=120)  # Autor del comentario (texto plano, no user real)
    text = models.TextField()                  # Contenido del comentario
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación

    class Meta:
        # Ordenar comentarios del más antiguo al más nuevo
        ordering = ["created_at"]

    def __str__(self):
        # Representación legible del comentario
        return f"Comment #{self.id} on Ticket #{self.ticket_id}"
