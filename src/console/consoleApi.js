/**
 * API client for the admin console (/console).
 * Talks to the FastAPI routes in routers/console.py.
 *
 * Uses the same JWT the rest of the site uses (localStorage 'ayinde_token').
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const BASE = `${API_URL}/api/console`;

export class ConsoleApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ConsoleApiError';
    this.status = status;
  }
}

const getToken = () => {
  try {
    return localStorage.getItem('ayinde_token');
  } catch {
    return null;
  }
};

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const errorMessage = (data, status) => {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail)) return data.detail.map((d) => d.msg).join(' ');
  return `Request failed (${status}).`;
};

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = { ...authHeader() };
  let payload;
  if (form) {
    payload = form; // browser sets the multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ConsoleApiError(errorMessage(data, res.status), res.status);
  }
  return res.json();
}

export const consoleApi = {
  // Profile
  me: () => request('/me/'),
  updateMe: (payload) => request('/me/', { method: 'PATCH', body: payload }),

  // Dashboard
  stats: () => request('/stats/'),

  // Projects & service requests
  projects: () => request('/projects/'),
  updateProject: (id, payload) => request(`/projects/${id}/`, { method: 'PATCH', body: payload }),
  serviceRequests: () => request('/service-requests/'),
  approveRequest: (id, amount) =>
    request(`/service-requests/${id}/approve/`, { method: 'POST', body: { amount } }),
  rejectRequest: (id) => request(`/service-requests/${id}/reject/`, { method: 'POST' }),

  // Clients & messages
  clients: () => request('/clients/'),
  messages: () => request('/messages/'),
  sendMessage: (payload) => request('/messages/', { method: 'POST', body: payload }),
  broadcastMessage: (payload) => request('/messages/broadcast/', { method: 'POST', body: payload }),
  markMessageRead: (id) => request(`/messages/${id}/read/`, { method: 'POST' }),

  // Shared files
  files: () => request('/files/'),
  uploadFile: (formData) => request('/files/', { method: 'POST', form: formData }),
  deleteFile: (id) => request(`/files/${id}/`, { method: 'DELETE' }),
  downloadFile: async (id, filename) => {
    const res = await fetch(`${BASE}/files/${id}/download/`, { headers: authHeader() });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ConsoleApiError(errorMessage(data, res.status), res.status);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  // Contact submissions
  contacts: () => request('/contacts/'),
  markContactRead: (id) => request(`/contacts/${id}/read/`, { method: 'POST' }),
  deleteContact: (id) => request(`/contacts/${id}/`, { method: 'DELETE' }),

  // Newsletter
  subscribers: () => request('/newsletters/'),
  deleteSubscriber: (id) => request(`/newsletters/${id}/`, { method: 'DELETE' }),

  // Broadcasts
  broadcasts: () => request('/broadcasts/'),
  sendBroadcast: (payload) => request('/broadcasts/', { method: 'POST', body: payload }),
};

export default consoleApi;