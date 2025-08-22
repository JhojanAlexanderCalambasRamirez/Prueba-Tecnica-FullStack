import React, { useState } from "react";
// Se importan las funciones de la API para la lógica de negocio.
import { transitionTicket, addTicketComment } from "../api/tickets";
// Se importan los íconos de React.
import { FaTrashAlt, FaRegEdit } from "react-icons/fa";
// Se importan los archivos CSS para los estilos del componente.
import "../styles/ticket-card.css";
import "../styles/ticket.css";

// Definición de las etiquetas de prioridad para una mejor visualización.
const PRIORITY_LABELS = { baja: "Baja", media: "Media", alta: "Alta" };

// Mapeo de los estados de tickets a los posibles siguientes estados.
// Esto controla qué botones de transición se muestran en la tarjeta.
const NEXTS = {
  nuevo: ["en_proceso"],
  en_proceso: ["nuevo", "resuelto"],
  resuelto: ["cerrado"],
  cerrado: [],
};

// Función de utilidad para formatear el estado, reemplazando '_' por un espacio.
function prettyStatus(s) {
  return s.replace("_", " ");
}

// Definición del componente funcional TicketCard.
// Recibe props de su componente padre (`Board.js`) para manejar los datos y las interacciones.
export default function TicketCard({ ticket, onChanged, onError, onOpen, onDelete }) {
  // 1. Estado local del componente.
  // `busy` (booleano) controla si la tarjeta está procesando una acción (ej. una petición a la API).
  // Se usa para deshabilitar botones y evitar múltiples clics.
  const [busy, setBusy] = useState(false);
  // `comment` (string) almacena el texto del comentario que el usuario está escribiendo.
  const [comment, setComment] = useState("");

  // 2. Lógica para la transición de estado.
  // Es una función asíncrona que cambia el estado del ticket.
  async function doTransition(next) {
    // Si el estado siguiente es el mismo que el actual, no hace nada.
    if (next === ticket.status) return;
    
    try {
      setBusy(true); // Se activa el estado "ocupado".
      // Se llama a la función de la API para cambiar el estado del ticket.
      await transitionTicket(ticket.id, next);
      // Se notifica al componente padre (Board) que un cambio ha ocurrido.
      // `onChanged?.(...)` es una llamada segura que solo se ejecuta si la prop existe.
      onChanged?.(`Ticket #${ticket.id}: estado ${prettyStatus(next)}`);
    } catch (e) {
      // Si hay un error, se llama a la función `onError` del componente padre.
      onError?.(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false); // Se desactiva el estado "ocupado" al finalizar.
    }
  }

  // 3. Lógica para enviar un comentario.
  // Es una función asíncrona que maneja el envío del formulario de comentario.
  async function submitComment(e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página).
    const text = comment.trim(); // Se elimina el espacio en blanco del comentario.
    if (!text) return; // Si el comentario está vacío, no hace nada.
    
    try {
      setBusy(true); // Se activa el estado "ocupado".
      // Se llama a la función de la API para agregar el comentario.
      // Se pasa el ID del ticket y los datos del comentario.
      await addTicketComment(ticket.id, { author: "TI", text });
      setComment(""); // Se limpia el input del comentario.
      onChanged?.(`Comentario agregado al ticket #${ticket.id}`);
    } catch (e) {
      onError?.(e?.response?.data?.detail || e.message);
    } finally {
      setBusy(false); // Se desactiva el estado "ocupado".
    }
  }

  // 4. Renderizado del componente.
  // El JSX que define la apariencia de la tarjeta.
  return (
    <div className="ticket">
      {/* Sección de encabezado con título y botones de acción */}
      <div className="ticket__head">
        <button
          className="ticket__title"
          title="Ver / editar"
          // Al hacer clic, se llama a la función `onOpen` del componente padre
          // para abrir la vista de detalles del ticket.
          onClick={() => onOpen?.(ticket.id)}
        >
          {ticket.title}
        </button>
        {/* Sección de botones de edición y eliminación */}
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
            // Llama a la función `onDelete` del componente padre para eliminar el ticket.
            onClick={() => onDelete?.(ticket.id)}
            aria-label="Eliminar ticket"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>

      {/* Sección de metadatos del ticket (fecha, prioridad, estado, etc.) */}
      <div className="ticket__meta">
        <span className="ticket__date">
          {new Date(ticket.created_at).toLocaleString()}
        </span>
      </div>

      <div className="ticket__info">
        <div><b>Prioridad:</b> {PRIORITY_LABELS[ticket.priority]}</div>
        <div><b>Estado:</b> {prettyStatus(ticket.status)}</div>
        <div className="ticket__reporter">
          <b>Reportado por:</b> {ticket.reporter_name}
          {ticket.reporter_email ? ` · ${ticket.reporter_email}` : ""}
        </div>
      </div>

      {/* 5. Renderizado condicional de los botones de transición. */}
      {/* Se usa '&&' para renderizar los botones solo si la matriz de `NEXTS`
          para el estado actual no está vacía. */}
      {NEXTS[ticket.status].length > 0 && (
        <div className="ticket__transitions">
          {/* Se mapean los siguientes estados para crear un botón para cada uno. */}
          {NEXTS[ticket.status].map((n) => (
            <button
              key={n}
              // El botón se deshabilita si la tarjeta está ocupada.
              disabled={busy}
              // Al hacer clic, se llama a la función `doTransition`.
              onClick={() => doTransition(n)}
              className="ticket__btn"
            >
              {prettyStatus(n)}
            </button>
          ))}
        </div>
      )}

      {/* 6. Formulario para añadir un comentario. */}
      <form onSubmit={submitComment} className="ticket__comment">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir comentario…"
          className="ticket__input"
        />
        <button
          // El botón está deshabilitado si la tarjeta está ocupada o si el campo de
          // comentario está vacío después de eliminar los espacios en blanco.
          disabled={busy || !comment.trim()}
          className="ticket__btn"
        >
          Comentar
        </button>
      </form>
    </div>
  );
}