import React from "react";
// Se importa el archivo CSS para los estilos específicos del componente.
import "../styles/status.css";

// Definición del componente funcional StatusBar.
// Recibe dos props:
// - state: Un objeto que contiene el estado actual (loading, error, success).
// - onClose: Una función para cerrar la barra de estado.
export default function StatusBar({ state, onClose }) {
  // 1. Renderizado condicional para el estado "cargando".
  // Se usa 'if' para verificar si la propiedad `state?.loading` es verdadera.
  // El operador de encadenamiento opcional `?.` previene errores si 'state' es nulo.
  if (state?.loading) {
    // Si la aplicación está cargando, se retorna un div con la clase de 'loading'.
    // Esto mostrará una barra de estado con un ícono de spinner y el mensaje "Cargando…".
    return (
      <div className="status status--loading">
        <span className="status__spinner" aria-hidden />
        <span>Cargando…</span>
      </div>
    );
  }

  // 2. Renderizado condicional para el estado de "error".
  // Si `state?.error` es verdadero (es decir, si contiene un mensaje de error),
  // se retorna la barra de estado de error.
  if (state?.error) {
    // Se muestra un ícono de error, el mensaje de error (`state.error`)
    // y un botón para que el usuario pueda cerrar la notificación.
    return (
      <div className="status status--error">
        <span className="status__icon" aria-hidden></span>
        <span className="status__msg">{state.error}</span>
        <button className="status__close" onClick={onClose}>✕</button>
      </div>
    );
  }

  // 3. Renderizado condicional para el estado de "éxito".
  // Si `state?.success` es verdadero, se retorna la barra de estado de éxito.
  if (state?.success) {
    // Se muestra un ícono de éxito, el mensaje de éxito (`state.success`)
    // y un botón para cerrar la notificación.
    return (
      <div className="status status--success">
        <span className="status__icon" aria-hidden></span>
        <span className="status__msg">{state.success}</span>
        <button className="status__close" onClick={onClose}>✕</button>
      </div>
    );
  }

  // 4. Caso por defecto.
  // Si ninguna de las condiciones anteriores es verdadera (por ejemplo, el estado
  // está vacío), el componente no renderiza nada en absoluto.
  return null;
}