# Prueba Técnica – Tickets de Soporte con Flujo (Django + React)

## 1) Enunciado (problema real)
Una empresa pequeña de tecnología recibe solicitudes de soporte por múltiples canales y no tiene visibilidad clara del estado de cada caso ni de quién lo atiende. Esto genera tiempos de respuesta inconsistentes, duplicidad de casos y pérdida de seguimiento.

**Reto:** Construir una mini-aplicación web que permita registrar tickets de soporte y gestionar su ciclo de vida con un flujo simple de estados, incluyendo comentarios por ticket y vistas básicas en el frontend.

**Tiempo objetivo:** 8 horas (máximo 12).  
**Enfoque:** prioriza funcionalidad clara, manejo de errores y UX sencilla. No se requiere autenticación real.

## 2) Objetivo
Resolver el problema de visibilidad y control del ciclo de vida de los tickets mediante:
- Registro de nuevos tickets con información esencial.
- Transición controlada de estados (flujo) y validaciones de reglas.
- Comentarios por ticket para mantener el historial.
- Vistas claras en frontend (tablero por columnas + detalle del ticket).

## 3) Alcance funcional mínimo
1. **Crear ticket** con: título, descripción, prioridad (`baja`, `media`, `alta`), nombre del solicitante (reporter), correo opcional y estado inicial `nuevo`.
2. **Listar tickets** con filtros: por **estado** y por **texto** (búsqueda en título).
3. **Transicionar estado** con reglas válidas:
   - `nuevo → en_proceso → resuelto → cerrado`
   - Permitir `en_proceso → nuevo` (retrabajo).
   - Denegar saltos inválidos (p. ej., `nuevo → resuelto`).
4. **Comentarios**: agregar comentarios a un ticket, visibles en orden cronológico.
5. **Frontend**: tablero tipo kanban (por estados), detalle de ticket (datos + comentarios + transición), formulario para crear ticket y manejo visible de estados (carga/éxito/error).

## 4) Requisitos mínimos (a entregar por el participante)
- **README del proyecto** (obligatorio):
  - Cómo instalar y ejecutar backend y frontend (comandos exactos).
  - Requisitos de entorno (versiones mínimas de Python/Node).
  - Configuración (p. ej., CORS o variables de entorno).
- **Mockups** (mínimo 2): tablero y detalle del ticket. Pueden ser imágenes simples o bosquejos. Incluirlos en `/docs/` o dentro del README.
- **Código documentado**: comentarios en puntos clave (validaciones, reglas de transición, manejo de errores).
- **Requisitos funcionales mínimos**: los de la sección 3 (alcance funcional).
- **Requisitos no funcionales mínimos**:
  - Manejo de errores y respuestas HTTP correctas (400 para transiciones inválidas, etc.).
  - Estructura de módulos clara y separada (sin imponer una estructura específica, eres libre de organizarla).
  - Semillas o datos de ejemplo (fixture/comando) para probar rápidamente.
  - Sin dependencias pesadas innecesarias (Django + DRF, SQLite, React con fetch/axios; Tailwind opcional).
  - Entrega reproducible: se debe poder ejecutar con los comandos descritos en el README.

> Importante: La estructura exacta del proyecto queda **a tu criterio**. Puedes reorganizar, renombrar o ampliar el esqueleto provisto en este zip.

## 5) Entregables
- Repositorio o carpeta con:
  - **Backend** (Django + DRF + SQLite).
  - **Frontend** (React + Vite o similar).
  - **README** principal y mockups.
  - Opcional: scripts/fixtures de semilla.

## 6) Recursos provistos
En este zip se incluye un **esqueleto mínimo** para backend y frontend para facilitar el arranque. Puedes usarlo tal cual o reorganizarlo.
