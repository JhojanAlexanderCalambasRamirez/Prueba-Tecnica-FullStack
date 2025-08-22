import React, { useState } from "react";
import { transitionTicket, addTicketComment } from "../api/tickets";
import "../styles/ticket-card.css"; 

const PRIORITY_LABELS = { baja: "Baja", media: "Media", alta: "Alta" };
const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["nuevo", "resuelto"],
  resuelto: ["cerrado"],
  cerrado: [],
};

export default function TicketCard({ ticket, onChanged, onOpen }) {
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState("");

  async function doTransition(next) {
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
    if (!comment.trim()) return;
    try {
      setBusy(true);
      await addTicketComment(ticket.id, { author: "Frontend", text: comment.trim() });
      setComment("");
      onChanged?.();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <strong className="ticket-card__title" onClick={() => onOpen?.(ticket.id)}>
          {ticket.title}
        </strong>
        <span className="ticket-card__date">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
      </div>

      <div className="ticket-card__meta">
        <div><b>Prioridad:</b> {PRIORITY_LABELS[ticket.priority]}</div>
        <div><b>Estado:</b> {ticket.status.replace("_", " ")}</div>
        <div className="ticket-card__reporter">
          <b>Reportado por:</b> {ticket.reporter_name}
          {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
        </div>
      </div>

      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket-card__actions">
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              disabled={busy}
              onClick={() => doTransition(n)}
              className="ticket-card__btn"
            >
              → {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submitComment} className="ticket-card__comment-form">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir comentario…"
          className="ticket-card__comment-input"
        />
        <button
          disabled={busy || !comment.trim()}
          className="ticket-card__btn"
          type="submit"
        >
          Comentar
        </button>
      </form>
    </div>
  );
}
