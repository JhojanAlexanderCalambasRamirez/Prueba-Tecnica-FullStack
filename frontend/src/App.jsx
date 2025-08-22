import React from "react";
// Se importan los componentes de React Router para manejar la navegación.
import { Link, Route, Routes, useLocation } from "react-router-dom";
// Se importan los componentes de las diferentes páginas de la aplicación.
import Board from "./pages/Board";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
// Se importa el archivo CSS principal que define la estructura general.
import "./styles/app.css";
// Se importa 'Navigate' para la redirección.
import { Navigate } from "react-router-dom";

// Definición del componente principal 'App'.
export default function App() {
  // 1. Hook para obtener la ubicación actual.
  // `useLocation` retorna el objeto de ubicación (location) actual, que
  // contiene información como la ruta actual (`pathname`).
  const location = useLocation();
  // Se usa el pathname para determinar si la ruta actual es la de crear un nuevo ticket.
  const isOnNew = location.pathname === "/tickets/new";

  // 2. Renderizado de la estructura principal.
  // Se retorna la estructura JSX que compone toda la aplicación.
  return (
    <div className="app">
      {/* Encabezado de la aplicación */}
      <header className="app__header">
        <h1 className="app__title">
          {/* El `Link` hace que el título sea navegable a la página principal. */}
          <Link to="/" className="app__brand">
            Helpdesk – Tickets
          </Link>
        </h1>

        {/* Barra de navegación */}
        <nav className="app__nav">
          {/* Renderizado condicional del botón para crear un nuevo ticket.
              El botón solo se muestra si NO estás en la página de creación. */}
          {!isOnNew && <Link to="/tickets/new">+ Crear ticket</Link>}
        </nav>
      </header>

      {/* Contenedor principal del contenido de las páginas. */}
      <main className="app__main">
        {/* 3. Definición de rutas. */}
        {/* El componente `Routes` define las diferentes rutas de la aplicación. */}
        <Routes>
          {/* La primera ruta (`/`) redirige automáticamente al tablero de tickets.
              `replace` evita que el usuario pueda volver a la ruta anterior con el botón 'atrás'. */}
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          
          {/* Ruta para el tablero de tickets. */}
          <Route path="/tickets" element={<Board />} />
          
          {/* Ruta para la página de creación de un nuevo ticket. */}
          <Route path="/tickets/new" element={<NewTicket />} />
          
          {/* Ruta para la página de detalle de un ticket.
              El `:id` es un parámetro dinámico que se capturará con `useParams`
              en el componente 'TicketDetail'. */}
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </main>

      {/* Pie de página de la aplicación. */}
      <footer>
        <p>
          © 2025{" "}
          <a
            href="https://github.com/JhojanAlexanderCalambasRamirez/Prueba-Tecnica-FullStack"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developer Alexander Calambas
          </a>{" "}
          – Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}