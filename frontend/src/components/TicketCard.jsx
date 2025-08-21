import React, { useState } from "react";
import { transitionTicket, addTicketComment } from "../api/tickets";

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
    <div style={{
      border: "1px solid #ddd", padding: 10, borderRadius: 10, marginBottom: 10,
      background: "#fff"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ cursor: "pointer" }} onClick={() => onOpen?.(ticket.id)}>
          {ticket.title}
        </strong>
        <span style={{ fontSize: 12, opacity: .7 }}>
          {new Date(ticket.created_at).toLocaleString()}
        </span>
      </div>

      <div style={{ fontSize: 13, margin: "6px 0" }}>
        <div><b>Prioridad:</b> {PRIORITY_LABELS[ticket.priority]}</div>
        <div><b>Estado:</b> {ticket.status.replace("_", " ")}</div>
        <div style={{ opacity: .8 }}>
          <b>Reportado por:</b> {ticket.reporter_name}
          {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
        </div>
      </div>
      
      {NEXTS[ticket.status].length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              disabled={busy}
              onClick={() => doTransition(n)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", background: "#f6f7f9" }}
            >
              → {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {/* Comentario rápido */}
      <form onSubmit={submitComment} style={{ marginTop: 8, display: "flex", gap: 6 }}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir comentario…"
          style={{ flex: 1, padding: 6, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button disabled={busy || !comment.trim()} style={{ padding: "6px 10px", borderRadius: 8 }}>
          Comentar
        </button>
      </form>
    </div>
  );
}
