const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getApplications: () => request('/api/applications'),

  getApplication: (id) => request(`/api/applications/${id}`),

  approveApplication: (id, data) =>
    request(`/api/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ ...data, status: 'approved' }) }),

  rejectApplication: (id) =>
    request(`/api/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'rejected' }) }),

  getRiders: () => request('/api/riders'),

  getRider: (id) => request(`/api/riders/${id}`),

  updateRider: (id, data) =>
    request(`/api/riders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getRiderRepayments: (riderId) => request(`/api/repayments/${riderId}`),

  getBikes: () => request('/api/bikes'),
};
