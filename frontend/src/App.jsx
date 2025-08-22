import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Board from "./pages/Board";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import "./styles/app.css";

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <Link to="/" className="app__brand">
            Helpdesk – Tickets
          </Link>
        </h1>

        <nav className="app__nav">
          <Link to="/new">+ Crear ticket</Link>
        </nav>
      </header>

      <main className="app__main">
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </main>

      <footer>
        <p>
          © 2025 <a href="https://github.com/JhojanAlexanderCalambasRamirez/Prueba-Tecnica-FullStack" target="_blank" rel="noopener noreferrer">
            Developer Alexander Calambas
          </a> – Todos los derechos reservados.
        </p>
      </footer>
    </div>
    
  );
}
