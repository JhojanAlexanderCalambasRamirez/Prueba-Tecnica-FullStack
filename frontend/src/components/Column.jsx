import React from "react";
// Se importa el archivo CSS para los estilos específicos de la columna.
import "../styles/column.css";

// Definición del componente funcional Column.
// Recibe tres props:
// - title: El título de la columna (ej. "Nuevo", "En Proceso").
// - tickets: Una lista de tickets que se mostrarán en esta columna.
// - children: Un prop especial de React que contiene los elementos hijos.
//             En este caso, son los componentes `TicketCard`.
export default function Column({ title, tickets, children }) {
  // 1. Lógica para contar los tickets.
  // Se calcula el número de tickets en la columna.
  // El operador de encadenamiento opcional `?.` evita errores si `tickets` es nulo o indefinido.
  // Si no hay tickets, el valor por defecto es 0.
  const count = tickets?.length ?? 0;

  // 2. Renderizado del componente.
  // Se retorna la estructura JSX que define la UI de la columna.
  return (
    // Contenedor principal de la columna con la clase 'column' para los estilos.
    <div className="column">
      {/* Título de la columna. */}
      {/* Se muestra el título y el número de tickets entre paréntesis. */}
      <h3 className="column__title">
        {title} ({count})
      </h3>
      
      {/* Contenedor para los tickets. */}
      {/* El 'children' prop se renderiza aquí. Este es el lugar donde los
          componentes 'TicketCard' (que se pasan desde el componente padre)
          serán insertados y mostrados. */}
      <div className="column__content">{children}</div>

      {/* 3. Renderizado condicional del mensaje de "Sin tickets". */}
      {/* Se usa una expresión lógica '&&' para mostrar un párrafo de marcador de posición
          solo si la cuenta de tickets es exactamente 0.
          Esto mejora la experiencia de usuario al comunicar que la columna está vacía. */}
      {count === 0 && <p className="column__empty">Sin tickets</p>}
    </div>
  );
}