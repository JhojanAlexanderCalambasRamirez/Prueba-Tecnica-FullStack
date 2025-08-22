import React, { useEffect, useState } from "react";
import {
  addTicketComment,
  getTicket,
  listComments,
  transitionTicket,
  deleteTicket,
  deleteComment,
  updateTicket,
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

  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("media");

  const [comment, setComment] = useState("");

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

  useEffect(() => {
    load();
  }, [id]);

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
    if (!text) {
      alert("Escribe un comentario");
      return;
    }
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
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer."))
      return;
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

  if (!ticket) return <div className="page-pad">Cargando…</div>;

  return (
    <div className="ticket-detail page-pad">
      <div className="ticket-detail__actions">
        <button className="btn" onClick={() => navigate(-1)} disabled={busy}>
          Volver
        </button>
        <button
          className="btn btn--danger"
          onClick={handleDeleteTicket}
          disabled={busy}
        >
          Eliminar ticket
        </button>
      </div>

      <h2 className="ticket-detail__title">{ticket.title}</h2>
      <p className="muted">
        Creado: {new Date(ticket.created_at).toLocaleString()} · Última act.:{" "}
        {new Date(ticket.updated_at).toLocaleString()}
      </p>

      <p>
        <b>Estado:</b> {ticket.status.replace("_", " ")} · <b>Prioridad:</b>{" "}
        {ticket.priority}
      </p>
      <p>
        <b>Solicitante:</b> {ticket.reporter_name}
        {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
      </p>
      <p>
        <b>Descripción actual:</b>
        <br />
        {ticket.description}
      </p>

      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket-detail__transitions">
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              className="btn"
              onClick={() => doTransition(n)}
              disabled={busy}
            >
              → {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <hr />

      <h3>Editar ticket</h3>
      <form onSubmit={saveEdits} className="ticket-detail__edit-form">
        <label className="label">Descripción</label>
        <textarea
          className="input"
          rows={4}
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
        />
        <label className="label">Prioridad</label>
        <select
          className="input"
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <div>
          <button type="submit" className="btn" disabled={busy}>
            Guardar cambios
          </button>
        </div>
      </form>

      <hr />

      <h3>Comentarios</h3>
      <form onSubmit={submitComment} className="ticket-detail__comment-form">
        <input
          className="input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe un comentario…"
          disabled={busy}
        />
        <button className="btn" disabled={busy}>
          Agregar comentario
        </button>
      </form>

      {loading && <p>Cargando…</p>}

      <ul className="ticket-detail__comments">
        {comments.map((c) => (
          <li key={c.id} className="ticket-detail__comment">
            <div className="ticket-detail__comment-row">
              <div>
                <b>{c.author}</b>{" "}
                <span className="muted">
                  {new Date(c.created_at).toLocaleString()}
                </span>
                <br />
                {c.text}
              </div>
              <button
                className="btn btn--danger"
                onClick={async () => {
                  if (confirm("¿Eliminar comentario?")) {
                    await deleteComment(c.id);
                    await load();
                  }
                }}
                disabled={busy}
              >
                Eliminar comentario
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && <p className="muted">Sin comentarios, agrega uno</p>}
      </ul>
    </div>
  );
}
