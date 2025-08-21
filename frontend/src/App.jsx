import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Board from "./pages/Board";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Helpdesk – Tickets
          </Link>
        </h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Tablero</Link>
          <Link to="/new">Nuevo ticket</Link>
        </nav>
      </header>

      <main style={{ marginTop: 12 }}>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
}
