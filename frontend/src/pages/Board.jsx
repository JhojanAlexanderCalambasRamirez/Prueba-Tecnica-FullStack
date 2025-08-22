// frontend/src/pages/Board.jsx
import React, { useEffect, useMemo, useState } from "react";
import { listTickets, deleteTicket } from "../api/tickets";
import Column from "../components/Column";
import TicketCard from "../components/TicketCard";
import StatusBar from "../components/StatusBar";
import { useNavigate } from "react-router-dom";
import "../styles/board.css";

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
  });

  // estado de UI visible (carga/éxito/error)
  const [ui, setUi] = useState({ loading: false, success: "", error: "" });

  const navigate = useNavigate();

  // helpers para el estado visible
  function setLoading(v) {
    setUi({ loading: v, success: "", error: "" });
  }
  function ok(msg) {
    setUi({ loading: false, success: msg, error: "" });
  }
  function fail(msg) {
    setUi({ loading: false, success: "", error: msg });
  }
  function clearMsg() {
    setUi((p) => ({ ...p, success: "", error: "" }));
  }

  async function load() {
    try {
      setLoading(true);
      const data = await listTickets({
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.priority ? { priority: filters.priority } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        page_size: 100,
      });
      setTickets(data.results || []);
      setLoading(false);
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este ticket? Esta acción no se puede deshacer."))
      return;
    try {
      setLoading(true);
      await deleteTicket(id);
      await load();
      ok("Ticket eliminado correctamente");
    } catch (e) {
      fail(e?.response?.data?.detail || e.message);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [filters]);

  const byStatus = useMemo(() => {
    const groups = { nuevo: [], en_proceso: [], resuelto: [], cerrado: [] };
    for (const t of tickets) groups[t.status]?.push(t);
    return groups;
  }, [tickets]);

  function openDetail(id) {
    navigate(`/tickets/${id}`);
  }

  return (
    <div className="board">
      {/* Barra de estado visible */}
      <StatusBar state={ui} onClose={clearMsg} />

      <div className="board__filters">
        <input
          placeholder="Buscar por título…"
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="board__search"
        />
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, priority: e.target.value }))
          }
          className="board__select"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
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

      {/* Si quieres, además de la StatusBar, puedes mantener este texto */}
      {ui.loading && <p className="board__loading">Cargando…</p>}

      <div className="board__columns">
        <Column title="Nuevo" tickets={byStatus.nuevo}>
          {byStatus.nuevo.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onChanged={() => {
                load();
                ok("Acción realizada correctamente");
              }}
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
              onChanged={() => {
                load();
                ok("Acción realizada correctamente");
              }}
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
              onChanged={() => {
                load();
                ok("Acción realizada correctamente");
              }}
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
              onChanged={() => {
                load();
                ok("Acción realizada correctamente");
              }}
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
