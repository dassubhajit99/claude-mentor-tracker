import axios from "axios";

const BASE = "/api/sessions";

export const fetchSessions = (level) => {
  const params = level && level !== "all" ? { level } : {};
  return axios.get(BASE, { params }).then((r) => r.data);
};

export const createSession = (data) =>
  axios.post(BASE, data).then((r) => r.data);

export const getSession = (id) =>
  axios.get(`${BASE}/${id}`).then((r) => r.data);

export const updateSession = (id, data) =>
  axios.put(`${BASE}/${id}`, data).then((r) => r.data);

export const deleteSession = (id) =>
  axios.delete(`${BASE}/${id}`).then((r) => r.data);
