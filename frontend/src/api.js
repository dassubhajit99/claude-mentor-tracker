import axios from "axios";

const API = normalizeApiBase(import.meta.env.VITE_API_URL);

function normalizeApiBase(value) {
  const trimmed = (value || "").trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
}

function apiUrl(path) {
  return `${API}/api${path}`;
}

// ── Directives ──
export const fetchDirectives = (params = {}) =>
  axios.get(apiUrl("/directives"), { params }).then((r) => r.data);

export const getDirective = (id) =>
  axios.get(apiUrl(`/directives/${id}`)).then((r) => r.data);

export const patchDirectiveStatus = (id, status) =>
  axios.patch(apiUrl(`/directives/${id}/status`), { status }).then((r) => r.data);

// ── Learning Entries ──
export const fetchEntries = (params = {}) =>
  axios.get(apiUrl("/entries"), { params }).then((r) => r.data);

export const getEntry = (id) =>
  axios.get(apiUrl(`/entries/${id}`)).then((r) => r.data);

export const createEntry = (data) =>
  axios.post(apiUrl("/entries"), data).then((r) => r.data);

export const updateEntry = (id, data) =>
  axios.put(apiUrl(`/entries/${id}`), data).then((r) => r.data);

export const deleteEntry = (id) =>
  axios.delete(apiUrl(`/entries/${id}`)).then((r) => r.data);
