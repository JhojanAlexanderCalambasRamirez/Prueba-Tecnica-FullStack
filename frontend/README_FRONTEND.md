# Frontend (React) – Esqueleto mínimo

Este módulo implementa una interfaz web tipo Kanban para la gestión de tickets de soporte técnico. 
Su diseño es minimalista, responsivo y funcional, enfocado en cubrir el flujo completo de interacción con los tickets a través de una experiencia intuitiva.

# La interfaz permite:

1) Visualización de tickets por estado
Muestra los tickets organizados en columnas según su estado:
Nuevo, En proceso, Resuelto y Cerrado.

2) Búsqueda y filtrado avanzado
Permite buscar tickets por título y aplicar filtros combinados por prioridad (baja, media, alta) y estado.

3) Creación de nuevos tickets
Formulario para registrar un nuevo ticket indicando título, descripción, prioridad y datos del solicitante.

4) Detalle completo del ticket

# Vista detallada que muestra el ticket:

- Descripción y datos del ticket

- Historial de comentarios

- Opciones de edición y eliminación

- Transición de estado validada

El cambio de estado de un ticket se hace desde la interfaz, siguiendo reglas de negocio validadas desde el backend:

nuevo → en_proceso → resuelto → cerrado
            ↘
           nuevo (retrabajo)

- Agregado de comentarios
Se pueden añadir comentarios a cada ticket desde el detalle o desde la tarjeta en el tablero, manteniendo un historial.

- Manejo visible de estados de UI

# Se muestra al usuario:

- Carga en curso (loading…)

- Mensajes de éxito (acción completada)

- Mensajes de error claros (respuesta del servidor o validaciones)

## Requisitos:

- Node.js versión 18+ (recomendado para compatibilidad con Vite)

- Vite versión 5.4.19 (ya preconfigurado)

## Instalación y ejecución:

- Abre terminal y ubícate en la carpeta del frontend:

- cd frontend

- Instala las dependencias principales:

- npm install

- Instala las dependencias adicionales requeridas:

- npm install react-router-dom react-icons

- npm install js-cookie

- Ejecuta el entorno de desarrollo: npm run dev

# Acceso a la aplicación:

- Una vez iniciado el servidor, la aplicación estará disponible en:

http://127.0.0.1:5173

Esta dirección está preconfigurada en el package.json a través del script "dev": "vite --host 127.0.0.1".

- Configuración del Proxy

La API backend (Django) está disponible en http://127.0.0.1:8000, 
por lo que se ha configurado un proxy automático en el archivo vite.config.js, 
permitiendo que todas las peticiones que comienzan con /api se redirijan al servidor backend:

vite.config.js
server: {
  proxy: {
    "/api": "http://127.0.0.1:8000",
  },
}

Esto significa que desde el frontend puedes realizar llamadas como:

fetch('/api/tickets/')  // Será redirigido automáticamente al backend
