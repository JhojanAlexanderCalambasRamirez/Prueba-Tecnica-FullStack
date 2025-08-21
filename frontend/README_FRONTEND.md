# Frontend (React) – Esqueleto mínimo

UI mínima tipo **kanban** para tickets. Permite:
- Listar por columnas (Nuevo, En proceso, Resuelto, Cerrado)
- Buscar por título y filtrar por prioridad/estado
- Crear ticket
- Ver detalle con comentarios
- Transicionar estado con reglas (validado por backend)
- Agregar comentarios

## Requisitos
- Node.js 18+ recomendado

## Instalación

cd frontend
npm install
npm i react-router-dom
npm run dev

- Aplicación en: http://127.0.0.1:5173
- Proxy de `/api` a `http://127.0.0.1:8000` (configurado en `vite.config.js`).
