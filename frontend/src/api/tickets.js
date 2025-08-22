import client from "./client";
export const listTickets = (params = {}) =>
  client.get("/tickets/", { params });

export const getTicket = (id) =>
  client.get(`/tickets/${id}/`);

export const createTicket = (payload) =>
  client.post("/tickets/", payload);

export const patchTicket = (id, payload) =>
  client.patch(`/tickets/${id}/`, payload);

export const transitionTicket = (id, next_status) =>
  client.post(`/tickets/${id}/transition/`, { next_status });

export const addTicketComment = (id, payload) =>
  client.post(`/tickets/${id}/comments/`, payload);

export const listComments = async (ticketId) => {
  const data = await client.get(`/comments/`, { params: { ticket: ticketId } });
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const deleteTicket = (id) =>
  client.delete(`/tickets/${id}/`);

export const deleteComment = (commentId) =>
  client.delete(`/comments/${commentId}/`);

export const updateTicket = (id, payload) =>
  client.patch(`/tickets/${id}/`, payload);
