import React, { useState } from "react";
import { transitionTicket, addTicketComment } from "../api/tickets";
import { FaTrashAlt, FaRegEdit } from "react-icons/fa";
import "../styles/ticket-card.css";

const PRIORITY_LABELS = { baja: "Baja", media: "Media", alta: "Alta" };
const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["resuelto"],   
  resuelto: ["cerrado"],
  cerrado: [],
};

export default function TicketCard({ ticket, onChanged, onOpen, onDelete }) {
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
    <div className="ticket">
      <div className="ticket__head">
        <button
          className="ticket__title"
          title="Ver / editar"
          onClick={() => onOpen?.(ticket.id)}
        >
          {ticket.title}
        </button>

        <div className="ticket__actions">
          <button
            className="ticket__icon"
            title="Editar"
            onClick={() => onOpen?.(ticket.id)}
            aria-label="Editar ticket"
          >
            <FaRegEdit />
          </button>

          <button
            className="ticket__icon ticket__icon--danger"
            title="Eliminar"
            onClick={() => onDelete?.(ticket.id)}
            aria-label="Eliminar ticket"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      <div className="ticket__meta">
        <span className="ticket__date">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
      </div>

      <div className="ticket__info">
        <div><b>Prioridad:</b> {PRIORITY_LABELS[ticket.priority]}</div>
        <div><b>Estado:</b> {ticket.status.replace("_", " ")}</div>
        <div className="ticket__reporter">
          <b>Reportado por:</b> {ticket.reporter_name}
          {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
        </div>
      </div>

      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket__transitions">
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              disabled={busy}
              onClick={() => doTransition(n)}
              className="ticket__btn"
            >
              {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submitComment} className="ticket__comment">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir comentario…"
          className="ticket__input"
        />
        <button disabled={busy || !comment.trim()} className="ticket__btn">
          Comentar
        </button>
      </form>
    </div>
  );
}
