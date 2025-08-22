import React, { useState } from "react";
import { transitionTicket, addTicketComment } from "../api/tickets";
import "../styles/ticket-card.css";

const PRIORITY_LABELS = { baja: "Baja", media: "Media", alta: "Alta" };
const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["resuelto"],
  resuelto: ["cerrado"],
  cerrado: [],
};

export default function TicketCard({ ticket, onChanged, onOpen }) {
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState("");

  function openCard() {
    onOpen?.(ticket.id);
  }

  function stop(e) {
    e.stopPropagation();
  }

  async function doTransition(next, e) {
    e?.stopPropagation();
    try {
      setBusy(true);
      await transitionTicket(ticket.id, next);
      onChanged?.();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    e.stopPropagation();
    const text = comment.trim();
    if (!text) {
      alert("Escribe un comentario antes de enviar.");
      return;
    }
    try {
      setBusy(true);
      await addTicketComment(ticket.id, { author: "Frontend", text });
      setComment("");
      onChanged?.();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ticket-card ticket-card--clickable" onClick={openCard}>
      <div className="ticket-card__row">
        <strong className="ticket-card__title">{ticket.title}</strong>
        <span className="muted">{new Date(ticket.created_at).toLocaleString()}</span>
      </div>

      <div className="ticket-card__meta">
        <div><b>Prioridad:</b> {PRIORITY_LABELS[ticket.priority]}</div>
        <div><b>Estado:</b> {ticket.status.replace("_", " ")}</div>
        <div className="muted">
          <b>Reportado por:</b> {ticket.reporter_name}
          {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
        </div>
      </div>

      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket-card__actions" onClick={stop}>
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              disabled={busy}
              onClick={(ev) => doTransition(n, ev)}
              className="btn btn--light"
            >
              {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submitComment} className="ticket-card__comment-form" onClick={stop}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir comentario…"
          className="ticket-card__comment-input input"
          disabled={busy}
        />
        <button type="submit" className="btn" disabled={busy}>
          Comentar
        </button>
      </form>
    </div>
  );
}
