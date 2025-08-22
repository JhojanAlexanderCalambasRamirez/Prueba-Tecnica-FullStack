import React from "react";
import "../styles/status.css";

export default function StatusBar({ state, onClose }) {
  if (state?.loading) {
    return (
      <div className="status status--loading">
        <span className="status__spinner" aria-hidden />
        <span>Cargando…</span>
      </div>
    );
  }

  if (state?.error) {
    return (
      <div className="status status--error">
        <span className="status__icon" aria-hidden></span>
        <span className="status__msg">{state.error}</span>
        <button className="status__close" onClick={onClose}>✕</button>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="status status--success">
        <span className="status__icon" aria-hidden></span>
        <span className="status__msg">{state.success}</span>
        <button className="status__close" onClick={onClose}>✕</button>
      </div>
    );
  }

  return null;
}
