import React, { useState } from "react";
// Se importa la función de la API para crear un ticket.
import { createTicket } from "../api/tickets";
// Se importa el hook de navegación para redirigir al usuario.
import { useNavigate } from "react-router-dom";
// Se importa el componente StatusBar para mostrar mensajes de estado.
import StatusBar from "../components/StatusBar";
// Se importa el archivo CSS para los estilos del formulario.
import "../styles/new-ticket.css";

// Definición del componente funcional NewTicket.
export default function NewTicket() {
  // 1. Estados del componente.
  // `Maps`: Hook para la navegación.
  const navigate = useNavigate();
  // `ui`: Estado para gestionar los mensajes y el estado de carga de la interfaz.
  const [ui, setUi] = useState({ loading: false, success: "", error: "" });

  // 2. Funciones de ayuda (helpers) para manejar el estado de la UI.
  // Centralizan la lógica de actualización del estado 'ui'.
  function setLoading(v){ setUi({ loading: v, success: "", error: "" }); }
  function ok(msg){ setUi({ loading: false, success: msg, error: "" }); }
  function fail(msg){ setUi({ loading: false, success: "", error: msg }); }

  // 3. Lógica para el envío del formulario.
  // Es una función asíncrona que se ejecuta al enviar el formulario.
  async function handleSubmit(e) {
    e.preventDefault(); // Evita que el formulario recargue la página.
    
    // Obtiene los datos del formulario.
    // `FormData` es una API nativa del navegador que facilita la captura de datos.
    const fd = new FormData(e.currentTarget);
    // `Object.fromEntries` convierte los datos del formulario a un objeto de JavaScript.
    const payload = Object.fromEntries(fd.entries());

    // 4. Validación del formulario.
    // Se comprueba si los campos obligatorios están llenos.
    if (!payload.title || !payload.description || !payload.reporter_name) {
      fail("Campos obligatorios: título, descripción, solicitante");
      return; // Detiene la ejecución si la validación falla.
    }
    
    try {
      setLoading(true); // Activa el estado de carga.
      
      // 5. Llamada a la API para crear el ticket.
      // Se llama a la función `createTicket` con los datos del formulario.
      await createTicket({
        title: payload.title,
        description: payload.description,
        // Si la prioridad no está definida en el formulario, se usa 'media' por defecto.
        priority: payload.priority || "media",
        reporter_name: payload.reporter_name,
        reporter_email: payload.reporter_email || "",
      });
      
      ok("Ticket creado correctamente"); // Muestra un mensaje de éxito.
      
      // 6. Redirección.
      // Después de un breve retraso, redirige al usuario a la página principal del tablero.
      setTimeout(() => navigate("/tickets"), 700);
      
    } catch (e) {
      // 7. Manejo de errores.
      // Si la API retorna un error, se muestra un mensaje de error.
      fail(e?.response?.data?.detail || e.message);
    }
  }

  // 8. Renderizado del componente.
  return (
    <div className="new-ticket">
      {/* Se renderiza el StatusBar para mostrar los mensajes de la UI. */}
      <StatusBar state={ui} onClose={() => setUi({ loading:false, success:"", error:"" })} />
      
      <h2>Nuevo Ticket</h2>
      
      {/* El formulario para la creación del ticket. */}
      {/* `onSubmit` llama a la función `handleSubmit` al enviar el formulario. */}
      <form onSubmit={handleSubmit} className="new-ticket__form">
        {/* Los campos del formulario. */}
        <input name="title" placeholder="Título" />
        <textarea name="description" rows={4} placeholder="Descripción" />
        <select name="priority" defaultValue="media">
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <input name="reporter_name" placeholder="Solicitante *" />
        <input name="reporter_email" placeholder="Correo" />
        
        <div className="new-ticket__buttons">
          {/* El botón de 'Cancelar' tiene type="reset" para limpiar el formulario. */}
          <button type="reset">Cancelar</button>
          {/* El botón de 'Crear' tiene type="submit" para enviar el formulario. */}
          <button type="submit">Crear</button>
        </div>
      </form>
    </div>
  );
}