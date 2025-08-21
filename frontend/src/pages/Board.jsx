import React, { useEffect, useMemo, useState } from "react";
import { listTickets, createTicket } from "../api/tickets";
import Column from "../components/Column";
import TicketCard from "../components/TicketCard";
import { useNavigate } from "react-router-dom";

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

  async function handleCreate(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    if (!payload.title || !payload.description || !payload.reporter_name) {
      alert("Título, descripción y solicitante son obligatorios."); return;
    }
    try {
      setLoading(true);
      await createTicket({
        title: payload.title,
        description: payload.description,
        reporter_name: payload.reporter_name,
        reporter_email: payload.reporter_email || "",
        priority: payload.priority || "media",
      });
      e.currentTarget.reset();
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  }

  function openDetail(id) {
    navigate(`/ticket/${id}`);
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Tablero</h2>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Buscar por título…"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          style={{ flex: 2, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <select onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} style={{ padding: 8, borderRadius: 8 }}>
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <select onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} style={{ padding: 8, borderRadius: 8 }}>
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <button onClick={() => setFilters({ search: "", priority: "", status: "" })}>Limpiar</button>
      </div>

      {loading && <p>Cargando…</p>}

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(280px, 1fr))", gap: 12 }}>
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

      <hr style={{ margin: "16px 0" }} />
    </div>
  );
}
