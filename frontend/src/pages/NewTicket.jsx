import React, { useState } from "react";
import { createTicket } from "../api/tickets";
import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import "../styles/new-ticket.css";

export default function NewTicket() {
  const navigate = useNavigate();
  const [ui, setUi] = useState({ loading: false, success: "", error: "" });

  function setLoading(v){ setUi({ loading: v, success: "", error: "" }); }
  function ok(msg){ setUi({ loading: false, success: msg, error: "" }); }
  function fail(msg){ setUi({ loading: false, success: "", error: msg }); }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    if (!payload.title || !payload.description || !payload.reporter_name) {
      fail("Campos obligatorios: título, descripción, solicitante");
      return;
    }
    try {
      setLoading(true);
      await createTicket({
        title: payload.title,
        description: payload.description,
        priority: payload.priority || "media",
        reporter_name: payload.reporter_name,
        reporter_email: payload.reporter_email || "",
      });
      ok("Ticket creado correctamente");
      setTimeout(() => navigate("/tickets"), 700);
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    }
  }

  return (
    <div className="new-ticket">
      <StatusBar state={ui} onClose={() => setUi({ loading:false, success:"", error:"" })} />
      <h2>Nuevo Ticket</h2>

      <form onSubmit={handleSubmit} className="new-ticket__form">
        <input name="title" placeholder="Título" />
        <textarea name="description" rows={4} placeholder="Descripción" />
        <select name="priority" defaultValue="media">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <input name="reporter_name" placeholder="Solicitante *" />
        <input name="reporter_email" placeholder="Correo" />
        <div className="new-ticket__buttons">
          <button type="reset">Cancelar</button>
          <button type="submit">Crear</button>
        </div>
      </form>
    </div>
  );
}
