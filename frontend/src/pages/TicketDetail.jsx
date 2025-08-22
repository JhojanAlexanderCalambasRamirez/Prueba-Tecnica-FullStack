import React, { useEffect, useState } from "react";
import {
  addTicketComment, getTicket, listComments, transitionTicket,
  deleteTicket, deleteComment, updateTicket
} from "../api/tickets";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ticket-detail.css";

const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["nuevo", "resuelto"],
  resuelto: ["cerrado"],
  cerrado: [],
};
export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const [comment, setComment] = useState("");

  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("media");

  async function load() {
    try {
      setLoading(true);
      const t = await getTicket(id);
      setTicket(t);
      const cs = await listComments(id);
      setComments(cs);
      setEditDesc(t.description || "");
      setEditPriority(t.priority || "media");
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function doTransition(next) {
    try {
      setBusy(true);
      await transitionTicket(id, next);
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    try {
      setBusy(true);
      await addTicketComment(id, { author: "Frontend", text });
      setComment("");
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteTicket() {
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer.")) return;
    try {
      setBusy(true);
      await deleteTicket(id);
      navigate("/");
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdits(e) {
    e.preventDefault();
    try {
      setBusy(true);
      await updateTicket(id, { description: editDesc, priority: editPriority });
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!ticket) return <div className="ticket-detail__loading">Cargando…</div>;

  return (
    <div className="ticket-detail">
      <div className="ticket-detail__actions">
        <button className="btn" onClick={() => navigate(-1)} disabled={busy}>← Volver</button>
        <button className="btn btn--danger" onClick={handleDeleteTicket} disabled={busy}>
          Eliminar ticket
        </button>
      </div>

      <h2 className="ticket-detail__title">{ticket.title}</h2>
      <p className="ticket-detail__meta">
        <b>Estado:</b> {ticket.status.replace("_", " ")} · <b>Prioridad:</b> {ticket.priority}
      </p>
      <p className="ticket-detail__meta">
        <b>Solicitante:</b> {ticket.reporter_name} {ticket.reporter_email ? `· ${ticket.reporter_email}` : ""}
      </p>
      <p className="ticket-detail__desc">
        <b>Descripción actual:</b><br />{ticket.description}
      </p>

      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket-detail__transitions">
          {NEXTS[ticket.status].map(n => (
            <button key={n} className="btn btn--light" onClick={() => doTransition(n)} disabled={busy}>
              → {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <hr className="ticket-detail__separator" />

      <h3>Editar ticket</h3>
      <form onSubmit={saveEdits} className="ticket-detail__form">
        <textarea
          value={editDesc}
          onChange={(e)=>setEditDesc(e.target.value)}
          rows={4}
          className="input input--textarea"
          disabled={busy}
        />
        <select
          value={editPriority}
          onChange={(e)=>setEditPriority(e.target.value)}
          className="input"
          disabled={busy}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <div>
          <button type="submit" className="btn" disabled={busy}>Guardar cambios</button>
        </div>
      </form>

      <hr className="ticket-detail__separator" />

      <h3>Comentarios</h3>
      <form onSubmit={submitComment} className="ticket-detail__comment-form">
        <input
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          placeholder="Escribe un comentario…"
          className="input ticket-detail__comment-input"
          disabled={false}
        />
        <button disabled={false || !comment.trim()} className="btn">Agregar</button>
      </form>

      {loading && <p className="ticket-detail__loading">Cargando…</p>}

      <ul className="ticket-detail__comments">
        {comments.map(c => (
          <li key={c.id} className="ticket-detail__comment">
            <div className="ticket-detail__comment-row">
              <div>
                <b>{c.author}</b> · <span className="muted">{new Date(c.created_at).toLocaleString()}</span>
                <br />{c.text}
              </div>
              <button
                className="btn btn--light"
                disabled={busy}
                onClick={async () => {
                  if (confirm("¿Eliminar comentario?")) {
                    try {
                      setBusy(true);
                      await deleteComment(c.id);
                      await load();
                    } catch (e) {
                      alert(e?.response?.data?.detail || e.message);
                    } finally {
                      setBusy(false);
                    }
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && <p className="muted">Sin comentarios</p>}
      </ul>
    </div>
  );
}
