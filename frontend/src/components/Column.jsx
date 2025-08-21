import React from "react";

export default function Column({ title, tickets, children }) {
  return (
    <div style={{ minWidth: 280, marginRight: 12 }}>
      <h3 style={{ marginTop: 0 }}>{title} ({tickets?.length ?? 0})</h3>
      <div>{children}</div>
      {(!tickets || tickets.length === 0) && (
        <p style={{ opacity: .65 }}>Sin tickets</p>
      )}
    </div>
  );
}
