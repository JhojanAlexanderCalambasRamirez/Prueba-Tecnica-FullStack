import React from "react";
import { createTicket } from "../api/tickets";
import { useNavigate } from "react-router-dom";
import "../styles/new-ticket.css"; 

export default function NewTicket() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    if (!payload.title || !payload.description || !payload.reporter_name) {
      alert("Campos obligatorios: título, descripción, solicitante");
      return;
    }
    await createTicket({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || "media",
      reporter_name: payload.reporter_name,
      reporter_email: payload.reporter_email || "",
    });
    navigate("/");
  }

  return (
    <div className="new-ticket">
      <h2>Nuevo Ticket</h2>
      <form onSubmit={handleSubmit} className="new-ticket__form">
        <input name="title" placeholder="Título *" />
        <textarea name="description" rows={4} placeholder="Descripción *" />
        <select name="priority" defaultValue="media">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <input name="reporter_name" placeholder="Solicitante *" />
        <input name="reporter_email" placeholder="Correo (opcional)" />
        <div className="new-ticket__buttons">
          <button type="reset">Cancelar</button>
          <button type="submit">Crear</button>
        </div>
      </form>
    </div>
  );
}
