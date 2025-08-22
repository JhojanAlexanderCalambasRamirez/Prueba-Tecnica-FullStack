# Backend (Django + DRF):

Este módulo implementa la API REST para la gestión de tickets de soporte técnico. 
Está desarrollado con Django 5.2.5 y Django REST Framework, siguiendo buenas prácticas de diseño, 
validación y separación de responsabilidades.

# Requisitos:

- Python 3.10+ recomendado (probado en 3.13.17)
Verifica tu versión con: python --version

- Django 5.2.5
Verifica tu versión con: python manage.py --version

# Instalación:

1) Abre la terminal y ubícate en la carpeta del backend: cd backend

2) Instala las dependencias desde el archivo requirements.txt: pip install -r requirements.txt

Si tienes múltiples versiones de Python instaladas, puedes usar pip3 para asegurarte:

- pip3 install -U pip
- pip3 install django djangorestframework django-filter django-cors-headers

3) Crea y activa un entorno virtual:

- python -m venv .venv
- .\.venv\Scripts\Activate.ps1 

4) Datos de prueba (semillas)

Puedes precargar datos de ejemplo con el siguiente comando: python manage.py seed_helpdesk

5) Ejecuta las migraciones iniciales: python manage.py migrate

# Correr servidor:

- Asegúrate de estar en la carpeta backend, luego ejecuta: python manage.py runserver

Esto iniciará el servidor en: http://127.0.0.1:8000/


# Administración (Admin Panel):

- Accede al panel de administración desde: http://127.0.0.1:8000/admin/

- Si aún no has creado un usuario administrador, hazlo con: python manage.py createsuperuser

# Ejemplo:

Usuario: alexa (puede ser personalizado)

Contraseña: 246800. (puede ser personalizada)

# Rutas principales de la API:

- API base en: http://127.0.0.1:8000/
- Salud: http://127.0.0.1:8000/health/
- TICKETS: http://127.0.0.1:8000/api/tickets/

# Base de datos (SQLite):

- El proyecto usa SQLite por defecto (backend/db.sqlite3), por lo que no necesitas instalar servicios adicionales.

# Comandos útiles:

Reiniciar base de datos:

del db.sqlite3  # o bórralo manualmente
python manage.py migrate


# SQLite informacion general

- El backend usa SQLite (archivo `backend/db.sqlite3`).
- No requiere instalar servicios externos.

# Comandos:

  - Migraciones: `python manage.py migrate`
  - Semillas: `python manage.py seed_helpdesk` 
  - Superusuario: `python manage.py createsuperuser` 


