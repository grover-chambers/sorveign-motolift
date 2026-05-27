const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('rider_token') || localStorage.getItem('admin_token');
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
  // Auth
  adminLogin: (email, password) =>
    request('/api/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  riderLogin: (phone, password) =>
    request('/api/auth/rider-login', { method: 'POST', body: JSON.stringify({ phone, password }) }),

  activate: (phone, password) =>
    request('/api/auth/activate', { method: 'POST', body: JSON.stringify({ phone, password }) }),

  // Applications
  submitApplication: (data) =>
    request('/api/applications', { method: 'POST', body: JSON.stringify(data) }),

  getApplications: () =>
    request('/api/applications'),

  getApplication: (id) =>
    request(`/api/applications/${id}`),

  approveApplication: (id, data) =>
    request(`/api/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Riders
  getRiders: () =>
    request('/api/riders'),

  getRider: (id) =>
    request(`/api/riders/${id}`),

  updateRider: (id, data) =>
    request(`/api/riders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getMyProfile: () =>
    request('/api/riders/me'),

  // Repayments
  getMyRepayments: () =>
    request('/api/repayments/me/history'),

  getRiderRepayments: (riderId) =>
    request(`/api/repayments/${riderId}`),

  // Bikes
  getBikes: () =>
    request('/api/bikes'),
};
