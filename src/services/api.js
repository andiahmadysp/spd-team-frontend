// ─── API Client Service ────────────────────────────────────────────────────────
// Centralized HTTP client using standard fetch API to communicate with spd_team_backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shop-api.tribuana.dev';

export function getStoredToken() {
  return localStorage.getItem('marketo_token') || null;
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('marketo_token', token);
  } else {
    localStorage.removeItem('marketo_token');
  }
}

export function getStoredUser() {
  const data = localStorage.getItem('marketo_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('marketo_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('marketo_user');
  }
}

export async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Error ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
