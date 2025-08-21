import React, { useEffect, useMemo, useState } from "react";
import { listTickets } from "../api/tickets";
import Column from "../components/Column";
import TicketCard from "../components/TicketCard";
import { useNavigate } from "react-router-dom";
import "../styles/board.css"; // ⬅️ CSS separado

export default function Board() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", priority: "", status: "" });
  const navigate = useNavigate();

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
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filters]);

  const byStatus = useMemo(() => {
    const groups = { nuevo: [], en_proceso: [], resuelto: [], cerrado: [] };
    for (const t of tickets) groups[t.status]?.push(t);
    return groups;
  }, [tickets]);

  function openDetail(id) {
    navigate(`/ticket/${id}`);
  }

  return (
    <div className="board">
      <h2 className="board__title">Tablero</h2>

      {/* Filtros */}
      <div className="board__filters">
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
        <button onClick={() => setFilters({ search: "", priority: "", status: "" })} className="board__button">
          Limpiar
        </button>
      </div>

      {loading && <p className="board__loading">Cargando…</p>}

      {/* Kanban */}
      <div className="board__columns">
        <Column title="Nuevo" tickets={byStatus.nuevo}>
          {byStatus.nuevo.map((t) => (
            <TicketCard key={t.id} ticket={t} onChanged={load} onOpen={openDetail} />
          ))}
        </Column>
        <Column title="En Proceso" tickets={byStatus.en_proceso}>
          {byStatus.en_proceso.map((t) => (
            <TicketCard key={t.id} ticket={t} onChanged={load} onOpen={openDetail} />
          ))}
        </Column>
        <Column title="Resuelto" tickets={byStatus.resuelto}>
          {byStatus.resuelto.map((t) => (
            <TicketCard key={t.id} ticket={t} onChanged={load} onOpen={openDetail} />
          ))}
        </Column>
        <Column title="Cerrado" tickets={byStatus.cerrado}>
          {byStatus.cerrado.map((t) => (
            <TicketCard key={t.id} ticket={t} onChanged={load} onOpen={openDetail} />
          ))}
        </Column>
      </div>

      <hr className="board__separator" />
    </div>
  );
}
