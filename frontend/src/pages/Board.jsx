// frontend/src/pages/Board.jsx
import React, { useEffect, useMemo, useState } from "react";
// Se importan las funciones de la API para la comunicación con el backend.
import { listTickets, deleteTicket } from "../api/tickets";
// Se importan los componentes hijos.
import Column from "../components/Column";
import TicketCard from "../components/TicketCard";
import StatusBar from "../components/StatusBar";
// Se importa el hook para la navegación.
import { useNavigate } from "react-router-dom";
// Se importa el archivo CSS principal del tablero.
import "../styles/board.css";

// Definición del componente principal 'Board'.
export default function Board() {
  // 1. Estados principales del componente.
  // `tickets`: Almacena la lista de tickets obtenidos de la API.
  const [tickets, setTickets] = useState([]);
  // `filters`: Almacena los valores de los filtros de búsqueda y selección.
  const [filters, setFilters] = useState({ search: "", priority: "", status: "" });

  // 2. Estado de la interfaz de usuario (UI).
  // Se usa un objeto para agrupar y gestionar el estado visible de la UI.
  // `loading`: booleano para mostrar un indicador de carga.
  // `success`: string para un mensaje de éxito.
  // `error`: string para un mensaje de error.
  const [ui, setUi] = useState({ loading: false, success: "", error: "" });

  // Hook para la navegación programática.
  const navigate = useNavigate();

  // 3. Funciones de ayuda (helpers) para manejar el estado de la UI.
  // Centralizan la lógica de actualización de 'ui', haciendo el código más limpio.
  const setLoading = (v) =>
    setUi((prev) => ({ ...prev, loading: v })); // Mantiene otros estados
  const ok = (msg) => setUi({ loading: false, success: msg || "", error: "" });
  const fail = (msg) => setUi({ loading: false, success: "", error: msg || "" });
  const clearMsg = () => setUi((p) => ({ ...p, success: "", error: "" }));

  // 4. Lógica para cargar los tickets de la API.
  // Esta función es asíncrona para manejar la llamada a la API.
  async function load() {
    try {
      setLoading(true); // Se activa el estado de carga.
      // Se llama a la API con los filtros actuales.
      // El operador '...' crea un objeto con las propiedades solo si existen.
      const data = await listTickets({
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.priority ? { priority: filters.priority } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        page_size: 100,
      });
      // Se actualiza el estado 'tickets' con los resultados.
      setTickets(data.results || []);
    } catch (e) {
      // Si hay un error, se llama a la función 'fail' para mostrar un mensaje.
      fail(e?.response?.data?.detail || e.message);
    } finally {
      // Se desactiva el estado de carga al finalizar, ya sea con éxito o error.
      setLoading(false);
    }
  }

  // 5. Lógica para eliminar un ticket.
  async function handleDelete(id) {
    // Pide confirmación al usuario antes de eliminar.
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer.")) return;
    try {
      setLoading(true); // Activa el estado de carga.
      await deleteTicket(id); // Llama a la API para eliminar el ticket.
      await load(); // Vuelve a cargar la lista de tickets para actualizar la UI.
      ok("Ticket eliminado correctamente"); // Muestra un mensaje de éxito.
    } catch (e) {
      fail(e?.response?.data?.detail || e.message); // Muestra un mensaje de error.
    }
  }

  // 6. Efecto de carga inicial y cuando los filtros cambian.
  // `useEffect` se ejecuta cuando el componente se monta por primera vez
  // y cada vez que el estado de `filters` cambia.
  // La dependencia `[filters]` asegura que la carga se realice automáticamente
  // cuando el usuario interactúa con los filtros.
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters]);

  // 7. Memoización de la agrupación de tickets.
  // `useMemo` se usa para agrupar los tickets por estado de manera eficiente.
  // La función solo se vuelve a ejecutar si la lista de `tickets` cambia,
  // evitando cálculos innecesarios en cada renderizado.
  const byStatus = useMemo(() => {
    // Se inicializa un objeto con arrays vacíos para cada estado.
    const groups = { nuevo: [], en_proceso: [], resuelto: [], cerrado: [] };
    // Se itera sobre todos los tickets y se agrupan en sus respectivos arrays.
    for (const t of tickets) groups[t.status]?.push(t);
    return groups;
  }, [tickets]);

  // 8. Lógica para la navegación.
  // Redirige al usuario a la página de detalle del ticket.
  function openDetail(id) {
    navigate(`/tickets/${id}`);
  }

  // 9. Renderizado del componente principal.
  return (
    <div className="board">
      {/* Barra de estado: muestra mensajes de carga, éxito o error. */}
      {/* Se le pasa el estado 'ui' y la función 'clearMsg' para que pueda cerrarse. */}
      <StatusBar state={ui} onClose={clearMsg} />

      {/* Sección de filtros */}
      <div className="board__filters">
        {/* Los inputs y selects controlan el estado 'filters'. */}
        <input
          placeholder="Buscar por título…"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="board__search"
        />
        <select
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
          className="board__select"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <select
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="board__select"
        >
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <button
          onClick={() => setFilters({ search: "", priority: "", status: "" })}
          className="board__button"
        >
          Limpiar buscador
        </button>
      </div>

      {/* Mensaje de carga condicional */}
      {ui.loading && <p className="board__loading">Cargando…</p>}

      {/* Contenedor de las columnas */}
      <div className="board__columns">
        {/* Se renderizan las columnas, pasando los tickets correspondientes. */}
        {/* Se pasa un set de funciones (`onChanged`, `onError`, `onOpen`, `onDelete`)
            para que los componentes 'TicketCard' puedan comunicarse con este
            componente padre. */}
        <Column title="Nuevo" tickets={byStatus.nuevo}>
          {byStatus.nuevo.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              // Esta función de callback se ejecuta cuando un ticket se actualiza.
              // Vuelve a cargar los datos y muestra un mensaje de éxito.
              onChanged={async (msg) => { await load(); ok(msg || "Acción realizada correctamente"); }}
              // Esta función de callback se ejecuta si hay un error en la tarjeta.
              onError={(msg) => fail(msg)}
              onOpen={openDetail}
              onDelete={handleDelete}
            />
          ))}
        </Column>

        <Column title="En Proceso" tickets={byStatus.en_proceso}>
          {byStatus.en_proceso.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onChanged={async (msg) => { await load(); ok(msg || "Acción realizada correctamente"); }}
              onError={(msg) => fail(msg)}
              onOpen={openDetail}
              onDelete={handleDelete}
            />
          ))}
        </Column>

        <Column title="Resuelto" tickets={byStatus.resuelto}>
          {byStatus.resuelto.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onChanged={async (msg) => { await load(); ok(msg || "Acción realizada correctamente"); }}
              onError={(msg) => fail(msg)}
              onOpen={openDetail}
              onDelete={handleDelete}
            />
          ))}
        </Column>

        <Column title="Cerrado" tickets={byStatus.cerrado}>
          {byStatus.cerrado.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onChanged={async (msg) => { await load(); ok(msg || "Acción realizada correctamente"); }}
              onError={(msg) => fail(msg)}
              onOpen={openDetail}
              onDelete={handleDelete}
            />
          ))}
        </Column>
      </div>
    </div>
  );
}