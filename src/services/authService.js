// ─── Auth Service ─────────────────────────────────────────────────────────────
// Interacts with /user routes on spd_team_backend

import { request, setStoredToken, setStoredUser, getStoredUser, getStoredToken } from './api';

export async function login({ email, password }) {
  const data = await request('/user/login', {
    method: 'POST',
    body: { email, password },
  });

  if (data.token && data.user) {
    // Add firstName helper property if missing
    const userWithFirstName = {
      ...data.user,
      firstName: data.user.name ? data.user.name.split(' ')[0] : 'User',
    };
    setStoredToken(data.token);
    setStoredUser(userWithFirstName);
    return { user: userWithFirstName, token: data.token };
  }

  throw new Error('Respons login tidak valid.');
}

export async function register({ firstName, lastName, email, password }) {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim() || email.split('@')[0];
  const data = await request('/user/register', {
    method: 'POST',
    body: { name, email, password, role: 'customer' },
  });

  if (data.token && data.user) {
    const userWithFirstName = {
      ...data.user,
      firstName: firstName || data.user.name.split(' ')[0],
    };
    setStoredToken(data.token);
    setStoredUser(userWithFirstName);
    return { user: userWithFirstName, token: data.token };
  }

  throw new Error('Respons pendaftaran tidak valid.');
}

export function logout() {
  setStoredToken(null);
  setStoredUser(null);
}

export function getCurrentUser() {
  return getStoredUser();
}

export function getCurrentToken() {
  return getStoredToken();
}

export async function getProfile(userId) {
  if (!userId) return null;
  const user = await request(`/user/${userId}`);
  const userWithFirstName = {
    ...user,
    firstName: user.name ? user.name.split(' ')[0] : 'User',
  };
  setStoredUser(userWithFirstName);
  return userWithFirstName;
}
