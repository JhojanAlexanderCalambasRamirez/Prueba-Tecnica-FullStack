# Backend (Django + DRF)

## Requisitos
- Python 3.10+ recomendado (3.13.17)
para ver la version (python --version)

- Django 5.2.5
Para ver la version (python manage.py --version)

## Instalación
Primero ve a la carpeta del proyecto "Backend"

cd backend

- pip install -r requirements.txt

Si tu sistema tiene múltiples versiones de Python, es mejor usar pip3 
para asegurarte de que se instale en la versión correcta: 

- pip3 install django
- pip3 install djangorestframework django-filter
- pip3 install -U pip
- pip3 install django django-cors-headers djangorestframework django-filter

posteriormente:

- python -m venv .venv
- .\.venv\Scripts\Activate.ps1
- python manage.py migrate

## Correr servidor
Estando en la carpeta de "Backend"

- python manage.py runserver

- ADMIN: http://127.0.0.1:8000/admin/

Para crear un usuario (admin)

python manage.py createsuperuser

Usuario: alexa (puede variar)
contraseña: 246800. (puede variar)

- API base en: http://127.0.0.1:8000/
- Salud: http://127.0.0.1:8000/health/
- TICKETS: http://127.0.0.1:8000/api/tickets/



## Base de datos (SQLite por defecto)

Reiniciar datos borra db.sqlite3 y ejecuta:

- python manage.py migrate

## Cargar datos de ejemplo:

En la carpeta de backend

- python manage.py seed_helpdesk

## SQLite informacion general

- El backend usa SQLite (archivo `backend/db.sqlite3`).
- No requiere instalar servicios externos.
- Comandos:
  - Migraciones: `python manage.py migrate`
  - Semillas: `python manage.py seed_helpdesk` 
  - Superusuario: `python manage.py createsuperuser` 


