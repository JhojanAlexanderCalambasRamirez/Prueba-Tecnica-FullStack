import client from "./client";

// Exportación de funciones para interactuar con la API de tickets.
// Cada función corresponde a una operación CRUD o una acción específica en la API.

// 1. listTickets: Obtiene una lista de tickets.

// `params` permite enviar parámetros de consulta (como filtros de búsqueda) a la API.
// Por ejemplo: listTickets({ search: 'problema', priority: 'alta' })
export const listTickets = (params = {}) =>
  client.get("/tickets/", { params });

// 2. getTicket: Obtiene los detalles de un solo ticket por su ID.

// La URL se construye dinámicamente con el ID del ticket.
export const getTicket = (id) =>
  client.get(`/tickets/${id}/`);

// 3. createTicket: Crea un nuevo ticket.

// Usa una petición POST para enviar los datos (payload) a la API.
// El 'payload' es un objeto que contiene los datos del nuevo ticket (título, descripción, etc.).
export const createTicket = (payload) =>
  client.post("/tickets/", payload);

// 4. patchTicket: Actualiza parcialmente un ticket existente.

// Usa una petición PATCH para enviar solo los campos modificados del ticket.
// Esto es más eficiente que enviar el objeto completo.
export const patchTicket = (id, payload) =>
  client.patch(`/tickets/${id}/`, payload);

// 5. transitionTicket: Cambia el estado de un ticket.

// Envía una petición POST a un endpoint específico de transición.
// El 'payload' contiene el 'next_status' que define el nuevo estado del ticket.
export const transitionTicket = (id, next_status) =>
  client.post(`/tickets/${id}/transition/`, { next_status });

// 6. addTicketComment: Agrega un comentario a un ticket.

// Usa una petición POST a la URL de comentarios de un ticket específico.
// El 'payload' es un objeto con el autor y el texto del comentario.
export const addTicketComment = (id, payload) =>
  client.post(`/tickets/${id}/comments/`, payload);

// 7. listComments: Obtiene una lista de comentarios para un ticket.

// Es una función asíncrona que usa 'await' para esperar la respuesta de la API.
// Los comentarios se filtran en el backend usando el ID del ticket.
export const listComments = async (ticketId) => {
  const data = await client.get(`/comments/`, { params: { ticket: ticketId } });
  
  // Manejo de la respuesta:
  // Si la respuesta es un array (por ejemplo, en caso de que la API retorne
  // una lista directa), se devuelve tal cual. De lo contrario, se verifica si
  // la respuesta contiene una propiedad 'results', lo cual es común en APIs
  // paginadas como las de Django REST Framework.
  return Array.isArray(data) ? data : (data?.results ?? []);
};

// 8. deleteTicket: Elimina un ticket por su ID.

// Usa una petición DELETE, un método HTTP estándar para eliminar recursos.
export const deleteTicket = (id) =>
  client.delete(`/tickets/${id}/`);

// 9. deleteComment: Elimina un comentario por su ID.

// Similar a deleteTicket, usa una petición DELETE.
export const deleteComment = (commentId) =>
  client.delete(`/comments/${commentId}/`);

// 10. updateTicket: Actualiza los detalles de un ticket.

// Esta función es un alias de `patchTicket`, y es una buena práctica
// usar PATCH para actualizaciones parciales.
export const updateTicket = (id, payload) =>
  client.patch(`/tickets/${id}/`, payload);