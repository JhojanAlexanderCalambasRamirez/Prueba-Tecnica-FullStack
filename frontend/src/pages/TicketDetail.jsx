import React, { useEffect, useState } from "react";
// Se importan las funciones de la API necesarias.
import {
  addTicketComment,
  getTicket,
  listComments,
  transitionTicket,
  deleteTicket,
  deleteComment,
  updateTicket,
} from "../api/tickets";
// Se importan los hooks de React Router para obtener los parámetros de la URL y navegar.
import { useNavigate, useParams } from "react-router-dom";
// Se importa el componente StatusBar para la retroalimentación al usuario.
import StatusBar from "../components/StatusBar";
// Se importan los estilos CSS.
import "../styles/ticket-detail.css";

// Mapeo de los estados de tickets a los posibles siguientes estados.
// Esta lógica es crucial para el flujo de trabajo del ticket.
const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["nuevo", "resuelto"],
  resuelto: ["cerrado"],
  cerrado: [],
};

// Definición del componente principal 'TicketDetail'.
export default function TicketDetail() {
  // 1. Hooks de estado y navegación.
  // `useParams`: Obtiene el parámetro 'id' de la URL (ej. "/tickets/123").
  const { id } = useParams();
  // `useNavigate`: Permite la navegación programática.
  const navigate = useNavigate();

  // 2. Estado del componente.
  // `ui`: Controla el estado visible de la UI (carga, éxito, error).
  const [ui, setUi] = useState({ loading: true, success: "", error: "" });
  // `ticket`: Almacena el objeto del ticket actual. Es inicialmente nulo hasta que se carga.
  const [ticket, setTicket] = useState(null);
  // `comments`: Almacena la lista de comentarios del ticket.
  const [comments, setComments] = useState([]);
  // `busy`: Controla si el componente está realizando una operación asíncrona.
  const [busy, setBusy] = useState(false);
  // `editDesc`: Almacena el valor del textarea de descripción para su edición.
  const [editDesc, setEditDesc] = useState("");
  // `editPriority`: Almacena el valor del select de prioridad para su edición.
  const [editPriority, setEditPriority] = useState("media");
  // `comment`: Almacena el texto del nuevo comentario a agregar.
  const [comment, setComment] = useState("");

  // 3. Funciones de ayuda (helpers) para manejar el estado de la UI.
  function setLoading(v) {
    setUi({ loading: v, success: "", error: "" });
  }
  function ok(msg) {
    setUi({ loading: false, success: msg, error: "" });
  }
  function fail(msg) {
    setUi({ loading: false, success: "", error: msg });
  }

  // 4. Lógica para cargar los datos del ticket y sus comentarios.
  // Es una función asíncrona que realiza dos llamadas a la API.
  async function load() {
    try {
      setLoading(true); // Activa el estado de carga.
      // Se obtiene el ticket por su ID.
      const t = await getTicket(id);
      setTicket(t); // Se actualiza el estado del ticket.
      // Se inicializan los estados de edición con los valores del ticket.
      setEditDesc(t.description || "");
      setEditPriority(t.priority || "media");
      // Se obtienen los comentarios del ticket.
      const cs = await listComments(id);
      setComments(cs); // Se actualiza el estado de los comentarios.
      setLoading(false); // Desactiva el estado de carga.
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    }
  }

  // 5. Efecto de carga inicial.
  // `useEffect` se ejecuta cuando el componente se monta o cuando el 'id' de la URL cambia.
  // Esto asegura que los datos se carguen correctamente al acceder a la página.
  useEffect(() => {
    load();
  }, [id]);

  // 6. Lógica de transición de estado del ticket.
  async function doTransition(next) {
    if (ticket && next === ticket.status) return;
    try {
      setBusy(true); // Bloquea la UI para evitar múltiples clics.
      await transitionTicket(id, next); // Llama a la API para la transición.
      await load(); // Vuelve a cargar los datos para reflejar el cambio.
      ok("Estado actualizado"); // Muestra un mensaje de éxito.
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  // 7. Lógica para enviar un comentario.
  async function submitComment(e) {
    e.preventDefault();
    const text = comment.trim();
    if (!text) return;
    try {
      setBusy(true);
      await addTicketComment(id, { author: "Frontend", text });
      setComment(""); // Limpia el input.
      await load(); // Vuelve a cargar los datos para mostrar el nuevo comentario.
      ok("Comentario agregado");
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  // 8. Lógica para eliminar el ticket.
  async function handleDeleteTicket() {
    if (!confirm("¿Eliminar este ticket?")) return;
    try {
      setBusy(true);
      await deleteTicket(id);
      ok("Ticket eliminado");
      // Redirige al tablero después de una breve pausa.
      setTimeout(() => navigate("/tickets"), 500);
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  // 9. Lógica para guardar las ediciones.
  async function saveEdits(e) {
    e.preventDefault();
    try {
      setBusy(true);
      // Llama a la API para actualizar el ticket con la nueva descripción y prioridad.
      await updateTicket(id, { description: editDesc, priority: editPriority });
      await load(); // Vuelve a cargar los datos para reflejar los cambios.
      ok("Cambios guardados");
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false);
    }
  }

  // 10. Renderizado condicional.
  // Si el ticket aún no se ha cargado, se muestra solo el StatusBar.
  if (!ticket)
    return (
      <div className="page-pad">
        <StatusBar state={ui} />
      </div>
    );

  // 11. Renderizado principal del componente.
  return (
    <div className="ticket-detail page-pad">
      {/* StatusBar para mensajes */}
      <StatusBar
        state={ui}
        onClose={() => setUi({ ...ui, success: "", error: "" })}
      />

      {/* Botones de acción general */}
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

      {/* Información del ticket */}
      <h2 className="ticket-detail__title">{ticket.title}</h2>
      {/* ... (otros detalles del ticket) ... */}
      <p>
        <b>Descripción actual:</b>
        <br />
        {ticket.description}
      </p>

      {/* Botones de transición de estado */}
      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket-detail__transitions">
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              className="btn"
              onClick={() => doTransition(n)}
              disabled={busy}
            >
              {n.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <hr />

      {/* Formulario de edición */}
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

      {/* Sección de comentarios */}
      <h3>Comentarios</h3>
      <form onSubmit={submitComment} className="ticket-detail__comment-form">
        <input
          className="input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe un comentario…"
          disabled={busy}
        />
        <button className="btn" disabled={busy || !comment.trim()}>
          Agregar comentario
        </button>
      </form>

      {/* Lista de comentarios */}
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
                    // Lógica para eliminar un comentario.
                    await deleteComment(c.id);
                    await load();
                    ok("Comentario eliminado");
                  }
                }}
                disabled={busy}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="muted">Sin comentarios, agrega uno</p>
        )}
      </ul>
    </div>
  );
}