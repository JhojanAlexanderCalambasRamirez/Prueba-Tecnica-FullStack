import React from "react";
import "../styles/column.css";

export default function Column({ title, tickets, children }) {
  const count = tickets?.length ?? 0;

  return (
    <div className="column">
      <h3 className="column__title">
        {title} ({count})
      </h3>
      <div className="column__content">{children}</div>

      {count === 0 && <p className="column__empty">Sin tickets</p>}
    </div>
  );
}
