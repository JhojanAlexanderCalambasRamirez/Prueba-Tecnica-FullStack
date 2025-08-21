import React, { useEffect, useState } from "react";
import {
  addTicketComment, getTicket, listComments, transitionTicket,
  deleteTicket, deleteComment, updateTicket
} from "../api/tickets";
import { useNavigate, useParams } from "react-router-dom";

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
  const [comment, setComment] = useState("");

  // Edición
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("media");

  async function load() {
    try {
      setLoading(true);
      const t = await getTicket(id);
      setTicket(t);
      const cs = await listComments(id);
      setComments(cs);
      // Inicializa campos de edición
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
    await transitionTicket(id, next);
    await load();
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    await addTicketComment(id, { author: "Frontend", text: comment.trim() });
    setComment("");
    await load();
  }

  async function handleDeleteTicket() {
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer.")) return;
    await deleteTicket(id);
    navigate("/");
  }

  async function saveEdits(e) {
    e.preventDefault();
    await updateTicket(id, { description: editDesc, priority: editPriority });
    await load();
  }

  if (!ticket) return <div style={{ padding: 16 }}>Cargando…</div>;

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => navigate(-1)}>← Volver</button>
        <button onClick={handleDeleteTicket} style={{ color: "white", background: "crimson", border: "1px solid crimson" }}>
          Eliminar ticket
        </button>
      </div>

      <h2 style={{ marginTop: 0 }}>{ticket.title}</h2>
      <p><b>Estado:</b> {ticket.status.replace("_", " ")} · <b>Prioridad:</b> {ticket.priority}</p>
      <p><b>Solicitante:</b> {ticket.reporter_name} {ticket.reporter_email ? `· ${ticket.reporter_email}` : ""}</p>
      <p><b>Descripción actual:</b><br />{ticket.description}</p>

      {/* Transiciones */}
      {NEXTS[ticket.status].length > 0 && (
        <div style={{ display: "flex", gap: 6, margin: "10px 0" }}>
          {NEXTS[ticket.status].map(n => (
            <button key={n} onClick={() => doTransition(n)}>→ {n.replace("_", " ")}</button>
          ))}
        </div>
      )}

      <hr />

      {/* Editar */}
      <h3>Editar ticket</h3>
      <form onSubmit={saveEdits} style={{ display: "grid", gap: 8, maxWidth: 700 }}>
        <textarea value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} rows={4} />
        <select value={editPriority} onChange={(e)=>setEditPriority(e.target.value)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <div>
          <button type="submit">Guardar cambios</button>
        </div>
      </form>

      <hr />

      {/* Comentarios */}
      <h3>Comentarios</h3>
      <form onSubmit={submitComment} style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Escribe un comentario…" style={{ flex: 1 }} />
        <button disabled={!comment.trim()}>Agregar</button>
      </form>

      {loading && <p>Cargando…</p>}
      <ul>
        {comments.map(c => (
          <li key={c.id} style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b>{c.author}</b> · <span style={{ opacity: .7 }}>{new Date(c.created_at).toLocaleString()}</span>
                <br />{c.text}
              </div>
              <button
                onClick={async () => { 
                  if (confirm("¿Eliminar comentario?")) { 
                    await deleteComment(c.id); 
                    await load();
                  }
                }}
                style={{ marginLeft: 8 }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && <p style={{ opacity: .7 }}>Sin comentarios</p>}
      </ul>
    </div>
  );
}
